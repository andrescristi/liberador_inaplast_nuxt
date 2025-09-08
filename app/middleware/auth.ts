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
export default defineNuxtRouteMiddleware(async (to) => {
  // Skip durante SSR para evitar problemas de inicialización
  if (import.meta.server) {
    console.log('🔒 [Middleware Auth] Skipping on server side')
    return
  }
  
  console.log('🔒 [Middleware Auth] Running on client side for route:', to.path)
  
  const { useHybridAuth } = await import('~/composables/auth/useHybridAuth')
  const { checkAuth, hasValidJWT } = useHybridAuth()
  
  // Verificación rápida con JWT local primero
  console.log('🔍 [Middleware Auth] Verificando JWT local...')
  if (!hasValidJWT()) {
    console.log('❌ [Middleware Auth] No hay JWT válido, redirigiendo al login')
    // No hay JWT válido, redirigir al login
    return navigateTo('/auth/login')
  }
  
  console.log('✅ [Middleware Auth] JWT válido encontrado, verificando con servidor...')
  
  // Verificar con el servidor (valida JWT + session)
  try {
    const isAuthenticated = await checkAuth()
    
    if (!isAuthenticated) {
      console.log('❌ [Middleware Auth] Servidor dice que no está autenticado, redirigiendo al login')
      // La verificación del servidor falló, redirigir al login
      return navigateTo('/auth/login')
    }
    
    console.log('✅ [Middleware Auth] Usuario autenticado correctamente, continuando...')
    // Usuario autenticado correctamente, continuar
    
  } catch (error) {
    console.warn('❌ [Middleware Auth] Error en verificación de autenticación híbrida:', error)
    // En caso de error, redirigir al login por seguridad
    return navigateTo('/auth/login')
  }
})