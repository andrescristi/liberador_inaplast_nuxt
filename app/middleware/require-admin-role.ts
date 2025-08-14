/**
 * Middleware de autorización estricta para rutas administrativas
 * 
 * Implementa verificación en 2 capas:
 * 1. Autenticación: Usuario debe tener sesión activa
 * 2. Autorización: Usuario debe tener rol 'Admin' específicamente
 * 
 * USO:
 * - definePageMeta({ middleware: 'require-admin-role' })
 * - Solo para páginas de administración (/admin/*)
 * - Rutas como panel de usuarios, configuración del sistema, etc.
 * 
 * SEGURIDAD:
 * - Consulta base de datos en tiempo real para verificar rol actual
 * - No confía en cache del cliente o datos obsoletos
 * - Errores descriptivos para debugging pero sin exponer información sensible
 * 
 * DIFERENCIA CON 'auth':
 * - 'auth': Solo verifica autenticación (cualquier usuario loggeado)
 * - 'require-admin-role': Verifica autenticación + rol Admin específico
 */
export default defineNuxtRouteMiddleware(async (_to, _from) => {
  // Obtener usuario autenticado de Supabase
  const user = useSupabaseUser()
  const { getCurrentUserProfile } = useAuth()

  // PASO 1: Verificar autenticación básica
  // Si no hay usuario, lanzar error 401 (no redirigir porque es una verificación estricta)
  if (!user.value) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Authentication required' // Mensaje en inglés para consistencia con APIs
    })
  }

  try {
    // PASO 2: Obtener perfil completo con rol desde base de datos
    // Esto hace una consulta fresh, no usa cache para garantizar datos actuales
    const profile = await getCurrentUserProfile()
    
    // Verificar que el perfil existe (usuario válido pero sin perfil configurado)
    if (!profile) {
      throw createError({
        statusCode: 403,
        statusMessage: 'User profile not found'
      })
    }

    // PASO 3: Verificación estricta de rol de administrador
    // Solo usuarios con rol exacto 'Admin' pueden acceder
    // Supervisors e Inspectors son rechazados aquí
    if (profile.user_role !== 'Admin') {
      throw createError({
        statusCode: 403,
        statusMessage: 'Admin access required'
      })
    }
    
    // Si llega aquí, el usuario está autenticado Y autorizado como Admin
    // El middleware permite continuar con la navegación
    
  } catch (error: unknown) {
    // Manejo robusto de errores para evitar crashes del middleware
    // Preserva códigos de error existentes o usa 500 como fallback
    
    // Extraer statusCode si existe (errores de createError anteriores)
    const statusCode = error && typeof error === 'object' && 'statusCode' in error 
      ? (error.statusCode as number) 
      : 500 // Error de servidor si algo falla inesperadamente
    
    // Extraer mensaje si existe, o usar mensaje genérico
    const statusMessage = error && typeof error === 'object' && 'statusMessage' in error 
      ? (error.statusMessage as string) 
      : 'Failed to verify admin access'
    
    // Re-lanzar error con formato consistente de Nuxt
    throw createError({
      statusCode,
      statusMessage
    })
  }
})