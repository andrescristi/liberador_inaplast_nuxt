import { verifyHybridAuth } from '../../../server/utils/hybrid-auth'
import { serverSupabaseServiceRole } from '#supabase/server'

/**
 * Endpoint para obtener la información del usuario autenticado actual
 * Usa el sistema híbrido JWT + Session para verificación
 * 
 * @returns Usuario con información de perfil o null si no está autenticado
 */
export default defineEventHandler(async (event) => {
  try {
    // Verificar autenticación híbrida (JWT + Session)
    const auth = await verifyHybridAuth(event)
    
    if (!auth) {
      return {
        user: null,
        authenticated: false
      }
    }

    // Obtener información completa del perfil usando service role
    const supabaseServiceRole = serverSupabaseServiceRole(event)
    const { data: profile, error: profileError } = await supabaseServiceRole
      .from('profiles')
      .select('first_name, last_name, user_role, created_at, updated_at')
      .eq('user_id', auth.userId)
      .single()
      
    if (profileError || !profile) {
      console.warn('No se pudo obtener perfil completo, retornando datos básicos')
      return {
        user: {
          id: auth.userId,
          email: auth.email,
          role: auth.role
        },
        authenticated: true
      }
    }

    // Retornar información completa del usuario
    return {
      user: {
        id: auth.userId,
        email: auth.email,
        role: profile.user_role, // Usar el rol desde el perfil de la base de datos
        first_name: profile.first_name,
        last_name: profile.last_name,
        full_name: `${profile.first_name} ${profile.last_name}`,
        created_at: profile.created_at,
        updated_at: profile.updated_at
      },
      authenticated: true
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
    
    // Si es un error de autenticación, retornar no autenticado sin lanzar error
    if (error && typeof error === 'object' && 'statusCode' in error && error.statusCode === 401) {
      return {
        user: null,
        authenticated: false
      }
    }
    
    // Para otros errores, lanzar error
    console.error('Error en /api/auth/user:', error)
    throw createError({
      statusCode: 500,
      statusMessage: `Error al obtener usuario actual: ${errorMessage}`
    })
  }
})