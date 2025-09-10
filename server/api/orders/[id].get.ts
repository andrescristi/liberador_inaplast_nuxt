/**
 * API endpoint para obtener una orden específica con sus tests
 */
import { serverSupabaseServiceRole } from '#supabase/server'

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
        tests!orders_preguntas_pregunta_fkey (
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
    
    return {
      success: true,
      data: {
        ...order,
        tests: orderTests || []
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