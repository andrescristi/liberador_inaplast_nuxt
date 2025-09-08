import type { H3Event } from 'h3'
import { serverSupabaseUser, serverSupabaseServiceRole, serverSupabaseClient } from '#supabase/server'
import { createHash, randomBytes } from 'crypto'
import jwt from 'jsonwebtoken'

/**
 * Almacén en memoria para sesiones activas
 * En producción debería usar Redis o similar
 */
const sessionStore = new Map<string, SessionData>()

interface SessionData {
  userId: string
  email: string
  userRole: string
  createdAt: number
  lastActivity: number
  expiresAt: number
}

interface JWTPayload {
  user_id: string
  email: string
  user_role: string
  exp: number
  iat: number
}

/**
 * Configuración del sistema híbrido
 */
const HYBRID_AUTH_CONFIG = {
  JWT_SECRET: process.env.NUXT_JWT_SECRET || 'fallback-secret-change-in-production',
  SESSION_DURATION: 7 * 24 * 60 * 60 * 1000, // 7 días en ms
  JWT_DURATION: 7 * 24 * 60 * 60, // 7 días en segundos
  COOKIE_NAME: 'inaplast_session_id',
  CLEANUP_INTERVAL: 60 * 60 * 1000, // 1 hora en ms
}

/**
 * Genera un session ID criptográficamente seguro
 */
function generateSessionId(): string {
  return randomBytes(32).toString('hex')
}

/**
 * Crea un JWT con los datos del usuario
 */
function createJWT(userId: string, email: string, userRole: string): string {
  const now = Math.floor(Date.now() / 1000)
  const payload: JWTPayload = {
    user_id: userId,
    email,
    user_role: userRole,
    iat: now,
    exp: now + HYBRID_AUTH_CONFIG.JWT_DURATION
  }
  
  return jwt.sign(payload, HYBRID_AUTH_CONFIG.JWT_SECRET, { algorithm: 'HS256' })
}

/**
 * Verifica y decodifica un JWT
 */
function verifyJWT(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, HYBRID_AUTH_CONFIG.JWT_SECRET) as JWTPayload
  } catch (error) {
    return null
  }
}

/**
 * Crea una nueva sesión en el almacén
 */
function createSession(userId: string, email: string, userRole: string): string {
  const sessionId = generateSessionId()
  const now = Date.now()
  
  sessionStore.set(sessionId, {
    userId,
    email,
    userRole,
    createdAt: now,
    lastActivity: now,
    expiresAt: now + HYBRID_AUTH_CONFIG.SESSION_DURATION
  })
  
  return sessionId
}

/**
 * Verifica si una sesión es válida y la actualiza
 */
function verifySession(sessionId: string): SessionData | null {
  const session = sessionStore.get(sessionId)
  if (!session) return null
  
  const now = Date.now()
  if (now > session.expiresAt) {
    sessionStore.delete(sessionId)
    return null
  }
  
  // Actualizar última actividad
  session.lastActivity = now
  return session
}

/**
 * Elimina una sesión del almacén
 */
function destroySession(sessionId: string): void {
  sessionStore.delete(sessionId)
}

/**
 * Limpia sesiones expiradas (llamar periódicamente)
 */
function cleanupExpiredSessions(): void {
  const now = Date.now()
  for (const [sessionId, session] of sessionStore.entries()) {
    if (now > session.expiresAt) {
      sessionStore.delete(sessionId)
    }
  }
}

/**
 * Autentica un usuario y crea tanto JWT como session ID
 * 
 * @param event - Evento H3
 * @param email - Email del usuario
 * @param password - Contraseña del usuario
 * @returns Datos de autenticación completos
 */
export async function authenticateUser(event: H3Event, email: string, password: string) {
  // Usar cliente normal para autenticación
  const supabaseClient = await serverSupabaseClient(event)
  
  // Autenticar con Supabase
  const { data: authData, error: authError } = await supabaseClient.auth.signInWithPassword({
    email,
    password
  })
  
  if (authError || !authData.user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Credenciales inválidas'
    })
  }
  
  // Usar service role para consultar perfiles (bypass RLS)
  const supabaseServiceRole = serverSupabaseServiceRole(event)
  
  // Obtener perfil completo del usuario
  const { data: profile, error: profileError } = await supabaseServiceRole
    .from('profiles')
    .select('first_name, last_name, user_role')
    .eq('user_id', authData.user.id)
    .single()
    
  if (profileError || !profile) {
    throw createError({
      statusCode: 403,
      statusMessage: 'No se pudo obtener el perfil del usuario'
    })
  }
  
  // Crear JWT
  const jwtToken = createJWT(authData.user.id, authData.user.email!, profile.user_role)
  
  // Crear sesión
  const sessionId = createSession(authData.user.id, authData.user.email!, profile.user_role)
  
  // Configurar cookie con session ID
  setCookie(event, HYBRID_AUTH_CONFIG.COOKIE_NAME, sessionId, {
    maxAge: HYBRID_AUTH_CONFIG.SESSION_DURATION / 1000, // En segundos
    httpOnly: true,
    secure: (process.env.NODE_ENV as string) === 'production',
    sameSite: 'lax'
  })
  
  return {
    jwt: jwtToken,
    sessionId,
    user: {
      id: authData.user.id,
      email: authData.user.email!,
      role: profile.user_role,
      first_name: profile.first_name,
      last_name: profile.last_name,
      full_name: `${profile.first_name} ${profile.last_name}`
    }
  }
}

