import type { H3Event } from 'h3'

/**
 * Sistema de rate limiting en memoria para proteger endpoints de autenticación
 *
 * Para sistemas pequeños (<10 usuarios concurrentes), el almacenamiento en memoria
 * es suficiente y más eficiente que soluciones externas como Redis.
 *
 * Implementa dos capas de protección:
 * 1. Rate limiting por IP: Limita intentos totales desde una IP
 * 2. Rate limiting por usuario: Limita intentos de login para un email específico
 */

interface RateLimitEntry {
  count: number
  firstAttempt: number
  blockedUntil?: number
}

// Almacenamiento en memoria para rate limiting
const ipLimits = new Map<string, RateLimitEntry>()
const userLimits = new Map<string, RateLimitEntry>()

// Configuración de límites
const RATE_LIMIT_CONFIG = {
  // Límites por IP
  IP_MAX_ATTEMPTS: 20, // Máximo de intentos desde una IP
  IP_WINDOW_MS: 15 * 60 * 1000, // Ventana de 15 minutos
  IP_BLOCK_DURATION_MS: 60 * 60 * 1000, // Bloqueo de 1 hora

  // Límites por usuario
  USER_MAX_ATTEMPTS: 5, // Máximo de intentos para un email
  USER_WINDOW_MS: 15 * 60 * 1000, // Ventana de 15 minutos
  USER_BLOCK_DURATION_MS: 30 * 60 * 1000, // Bloqueo de 30 minutos

  // Limpieza de memoria
  CLEANUP_INTERVAL_MS: 60 * 60 * 1000, // Limpiar cada hora
}

/**
 * Limpia entradas expiradas del rate limiter para evitar fugas de memoria
 */
function cleanupExpiredEntries() {
  const now = Date.now()

  // Limpiar IPs expiradas
  for (const [ip, entry] of ipLimits.entries()) {
    const isExpired = entry.blockedUntil
      ? now > entry.blockedUntil
      : now - entry.firstAttempt > RATE_LIMIT_CONFIG.IP_WINDOW_MS

    if (isExpired) {
      ipLimits.delete(ip)
    }
  }

  // Limpiar usuarios expirados
  for (const [user, entry] of userLimits.entries()) {
    const isExpired = entry.blockedUntil
      ? now > entry.blockedUntil
      : now - entry.firstAttempt > RATE_LIMIT_CONFIG.USER_WINDOW_MS

    if (isExpired) {
      userLimits.delete(user)
    }
  }
}

// Iniciar limpieza automática
setInterval(cleanupExpiredEntries, RATE_LIMIT_CONFIG.CLEANUP_INTERVAL_MS)

/**
 * Obtiene la IP del cliente desde el evento H3
 * Considera proxies y load balancers
 */
function getClientIP(event: H3Event): string {
  const headers = getHeaders(event)

  // Intentar obtener IP real detrás de proxies
  const forwarded = headers['x-forwarded-for']
  if (forwarded) {
    const forwardedStr = typeof forwarded === 'string' ? forwarded : String(forwarded)
    return forwardedStr.split(',')[0]?.trim() || 'unknown'
  }

  const realIP = headers['x-real-ip']
  if (realIP) {
    return typeof realIP === 'string' ? realIP : 'unknown'
  }

  // Fallback a IP directa
  return event.node.req.socket.remoteAddress || 'unknown'
}

/**
 * Verifica si una IP está bloqueada por exceso de intentos
 */
function checkIPRateLimit(ip: string): { blocked: boolean; retryAfter?: number } {
  const now = Date.now()
  const entry = ipLimits.get(ip)

  if (!entry) {
    return { blocked: false }
  }

  // Si está bloqueado, verificar si el bloqueo expiró
  if (entry.blockedUntil) {
    if (now < entry.blockedUntil) {
      const retryAfter = Math.ceil((entry.blockedUntil - now) / 1000)
      return { blocked: true, retryAfter }
    }
    // Bloqueo expirado, limpiar
    ipLimits.delete(ip)
    return { blocked: false }
  }

  // Si la ventana expiró, resetear contador
  if (now - entry.firstAttempt > RATE_LIMIT_CONFIG.IP_WINDOW_MS) {
    ipLimits.delete(ip)
    return { blocked: false }
  }

  return { blocked: false }
}

/**
 * Verifica si un usuario está bloqueado por exceso de intentos
 */
