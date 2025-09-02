/**
 * Middleware de autenticación básica para páginas protegidas
 * 
 * Verifica si existe un usuario autenticado activo y redirige
 * al login si no hay sesión válida.
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
  // Use our custom auth state instead of Supabase direct access
  // This prevents initialization issues
  
  // Skip auth check during SSR to avoid initialization problems
  if (import.meta.server) {
    return
  }
  
  // Use a simpler approach - check if we can access /api/auth/user
  try {
    const response = await $fetch<{authenticated: boolean}>('/api/auth/user')
    
    // If user is not authenticated, redirect to login
    if (!response.authenticated) {
      return navigateTo('/auth/login')
    }
  } catch (error) {
    // If we can't verify auth status, assume not authenticated
    console.warn('Auth middleware: Unable to verify auth status, redirecting to login')
    return navigateTo('/auth/login')
  }
  
  // If we reach here, user is authenticated - continue navigation
})