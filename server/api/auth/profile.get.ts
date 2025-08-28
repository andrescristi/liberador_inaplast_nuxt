import { serverSupabaseServiceRole, serverSupabaseUser } from '#supabase/server'

/**
 * Endpoint para obtener el perfil completo del usuario autenticado
 * Combina información de Supabase Auth con datos del perfil de la tabla profiles
 * Reemplaza la funcionalidad de getCurrentUserProfile() para uso desde cliente
 * 
 * @returns Perfil completo del usuario con datos de auth y perfil
 */
export default defineEventHandler(async (event) => {
  try {
    const supabase = serverSupabaseServiceRole(event)
    const user = await serverSupabaseUser(event)

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Autenticación requerida'
      })
    }

    // Obtener datos del perfil desde la tabla profiles
    const { data: profile, error } = await supabase
      .from('profiles')
      .select(`
        id,
        user_id,
        first_name,
        last_name,
        user_role,
        created_at,
        updated_at
      `)
      .eq('user_id', user.id)
      .single()

    if (error) {
      throw createError({
        statusCode: 404,
        statusMessage: `Error al obtener perfil: ${error.message}`
      })
    }

    // Combinar datos de auth y perfil
    return {
      // Datos de autenticación
      id: user.id,
      email: user.email || '',
      email_confirmed_at: user.email_confirmed_at,
      last_sign_in_at: user.last_sign_in_at,
      
      // Datos del perfil
      profile_id: profile.id,
      user_id: profile.user_id,
      first_name: profile.first_name,
      last_name: profile.last_name,
      full_name: `${profile.first_name} ${profile.last_name}`,
      user_role: profile.user_role,
      
      // Timestamps
      auth_created_at: user.created_at,
      auth_updated_at: user.updated_at,
      profile_created_at: profile.created_at,
      profile_updated_at: profile.updated_at,
      
      // Estado de autenticación
      authenticated: true
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
      statusMessage: `Error al obtener perfil del usuario: ${errorMessage}`
    })
  }
})