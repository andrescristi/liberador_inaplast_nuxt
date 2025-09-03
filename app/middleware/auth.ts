/**
 * Middleware de autenticación básica para páginas protegidas
 * 
 * Verifica si existe un usuario autenticado activo usando tokens (para Vercel)
 * y cookies como fallback. Redirige al login si no hay sesión válida.
 * 
 * USO:
 * - definePageMeta({ middleware: 'auth' })
 * - Automático en layouts o páginas que requieren autenticación básica
 * 
 * IMPORTANTE:
 * - Solo verifica autenticación, NO autorización (roles)
 * - Para verificar roles específicos usar 'require-admin-role'
 * - La redirección preserva la ruta original como query parameter
 */
export default defineNuxtRouteMiddleware(async (_to) => {
  // Skip auth check during SSR to avoid initialization problems
  if (import.meta.server) {
    return
  }
  
  // Importar composable de tokens
  const { useAuthToken } = await import('~/composables/auth/useAuthToken')
  const { hasValidToken, getAuthHeaders } = useAuthToken()
  
  // Verificación rápida con token primero (para Vercel)
  if (hasValidToken()) {
    // Token válido encontrado, continuar navegación
    return
  }
  
  // Si no hay token, intentar verificar con API (fallback para cookies)
  try {
    const response = await $fetch<{authenticated: boolean}>('/api/auth/user', {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        ...getAuthHeaders() // Incluir headers de token si existen
      }
    })
    
    // Si está autenticado, continuar navegación
    if (response.authenticated) {
      return
    }
    
  } catch (error) {
    console.warn('Auth middleware API check failed:', error)
  }
  
  // No está autenticado, redirigir al login
  return navigateTo('/auth/login')
})