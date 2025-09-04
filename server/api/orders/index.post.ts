/**
 * API endpoint para crear nueva orden con tests automáticos
 */
import { serverSupabaseServiceRole } from '#supabase/server'

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
  
  // Resultados de tests (para pre-popular orders_tests)
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
    
    // Obtener cliente de Supabase con permisos de servicio
    const supabase = serverSupabaseServiceRole(event)
    
    // Preparar datos de la orden según la nueva estructura
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
      inspector_calidad: body.inspector_calidad
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
    
    // Obtener todos los tests disponibles
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
    
    // Crear un order_test para cada test disponible
    const orderTests = tests.map(test => ({
      order: order.id,
      pregunta: test.id,
      aprobado: body.test_results?.[test.id] ?? false // Usar resultado si se proporciona, sino false
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
    
    // Retornar la orden creada con información adicional
    return {
      success: true,
      data: {
        ...order,
        tests_created: tests.length,
        message: `Orden creada exitosamente con ${tests.length} tests automáticos`
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