/**
 * API endpoint para obtener la URL del PDF con QR de una orden
 */
import { serverSupabaseServiceRole, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  try {
    // Validar método
    assertMethod(event, 'GET')

    // Obtener usuario actual
    const user = await serverSupabaseUser(event)
    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Usuario no autenticado'
      })
    }

    // Obtener ID de la orden desde los parámetros
    const orderId = getRouterParam(event, 'id')
    if (!orderId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID de orden inválido'
      })
    }

    // Obtener cliente de Supabase con permisos de servicio
    const supabase = serverSupabaseServiceRole(event)

    // Verificar que la orden existe y no está eliminada
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('id, pedido, creado_por')
      .eq('id', orderId)
      .is('eliminado_por', null) // Solo órdenes no eliminadas
      .single()

    if (orderError || !order) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Orden no encontrada'
      })
    }

    // Obtener perfil del usuario para verificar el rol
    const { data: userProfile } = await supabase
      .from('profiles')
      .select('user_role')
      .eq('user_id', user.id)
      .single()

    const userRole = userProfile?.user_role || user.user_metadata?.user_role || 'User'

    // VALIDACIÓN CRÍTICA: Si es Inspector, solo puede acceder a las órdenes que él creó
    if (userRole === 'Inspector' && order.creado_por !== user.id) {
      throw createError({
        statusCode: 403,
        statusMessage: 'No tienes permisos para acceder a esta orden'
      })
    }

    // Verificar si el archivo PDF existe en el bucket
    const fileName = `${orderId}.pdf`
    const { data: fileList, error: listError } = await supabase.storage
      .from('qr_bucket')
      .list('', {
        search: fileName
      })

    if (listError) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Error al verificar el archivo PDF'
      })
    }

    const fileExists = fileList?.some(file => file.name === fileName)

    if (!fileExists) {
      throw createError({
        statusCode: 404,
        statusMessage: 'PDF con QR no encontrado para esta orden'
      })
    }

    // Generar URL firmada para bucket privado (válida por 1 hora)
    const { data: signedUrlData, error: urlError } = await supabase.storage
      .from('qr_bucket')
      .createSignedUrl(fileName, 3600) // 1 hora

    if (urlError) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Error al generar URL de descarga'
      })
    }

    return {
      success: true,
      data: {
        qr_pdf_url: signedUrlData.signedUrl,
        order_id: orderId,
        file_name: fileName
      }
    }

  } catch (error) {
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