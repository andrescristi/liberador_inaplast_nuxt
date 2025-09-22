import { serverSupabaseServiceRole, serverSupabaseUser } from '#supabase/server'

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

    // Usar serverSupabaseServiceRole para bypass de RLS
    const supabase = serverSupabaseServiceRole(event)

    // Obtener el rol del usuario desde la tabla profiles
    const { data: profile } = await supabase
      .from('profiles')
      .select('user_role')
      .eq('user_id', user.id)
      .single()

    const userRole = profile?.user_role || 'User'

    const metrics = {
      pending: 0,
      completed: 0,
      rejected: 0,
      customers: 0
    }

    if (userRole === 'Inspector') {
      // Métricas específicas del inspector - solo órdenes que él creó
      // Filtrar por creado_por para que vea solo sus inspecciones
      const { data: orders } = await supabase
        .from('orders')
        .select('status')
        .eq('creado_por', user.id)

      if (orders) {
        // En este contexto, pending = 0 (no hay status pendiente en la BD)
        // completed = órdenes aprobadas
        // rejected = órdenes rechazadas
        metrics.pending = 0 // No hay status pendiente en la BD actual
        metrics.completed = orders.filter(o => o.status === 'Aprobado').length
        metrics.rejected = orders.filter(o => o.status === 'Rechazado').length
      }

      // Obtener clientes únicos de las órdenes creadas por el inspector
      const { data: customerOrders } = await supabase
        .from('orders')
        .select('cliente')
        .eq('creado_por', user.id)
        .not('cliente', 'is', null)

      if (customerOrders) {
        const uniqueCustomers = new Set(customerOrders.map(o => o.cliente))
        metrics.customers = uniqueCustomers.size
      }

    } else {
      // Métricas globales para Admin y Supervisor
      
      // Obtener todas las órdenes
      const { data: allOrders, error: ordersError } = await supabase
        .from('orders')
        .select('status, cliente')

      if (ordersError) {
        throw new Error(`Error de base de datos: ${ordersError.message}`)
      }

      if (allOrders) {
        // En este contexto, pending = 0 (no hay status pendiente en la BD)
        // completed = órdenes aprobadas
        // rejected = órdenes rechazadas
        metrics.pending = 0 // No hay status pendiente en la BD actual
        metrics.completed = allOrders.filter(o => o.status === 'Aprobado').length
        metrics.rejected = allOrders.filter(o => o.status === 'Rechazado').length
        
        // Contar clientes únicos
        const uniqueCustomers = new Set(
          allOrders
            .filter(o => o.cliente)
            .map(o => o.cliente)
        )
        metrics.customers = uniqueCustomers.size
      }

      // Los datos ahora deberían venir correctamente de Supabase
    }

    
    return {
      success: true,
      data: metrics,
      user_role: userRole,
      timestamp: new Date().toISOString()
    }

  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching dashboard metrics:', error)
    
    return {
      success: false,
      data: {
        pending: 0,
        completed: 0,
        rejected: 0,
        customers: 0
      },
      error: `Error al obtener métricas del dashboard: ${error instanceof Error ? error.message : 'Error desconocido'}`,
      timestamp: new Date().toISOString()
    }
  }
})