import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

/**
 * Endpoint para manejar el cierre de sesión del usuario
 * Invalida la sesión de Supabase y limpia las cookies/tokens
 * Reemplaza la funcionalidad de signOut() para uso desde cliente
 * 
 * @returns Confirmación de logout exitoso
 */
export default defineEventHandler(async (event) => {
  try {
    const supabase = await serverSupabaseClient(event)
    const user = await serverSupabaseUser(event)

    // Verificar que hay un usuario autenticado antes del logout
    if (!user) {
      // No es un error crítico - el usuario ya no está autenticado
      return {
        success: true,
        message: 'Usuario ya no estaba autenticado',
        logged_out: false
      }
    }

    // Realizar logout en Supabase
    const { error } = await supabase.auth.signOut()

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: `Error durante el cierre de sesión: ${error.message}`
      })
    }

    // Opcional: Log del evento para auditoría
    if (import.meta.server) {
      try {
        const logger = event.context.logger
        if (logger && typeof logger.info === 'function') {
          logger.info({
            userId: user.id,
            userEmail: user.email,
            timestamp: new Date().toISOString(),
            context: 'auth/logout.post'
          }, 'User logged out successfully')
        }
      } catch {
        // Error silencioso en logging - no debe afectar el logout
      }
    }

    return {
      success: true,
      message: 'Sesión cerrada correctamente',
      logged_out: true,
      timestamp: new Date().toISOString()
    }
  } catch (error: unknown) {
    // Si es un error de createError, re-lanzarlo
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }

    // Para otros errores, crear error genérico
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
    throw createError({
      statusCode: 500,
      statusMessage: `Error interno durante logout: ${errorMessage}`
    })
  }
})