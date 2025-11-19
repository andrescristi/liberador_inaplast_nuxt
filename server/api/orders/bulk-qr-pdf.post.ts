/**
 * API endpoint para descargar múltiples PDFs de QR combinados en un solo archivo
 */
import { serverSupabaseServiceRole, serverSupabaseUser } from '#supabase/server'
import { PDFDocument } from 'pdf-lib'

export default defineEventHandler(async (event) => {
  try {
    // Validar método
    assertMethod(event, 'POST')

    // Obtener usuario actual
    const user = await serverSupabaseUser(event)
    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Usuario no autenticado'
      })
    }

    // Obtener IDs de las órdenes desde el body
    const body = await readBody(event)
    const orderIds = body?.orderIds

    if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Debe proporcionar al menos un ID de orden'
      })
    }

    // Obtener cliente de Supabase con permisos de servicio
    const supabase = serverSupabaseServiceRole(event)

    // Obtener perfil del usuario para verificar el rol
    const { data: userProfile } = await supabase
      .from('profiles')
      .select('user_role')
      .eq('user_id', user.id)
      .single()

    const userRole = userProfile?.user_role || user.user_metadata?.user_role || 'User'

    // Verificar que las órdenes existen y no están eliminadas
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('id, pedido, creado_por')
      .in('id', orderIds)
      .is('eliminado_por', null) // Solo órdenes no eliminadas

    if (ordersError || !orders || orders.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'No se encontraron órdenes válidas'
      })
    }

    // VALIDACIÓN CRÍTICA: Si es Inspector, solo puede acceder a las órdenes que él creó
    if (userRole === 'Inspector') {
      const unauthorizedOrders = orders.filter(order => order.creado_por !== user.id)
      if (unauthorizedOrders.length > 0) {
        throw createError({
          statusCode: 403,
          statusMessage: 'No tienes permisos para acceder a algunas de estas órdenes'
        })
      }
    }

    // Crear documento PDF combinado
    const mergedPdf = await PDFDocument.create()

    // Array para almacenar PDFs descargados
    const pdfBuffers: { orderId: number, buffer: ArrayBuffer }[] = []

    // Descargar todos los PDFs
    for (const order of orders) {
      const fileName = `${order.id}.pdf`

      try {
        // Descargar PDF desde el bucket
        const { data: pdfData, error: downloadError } = await supabase.storage
          .from('qr_bucket')
          .download(fileName)

        if (downloadError || !pdfData) {
          // PDF no encontrado para esta orden, continuar con la siguiente
          continue
        }

        // Convertir Blob a ArrayBuffer
        const arrayBuffer = await pdfData.arrayBuffer()
        pdfBuffers.push({ orderId: order.id, buffer: arrayBuffer })

      } catch {
        // Error al descargar PDF, continuar con la siguiente orden
        continue
      }
    }

    if (pdfBuffers.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'No se encontraron PDFs válidos para las órdenes seleccionadas'
      })
    }

    // Combinar todos los PDFs
    for (const { buffer } of pdfBuffers) {
      try {
        const pdfDoc = await PDFDocument.load(buffer)
        const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices())
        copiedPages.forEach(page => mergedPdf.addPage(page))
      } catch {
        // Error al combinar este PDF, continuar con el siguiente
      }
    }

    // Generar el PDF combinado
    const mergedPdfBytes = await mergedPdf.save()

    // Generar nombre único para el archivo temporal
    const timestamp = Date.now()
    const fileName = `bulk-qr-${timestamp}.pdf`

    // Subir PDF combinado al bucket temporal
    const { error: uploadError } = await supabase.storage
      .from('qr_bucket')
      .upload(`temp/${fileName}`, mergedPdfBytes, {
        contentType: 'application/pdf',
        cacheControl: '3600'
      })

    if (uploadError) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Error al subir el PDF combinado'
      })
    }

    // Generar URL firmada (válida por 1 hora)
    const { data: signedUrlData, error: urlError } = await supabase.storage
      .from('qr_bucket')
      .createSignedUrl(`temp/${fileName}`, 3600)

    if (urlError) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Error al generar URL de descarga'
      })
    }

    return {
      success: true,
      data: {
        pdfUrl: signedUrlData.signedUrl,
        fileName,
        ordersCount: pdfBuffers.length
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
      statusMessage: 'Error interno del servidor al combinar PDFs'
    })
  }
})
