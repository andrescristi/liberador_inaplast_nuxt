import { serverSupabaseServiceRole } from '#supabase/server'
import { orderLogger } from '../../utils/logger'

/**
 * Endpoint optimizado para obtener estadísticas de órdenes
 *
 * GET /api/orders/stats
 *
 * Retorna estadísticas agregadas sin necesidad de traer todas las órdenes al cliente
 * Optimización: Una sola query SQL en lugar de múltiples fetches
 */
export default defineEventHandler(async (event) => {
  try {
    const supabase = serverSupabaseServiceRole(event)

    // ✅ Una sola query SQL para obtener datos necesarios
    const { data, error } = await supabase
      .from('orders')
      .select('status, created_at, fecha_liberacion')
      .is('eliminado_por', null)

    if (error) {
      orderLogger.error(
        {
          error: error.message,
          code: error.code,
        },
        'Error al obtener estadísticas de órdenes',
      )
      throw createError({
        statusCode: 500,
        statusMessage: 'Error al obtener estadísticas de órdenes',
      })
    }

    // Calcular estadísticas en el servidor
    const now = new Date()
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)

    const stats = {
      total: data.length,
      approved: data.filter(o => o.status === 'Aprobado').length,
      rejected: data.filter(o => o.status === 'Rechazado').length,
      pending: data.filter(o => o.status === 'Pendiente').length,
      thisMonth: data.filter(o => {
        const createdAt = new Date(o.created_at)
        return createdAt >= thisMonthStart
      }).length,
      liberatedThisMonth: data.filter(o => {
        if (!o.fecha_liberacion)
          return false
        const liberatedAt = new Date(o.fecha_liberacion)
        return liberatedAt >= thisMonthStart
      }).length,
    }

    orderLogger.debug(
      {
        stats,
        queryTime: 'optimized',
      },
      'Estadísticas de órdenes calculadas',
    )

    return stats
  }
  catch (error) {
    orderLogger.error(
      {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      'Error no controlado al obtener estadísticas',
    )
    throw createError({
      statusCode: 500,
      statusMessage: 'Error interno del servidor',
    })
  }
})
