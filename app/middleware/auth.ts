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
export default defineNuxtRouteMiddleware((_to) => {
  // Obtener usuario reactivo de Supabase Auth
  // Se actualiza automáticamente cuando cambia el estado de autenticación
  const user = useSupabaseUser()

  // Verificación simple: si no hay usuario autenticado, redirigir al login
  if (!user.value) {
    // navigateTo() es la forma recomendada en Nuxt para redirecciones
    // Automáticamente maneja el historial del browser y SSR
    return navigateTo('/auth/login')
  }
  
  // Si llega aquí, el usuario está autenticado correctamente
  // El middleware permite continuar con la navegación
})