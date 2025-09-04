/**
 * Composable para gestión del estado de órdenes
 * Centraliza el estado reactivo de órdenes en la aplicación
 */

import type { Order, OrderStatus } from '~/types/orders'

export const useOrderState = () => {
  // Estado global de órdenes
  const orders = ref<Order[]>([])
  const currentOrder = ref<Order | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  
  // Filtros y búsqueda
  const searchQuery = ref('')
  const statusFilter = ref<OrderStatus | 'all'>('all')
  const customerFilter = ref('')
  
  /**
   * Establece la orden actual
   */
  const setCurrentOrder = (order: Order | null) => {
    currentOrder.value = order
  }
  
  /**
   * Añade una nueva orden al estado
   */
  const addOrder = (order: Order) => {
    orders.value.unshift(order)
  }
  
  /**
   * Actualiza una orden existente
   */
  const updateOrder = (orderId: string, updates: Partial<Order>) => {
    const index = orders.value.findIndex(o => o.id === orderId)
    if (index !== -1) {
      orders.value[index] = { ...orders.value[index], ...updates } as Order
    }
    
    // Actualizar orden actual si es la misma
    if (currentOrder.value?.id === orderId) {
      currentOrder.value = { ...currentOrder.value, ...updates } as Order
    }
  }
  
  /**
   * Elimina una orden del estado
   */
  const removeOrder = (orderId: string) => {
    orders.value = orders.value.filter(o => o.id !== orderId)
    
    // Limpiar orden actual si es la misma
    if (currentOrder.value?.id === orderId) {
      currentOrder.value = null
    }
  }
  
  /**
   * Limpia todos los estados
   */
  const clearState = () => {
    orders.value = []
    currentOrder.value = null
    searchQuery.value = ''
    statusFilter.value = 'all'
    customerFilter.value = ''
    error.value = null
  }
  
  /**
   * Computed para órdenes filtradas
   */
  const filteredOrders = computed(() => {
    let filtered = orders.value
    
    // Filtro por búsqueda
    if (searchQuery.value.trim()) {
      const query = searchQuery.value.toLowerCase().trim()
      filtered = filtered.filter(order => 
        order.pedido?.toLowerCase().includes(query) ||
        order.cliente?.toLowerCase().includes(query) ||
        order.codigo_producto?.toLowerCase().includes(query) ||
        order.producto?.toLowerCase().includes(query)
      )
    }
    
    // Filtro por estado
    if (statusFilter.value !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter.value)
    }
    
    // Filtro por cliente
    if (customerFilter.value.trim()) {
      const customer = customerFilter.value.toLowerCase().trim()
      filtered = filtered.filter(order => 
        order.cliente?.toLowerCase().includes(customer)
      )
    }
    
    return filtered
  })
  
  /**
   * Computed para estadísticas de órdenes
   */
  const orderStats = computed(() => {
    const stats = {
      total: orders.value.length,
      pending: 0,
      processing: 0,
      completed: 0,
      cancelled: 0
    }
    
    orders.value.forEach(order => {
      if (order.status) {
        const statusKey = order.status as keyof typeof stats
        if (statusKey in stats) {
          stats[statusKey]++
        }
      }
    })
    
    return stats
  })
  
  return {
    // Estados
    orders: readonly(orders),
    currentOrder: readonly(currentOrder),
    isLoading: readonly(isLoading),
    error: readonly(error),
    
    // Filtros
    searchQuery,
    statusFilter,
    customerFilter,
    
    // Computed
    filteredOrders,
    orderStats,
    
    // Métodos
    setCurrentOrder,
    addOrder,
    updateOrder,
    removeOrder,
    clearState
  }
}