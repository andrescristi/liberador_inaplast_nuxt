/**
 * API endpoint para obtener una orden específica con sus tests y resumen de inspección
 */
import { serverSupabaseServiceRole, serverSupabaseUser } from '#supabase/server'
import { orderLogger } from '../../utils/logger'

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
    // Obtener usuario autenticado
    const user = await serverSupabaseUser(event)

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Usuario no autenticado'
      })
    }

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
    
    // Obtener la orden (solo si no está eliminada)
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .is('eliminado_por', null) // Solo órdenes no eliminadas
      .single()

    if (orderError) {
      orderLogger.error({
        error: orderError.message,
        code: orderError.code,
        orderId
      }, 'Error obteniendo orden')

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

    // Obtener perfil del usuario para verificar el rol
    const { data: userProfile } = await supabase
      .from('profiles')
      .select('user_role')
      .eq('user_id', user.id)
      .single()

    const userRole = userProfile?.user_role || user.user_metadata?.user_role || 'User'

    // VALIDACIÓN CRÍTICA: Si es Inspector, solo puede ver las órdenes que él creó
    if (userRole === 'Inspector' && order.creado_por !== user.id) {
      throw createError({
        statusCode: 403,
        statusMessage: 'No tienes permisos para acceder a esta orden'
      })
    }

    // Obtener datos del usuario liberador si existe
    let liberadorUser = null
    if (order.creado_por) {
      const { data: userData, error: userError } = await supabase.auth.admin.getUserById(order.creado_por)
      if (!userError && userData.user) {
        liberadorUser = {
          id: userData.user.id,
          email: userData.user.email,
          user_metadata: userData.user.user_metadata
        }
      }
    }

    // Obtener los tests de la orden con información del test
    const { data: orderTests, error: testsError } = await supabase
      .from('orders_tests')
      .select(`
        id,
        aprobado,
        cantidad_unidades_con_falla,
        created_at,
        pregunta,
        tests!pregunta (
          id,
          name,
          type
        )
      `)
      .eq('"order"', orderId)
    
    if (testsError) {
      orderLogger.warn({
        error: testsError.message,
        orderId
      }, 'Error obteniendo tests de la orden')
      // No es un error crítico, continuamos sin los tests
    }
    
    const tests = orderTests || []
    
    // Calcular resumen de inspección
    const testsAprobados = tests.filter((test: OrderTest) => test.aprobado).length
    const testsReprobados = tests.filter((test: OrderTest) => !test.aprobado).length
    const totalUnidadesConFalla = tests.reduce((sum: number, test: OrderTest) => 
      sum + (test.cantidad_unidades_con_falla || 0), 0
    )
    
    // Determinar status de inspección - usar el status de la orden si existe, sino calcular basado en tests
    const statusInspeccion = order.status || (testsReprobados > 0 ? 'Rechazado' : 'Aprobado')
    
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
    
    // Mapear campos de la base de datos a los nombres esperados por el frontend
    const ordenMapeada = {
      id: order.id,
      numeroOrden: order.numero_orden,
      cliente: order.cliente,
      producto: order.producto,
      codigoProducto: order.codigo_producto,
      pedido: order.pedido,
      lote: order.lote,
      fechaFabricacion: order.fecha_fabricacion,
      turno: order.turno,
      maquina: order.maquina,
      numeroOperario: order.numero_operario,
      inspectorCalidad: order.inspector_calidad,
      jefeTurno: order.jefe_de_turno,
      ordenCompra: order.orden_de_compra,
      unidadesPorEmbalaje: order.unidades_por_embalaje,
      cantidadEmbalajes: order.cantidad_embalajes,
      muestreoReal: order.muestreo_real,
      status: order.status,
      createdAt: order.created_at,
      liberador: order.creado_por,
      liberadorUser
    }

    // Mapear tests con nombres correctos
    const testsMapeados = tests.map((test: OrderTest) => ({
      id: test.id,
      aprobado: test.aprobado,
      cantidadUnidadesConFalla: test.cantidad_unidades_con_falla,
      tests: test.tests
    }))

    return {
      success: true,
      data: {
        orden: ordenMapeada,
        tests: testsMapeados,
        resumenInspeccion,
        message: `Orden ${statusInspeccion.toLowerCase()} - ${testsAprobados}/${tests.length} tests aprobados`
      }
    }
    
  } catch (error) {
    orderLogger.error({
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    }, 'Error en API orders/[id]')

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