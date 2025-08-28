import { serverSupabaseUser } from '#supabase/server'

/**
 * Endpoint para obtener la información del usuario autenticado actual
 * Reemplaza la funcionalidad de useSupabaseUser() en el lado del cliente
 * 
 * @returns Usuario de Supabase Auth o null si no está autenticado
 */
export default defineEventHandler(async (event) => {
  try {
    // Obtener usuario de la sesión actual
    const user = await serverSupabaseUser(event)

    if (!user) {
      return {
        user: null,
        authenticated: false
      }
    }

    // Retornar información básica del usuario
    return {
      user: {
        id: user.id,
        email: user.email,
        email_confirmed_at: user.email_confirmed_at,
        created_at: user.created_at,
        updated_at: user.updated_at,
        last_sign_in_at: user.last_sign_in_at
      },
      authenticated: true
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
    
    throw createError({
      statusCode: 500,
      statusMessage: `Error al obtener usuario actual: ${errorMessage}`
    })
  }
})