/**
 * Verifica autenticación híbrida (JWT + Session)
 * 
 * @param event - Evento H3
 * @returns Datos del usuario si está autenticado
 */
export async function verifyHybridAuth(event: H3Event) {
  // Obtener JWT del header Authorization
  const authHeader = getHeader(event, 'authorization')
  const jwtToken = authHeader?.replace('Bearer ', '')
  
  // Obtener session ID de la cookie
  const sessionId = getCookie(event, HYBRID_AUTH_CONFIG.COOKIE_NAME)
  
  if (!jwtToken || !sessionId) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Token de autenticación requerido'
    })
  }
  
  // Verificar JWT
  const jwtPayload = verifyJWT(jwtToken)
  if (!jwtPayload) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Token JWT inválido'
    })
  }
  
  // Verificar sesión
  let session = verifySession(sessionId)
  
  // RECUPERACIÓN AUTOMÁTICA DE SESIÓN PARA DESARROLLO
  // Si JWT es válido pero sesión no existe (servidor reiniciado), recrear sesión
  if (!session && (process.env.NODE_ENV as string) === 'development') {
    console.log('🔄 Sesión perdida detectada en desarrollo. Recreando sesión...')
    
    // Crear nueva sesión usando datos del JWT
    const now = Date.now()
    sessionStore.set(sessionId, {
      userId: jwtPayload.user_id,
      email: jwtPayload.email,
      userRole: jwtPayload.user_role,
      createdAt: now,
      lastActivity: now,
      expiresAt: now + HYBRID_AUTH_CONFIG.SESSION_DURATION
    })
    
    // Renovar cookie para extender duración
    setCookie(event, HYBRID_AUTH_CONFIG.COOKIE_NAME, sessionId, {
      maxAge: HYBRID_AUTH_CONFIG.SESSION_DURATION / 1000,
      httpOnly: true,
      secure: (process.env.NODE_ENV as string) === 'production',
      sameSite: 'lax'
    })
    
    session = sessionStore.get(sessionId) || null
    console.log('✅ Sesión recreada exitosamente para:', jwtPayload.email)
  }
  
  if (!session) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Sesión inválida o expirada'
    })
  }
  
  // Verificar que JWT y sesión coincidan
  if (jwtPayload.user_id !== session.userId) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Mismatch entre token y sesión'
    })
  }
  
  return {
    userId: session.userId,
    email: session.email,
    role: session.userRole,
    sessionId
  }
}

/**
 * Cierra la sesión del usuario
 * 
 * @param event - Evento H3
 */
export async function logoutUser(event: H3Event) {
  const sessionId = getCookie(event, HYBRID_AUTH_CONFIG.COOKIE_NAME)
  
  if (sessionId) {
    destroySession(sessionId)
  }
  
  // Limpiar cookie
  deleteCookie(event, HYBRID_AUTH_CONFIG.COOKIE_NAME)
  
  return { success: true }
}

/**
 * Middleware de autenticación híbrida para administradores
 * 
 * @param event - Evento H3
 * @returns Datos del usuario admin
 */
export async function requireHybridAdminAuth(event: H3Event) {
  const auth = await verifyHybridAuth(event)
  
  if (auth.role !== 'Admin') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Se requieren permisos de administrador'
    })
  }
  
  return auth
}

/**
 * Refrescar la sesión extendiendo su duración
 * 
 * @param event - Evento H3
 */
export async function refreshHybridAuth(event: H3Event) {
  const sessionId = getCookie(event, HYBRID_AUTH_CONFIG.COOKIE_NAME)
  
  if (!sessionId) {
    throw createError({
      statusCode: 401,
      statusMessage: 'No hay sesión activa'
    })
  }
  
  const session = sessionStore.get(sessionId)
  if (!session) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Sesión inválida'
    })
  }
  
  // Extender sesión
  const now = Date.now()
  session.lastActivity = now
  session.expiresAt = now + HYBRID_AUTH_CONFIG.SESSION_DURATION
  
  // Renovar cookie
  setCookie(event, HYBRID_AUTH_CONFIG.COOKIE_NAME, sessionId, {
    maxAge: HYBRID_AUTH_CONFIG.SESSION_DURATION / 1000,
    httpOnly: true,
    secure: (process.env.NODE_ENV as string) === 'production',
    sameSite: 'lax'
  })
  
  // Crear nuevo JWT
  const newJWT = createJWT(session.userId, session.email, session.userRole)
  
  return {
    jwt: newJWT,
    user: {
      id: session.userId,
      email: session.email,
      role: session.userRole
    }
  }
}

// Configurar limpieza automática de sesiones expiradas
setInterval(cleanupExpiredSessions, HYBRID_AUTH_CONFIG.CLEANUP_INTERVAL)

// Exports para uso externo
export {
  verifyJWT,
  createJWT,
  cleanupExpiredSessions,
  HYBRID_AUTH_CONFIG
}