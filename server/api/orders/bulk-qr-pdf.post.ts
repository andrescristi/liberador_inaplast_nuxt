import { serverSupabaseServiceRole, serverSupabaseUser } from '#supabase/server'
import { generateBulkOrderQRPDF } from '../../../server/utils/bulk-qr-pdf-generator'

export default defineEventHandler(async (event) => {
  try {
    // Verificar autenticación
    const user = await serverSupabaseUser(event)
    if (!user) {
      throw createError({
        statusCode: 401,
        message: 'No autenticado'
      })
    }

    // Obtener los IDs de las órdenes desde el body
    const body = await readBody(event)
    const { orderIds } = body

    if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
      throw createError({
        statusCode: 400,
        message: 'Se requiere un array de IDs de órdenes'
      })
    }

    // Limitar a 100 órdenes por descarga
    if (orderIds.length > 100) {
      throw createError({
        statusCode: 400,
        message: 'No se pueden descargar más de 100 órdenes a la vez'
      })
    }

    const supabase = serverSupabaseServiceRole(event)

    // Obtener información del usuario para verificar permisos
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('user_role')
      .eq('user_id', user.id)
      .single()

    if (profileError || !profile) {
      throw createError({
        statusCode: 403,
        message: 'No se pudo verificar el rol del usuario'
      })
    }

    // Obtener la información completa de las órdenes
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('id, numero_orden, pedido, cliente, status, inspector_calidad, eliminado_por, created_at')
      .in('id', orderIds)
      .is('eliminado_por', null)

    if (ordersError) {
      throw createError({
        statusCode: 500,
        message: 'Error al obtener las órdenes'
      })
    }

    if (!orders || orders.length === 0) {
      throw createError({
        statusCode: 404,
        message: 'No se encontraron órdenes válidas'
      })
    }

    // Si es inspector, verificar que todas las órdenes le pertenezcan
    if (profile.user_role === 'Inspector') {
      const unauthorizedOrder = orders.find(order => order.inspector_calidad !== user.id)
      if (unauthorizedOrder) {
        throw createError({
          statusCode: 403,
          message: 'No tienes permiso para acceder a todas las órdenes seleccionadas'
        })
      }
    }

    // Preparar datos para el generador de PDF
    const ordersData = orders.map(order => ({
      id: order.id,
      pedido: order.pedido || 'Sin pedido',
      cliente: order.cliente || 'Sin cliente',
      status: order.status || 'pendiente',
      createdAt: order.created_at
    }))

    // Generar el PDF con todos los QR codes
    const pdfBuffer = await generateBulkOrderQRPDF(ordersData)

    // Generar nombre único para el archivo temporal
    const timestamp = Date.now()
    const tempFileName = `temp/bulk-qr-${timestamp}.pdf`

    // Subir el PDF combinado al bucket en una carpeta temporal
    const { error: uploadError } = await supabase.storage
      .from('qr_bucket')
      .upload(tempFileName, pdfBuffer, {
        contentType: 'application/pdf',
        upsert: true
      })

    if (uploadError) {
      throw createError({
        statusCode: 500,
        message: 'Error al guardar el PDF combinado'
      })
    }

    // Generar URL firmada temporal (válida por 1 hora)
    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from('qr_bucket')
      .createSignedUrl(tempFileName, 3600) // 1 hora

    if (signedUrlError || !signedUrlData) {
      throw createError({
        statusCode: 500,
        message: 'Error al generar URL de descarga'
      })
    }

    // Programar limpieza del archivo temporal después de 2 horas
    setTimeout(async () => {
      try {
        await supabase.storage
          .from('qr_bucket')
          .remove([tempFileName])
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error al limpiar archivo temporal:', error)
      }
    }, 2 * 60 * 60 * 1000) // 2 horas

    return {
      success: true,
      data: {
        downloadUrl: signedUrlData.signedUrl,
        totalOrders: orders.length
      }
    }
  } catch (error: unknown) {
    // eslint-disable-next-line no-console
    console.error('Error en bulk-qr-pdf:', error)

    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }

    throw createError({
      statusCode: 500,
      message: 'Error al procesar la solicitud de descarga masiva'
    })
  }
})
