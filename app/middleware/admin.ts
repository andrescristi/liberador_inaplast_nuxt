/**
 * Middleware para páginas que requieren permisos de administrador
 * 
 * Verifica que el usuario esté autenticado Y tenga rol de Admin
 * 
 * USO:
 * - definePageMeta({ middleware: ['auth', 'admin'] })
 * - Para páginas de administración del sistema
 */
export default defineNuxtRouteMiddleware(async (_to) => {
  // Skip durante SSR
  if (import.meta.server) {
    return
  }
  
  const { useHybridAuth } = await import('~/composables/auth/useHybridAuth')
  const { checkAuth, isAdmin } = useHybridAuth()
  
  // Primero verificar que esté autenticado
  const isAuthenticated = await checkAuth()
  
  if (!isAuthenticated) {
    return navigateTo('/auth/login')
  }
  
  // Verificar que tenga rol de admin
  if (!isAdmin.value) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Se requieren permisos de administrador'
    })
  }
})