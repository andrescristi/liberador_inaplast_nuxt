// Supabase API utilities for Order Management System
// Created: 2025-08-01
// Description: Utility functions for database operations

import type { 
  Order, 
  CreateOrderForm,
  OrderFilters,
  PaginatedResponse,
  OrderStatus
} from '~/types/orders'
import type { Database } from '~/types/database.types'

interface DashboardMetrics {
  pending_orders: number
  completed_orders: number
  cancelled_orders: number
  current_month_revenue: number
  current_week_revenue: number
}

// Database query utilities
export class SupabaseAPI {
  private get client() {
    return useSupabaseClient<Database>()
  }

  // Dashboard Metrics
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    // TODO: Implement get_dashboard_metrics RPC function
    // const { data, error } = await this.getClient()
    //   .rpc('get_dashboard_metrics')

    // if (error) {
    //   // Handle dashboard metrics error
    //   throw new Error('Failed to fetch dashboard metrics')
    // }

    // return data || {
    return {
      pending_orders: 0,
      completed_orders: 0,
      cancelled_orders: 0,
      current_month_revenue: 0,
      current_week_revenue: 0
    }
  }

  // Orders
  async getOrders(
    page = 1, 
    perPage = 20, 
    filters: OrderFilters = {}
  ): Promise<PaginatedResponse<Order>> {
    try {
      // Construir parámetros de consulta
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: perPage.toString()
      })
      
      if (filters.status) {
        queryParams.append('status', filters.status)
      }
      
      if (filters.search) {
        queryParams.append('search', filters.search)
      }
      
      if (filters.dateFrom) {
        queryParams.append('dateFrom', filters.dateFrom)
      }
      
      if (filters.dateTo) {
        queryParams.append('dateTo', filters.dateTo)
      }

      // Llamar al endpoint de la API
      const response = await $fetch<{
        success: boolean
        data: Order[]
        pagination: {
          page: number
          limit: number
          total: number
          totalPages: number
          hasNextPage: boolean
          hasPreviousPage: boolean
        }
      }>(`/api/orders?${queryParams.toString()}`)

      if (!response.success) {
        throw new Error('Failed to fetch orders from API')
      }

      return response
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching orders:', error)
      throw new Error('Failed to fetch orders')
    }
  }

  async getOrderById(_id: string): Promise<Order | null> {
    // TODO: Implement get_order_details RPC function
    // const { data, error } = await this.client
    //   .rpc('get_order_details', { order_id_param: id })

    // if (error) {
    //   // Handle order fetch error
    //   throw new Error('Failed to fetch order details')
    // }

    // return (data as unknown) as Order || null
    return null
  }

  async createOrder(orderData: CreateOrderForm): Promise<Order> {
    // Start transaction
    const { data: order, error: orderError } = await this.client
      .from('orders')
      .insert({
        cliente: orderData.cliente,
        producto: orderData.producto,
        pedido: orderData.pedido,
        fecha_fabricacion: orderData.fecha_fabricacion,
        codigo_producto: orderData.codigo_producto,
        turno: orderData.turno,
        unidades_por_embalaje: orderData.unidades_por_embalaje,
        numero_operario: orderData.numero_operario,
        maquina: orderData.maquina,
        inspector_calidad: orderData.inspector_calidad,
        lote: orderData.lote,
        jefe_de_turno: orderData.jefe_de_turno,
        orden_de_compra: orderData.orden_de_compra,
        cantidad_embalajes: 1
      } as Database['public']['Tables']['orders']['Insert'])
      .select()
      .single()

    if (orderError) {
      // Handle order creation error
      throw new Error('Failed to create order')
    }

    // Insert order items
    // TODO: Implement order_items table
    // const orderItems = orderData.items.map(item => ({
    //   order_id: order.id,
    //   product_id: item.product_id,
    //   quantity: item.quantity,
    //   unit_price: item.unit_price,
    //   subtotal: item.quantity * item.unit_price
    // }))

    // const { error: itemsError } = await this.client
    //   .from('order_items')
    //   .insert(orderItems)

    // if (itemsError) {
    //   // Handle order items creation error
    //   // Rollback order creation
    //   await this.client.from('orders').delete().eq('id', order.id)
    //   throw new Error('Failed to create order items')
    // }

    if (!order?.id) {
      throw new Error('Order creation failed')
    }

    const validOrder = order! as Database['public']['Tables']['orders']['Row']

    return {
      id: validOrder.id!,
      numero_orden: validOrder.numero_orden || 0,
      cliente: orderData.cliente,
      producto: orderData.producto,
      pedido: orderData.pedido,
      fecha_fabricacion: orderData.fecha_fabricacion,
      codigo_producto: orderData.codigo_producto,
      turno: orderData.turno,
      unidades_por_embalaje: orderData.unidades_por_embalaje,
      cantidad_embalajes: validOrder.cantidad_embalajes || 1,
      muestreo_real: validOrder.muestreo_real || undefined,
      muestreo_recomendado: validOrder.muestreo_recomendado || undefined,
      numero_operario: orderData.numero_operario,
      maquina: orderData.maquina,
      inspector_calidad: orderData.inspector_calidad,
      lote: orderData.lote,
      jefe_de_turno: orderData.jefe_de_turno,
      orden_de_compra: orderData.orden_de_compra,
      status: 'Rechazado' as OrderStatus,
      created_at: validOrder.created_at || new Date().toISOString(),
      updated_at: validOrder.updated_at || new Date().toISOString()
    }
  }

  async updateOrderStatus(_orderId: string, _status: OrderStatus): Promise<void> {
    // Note: orders table doesn't have a status field
    // Status is managed through orders_tests table for each test
    // This method needs to be implemented based on business logic
    throw new Error('Order status update not implemented - status managed through orders_tests table')
  }

  async deleteOrder(orderId: string): Promise<void> {
    const { error } = await this.client
      .from('orders')
      .delete()
      .eq('id', orderId)

    if (error) {
      // Handle order deletion error
      throw new Error('Failed to delete order')
    }
  }


  // Utility methods
  async getRecentOrders(_limit = 10): Promise<Order[]> {
    // TODO: Implement customers, products, and order_items tables
    // const { data, error } = await this.client
    //   .from('orders')
    //   .select(`
    //     *,
    //     customer:customers(*),
    //     order_items(
    //       *,
    //       product:products(*)
    //     )
    //   `)
    //   .order('created_at', { ascending: false })
    //   .limit(limit)

    // if (error) {
    //   // Handle recent orders fetch error
    //   throw new Error('Failed to fetch recent orders')
    // }

    // return data || []
    return []
  }

}

// Export singleton instance
export const supabaseAPI = new SupabaseAPI()