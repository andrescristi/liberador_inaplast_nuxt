import { createClient } from '@supabase/supabase-js'
import type { H3Event } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    const user = await requireAuthenticatedUser(event)
    const userRole = user.user_metadata?.user_role || 'User'
    
    // Inicializar cliente Supabase con service role para queries administrativas
    const supabase = createClient(
      process.env.NUXT_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NUXT_SUPABASE_ANON_KEY!
    )

    let metrics = {
      pending: 0,
      completed: 0,
      rejected: 0,
      customers: 0
    }

    if (userRole === 'Inspector') {
      // Métricas específicas del inspector
      const inspectorId = user.id

      // Obtener órdenes del inspector
      const { data: orders } = await supabase
        .from('orders')
        .select('status')
        .eq('inspector_id', inspectorId)

      if (orders) {
        metrics.pending = orders.filter(o => o.status === 'pending').length
        metrics.completed = orders.filter(o => o.status === 'completed').length
        metrics.rejected = orders.filter(o => o.status === 'rejected').length
      }

      // Obtener clientes únicos asignados al inspector
      const { data: customerOrders } = await supabase
        .from('orders')
        .select('customer_id')
        .eq('inspector_id', inspectorId)
        .not('customer_id', 'is', null)

      if (customerOrders) {
        const uniqueCustomers = new Set(customerOrders.map(o => o.customer_id))
        metrics.customers = uniqueCustomers.size
      }

    } else {
      // Métricas globales para Admin y Supervisor
      
      // Obtener todas las órdenes
      const { data: allOrders } = await supabase
        .from('orders')
        .select('status, customer_id')

      if (allOrders) {
        metrics.pending = allOrders.filter(o => o.status === 'pending').length
        metrics.completed = allOrders.filter(o => o.status === 'completed').length
        metrics.rejected = allOrders.filter(o => o.status === 'rejected').length
        
        // Contar clientes únicos
        const uniqueCustomers = new Set(
          allOrders
            .filter(o => o.customer_id)
            .map(o => o.customer_id)
        )
        metrics.customers = uniqueCustomers.size
      }

      // Si no hay datos en la tabla orders, usar métricas de ejemplo para desarrollo
      if (allOrders?.length === 0) {
        metrics = {
          pending: 25,
          completed: 120,
          rejected: 8,
          customers: 45
        }
      }
    }

    return {
      success: true,
      data: metrics,
      user_role: userRole,
      timestamp: new Date().toISOString()
    }

  } catch (error) {
    console.error('Error fetching dashboard metrics:', error)
    
    // Fallback con métricas de ejemplo en caso de error
    return {
      success: false,
      data: {
        pending: 0,
        completed: 0,
        rejected: 0,
        customers: 0
      },
      error: 'Error al obtener métricas del dashboard',
      timestamp: new Date().toISOString()
    }
  }
})

/**
 * Helper function para requerir usuario autenticado
 */
async function requireAuthenticatedUser(event: H3Event) {
  const headers = getHeaders(event)
  const authHeader = headers.authorization
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Token de autorización requerido'
    })
  }

  const token = authHeader.substring(7)
  const supabase = createClient(
    process.env.NUXT_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NUXT_SUPABASE_ANON_KEY!
  )

  const { data: { user }, error } = await supabase.auth.getUser(token)
  
  if (error || !user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Token inválido o expirado'
    })
  }

  return user
}