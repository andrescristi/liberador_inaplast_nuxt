/**
 * API endpoint para eliminar una orden específica
 * Solo usuarios con rol Admin o Supervisor pueden eliminar órdenes
 */
import type { H3Event } from 'h3'
import { serverSupabaseServiceRole, serverSupabaseUser } from '#supabase/server'

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

    // Verificar que la orden existe antes de intentar eliminarla
    const { data: existingOrder, error: checkError } = await supabase
      .from('orders')
      .select('id, numero_orden, cliente, producto')
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

    // Eliminar primero los tests relacionados (orders_tests)
    // Esto es necesario debido a las restricciones de clave foránea
    const { error: deleteTestsError } = await supabase
      .from('orders_tests')
      .delete()
      .eq('"order"', orderId)

    if (deleteTestsError) {
      // eslint-disable-next-line no-console
      console.error('Error eliminando tests de la orden:', deleteTestsError)
      throw createError({
        statusCode: 500,
        statusMessage: 'Error al eliminar los tests de la orden: ' + deleteTestsError.message
      })
    }

    // Eliminar el archivo PDF del bucket de Supabase si existe
    try {
      const fileName = `${orderId}.pdf`
      const { error: deleteFileError } = await supabase.storage
        .from('qr_bucket')
        .remove([fileName])

      if (deleteFileError) {
        // eslint-disable-next-line no-console
        console.warn('No se pudo eliminar el archivo PDF:', deleteFileError.message)
        // No fallar la operación por esto, el archivo puede no existir
      }
    } catch (fileError) {
      // eslint-disable-next-line no-console
      console.warn('Error al intentar eliminar archivo PDF:', fileError)
      // Continuar con la eliminación de la orden
    }

    // Ahora eliminar la orden principal
    const { error: deleteOrderError } = await supabase
      .from('orders')
      .delete()
      .eq('id', orderId)

    if (deleteOrderError) {
      // eslint-disable-next-line no-console
      console.error('Error eliminando la orden:', deleteOrderError)
      throw createError({
        statusCode: 500,
        statusMessage: 'Error al eliminar la orden: ' + deleteOrderError.message
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
        }
      },
      message: `Orden ${existingOrder.numero_orden || orderId} eliminada exitosamente`
    }

  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error en API orders/[id].delete:', error)

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