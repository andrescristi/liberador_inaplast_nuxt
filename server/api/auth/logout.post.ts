import { logoutUser } from '../../utils/hybrid-auth'

/**
 * Endpoint de logout con sistema híbrido JWT + Session
 * 
 * POST /api/auth/logout
 * 
 * Limpia tanto la sesión del servidor como instruye al cliente
 * para eliminar el JWT de localStorage
 */
export default defineEventHandler(async (event) => {
  // Solo permitir POST
  assertMethod(event, 'POST')
  
  try {
    // Limpiar sesión híbrida
    const result = await logoutUser(event)
    
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