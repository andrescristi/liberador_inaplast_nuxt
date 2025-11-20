import type { H3Event } from 'h3'
import { randomBytes, createHmac, timingSafeEqual } from 'node:crypto'

/**
 * Protección CSRF (Cross-Site Request Forgery) para formularios y APIs
 *
 * Implementa el patrón Double Submit Cookie:
 * 1. Se genera un token CSRF aleatorio
 * 2. Se envía al cliente en una cookie
 * 3. El cliente debe incluir el mismo token en el body/header
 * 4. El servidor compara ambos valores
 *
 * Esto previene ataques CSRF porque sitios maliciosos no pueden leer
 * cookies de otros dominios debido a Same-Origin Policy.
 */

const CSRF_TOKEN_LENGTH = 32
const CSRF_COOKIE_NAME = 'csrf_token'
const CSRF_HEADER_NAME = 'x-csrf-token'
const CSRF_SECRET = process.env.NUXT_CSRF_SECRET || 'default-csrf-secret-change-in-production'

/**
 * Genera un token CSRF firmado
 *
 * El token incluye:
 * - Timestamp de creación
 * - Valor aleatorio
 * - HMAC para prevenir manipulación
 */
export function generateCSRFToken(): string {
  const timestamp = Date.now().toString()
  const randomValue = randomBytes(CSRF_TOKEN_LENGTH).toString('hex')
  const data = `${timestamp}.${randomValue}`

  // Firmar con HMAC para prevenir manipulación
  const signature = createHmac('sha256', CSRF_SECRET)
    .update(data)
    .digest('hex')

  return `${data}.${signature}`
}

/**
 * Valida un token CSRF firmado
 *
 * Verifica:
 * - Formato correcto
 * - Firma válida (no manipulado)
 * - No expirado (válido por 24 horas)
 */
function validateCSRFToken(token: string): boolean {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) {
      return false
    }

    const [timestamp, randomValue, signature] = parts

    // Verificar firma
    const data = `${timestamp}.${randomValue}`
    const expectedSignature = createHmac('sha256', CSRF_SECRET)
      .update(data)
      .digest('hex')

    // Comparación segura contra timing attacks
    const sigBuffer = Buffer.from(signature || '', 'hex')
    const expectedSigBuffer = Buffer.from(expectedSignature, 'hex')

    if (sigBuffer.length !== expectedSigBuffer.length || !timingSafeEqual(sigBuffer, expectedSigBuffer)) {
      return false
    }

    // Verificar que no esté expirado (24 horas)
    const tokenAge = Date.now() - Number.parseInt(timestamp || '0', 10)
    const MAX_AGE = 24 * 60 * 60 * 1000 // 24 horas

    return tokenAge < MAX_AGE
  }
  catch {
    return false
  }
}

/**
 * Obtiene el token CSRF de la cookie
 */
function getCSRFTokenFromCookie(event: H3Event): string | undefined {
  return getCookie(event, CSRF_COOKIE_NAME)
}

/**
 * Obtiene el token CSRF del header o body
 */
function getCSRFTokenFromRequest(event: H3Event): string | undefined {
  // Primero intentar obtener del header
  const headerToken = getHeader(event, CSRF_HEADER_NAME)
  if (headerToken) {
    return headerToken
  }

  // Si no está en header, intentar obtener del body
  // Esto requiere que el body ya haya sido parseado
  return undefined
}

/**
 * Configura una cookie CSRF para el cliente
 *
 * La cookie debe ser:
 * - HttpOnly: NO (necesita ser leída por JavaScript)
 * - Secure: SÍ en producción
 * - SameSite: Strict/Lax
 */
export function setCSRFCookie(event: H3Event) {
  const token = generateCSRFToken()

  setCookie(event, CSRF_COOKIE_NAME, token, {
    httpOnly: false, // El cliente necesita leerlo para enviarlo en headers
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60, // 24 horas
    path: '/',
  })

  return token
}

/**
 * Middleware de verificación CSRF para endpoints mutables
 *
 * Uso en endpoints:
 * ```typescript
 * export default defineEventHandler(async (event) => {
 *   await verifyCSRF(event)
 *   // ... resto del endpoint
 * })
 * ```
 */
export async function verifyCSRF(event: H3Event) {
  const method = event.method

  // Solo verificar en métodos que modifican datos
  const methodsToCheck = ['POST', 'PUT', 'PATCH', 'DELETE']
  if (!methodsToCheck.includes(method)) {
    return
  }

  // Obtener token de cookie
  const cookieToken = getCSRFTokenFromCookie(event)
  if (!cookieToken) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Token CSRF no encontrado en cookie',
    })
  }

  // Validar que el token de cookie sea válido
  if (!validateCSRFToken(cookieToken)) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Token CSRF inválido o expirado',
    })
  }

  // Obtener token del request (header o body)
  let requestToken = getCSRFTokenFromRequest(event)

  // Si no está en header, buscar en body
  if (!requestToken && ['POST', 'PUT', 'PATCH'].includes(method)) {
    const body = await readBody(event).catch(() => ({}))
    requestToken = body?.csrf_token
  }

  if (!requestToken) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Token CSRF no encontrado en request',
    })
  }

  // Comparar tokens (Double Submit Cookie pattern)
  if (cookieToken !== requestToken) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Token CSRF no coincide',
    })
  }
}

/**
 * Helper para endpoints que necesitan proveer token al cliente
 *
 * Ejemplo: Endpoint que renderiza formularios
 */
export function getCSRFToken(event: H3Event): string {
  // Intentar obtener token existente de cookie
  let token = getCSRFTokenFromCookie(event)

  // Si no existe o es inválido, generar nuevo
  if (!token || !validateCSRFToken(token)) {
    token = setCSRFCookie(event)
  }

  return token
}

/**
 * Configurar CSRF para una respuesta (útil en endpoints de autenticación)
 */
export function setupCSRF(event: H3Event): { csrf_token: string } {
  const token = setCSRFCookie(event)
  return { csrf_token: token }
}
