/**
 * API endpoint para obtener solo los usuarios que han realizado liberaciones de órdenes
 */
import { serverSupabaseServiceRole } from '#supabase/server'
import { logger } from '../../utils/logger'

export default defineEventHandler(async (event) => {
  try {
    // Obtener cliente de Supabase con permisos de servicio
    const supabase = serverSupabaseServiceRole(event)

    // Primero obtener los IDs únicos de usuarios que han liberado órdenes (no eliminadas)
    const { data: userIds, error: userIdsError } = await supabase
      .from('orders')
      .select('creado_por')
      .not('creado_por', 'is', null)
      .is('eliminado_por', null)

    if (userIdsError) {
      logger.error({
        error: userIdsError.message
      }, 'Error obteniendo IDs de usuarios')
      throw createError({
        statusCode: 500,
        statusMessage: 'Error al obtener los usuarios liberadores: ' + userIdsError.message
      })
    }

    // Extraer IDs únicos
    const uniqueUserIds = [...new Set((userIds || []).map(item => item.creado_por).filter(Boolean))]

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
      logger.error({
        error: error.message
      }, 'Error obteniendo usuarios')
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
    logger.error({
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    }, 'Error en API users/liberadores')

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