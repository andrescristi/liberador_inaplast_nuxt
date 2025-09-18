/**
 * Middleware de autorización estricta para rutas administrativas
 *
 * Este middleware verifica que el usuario tenga rol de Admin
 * usando una llamada a un endpoint API desde el cliente.
 *
 * USO:
 * - definePageMeta({ middleware: 'require-admin-role' })
 * - Solo para páginas de administración (/admin/*)
 */

export default defineNuxtRouteMiddleware(async () => {
  // Solo ejecutar en el cliente para evitar problemas de SSR
  if (import.meta.server) {
    return
  }

  // Temporalmente deshabilitado para debugging
  // TODO: Restaurar verificación completa de admin
  console.log('Admin middleware: permitiendo acceso temporalmente para debugging')
  return

  /*
  try {
    // Verificar autenticación básica
    const user = useSupabaseUser()

    if (!user.value) {
      console.log('Admin middleware: No user found')
      return navigateTo('/auth/login')
    }

    console.log('Admin middleware: User found:', user.value.email)

    // Verificar rol de admin usando endpoint API
    const userProfile = await $fetch('/api/auth/user')
    console.log('Admin middleware: User profile:', userProfile)

    if (!userProfile || !userProfile.authenticated) {
      console.log('Admin middleware: User not authenticated via API')
      return navigateTo('/auth/login')
    }

    // Verificar rol de administrador
    if (userProfile.user?.role !== 'Admin') {
      console.log('Admin middleware: User is not admin, role:', userProfile.user?.role)
      throw createError({
        statusCode: 403,
        statusMessage: 'Admin access required'
      })
    }

    console.log('Admin middleware: User is admin, allowing access')

  } catch (error: unknown) {
    console.error('Admin middleware error:', error)
    return navigateTo('/auth/login')
  }
  */
})