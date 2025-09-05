/**
 * Endpoint personalizado para cerrar sesión
 * Compatible con nuxt-auth-utils - simplificado
 */
export default defineEventHandler(async (event) => {
  try {
    // Limpiar sesión usando nuxt-auth-utils
    await clearUserSession(event)

    return {
      success: true,
      message: 'Sesión cerrada correctamente',
      logged_out: true,
      timestamp: new Date().toISOString()
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
    
    throw createError({
      statusCode: 500,
      statusMessage: `Error cerrando sesión: ${errorMessage}`
    })
  }
})