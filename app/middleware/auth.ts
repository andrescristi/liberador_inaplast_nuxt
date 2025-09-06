/**
 * Middleware de autenticación híbrida para páginas protegidas
 * 
 * Verifica tanto JWT (localStorage) como session ID (cookie) 
 * siguiendo el sistema híbrido implementado
 * 
 * USO:
 * - definePageMeta({ middleware: 'auth' })
 * - Para páginas que requieren autenticación básica
 * 
 * IMPORTANTE:
 * - Solo verifica autenticación, NO autorización (roles)
 * - Para verificar roles específicos usar middleware específico
 * - Redirige a dashboard (/) después de login exitoso
 */
export default defineNuxtRouteMiddleware(async (_to) => {
  // Skip durante SSR para evitar problemas de inicialización
  if (import.meta.server) {
    return
  }
  
  const { useHybridAuth } = await import('~/composables/auth/useHybridAuth')
  const { checkAuth, hasValidJWT } = useHybridAuth()
  
  // Verificación rápida con JWT local primero
  if (!hasValidJWT()) {
    // No hay JWT válido, redirigir al login
    return navigateTo('/auth/login')
  }
  
  // Verificar con el servidor (valida JWT + session)
  try {
    const isAuthenticated = await checkAuth()
    
    if (!isAuthenticated) {
      // La verificación del servidor falló, redirigir al login
      return navigateTo('/auth/login')
    }
    
    // Usuario autenticado correctamente, continuar
    
  } catch (error) {
    console.warn('Error en verificación de autenticación híbrida:', error)
    // En caso de error, redirigir al login por seguridad
    return navigateTo('/auth/login')
  }
})