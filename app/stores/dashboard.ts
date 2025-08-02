import { defineStore } from 'pinia'
import type { DashboardMetrics, Order } from '~/types'
import { supabaseAPI } from '~/utils/supabase'

interface DashboardState {
  metrics: DashboardMetrics | null
  recentOrders: Order[]
  loading: boolean
  error: string | null
}

export const useDashboardStore = defineStore('dashboard', {
  state: (): DashboardState => ({
    metrics: null,
    recentOrders: [],
    loading: false,
    error: null
  }),

  getters: {
    totalOrders(): number {
      if (!this.metrics) return 0
      return (this.metrics as any).total_orders || (this.metrics.pending_orders + this.metrics.completed_orders + this.metrics.cancelled_orders)
    },

    completionRate(): number {
      if (!this.metrics) return 0
      return (this.metrics as any).completion_rate || Math.round((this.metrics.completed_orders / this.totalOrders) * 100)
    }
  },

  actions: {
    async fetchDashboardData() {
      this.loading = true
      this.error = null
      
      try {
        // Fetch dashboard metrics and recent orders in parallel
        const [metrics, recentOrders] = await Promise.all([
          supabaseAPI.getDashboardMetrics(),
          supabaseAPI.getRecentOrders(10)
        ])
        
        this.metrics = metrics
        this.recentOrders = recentOrders
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to fetch dashboard data'
        console.error('Error fetching dashboard data:', error)
      } finally {
        this.loading = false
      }
    },


    clearError() {
      this.error = null
    }
  }
})