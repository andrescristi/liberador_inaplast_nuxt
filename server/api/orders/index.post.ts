/**
 * API endpoint para crear nueva orden con tests automáticos
 */
import { serverSupabaseServiceRole, serverSupabaseUser } from '#supabase/server'
import { generateOrderQRPDF } from '../../utils/qr-pdf-generator'

interface OrderTestData {
  testId?: number
  test_id?: number // For backward compatibility
  aprobado: boolean
  cantidad_unidades_con_falla?: number
}

interface Test {
  id: number
  name: string
}

interface CreateOrderRequest {
  // Datos de la orden según nueva estructura
  lote?: string
  cliente: string
  producto: string
  pedido: string
  fecha_fabricacion: string
  codigo_producto: string
  turno: string
  cantidad_unidades_por_embalaje?: number
  unidadesPorEmbalaje?: number // camelCase alternative
  cantidad_embalajes?: number
  cantidadEmbalajes?: number // camelCase alternative
  jefe_de_turno?: string
  orden_de_compra?: string
  numero_operario: string
  maquina: string
  inspector_calidad: string
  
  // Tests asociados a la orden - cada test debe estar incluido
  orders_tests?: OrderTestData[]
  ordersTests?: OrderTestData[] // camelCase alternative
  cantidad_muestra?: number
  cantidadMuestra?: number // camelCase alternative
  // Mantener compatibilidad con formato anterior
  test_results?: { [testId: number]: boolean }
}

