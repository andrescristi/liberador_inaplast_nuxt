import { defineStore } from 'pinia'
import type { Order, OrderFilters, OrderStatus, CreateOrderForm } from '~/types/orders'
import { supabaseAPI } from '~/utils/supabase'

interface OrdersState {
  orders: Order[]
  currentOrder: Order | null
  loading: boolean
  error: string | null
  pagination: {
    page: number
    per_page: number
    total: number
    total_pages: number
  }
  filters: OrderFilters
}

export const useOrdersStore = defineStore('orders', {
  state: (): OrdersState => ({
    orders: [],
    currentOrder: null,
    loading: false,
    error: null,
    pagination: {
      page: 1,
      per_page: 20,
      total: 0,
      total_pages: 0
    },
    filters: {}
  }),

  getters: {
    ordersWithCustomers(): Order[] {
      return this.orders.filter(order => order.cliente)
    },
    
    recentOrders(): Order[] {
      return this.orders
        .slice()
        .sort((a, b) => new Date(b.created_at || new Date()).getTime() - new Date(a.created_at || new Date()).getTime())
        .slice(0, 10)
    },

    ordersByStatus: (state) => (status: OrderStatus): Order[] => {
      return state.orders.filter(order => order.status === status)
    }
  },

  actions: {
    async fetchOrders(page = 1, filters: OrderFilters = {}) {
      this.loading = true
      this.error = null
      
      try {
        const response = await supabaseAPI.getOrders(page, this.pagination.per_page, filters)
        
        this.orders = response.data
        this.pagination = {
          page: response.pagination.page,
          per_page: response.pagination.limit,
          total: response.pagination.total,
          total_pages: response.pagination.totalPages
        }
        this.filters = filters
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to fetch orders'
      } finally {
        this.loading = false
      }
    },

    async fetchOrderById(id: string) {
      this.loading = true
      this.error = null
      
      try {
        const order = await supabaseAPI.getOrderById(id)
        this.currentOrder = order
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to fetch order'
      } finally {
        this.loading = false
      }
    },

    async createOrder(orderData: CreateOrderForm) {
      this.loading = true
      this.error = null
      
      try {
        const response = await $fetch<{success: boolean, data: Order}>('/api/orders', {
          method: 'POST',
          body: orderData
        })
        
        if (response.success && response.data) {
          this.orders.unshift(response.data)
          return response.data
        } else {
          throw new Error('Error en la respuesta del servidor')
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to create order'
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateOrderStatus(orderId: string, status: OrderStatus) {
      this.loading = true
      this.error = null
      
      try {
        await supabaseAPI.updateOrderStatus(orderId, status)
        
        const orderIndex = this.orders.findIndex(order => order.id === orderId)
        if (orderIndex !== -1) {
          this.orders[orderIndex] = {
            ...this.orders[orderIndex],
            status,
            updated_at: new Date().toISOString()
          } as Order
        }
        
        if (this.currentOrder && this.currentOrder.id === orderId) {
          this.currentOrder = {
            ...this.currentOrder,
            status,
            updated_at: new Date().toISOString()
          }
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to update order status'
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteOrder(orderId: string) {
      this.loading = true
      this.error = null
      
      try {
        await supabaseAPI.deleteOrder(orderId)
        
        this.orders = this.orders.filter(order => order.id !== orderId)
        if (this.currentOrder && this.currentOrder.id === orderId) {
          this.currentOrder = null
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to delete order'
        throw error
      } finally {
        this.loading = false
      }
    },

    // Utility methods for recent orders
    async fetchRecentOrders(limit = 10) {
      try {
        const orders = await supabaseAPI.getRecentOrders(limit)
        return orders
      } catch (error) {
        if (import.meta.server) {
          const { $logger } = useNuxtApp()
          if ($logger && typeof ($logger as { error: (msg: object, context: string) => void }).error === 'function') {
            ($logger as { error: (msg: object, context: string) => void }).error({
              error: error instanceof Error ? error.message : String(error),
              stack: error instanceof Error ? error.stack : undefined,
              context: 'useOrdersStore.fetchRecentOrders'
            }, 'Error fetching recent orders')
          }
        }
        return []
      }
    },

    clearError() {
      this.error = null
    }
  }
})