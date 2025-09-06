import { refreshHybridAuth } from '../../utils/hybrid-auth'

/**
 * Endpoint para refrescar la autenticación híbrida
 * 
 * POST /api/auth/refresh
 * 
 * Extiende la duración de la sesión y genera un nuevo JWT
 */
export default defineEventHandler(async (event) => {
  // Solo permitir POST
  assertMethod(event, 'POST')
  
  try {
    // Refrescar autenticación
    const authData = await refreshHybridAuth(event)
    
    return {
      success: true,
      jwt: authData.jwt,
      user: authData.user,
      message: 'Sesión renovada exitosamente'
    }
    
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
    
    throw createError({
      statusCode: 401,
      statusMessage: `Error renovando sesión: ${errorMessage}`
    })
  }
})