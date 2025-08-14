import type { H3Event } from 'h3'

/**
 * Middleware de autenticación y autorización para endpoints administrativos
 * 
 * Implementa verificación en 3 capas:
 * 1. Autenticación: Verificar JWT válido de Supabase
 * 2. Perfil: Obtener información de rol desde tabla profiles  
 * 3. Autorización: Verificar rol de administrador específicamente
 * 
 * SEGURIDAD CRÍTICA:
 * - Usa service role para bypass RLS y verificar roles reales
 * - No confía en metadatos del JWT que pueden ser manipulados
 * - Consulta directa a base de datos para estado actual del rol
 * 
 * @param event - Evento H3 de Nitro con headers y contexto de request
 * @returns Usuario autenticado y autorizado como Admin
 * @throws 401 - Si no hay token JWT válido
 * @throws 403 - Si hay token pero usuario no es Admin
 */
export async function requireAdminAuth(event: H3Event) {
  // Importación dinámica para optimizar cold starts en serverless
  const { serverSupabaseUser, serverSupabaseServiceRole } = await import('#supabase/server')
  
  // PASO 1: Verificar autenticación JWT
  // Extrae y valida el token del header Authorization o cookies
  const user = await serverSupabaseUser(event)
  if (!user) {
    // 401 Unauthorized - No hay token válido o token expirado
    throw createError({
      statusCode: 401,
      statusMessage: 'No autorizado. Se requiere autenticación.'
    })
  }

  // PASO 2: Obtener rol actual desde base de datos
  // Usar service role para bypass Row Level Security (RLS)
  // Esto es seguro porque ya validamos el JWT en el paso anterior
  const supabase = serverSupabaseServiceRole(event)
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('user_role') // Solo necesitamos el rol para eficiencia
    .eq('user_id', user.id) // Buscar por ID del usuario autenticado
    .single() // Esperar exactamente 1 resultado

  // Verificar que la consulta fue exitosa y encontró el perfil
  if (error || !profile) {
    // 403 Forbidden - Usuario válido pero sin perfil o error DB
    throw createError({
      statusCode: 403,
      statusMessage: 'No se pudo verificar el perfil del usuario.'
    })
  }

  // PASO 3: Autorización específica para administradores
  // Solo usuarios con rol exacto 'Admin' pueden acceder
  if (profile.user_role !== 'Admin') {
    // 403 Forbidden - Usuario válido pero sin permisos suficientes
    throw createError({
      statusCode: 403,
      statusMessage: 'Acceso denegado. Se requieren permisos de administrador.'
    })
  }

  // Usuario completamente verificado: autenticado Y autorizado
  return user
}