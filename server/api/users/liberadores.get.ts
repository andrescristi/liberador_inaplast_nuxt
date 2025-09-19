/**
 * API endpoint para obtener solo los usuarios que han realizado liberaciones de órdenes
 */
import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
  try {
    // Obtener cliente de Supabase con permisos de servicio
    const supabase = serverSupabaseServiceRole(event)

    // Primero obtener los IDs únicos de usuarios que han liberado órdenes
    const { data: userIds, error: userIdsError } = await supabase
      .from('orders')
      .select('id_usuario')
      .not('id_usuario', 'is', null)

    if (userIdsError) {
      console.error('Error obteniendo IDs de usuarios:', userIdsError)
      throw createError({
        statusCode: 500,
        statusMessage: 'Error al obtener los usuarios liberadores: ' + userIdsError.message
      })
    }

    // Extraer IDs únicos
    const uniqueUserIds = [...new Set((userIds || []).map(item => item.id_usuario).filter(Boolean))]

    if (uniqueUserIds.length === 0) {
      return {
        success: true,
        data: []
      }
    }

    // Obtener perfiles de esos usuarios únicamente
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('user_id, first_name, last_name, user_role')
      .in('user_id', uniqueUserIds)
      .order('first_name', { ascending: true })

    if (error) {
      console.error('Error obteniendo usuarios:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Error al obtener los usuarios: ' + error.message
      })
    }

    return {
      success: true,
      data: profiles || []
    }

  } catch (error) {
    console.error('Error en API users/liberadores:', error)

    // Si es un error de createError, re-lanzarlo
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }

    // Error genérico
    throw createError({
      statusCode: 500,
      statusMessage: 'Error interno del servidor'
    })
  }
})