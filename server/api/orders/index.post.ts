/**
 * API endpoint para crear nueva orden con tests automáticos
 */
import { serverSupabaseServiceRole } from '#supabase/server'

interface OrderTestData {
  testId?: number
  test_id?: number // For backward compatibility
  aprobado: boolean
  cantidad_unidades_con_falla?: number
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
  cantidad_unidades_por_embalaje: number
  jefe_de_turno?: string
  orden_de_compra?: string
  numero_operario: string
  maquina: string
  inspector_calidad: string
  
  // Tests asociados a la orden - cada test debe estar incluido
  orders_tests?: OrderTestData[]
  cantidad_muestra?: number
  // Mantener compatibilidad con formato anterior
  test_results?: { [testId: number]: boolean }
}

export default defineEventHandler(async (event) => {
  try {
    // Validar método
    assertMethod(event, 'POST')
    
    // Obtener datos del body
    const body = await readBody<CreateOrderRequest>(event)
    
    // Validar campos requeridos
    const requiredFields = ['cliente', 'producto', 'pedido', 'fecha_fabricacion', 'codigo_producto', 'turno', 'cantidad_unidades_por_embalaje', 'numero_operario', 'maquina', 'inspector_calidad']
    const missingFields = requiredFields.filter(field => !body[field as keyof CreateOrderRequest])
    
    if (missingFields.length > 0) {
      throw createError({
        statusCode: 400,
        statusMessage: `Campos requeridos faltantes: ${missingFields.join(', ')}`
      })
    }
    
    // Validaciones adicionales de tipos y valores
    if (typeof body.cantidad_unidades_por_embalaje !== 'number' || body.cantidad_unidades_por_embalaje <= 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'cantidad_unidades_por_embalaje debe ser un número mayor a 0'
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
    const cantidadMuestra = (body as any).cantidadMuestra || body.cantidad_muestra
    if (cantidadMuestra !== undefined) {
      if (typeof cantidadMuestra !== 'number' || cantidadMuestra <= 0) {
        throw createError({
          statusCode: 400,
          statusMessage: 'cantidadMuestra o cantidad_muestra debe ser un número mayor a 0'
        })
      }
    }
    
    // Obtener orders_tests con compatibilidad de nombres
    const ordersTests = (body as any).ordersTests || body.orders_tests
    
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
      const providedTestIds = ordersTests.map((ot: OrderTestData) => ot.testId || ot.test_id)
      const allTestIds = tests.map((t: any) => t.id)
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
      testResults = tests.map((test: any) => ({
        pregunta: test.id,
        aprobado: body.test_results?.[test.id] ?? false,
        cantidad_unidades_con_falla: 0
      }))
    }
    
    // Determinar el status de la orden basado en los tests
    // Si algún test está reprobado (aprobado: false), la orden es "Rechazado"
    // Solo si TODOS los tests están aprobados, la orden es "Aprobado"
    const hasAnyFailedTest = testResults.some((test: any) => !test.aprobado)
    const orderStatus: 'Aprobado' | 'Rechazado' = hasAnyFailedTest ? 'Rechazado' : 'Aprobado'
    
    // Preparar datos de la orden según la nueva estructura con el status calculado
    const orderData = {
      lote: body.lote || null,
      cliente: body.cliente,
      producto: body.producto,
      pedido: body.pedido,
      fecha_fabricacion: body.fecha_fabricacion,
      codigo_producto: body.codigo_producto,
      turno: body.turno,
      cantidad_unidades_por_embalaje: body.cantidad_unidades_por_embalaje,
      cantidad_muestra: cantidadMuestra || 1,
      jefe_de_turno: body.jefe_de_turno || null,
      orden_de_compra: body.orden_de_compra || null,
      numero_operario: body.numero_operario,
      maquina: body.maquina,
      inspector_calidad: body.inspector_calidad,
      status: orderStatus
    }
    console.log('orderData')
    console.log(orderData)
    
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
    const orderTests = testResults.map((test: any) => ({
      order: order.id,
      pregunta: test.pregunta,
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
    
    // Retornar la orden creada con información adicional
    return {
      success: true,
      data: {
        order: {
          ...order,
          orders_tests: createdOrderTests || []
        },
        summary: {
          tests_total: tests.length,
          tests_aprobados: createdOrderTests?.filter(ot => ot.aprobado).length || 0,
          tests_reprobados: createdOrderTests?.filter(ot => !ot.aprobado).length || 0,
          status_final: orderStatus
        },
        message: `Orden creada exitosamente con ${tests.length} tests asociados. Status: ${orderStatus}`
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