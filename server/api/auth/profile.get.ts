import { verifyHybridAuth } from '../../utils/hybrid-auth'
import { serverSupabaseServiceRole } from '#supabase/server'

/**
 * Endpoint para obtener el perfil completo del usuario autenticado
 * Usa el sistema de autenticación híbrida (JWT + Session)
 * Reemplaza la funcionalidad de getCurrentUserProfile() para uso desde cliente
 * 
 * @returns Perfil completo del usuario con datos de auth y perfil
 */
export default defineEventHandler(async (event) => {
  try {
    // Verificar autenticación híbrida (JWT + Session)
    const auth = await verifyHybridAuth(event)
    
    if (!auth) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Autenticación requerida'
      })
    }

    // Usar service role para obtener datos del perfil
    const supabase = serverSupabaseServiceRole(event)
    
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
      .eq('user_id', auth.userId)
      .single()

    if (error) {
      // eslint-disable-next-line no-console
      console.error('Error obteniendo perfil desde BD:', error)
      throw createError({
        statusCode: 404,
        statusMessage: `Error al obtener perfil: ${error.message}`
      })
    }

    // Combinar datos de auth híbrida y perfil
    return {
      // Datos de autenticación híbrida
      id: auth.userId,
      email: auth.email,
      email_confirmed_at: null, // No disponible en sistema híbrido
      last_sign_in_at: null, // No disponible en sistema híbrido
      
      // Datos del perfil
      profile_id: profile.id,
      user_id: profile.user_id,
      first_name: profile.first_name,
      last_name: profile.last_name,
      full_name: `${profile.first_name} ${profile.last_name}`,
      user_role: profile.user_role,
      
      // Timestamps
      auth_created_at: null, // No disponible en sistema híbrido
      auth_updated_at: null, // No disponible en sistema híbrido
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