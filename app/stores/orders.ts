import { defineStore } from 'pinia'
import type { Order, OrderFilters, OrderStatus, CreateOrderForm } from '~/types'
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
      return this.orders.filter(order => order.customer)
    },
    
    recentOrders(): Order[] {
      return this.orders
        .slice()
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
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
          page: response.page,
          per_page: response.per_page,
          total: response.total,
          total_pages: response.total_pages
        }
        this.filters = filters
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to fetch orders'
        console.error('Error fetching orders:', error)
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
        console.error('Error fetching order:', error)
      } finally {
        this.loading = false
      }
    },

    async createOrder(orderData: CreateOrderForm) {
      this.loading = true
      this.error = null
      
      try {
        const newOrder = await supabaseAPI.createOrder(orderData)
        this.orders.unshift(newOrder)
        return newOrder
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to create order'
        console.error('Error creating order:', error)
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
          }
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
        console.error('Error updating order status:', error)
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
        console.error('Error deleting order:', error)
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
        console.error('Error fetching recent orders:', error)
        return []
      }
    },

    clearError() {
      this.error = null
    }
  }
})