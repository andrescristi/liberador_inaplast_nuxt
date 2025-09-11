/**
 * API endpoint para obtener una orden específica con sus tests y resumen de inspección
 */
import { serverSupabaseServiceRole } from '#supabase/server'

interface Test {
  id: number
  name: string
  type?: string
}

interface OrderTest {
  id: number
  aprobado: boolean
  cantidad_unidades_con_falla: number
  created_at: string
  tests: Test
}

export default defineEventHandler(async (event) => {
  try {
    // Obtener ID de la orden
    const orderId = getRouterParam(event, 'id')
    
    if (!orderId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID de orden requerido'
      })
    }
    
    // Obtener cliente de Supabase con permisos de servicio
    const supabase = serverSupabaseServiceRole(event)
    
    // Obtener la orden
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single()
    
    if (orderError) {
      console.error('Error obteniendo orden:', orderError)
      
      if (orderError.code === 'PGRST116') {
        throw createError({
          statusCode: 404,
          statusMessage: 'Orden no encontrada'
        })
      }
      
      throw createError({
        statusCode: 500,
        statusMessage: 'Error al obtener la orden: ' + orderError.message
      })
    }
    
    // Obtener los tests de la orden con información del test
    const { data: orderTests, error: testsError } = await supabase
      .from('orders_tests')
      .select(`
        id,
        aprobado,
        cantidad_unidades_con_falla,
        created_at,
        tests!orders_tests_pregunta_fkey (
          id,
          name,
          type
        )
      `)
      .eq('order', orderId)
      .order('pregunta')
    
    if (testsError) {
      console.error('Error obteniendo tests de la orden:', testsError)
      // No es un error crítico, continuamos sin los tests
    }
    
    const tests = orderTests || []
    
    // Calcular resumen de inspección
    const testsAprobados = tests.filter((test: OrderTest) => test.aprobado).length
    const testsReprobados = tests.filter((test: OrderTest) => !test.aprobado).length
    const totalUnidadesConFalla = tests.reduce((sum: number, test: OrderTest) => 
      sum + (test.cantidad_unidades_con_falla || 0), 0
    )
    
    // Determinar status de inspección
    const statusInspeccion = testsReprobados > 0 ? 'Rechazado' : 'Aprobado'
    
    // Calcular porcentaje de calidad
    const porcentajeCalidad = tests.length > 0 ? 
      Math.round((testsAprobados / tests.length) * 100) : 0
    
    // Crear resumen detallado
    const resumenInspeccion = {
      statusFinal: statusInspeccion,
      testsTotal: tests.length,
      testsAprobados,
      testsReprobados,
      porcentajeCalidad,
      totalUnidadesConFalla,
      unidadesPorEmbalaje: order.unidades_por_embalaje || 1,
      cantidadEmbalajes: order.cantidad_embalajes || 1,
      muestreoReal: order.muestreo_real || 1,
      fechaInspeccion: order.created_at,
      inspector: order.inspector_calidad
    }
    
    return {
      success: true,
      data: {
        orden: order,
        tests,
        resumenInspeccion,
        message: `Orden ${statusInspeccion.toLowerCase()} - ${testsAprobados}/${tests.length} tests aprobados`
      }
    }
    
  } catch (error) {
    console.error('Error en API orders/[id]:', error)
    
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