export default defineEventHandler(async (event) => {
  try {
    // Validar método
    assertMethod(event, 'POST')
    
    // Obtener datos del body
    const body = await readBody<CreateOrderRequest>(event)

    // Obtener usuario actual
    const user = await serverSupabaseUser(event)
    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Usuario no autenticado'
      })
    }
    
    // Validar campos requeridos
    const requiredFields = ['cliente', 'producto', 'pedido', 'fecha_fabricacion', 'codigo_producto', 'turno', 'numero_operario', 'maquina', 'inspector_calidad']
    const missingFields = requiredFields.filter(field => !body[field as keyof CreateOrderRequest])
    
    // Validar que al menos uno de los campos de unidades por embalaje esté presente
    if (!body.cantidad_unidades_por_embalaje && !body.unidadesPorEmbalaje) {
      missingFields.push('cantidad_unidades_por_embalaje o unidadesPorEmbalaje')
    }
    
    if (missingFields.length > 0) {
      throw createError({
        statusCode: 400,
        statusMessage: `Campos requeridos faltantes: ${missingFields.join(', ')}`
      })
    }
    
    // Validaciones adicionales de tipos y valores
    const unidadesPorEmbalaje = body.cantidad_unidades_por_embalaje || body.unidadesPorEmbalaje
    if (typeof unidadesPorEmbalaje !== 'number' || unidadesPorEmbalaje <= 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'cantidad_unidades_por_embalaje o unidadesPorEmbalaje debe ser un número mayor a 0'
      })
    }
    
    // Validar formato de fecha
    if (isNaN(Date.parse(body.fecha_fabricacion))) {
      throw createError({
        statusCode: 400,
        statusMessage: 'fecha_fabricacion debe ser una fecha válida'
      })
    }
    
    // Validar cantidad_muestra (compatible con camelCase y snake_case)
    const cantidadMuestra = body.cantidadMuestra || body.cantidad_muestra
    if (cantidadMuestra !== undefined) {
      if (typeof cantidadMuestra !== 'number' || cantidadMuestra <= 0) {
        throw createError({
          statusCode: 400,
          statusMessage: 'cantidadMuestra o cantidad_muestra debe ser un número mayor a 0'
        })
      }
    }
    
    // Obtener orders_tests con compatibilidad de nombres
    const ordersTests = body.ordersTests || body.orders_tests
    
    // Validar estructura de orders_tests si se proporciona y no está vacío
    if (ordersTests && !Array.isArray(ordersTests)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ordersTests u orders_tests debe ser un array'
      })
    }
    
    // Validar cada elemento de orders_tests
    if (ordersTests && ordersTests.length > 0) {
      for (let i = 0; i < ordersTests.length; i++) {
        const orderTest = ordersTests[i]
        if (!orderTest) {
          throw createError({
            statusCode: 400,
            statusMessage: `orders_tests[${i}] es requerido`
          })
        }
        const testId = orderTest.testId || orderTest.test_id
        if (typeof testId !== 'number') {
          throw createError({
            statusCode: 400,
            statusMessage: `orders_tests[${i}].testId o test_id debe ser un número`
          })
        }
        if (typeof orderTest.aprobado !== 'boolean') {
          throw createError({
            statusCode: 400,
            statusMessage: `orders_tests[${i}].aprobado debe ser un booleano`
          })
        }
        if (orderTest.cantidad_unidades_con_falla !== undefined) {
          if (typeof orderTest.cantidad_unidades_con_falla !== 'number' || orderTest.cantidad_unidades_con_falla < 0) {
            throw createError({
              statusCode: 400,
              statusMessage: `orders_tests[${i}].cantidad_unidades_con_falla debe ser un número mayor o igual a 0`
            })
          }
        }
      }
    }
    
    // Obtener cliente de Supabase con permisos de servicio
    const supabase = serverSupabaseServiceRole(event)
    
    // Obtener todos los tests disponibles ANTES de crear la orden
    const { data: tests, error: testsError } = await supabase
      .from('tests')
      .select('id, name')
      .order('id')
    
    if (testsError) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Error al obtener los tests: ' + testsError.message
      })
    }
    
    // Validar que todos los tests estén incluidos si se proporcionan orders_tests
    if (ordersTests) {
      const providedTestIds = ordersTests.map((ot: OrderTestData) => ot.testId || ot.test_id).filter((id): id is number => id !== undefined)
      const allTestIds = tests.map((t: Test) => t.id)
      const missingTests = allTestIds.filter((id: number) => !providedTestIds.includes(id))
      
      if (missingTests.length > 0) {
        throw createError({
          statusCode: 400,
          statusMessage: `Faltan tests obligatorios con IDs: ${missingTests.join(', ')}. Todos los tests deben estar incluidos.`
        })
      }
      
      const invalidTests = providedTestIds.filter((id: number) => !allTestIds.includes(id))
      if (invalidTests.length > 0) {
        throw createError({
          statusCode: 400,
          statusMessage: `Tests inválidos con IDs: ${invalidTests.join(', ')}. Estos tests no existen.`
        })
      }
    }
    
    // Preparar datos de los tests (sin el order.id aún)
    let testResults
    
    if (ordersTests) {
      // Usar los datos proporcionados de orders_tests
      testResults = ordersTests.map((orderTest: OrderTestData) => ({
        pregunta: orderTest.testId || orderTest.test_id,
        aprobado: orderTest.aprobado,
        cantidad_unidades_con_falla: orderTest.cantidad_unidades_con_falla || 0
      }))
    } else {
      // Fallback: usar test_results o crear con valores por defecto
      testResults = tests.map((test: Test) => ({
        pregunta: test.id,
        aprobado: body.test_results?.[test.id] ?? false,
        cantidad_unidades_con_falla: 0
      }))
    }
    
    // Determinar el status de la orden basado en los tests y el AQL
    // Calcular el total de unidades con falla de todos los tests
    const totalUnidadesConFalla = testResults.reduce((total: number, test: { aprobado: boolean; cantidad_unidades_con_falla: number }) => {
      return test.aprobado ? total : total + test.cantidad_unidades_con_falla
    }, 0)

    // Obtener cantidad_embalajes (compatible con ambos formatos)
    const cantidadEmbalajes = body.cantidad_embalajes || body.cantidadEmbalajes || 1

    // Obtener información del plan de muestreo AQL basado en el tamaño del lote
    let orderStatus: 'Aprobado' | 'Rechazado' = 'Rechazado'
    let muestreoRecomendado: number | null = null

    try {
      const tamanoLote = unidadesPorEmbalaje * cantidadEmbalajes

      // Llamar al endpoint de planes de muestreo
      const planMuestreo = await $fetch(`/api/calidad/planes-muestreo?tamano_lote=${tamanoLote}`)

      if (planMuestreo && !('error' in planMuestreo)) {
        // Capturar el muestreo recomendado del plan AQL
        muestreoRecomendado = planMuestreo.tamano_muestra || null

        // Comparar el total de fallas con el máximo permitido por el AQL
        orderStatus = totalUnidadesConFalla <= (planMuestreo.numero_maximo_fallas || 0) ? 'Aprobado' : 'Rechazado'
      } else {
        // Si no hay plan de muestreo, usar lógica fallback: cualquier test reprobado = rechazado
        const hasAnyFailedTest = testResults.some((test: { aprobado: boolean }) => !test.aprobado)
        orderStatus = hasAnyFailedTest ? 'Rechazado' : 'Aprobado'
      }
    } catch {
      // En caso de error al obtener el plan de muestreo, usar lógica fallback
      const hasAnyFailedTest = testResults.some((test: { aprobado: boolean }) => !test.aprobado)
      orderStatus = hasAnyFailedTest ? 'Rechazado' : 'Aprobado'
    }
    
    // Preparar datos de la orden según la nueva estructura con el status calculado
    const orderData = {
      lote: body.lote || null,
      cliente: body.cliente,
      producto: body.producto,
      pedido: body.pedido,
      fecha_fabricacion: body.fecha_fabricacion,
      codigo_producto: body.codigo_producto,
      turno: body.turno,
      unidades_por_embalaje: unidadesPorEmbalaje,
      cantidad_embalajes: cantidadEmbalajes,
      muestreo_recomendado: muestreoRecomendado,
      muestreo_real: cantidadMuestra || 1,
      jefe_de_turno: body.jefe_de_turno || null,
      orden_de_compra: body.orden_de_compra || null,
      numero_operario: body.numero_operario,
      maquina: body.maquina,
      inspector_calidad: body.inspector_calidad,
      status: orderStatus,
      id_usuario: user.id
    }
    
    // Crear la orden
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([orderData])
      .select()
      .single()
    
    if (orderError) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Error al crear la orden: ' + orderError.message
      })
    }
    
    // Preparar los order_tests con el ID de la orden creada
    const orderTests = testResults.map((test: { pregunta: number | undefined; aprobado: boolean; cantidad_unidades_con_falla: number }) => ({
      order: order.id,
      pregunta: test.pregunta!,
      aprobado: test.aprobado,
      cantidad_unidades_con_falla: test.cantidad_unidades_con_falla
    }))
    
    // Insertar todos los order_tests
    const { error: orderTestsError } = await supabase
      .from('orders_tests')
      .insert(orderTests)
    
    if (orderTestsError) {
      // Si hay error, eliminar la orden creada para mantener consistencia
      await supabase
        .from('orders')
        .delete()
        .eq('id', order.id)
      
      throw createError({
        statusCode: 500,
        statusMessage: 'Error al crear los tests de la orden: ' + orderTestsError.message
      })
    }
    
    // Obtener los order_tests creados para incluirlos en la respuesta
    const { data: createdOrderTests, error: fetchOrderTestsError } = await supabase
      .from('orders_tests')
      .select(`
        id,
        aprobado,
        cantidad_unidades_con_falla,
        tests (id, name)
      `)
      .eq('order', order.id)
      .order('id')

    if (fetchOrderTestsError) {
      // Los order_tests no se pudieron obtener, pero la orden se creó correctamente
      // Continuar con la respuesta pero sin los detalles de los tests
    }

    // Generar y subir el PDF con QR al bucket de Supabase
    let qrPdfUrl: string | null = null
    try {
      // Preparar datos para el PDF
      const orderQRData = {
        id: order.id,
        pedido: order.pedido,
        cliente: order.cliente,
        status: orderStatus,
        createdAt: order.created_at
      }

      // Generar el PDF
      const pdfBuffer = await generateOrderQRPDF(orderQRData)

      // Subir al bucket qr_bucket con el nombre del ID de la orden
      const fileName = `${order.id}.pdf`
      const { error: uploadError } = await supabase.storage
        .from('qr_bucket')
        .upload(fileName, pdfBuffer, {
          contentType: 'application/pdf',
          upsert: true // Reemplazar si ya existe
        })

      if (uploadError) {
        // eslint-disable-next-line no-console
        console.error('Error al subir PDF al bucket:', uploadError)
      } else {
        // Generar URL firmada para bucket privado (válida por 24 horas)
        const { data: signedUrlData, error: urlError } = await supabase.storage
          .from('qr_bucket')
          .createSignedUrl(fileName, 86400) // 24 horas

        if (!urlError && signedUrlData) {
          qrPdfUrl = signedUrlData.signedUrl
        }
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error al generar o subir el PDF con QR:', error)
      // No fallar la creación de la orden por este error
    }
    
    // Retornar la orden creada con información adicional
    return {
      success: true,
      data: {
        order: {
          ...order,
          orders_tests: createdOrderTests || [],
          qr_pdf_url: qrPdfUrl // URL del PDF con QR generado
        },
        summary: {
          tests_total: tests.length,
          tests_aprobados: createdOrderTests?.filter(ot => ot.aprobado).length || 0,
          tests_reprobados: createdOrderTests?.filter(ot => !ot.aprobado).length || 0,
          status_final: orderStatus
        },
        message: `Orden creada exitosamente con ${tests.length} tests asociados. Status: ${orderStatus}${qrPdfUrl ? '. PDF con QR generado automáticamente.' : ''}`
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