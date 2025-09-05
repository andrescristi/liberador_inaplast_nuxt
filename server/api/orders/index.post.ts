/**
 * API endpoint para crear nueva orden con tests automáticos
 */
import { serverSupabaseServiceRole } from '#supabase/server'

interface OrderTestData {
  test_id: number
  aprobado: boolean
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
  cantidad_unidades: number
  jefe_de_turno?: string
  orden_de_compra?: string
  numero_operario: string
  maquina: string
  inspector_calidad: string
  
  // Tests asociados a la orden - cada test debe estar incluido
  orders_tests?: OrderTestData[]
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
    const requiredFields = ['cliente', 'producto', 'pedido', 'fecha_fabricacion', 'codigo_producto', 'turno', 'cantidad_unidades', 'numero_operario', 'maquina', 'inspector_calidad']
    const missingFields = requiredFields.filter(field => !body[field as keyof CreateOrderRequest])
    
    if (missingFields.length > 0) {
      throw createError({
        statusCode: 400,
        statusMessage: `Campos requeridos faltantes: ${missingFields.join(', ')}`
      })
    }
    
    // Validaciones adicionales de tipos y valores
    if (typeof body.cantidad_unidades !== 'number' || body.cantidad_unidades <= 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'cantidad_unidades debe ser un número mayor a 0'
      })
    }
    
    // Validar formato de fecha
    if (isNaN(Date.parse(body.fecha_fabricacion))) {
      throw createError({
        statusCode: 400,
        statusMessage: 'fecha_fabricacion debe ser una fecha válida'
      })
    }
    
    // Validar estructura de orders_tests si se proporciona y no está vacío
    if (body.orders_tests && !Array.isArray(body.orders_tests)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'orders_tests debe ser un array'
      })
    }
    
    // Validar cada elemento de orders_tests
    if (body.orders_tests && body.orders_tests.length > 0) {
      for (let i = 0; i < body.orders_tests.length; i++) {
        const orderTest = body.orders_tests[i]
        if (!orderTest || typeof orderTest.test_id !== 'number') {
          throw createError({
            statusCode: 400,
            statusMessage: `orders_tests[${i}].test_id debe ser un número`
          })
        }
        if (typeof orderTest.aprobado !== 'boolean') {
          throw createError({
            statusCode: 400,
            statusMessage: `orders_tests[${i}].aprobado debe ser un booleano`
          })
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
    if (body.orders_tests) {
      const providedTestIds = body.orders_tests.map(ot => ot.test_id)
      const allTestIds = tests.map(t => t.id)
      const missingTests = allTestIds.filter(id => !providedTestIds.includes(id))
      
      if (missingTests.length > 0) {
        throw createError({
          statusCode: 400,
          statusMessage: `Faltan tests obligatorios con IDs: ${missingTests.join(', ')}. Todos los tests deben estar incluidos.`
        })
      }
      
      const invalidTests = providedTestIds.filter(id => !allTestIds.includes(id))
      if (invalidTests.length > 0) {
        throw createError({
          statusCode: 400,
          statusMessage: `Tests inválidos con IDs: ${invalidTests.join(', ')}. Estos tests no existen.`
        })
      }
    }
    
    // Preparar datos de los tests (sin el order.id aún)
    let testResults
    
    if (body.orders_tests) {
      // Usar los datos proporcionados de orders_tests
      testResults = body.orders_tests.map(orderTest => ({
        pregunta: orderTest.test_id,
        aprobado: orderTest.aprobado
      }))
    } else {
      // Fallback: usar test_results o crear con valores por defecto
      testResults = tests.map(test => ({
        pregunta: test.id,
        aprobado: body.test_results?.[test.id] ?? false
      }))
    }
    
    // Determinar el status de la orden basado en los tests
    // Si algún test está reprobado (aprobado: false), la orden es "Rechazado"
    // Solo si TODOS los tests están aprobados, la orden es "Aprobado"
    const hasAnyFailedTest = testResults.some(test => !test.aprobado)
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
      cantidad_unidades: body.cantidad_unidades,
      jefe_de_turno: body.jefe_de_turno || null,
      orden_de_compra: body.orden_de_compra || null,
      numero_operario: body.numero_operario,
      maquina: body.maquina,
      inspector_calidad: body.inspector_calidad,
      status: orderStatus
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
    const orderTests = testResults.map(test => ({
      order: order.id,
      pregunta: test.pregunta,
      aprobado: test.aprobado
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
        observaciones,
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