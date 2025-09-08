/**
 * Composable para operaciones API de órdenes
 * Centraliza todas las llamadas HTTP relacionadas con órdenes
 */

import type { Order, CreateOrderForm, UpdateOrderForm, OrderFilters, PaginatedResponse } from '~/types/orders'

export const useOrderAPI = () => {
  const toast = useToast()
  const { addOrder, updateOrder, removeOrder } = useOrderState()
  
  /**
   * Obtiene todas las órdenes con paginación y filtros
   */
  const getOrders = async (
    page = 1,
    limit = 20,
    filters: OrderFilters = {}
  ): Promise<PaginatedResponse<Order>> => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(filters.status && { status: filters.status }),
        ...(filters.cliente && { cliente: filters.cliente }),
        ...(filters.producto && { producto: filters.producto }),
        ...(filters.turno && { turno: filters.turno }),
        ...(filters.search && { search: filters.search }),
        ...(filters.fecha_from && { fecha_from: filters.fecha_from }),
        ...(filters.fecha_to && { fecha_to: filters.fecha_to })
      })
      
      const response = await $fetch<PaginatedResponse<Order>>(`/api/orders?${params}`)
      return response
      
    } catch (error) {
      toast.error('Error', 'No se pudieron cargar las órdenes')
      throw error
    }
  }
  
  /**
   * Obtiene una orden específica por ID
   */
  const getOrder = async (orderId: string): Promise<Order | null> => {
    try {
      const response = await $fetch<Order>(`/api/orders/${orderId}`)
      return response
      
    } catch (error) {
      toast.error('Error', 'No se pudo cargar la orden')
      throw error
    }
  }
  
  /**
   * Crea una nueva orden
   */
  const createOrder = async (orderData: CreateOrderForm): Promise<Order> => {
    try {
      const response = await $fetch<Order>('/api/orders', {
        method: 'POST',
        body: orderData
      })
      
      // Actualizar estado local con la orden creada
      //addOrder(response)
      toast.success('Éxito', 'Orden creada correctamente')
      return response
      
    } catch (error) {
      let errorMessage = 'No se pudo crear la orden'
      if (error && typeof error === 'object' && 'data' in error && 
          error.data && typeof error.data === 'object' && 'message' in error.data) {
        errorMessage = String(error.data.message)
      }
      toast.error('Error', errorMessage)
      throw error
    }
  }
  
  /**
   * Actualiza una orden existente
   */
  const updateOrderData = async (orderId: string, updates: UpdateOrderForm): Promise<Order> => {
    try {
      const response = await $fetch<Order>(`/api/orders/${orderId}`, {
        method: 'PUT',
        body: updates
      })
      
      // Actualizar estado local
      updateOrder(orderId, response)
      toast.success('Éxito', 'Orden actualizada correctamente')
      
      return response
      
    } catch (error) {
      toast.error('Error', 'No se pudo actualizar la orden')
      throw error
    }
  }
  
  /**
   * Elimina una orden
   */
  const deleteOrder = async (orderId: string): Promise<void> => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await ($fetch as any)(`/api/orders/${orderId}`, {
        method: 'DELETE'
      })
      
      // Actualizar estado local
      removeOrder(orderId)
      toast.success('Éxito', 'Orden eliminada correctamente')
      
    } catch (error) {
      toast.error('Error', 'No se pudo eliminar la orden')
      throw error
    }
  }
  
  /**
   * Cambia el estado de una orden
   */
  const changeOrderStatus = async (orderId: string, status: Order['status']): Promise<Order> => {
    try {
      const response = await $fetch<Order>(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        body: { status }
      })
      
      // Actualizar estado local
      updateOrder(orderId, { status })
      toast.success('Éxito', `Estado cambiado a: ${status}`)
      
      return response
      
    } catch (error) {
      toast.error('Error', 'No se pudo cambiar el estado de la orden')
      throw error
    }
  }
  
  /**
   * Duplica una orden existente
   */
  const duplicateOrder = async (orderId: string): Promise<Order> => {
    try {
      const response = await $fetch<Order>(`/api/orders/${orderId}/duplicate`, {
        method: 'POST'
      })
      
      // Actualizar estado local
      addOrder(response)
      toast.success('Éxito', 'Orden duplicada correctamente')
      
      return response
      
    } catch (error) {
      toast.error('Error', 'No se pudo duplicar la orden')
      throw error
    }
  }
  
  return {
    // Operaciones CRUD
    getOrders,
    getOrder,
    createOrder,
    updateOrder: updateOrderData,
    deleteOrder,
    
    // Operaciones específicas
    changeOrderStatus,
    duplicateOrder
  }
}