function checkUserRateLimit(identifier: string): { blocked: boolean; retryAfter?: number } {
  const now = Date.now()
  const entry = userLimits.get(identifier)

  if (!entry) {
    return { blocked: false }
  }

  // Si está bloqueado, verificar si el bloqueo expiró
  if (entry.blockedUntil) {
    if (now < entry.blockedUntil) {
      const retryAfter = Math.ceil((entry.blockedUntil - now) / 1000)
      return { blocked: true, retryAfter }
    }
    // Bloqueo expirado, limpiar
    userLimits.delete(identifier)
    return { blocked: false }
  }

  // Si la ventana expiró, resetear contador
  if (now - entry.firstAttempt > RATE_LIMIT_CONFIG.USER_WINDOW_MS) {
    userLimits.delete(identifier)
    return { blocked: false }
  }

  return { blocked: false }
}

/**
 * Registra un intento de autenticación y actualiza contadores
 */
function recordAttempt(ip: string, identifier?: string) {
  const now = Date.now()

  // Registrar intento por IP
  const ipEntry = ipLimits.get(ip)
  if (!ipEntry) {
    ipLimits.set(ip, { count: 1, firstAttempt: now })
  }
  else {
    ipEntry.count++

    // Si excede el límite, bloquear
    if (ipEntry.count >= RATE_LIMIT_CONFIG.IP_MAX_ATTEMPTS) {
      ipEntry.blockedUntil = now + RATE_LIMIT_CONFIG.IP_BLOCK_DURATION_MS
    }
  }

  // Registrar intento por usuario (si se proporciona)
  if (identifier) {
    const userEntry = userLimits.get(identifier)
    if (!userEntry) {
      userLimits.set(identifier, { count: 1, firstAttempt: now })
    }
    else {
      userEntry.count++

      // Si excede el límite, bloquear
      if (userEntry.count >= RATE_LIMIT_CONFIG.USER_MAX_ATTEMPTS) {
        userEntry.blockedUntil = now + RATE_LIMIT_CONFIG.USER_BLOCK_DURATION_MS
      }
    }
  }
}

/**
 * Resetea el contador de intentos para un usuario tras login exitoso
 */
function resetUserLimit(identifier: string) {
  userLimits.delete(identifier)
}

/**
 * Middleware de rate limiting para endpoints de autenticación
 *
 * Uso:
 * ```typescript
 * export default defineEventHandler(async (event) => {
 *   await checkRateLimit(event, 'login')
 *   // ... resto del handler
 * })
 * ```
 */
export async function checkRateLimit(event: H3Event, identifier?: string) {
  const ip = getClientIP(event)

  // Verificar límite por IP
  const ipCheck = checkIPRateLimit(ip)
  if (ipCheck.blocked) {
    throw createError({
      statusCode: 429,
      statusMessage: 'Demasiados intentos desde esta IP. Intenta nuevamente más tarde.',
      data: {
        retryAfter: ipCheck.retryAfter,
      },
    })
  }

  // Verificar límite por usuario (si se proporciona)
  if (identifier) {
    const userCheck = checkUserRateLimit(identifier)
    if (userCheck.blocked) {
      throw createError({
        statusCode: 429,
        statusMessage: 'Demasiados intentos de login. Intenta nuevamente más tarde.',
        data: {
          retryAfter: userCheck.retryAfter,
        },
      })
    }
  }

  // Registrar el intento
  recordAttempt(ip, identifier)
}

/**
 * Notifica un login exitoso para resetear contadores del usuario
 */
export function notifySuccessfulLogin(identifier: string) {
  resetUserLimit(identifier)
}

/**
 * Función para testing y debugging: obtiene estadísticas del rate limiter
 */
export function getRateLimitStats() {
  return {
    ipLimits: {
      total: ipLimits.size,
      entries: Array.from(ipLimits.entries()).map(([ip, entry]) => ({
        ip,
        count: entry.count,
        blockedUntil: entry.blockedUntil,
      })),
    },
    userLimits: {
      total: userLimits.size,
      entries: Array.from(userLimits.entries()).map(([user, entry]) => ({
        user,
        count: entry.count,
        blockedUntil: entry.blockedUntil,
      })),
    },
  }
}

/**
 * Función para testing: limpia todos los límites
 */
export function clearAllLimits() {
  ipLimits.clear()
  userLimits.clear()
}
