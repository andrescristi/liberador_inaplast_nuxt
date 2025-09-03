import { serverSupabaseClient } from '#supabase/server'

/**
 * Endpoint para obtener la información del usuario autenticado actual
 * Soporta autenticación tanto por cookies como por tokens en headers (para Vercel)
 * 
 * @returns Usuario de Supabase Auth o null si no está autenticado
 */
export default defineEventHandler(async (event) => {
  try {
    // Verificar si hay token en headers primero
    const authHeader = getHeader(event, 'authorization')
    const tokenHeader = getHeader(event, 'x-auth-token')
    
    let user = null
    
    // Intentar autenticación por token primero
    if (authHeader || tokenHeader) {
      const token = authHeader?.replace('Bearer ', '') || tokenHeader
      
      if (token) {
        try {
          // Verificar token con Supabase
          const supabase = await serverSupabaseClient(event)
          const { data: { user: tokenUser }, error } = await supabase.auth.getUser(token)
          
          if (!error && tokenUser) {
            user = tokenUser
          }
        } catch (tokenError) {
          console.warn('Token auth failed, trying session auth:', tokenError)
        }
      }
    }
    
    // Si no hay usuario por token, intentar método tradicional con cookies
    if (!user) {
      const { serverSupabaseUser } = await import('#supabase/server')
      user = await serverSupabaseUser(event)
    }

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
    
    // Si es un error de sesión faltante, retornar no autenticado sin lanzar error
    if (errorMessage.includes('Auth session missing') || errorMessage.includes('session missing')) {
      return {
        user: null,
        authenticated: false
      }
    }
    
    // Para otros errores, lanzar error
    throw createError({
      statusCode: 500,
      statusMessage: `Error al obtener usuario actual: ${errorMessage}`
    })
  }
})