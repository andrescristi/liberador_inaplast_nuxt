/**
 * API endpoint para obtener orders con paginación y filtros
 */
import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
  try {
    // Obtener parámetros de consulta
    const query = getQuery(event)
    const page = parseInt(query.page as string) || 1
    const limit = parseInt(query.limit as string) || 20
    const status = query.status as string || null
    const search = query.search as string || null
    
    // Obtener cliente de Supabase con permisos de servicio
    const supabase = serverSupabaseServiceRole(event)
    
    // Construir consulta base
    let queryBuilder = supabase
      .from('orders')
      .select(`
        *
      `, { count: 'exact' })
    
    // Aplicar filtros
    if (status) {
      queryBuilder = queryBuilder.eq('status', status)
    }
    
    if (search) {
      queryBuilder = queryBuilder.or(
        `cliente.ilike.%${search}%,producto.ilike.%${search}%,pedido.ilike.%${search}%,numero_orden.eq.${parseInt(search) || 0}`
      )
    }
    
    // Aplicar paginación
    const from = (page - 1) * limit
    const to = from + limit - 1
    
    queryBuilder = queryBuilder
      .range(from, to)
      .order('created_at', { ascending: false })
    
    // Ejecutar consulta
    const { data: orders, error, count } = await queryBuilder

    if (error) {
      // eslint-disable-next-line no-console
      console.error('Error obteniendo orders:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Error al obtener las órdenes: ' + error.message
      })
    }

    // Enriquecer con información de los liberadores
    let enrichedOrders = orders || []
    if (orders && orders.length > 0) {
      // Obtener IDs únicos de usuarios
      const userIds = [...new Set(orders.map(order => order.id_usuario).filter(Boolean))]

      if (userIds.length > 0) {
        // Obtener perfiles de usuarios
        const { data: profiles } = await supabase
          .from('profiles')
          .select('user_id, first_name, last_name, user_role')
          .in('user_id', userIds)

        // Mapear perfiles a órdenes
        enrichedOrders = orders.map(order => ({
          ...order,
          liberador_profile: profiles?.find(profile => profile.user_id === order.id_usuario) || null
        }))
      }
    }
    
    // Calcular información de paginación
    const totalPages = Math.ceil((count || 0) / limit)
    const hasNextPage = page < totalPages
    const hasPreviousPage = page > 1
    
    return {
      success: true,
      data: enrichedOrders,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages,
        hasNextPage,
        hasPreviousPage
      }
    }
    
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error en API orders/list:', error)
    
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