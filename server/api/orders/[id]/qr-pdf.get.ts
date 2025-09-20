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

    // Verificar que la orden existe
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('id, pedido')
      .eq('id', orderId)
      .single()

    if (orderError || !order) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Orden no encontrada'
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