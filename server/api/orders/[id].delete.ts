/**
 * API endpoint para marcar una orden como eliminada (soft delete)
 * Solo usuarios con rol Admin o Supervisor pueden eliminar órdenes
 */
import type { H3Event } from 'h3'
import { serverSupabaseServiceRole, serverSupabaseUser } from '#supabase/server'
import { orderLogger } from '../../utils/logger'

/**
 * Verifica que el usuario tenga permisos para eliminar órdenes (Admin o Supervisor)
 * @param event - Evento H3 de Nitro
 * @returns Usuario autenticado y autorizado
 * @throws 401 - Si no hay token JWT válido
 * @throws 403 - Si el usuario no tiene permisos suficientes
 */
async function requireDeleteOrderAuth(event: H3Event) {
  // Verificar autenticación JWT
  const user = await serverSupabaseUser(event)
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'No autorizado. Se requiere autenticación.'
    })
  }

  // Obtener rol actual desde base de datos usando service role
  const supabase = serverSupabaseServiceRole(event)
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('user_role')
    .eq('user_id', user.id)
    .single()

  if (error || !profile) {
    throw createError({
      statusCode: 403,
      statusMessage: 'No se pudo verificar el perfil del usuario.'
    })
  }

  // Verificar que el usuario tiene rol Admin o Supervisor
  if (profile.user_role !== 'Admin' && profile.user_role !== 'Supervisor') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Acceso denegado. Se requieren permisos de administrador o supervisor para eliminar órdenes.'
    })
  }

  return user
}

export default defineEventHandler(async (event) => {
  try {
    // Validar método HTTP
    assertMethod(event, 'DELETE')

    // Verificar autenticación y autorización
    await requireDeleteOrderAuth(event)

    // Obtener ID de la orden
    const orderId = getRouterParam(event, 'id')

    if (!orderId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID de orden requerido'
      })
    }

    // Validar que el ID tenga formato de UUID
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(orderId)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID de orden debe ser un UUID válido'
      })
    }

    // Obtener cliente de Supabase con permisos de servicio
    const supabase = serverSupabaseServiceRole(event)

    // Verificar que la orden existe y no está ya eliminada
    const { data: existingOrder, error: checkError } = await supabase
      .from('orders')
      .select('id, numero_orden, cliente, producto, eliminado_por')
      .eq('id', orderId)
      .single()

    if (checkError) {
      if (checkError.code === 'PGRST116') {
        throw createError({
          statusCode: 404,
          statusMessage: 'Orden no encontrada'
        })
      }

      throw createError({
        statusCode: 500,
        statusMessage: 'Error al verificar la orden: ' + checkError.message
      })
    }

    // Verificar que la orden no esté ya eliminada
    if (existingOrder.eliminado_por) {
      throw createError({
        statusCode: 400,
        statusMessage: 'La orden ya ha sido eliminada previamente'
      })
    }

    // Obtener usuario autenticado para marcar quién eliminó la orden
    const deleteUser = await requireDeleteOrderAuth(event)

    // Marcar la orden como eliminada (soft delete) estableciendo eliminado_por
    const { error: updateOrderError } = await supabase
      .from('orders')
      .update({
        eliminado_por: deleteUser.id,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)

    if (updateOrderError) {
      orderLogger.error({
        error: updateOrderError.message,
        orderId,
        userId: deleteUser.id
      }, 'Error marcando la orden como eliminada')
      throw createError({
        statusCode: 500,
        statusMessage: 'Error al marcar la orden como eliminada: ' + updateOrderError.message
      })
    }

    // Respuesta exitosa
    return {
      success: true,
      data: {
        deletedOrderId: orderId,
        deletedOrder: {
          id: existingOrder.id,
          numeroOrden: existingOrder.numero_orden,
          cliente: existingOrder.cliente,
          producto: existingOrder.producto
        },
        eliminadoPor: deleteUser.id
      },
      message: `Orden ${existingOrder.numero_orden || orderId} marcada como eliminada exitosamente`
    }

  } catch (error) {
    orderLogger.error({
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    }, 'Error en API orders/[id].delete')

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