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
 * - Usa endpoint API server-side para verificar rol actual
 * - No confía en cache del cliente o datos obsoletos
 * - Errores descriptivos para debugging pero sin exponer información sensible
 * 
 * DIFERENCIA CON 'auth':
 * - 'auth': Solo verifica autenticación (cualquier usuario loggeado)
 * - 'require-admin-role': Verifica autenticación + rol Admin específico
 */

export default defineNuxtRouteMiddleware(async () => {
  // Solo ejecutar en el servidor
  if (import.meta.client) {
    return
  }

  try {
    // PASO 1: Verificar autenticación básica usando Nuxt utilities
    const user = useSupabaseUser()
    
    if (!user.value) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Authentication required'
      })
    }

    // PASO 2: Obtener perfil usando endpoint API server-side con cookies incluidas
    const event = useRequestEvent()
    const profile = await $fetch('/api/auth/profile', {
      headers: {
        // Pasar las cookies de la solicitud original
        cookie: event?.node.req.headers.cookie || ''
      }
    })
    
    if (!profile) {
      throw createError({
        statusCode: 403,
        statusMessage: 'User profile not found'
      })
    }

    // PASO 3: Verificación estricta de rol de administrador
    if (profile.user_role !== 'Admin') {
      throw createError({
        statusCode: 403,
        statusMessage: 'Admin access required'
      })
    }
    
    // Usuario autenticado y autorizado como Admin
    
  } catch (error: unknown) {
    // Si es error de $fetch con statusCode, preservarlo
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }
    
    // Si es error de createError, preservarlo
    if (error && typeof error === 'object' && 'statusMessage' in error) {
      throw error
    }
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to verify admin access: ${errorMessage}`
    })
  }
})