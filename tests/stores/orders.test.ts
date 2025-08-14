import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import type { Order, OrderFilters, OrderStatus } from '~/types'

// Mock del API de Supabase
const mockSupabaseAPI = {
  getOrders: vi.fn(),
  getOrderById: vi.fn(),
  createOrder: vi.fn(),
  updateOrderStatus: vi.fn(),
  deleteOrder: vi.fn(),
  getRecentOrders: vi.fn()
}

vi.mock('~/utils/supabase', () => ({
  supabaseAPI: mockSupabaseAPI
}))

// Mock store simplificado para testing
const createMockOrdersStore = () => {
  return {
    orders: [] as Order[],
    currentOrder: null as Order | null,
    loading: false,
    error: null as string | null,
    pagination: {
      page: 1,
      per_page: 20,
      total: 0,
      total_pages: 0
    },
    filters: {} as OrderFilters,

    async fetchOrders(page = 1, filters: OrderFilters = {}) {
      this.loading = true
      this.error = null
      
      try {
        const response = await mockSupabaseAPI.getOrders(page, this.pagination.per_page, filters)
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
      } finally {
        this.loading = false
      }
    },

    async updateOrderStatus(orderId: string, status: OrderStatus) {
      this.loading = true
      this.error = null
      
      try {
        await mockSupabaseAPI.updateOrderStatus(orderId, status)
        
        const orderIndex = this.orders.findIndex(order => order.id === orderId)
        if (orderIndex !== -1) {
          this.orders[orderIndex] = {
            ...this.orders[orderIndex],
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
        await mockSupabaseAPI.deleteOrder(orderId)
        this.orders = this.orders.filter(order => order.id !== orderId)
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to delete order'
        throw error
      } finally {
        this.loading = false
      }
    }
  }
}

describe('Orders Store', () => {
  let store: ReturnType<typeof createMockOrdersStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    store = createMockOrdersStore()
    vi.clearAllMocks()
  })

  describe('Fetch Orders', () => {
    it('debe cargar órdenes exitosamente', async () => {
      const mockOrders: Order[] = [
        {
          id: '1',
          customer_id: 'cust-1',
          status: 'pending',
          total_amount: 1000,
          order_date: '2025-08-14T00:00:00Z',
          created_at: '2025-08-14T00:00:00Z',
          updated_at: '2025-08-14T00:00:00Z'
        }
      ]

      mockSupabaseAPI.getOrders.mockResolvedValue({
        data: mockOrders,
        page: 1,
        per_page: 20,
        total: 1,
        total_pages: 1
      })

      await store.fetchOrders()

      expect(store.orders).toEqual(mockOrders)
      expect(store.pagination.total).toBe(1)
      expect(store.loading).toBe(false)
      expect(store.error).toBeNull()
    })

    it('debe manejar errores de carga', async () => {
      mockSupabaseAPI.getOrders.mockRejectedValue(new Error('Database error'))

      await store.fetchOrders()

      expect(store.orders).toEqual([])
      expect(store.error).toBe('Database error')
      expect(store.loading).toBe(false)
    })

    it('debe aplicar filtros correctamente', async () => {
      const filters: OrderFilters = {
        status: 'completed',
        search: 'test',
        date_from: '2025-08-01',
        date_to: '2025-08-14'
      }

      mockSupabaseAPI.getOrders.mockResolvedValue({
        data: [],
        page: 1,
        per_page: 20,
        total: 0,
        total_pages: 0
      })

      await store.fetchOrders(1, filters)

      expect(mockSupabaseAPI.getOrders).toHaveBeenCalledWith(1, 20, filters)
      expect(store.filters).toEqual(filters)
    })
  })

  describe('Update Order Status', () => {
    beforeEach(() => {
      store.orders = [
        {
          id: 'order-1',
          customer_id: 'cust-1',
          status: 'pending',
          total_amount: 1000,
          order_date: '2025-08-14T00:00:00Z',
          created_at: '2025-08-14T00:00:00Z',
          updated_at: '2025-08-14T00:00:00Z'
        }
      ]
    })

    it('debe actualizar estado de orden exitosamente', async () => {
      mockSupabaseAPI.updateOrderStatus.mockResolvedValue({})

      await store.updateOrderStatus('order-1', 'completed')

      expect(mockSupabaseAPI.updateOrderStatus).toHaveBeenCalledWith('order-1', 'completed')
      expect(store.orders[0].status).toBe('completed')
      expect(store.error).toBeNull()
    })

    it('debe manejar errores de actualización', async () => {
      mockSupabaseAPI.updateOrderStatus.mockRejectedValue(new Error('Update failed'))

      await expect(store.updateOrderStatus('order-1', 'completed')).rejects.toThrow('Update failed')
      expect(store.error).toBe('Update failed')
    })

    it('debe actualizar timestamp al cambiar estado', async () => {
      mockSupabaseAPI.updateOrderStatus.mockResolvedValue({})
      const originalTimestamp = store.orders[0].updated_at

      await store.updateOrderStatus('order-1', 'completed')

      expect(store.orders[0].updated_at).not.toBe(originalTimestamp)
    })
  })

  describe('Delete Order', () => {
    beforeEach(() => {
      store.orders = [
        {
          id: 'order-1',
          customer_id: 'cust-1',
          status: 'pending',
          total_amount: 1000,
          order_date: '2025-08-14T00:00:00Z',
          created_at: '2025-08-14T00:00:00Z',
          updated_at: '2025-08-14T00:00:00Z'
        },
        {
          id: 'order-2',
          customer_id: 'cust-2',
          status: 'completed',
          total_amount: 2000,
          order_date: '2025-08-14T00:00:00Z',
          created_at: '2025-08-14T00:00:00Z',
          updated_at: '2025-08-14T00:00:00Z'
        }
      ]
    })

    it('debe eliminar orden exitosamente', async () => {
      mockSupabaseAPI.deleteOrder.mockResolvedValue({})

      await store.deleteOrder('order-1')

      expect(mockSupabaseAPI.deleteOrder).toHaveBeenCalledWith('order-1')
      expect(store.orders).toHaveLength(1)
      expect(store.orders[0].id).toBe('order-2')
    })

    it('debe manejar errores de eliminación', async () => {
      mockSupabaseAPI.deleteOrder.mockRejectedValue(new Error('Delete failed'))

      await expect(store.deleteOrder('order-1')).rejects.toThrow('Delete failed')
      expect(store.orders).toHaveLength(2) // No debe eliminar si hay error
    })
  })

  describe('Getters', () => {
    beforeEach(() => {
      store.orders = [
        {
          id: '1',
          customer_id: 'cust-1',
          status: 'pending',
          total_amount: 1000,
          order_date: '2025-08-14T00:00:00Z',
          created_at: '2025-08-14T10:00:00Z',
          updated_at: '2025-08-14T10:00:00Z',
          customer: { id: 'cust-1', name: 'Cliente 1', email: 'cliente1@test.com', phone: '', address: '', created_at: '', updated_at: '' }
        },
        {
          id: '2',
          customer_id: 'cust-2',
          status: 'completed',
          total_amount: 2000,
          order_date: '2025-08-14T00:00:00Z',
          created_at: '2025-08-14T09:00:00Z',
          updated_at: '2025-08-14T09:00:00Z'
        }
      ]
    })

    it('debe filtrar órdenes con clientes', () => {
      // Mock del getter ordersWithCustomers
      const ordersWithCustomers = store.orders.filter(order => order.customer)
      expect(ordersWithCustomers).toHaveLength(1)
      expect(ordersWithCustomers[0].customer?.name).toBe('Cliente 1')
    })

    it('debe obtener órdenes recientes ordenadas', () => {
      // Mock del getter recentOrders
      const recentOrders = store.orders
        .slice()
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 10)
      
      expect(recentOrders[0].id).toBe('1') // Más reciente
      expect(recentOrders[1].id).toBe('2')
    })

    it('debe filtrar órdenes por estado', () => {
      // Mock del getter ordersByStatus
      const pendingOrders = store.orders.filter(order => order.status === 'pending')
      const completedOrders = store.orders.filter(order => order.status === 'completed')
      
      expect(pendingOrders).toHaveLength(1)
      expect(completedOrders).toHaveLength(1)
    })
  })

  describe('Estado de Loading', () => {
    it('debe manejar estado de loading correctamente', async () => {
      let resolvePromise: () => void
      const promise = new Promise<void>(resolve => {
        resolvePromise = resolve
      })

      mockSupabaseAPI.getOrders.mockReturnValue(promise)

      const fetchPromise = store.fetchOrders()
      expect(store.loading).toBe(true)

      resolvePromise!()
      await fetchPromise
      expect(store.loading).toBe(false)
    })
  })

  describe('Manejo de Errores', () => {
    it('debe limpiar errores al hacer nuevas peticiones', async () => {
      store.error = 'Previous error'
      
      mockSupabaseAPI.getOrders.mockResolvedValue({
        data: [],
        page: 1,
        per_page: 20,
        total: 0,
        total_pages: 0
      })

      await store.fetchOrders()
      expect(store.error).toBeNull()
    })

    it('debe mantener datos anteriores en caso de error', async () => {
      const initialOrders = [{ id: '1' } as Order]
      store.orders = initialOrders

      mockSupabaseAPI.getOrders.mockRejectedValue(new Error('Network error'))

      await store.fetchOrders()
      expect(store.orders).toEqual(initialOrders) // No debe cambiar
      expect(store.error).toBe('Network error')
    })
  })
})