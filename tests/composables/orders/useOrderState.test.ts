/**
 * Tests para useOrderState composable
 * 
 * Cubre las mejoras recientes en TypeScript type safety,
 * nuevos campos de Order interface, y fixes en orderStats
 */
import { describe, it, expect } from 'vitest'
import type { Order, OrderStatus } from '~/types/orders'
import { useOrderState } from '~/composables/orders/useOrderState'

// Mock orders data con los nuevos campos
const mockOrders: Order[] = [
  {
    id: '1',
    customer_id: 'customer-1',
    status: 'pending',
    total_amount: 1000,
    order_date: '2024-01-15T10:00:00Z',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
    order_number: 'ORD-2024-001',
    customer_name: 'Cliente Test 1',
    part_number: 'PART-001'
  },
  {
    id: '2', 
    customer_id: 'customer-2',
    status: 'in_progress',
    total_amount: 2000,
    order_date: '2024-01-16T10:00:00Z',
    created_at: '2024-01-16T10:00:00Z',
    updated_at: '2024-01-16T10:00:00Z',
    order_number: 'ORD-2024-002',
    customer_name: 'Cliente Test 2',
    part_number: 'PART-002'
  },
  {
    id: '3',
    customer_id: 'customer-3', 
    status: 'completed',
    total_amount: 1500,
    order_date: '2024-01-17T10:00:00Z',
    created_at: '2024-01-17T10:00:00Z',
    updated_at: '2024-01-17T10:00:00Z',
    order_number: 'ORD-2024-003',
    customer_name: 'Cliente Test 3',
    part_number: 'PART-003'
  }
]

describe('useOrderState', () => {
  describe('Inicialización', () => {
    it('debería inicializar con estado vacío', () => {
      const { orders, currentOrder, searchQuery, statusFilter, customerFilter } = useOrderState()
      
      expect(orders.value).toEqual([])
      expect(currentOrder.value).toBeNull()
      expect(searchQuery.value).toBe('')
      expect(statusFilter.value).toBe('all')
      expect(customerFilter.value).toBe('')
    })
  })

  describe('Gestión de orden actual', () => {
    it('debería establecer orden actual', () => {
      const { currentOrder, setCurrentOrder } = useOrderState()
      
      setCurrentOrder(mockOrders[0])
      
      expect(currentOrder.value).toEqual(mockOrders[0])
    })

    it('debería limpiar orden actual', () => {
      const { currentOrder, setCurrentOrder } = useOrderState()
      
      setCurrentOrder(mockOrders[0])
      expect(currentOrder.value).toEqual(mockOrders[0])
      
      setCurrentOrder(null)
      expect(currentOrder.value).toBeNull()
    })
  })

  describe('Gestión de órdenes', () => {
    it('debería añadir nueva orden', () => {
      const { orders, addOrder } = useOrderState()
      
      expect(orders.value).toHaveLength(0)
      
      addOrder(mockOrders[0])
      
      expect(orders.value).toHaveLength(1)
      expect(orders.value[0]).toEqual(mockOrders[0])
    })

    it('debería actualizar orden existente correctamente con tipos seguros', () => {
      const { orders, addOrder, updateOrder } = useOrderState()
      
      addOrder(mockOrders[0])
      
      const updates = {
        status: 'completed' as OrderStatus,
        total_amount: 5000,
        customer_name: 'Cliente Actualizado'
      }
      
      updateOrder('1', updates)
      
      const updatedOrder = orders.value.find(o => o.id === '1')
      expect(updatedOrder?.status).toBe('completed')
      expect(updatedOrder?.total_amount).toBe(5000)
      expect(updatedOrder?.customer_name).toBe('Cliente Actualizado')
      
      // Los demás campos deben mantenerse
      expect(updatedOrder?.order_number).toBe('ORD-2024-001')
      expect(updatedOrder?.part_number).toBe('PART-001')
    })

    it('debería actualizar orden actual si es la misma que se está actualizando', () => {
      const { currentOrder, addOrder, updateOrder, setCurrentOrder } = useOrderState()
      
      addOrder(mockOrders[0])
      setCurrentOrder(mockOrders[0])
      
      const updates = {
        status: 'completed' as OrderStatus,
        customer_name: 'Cliente Actual Actualizado'
      }
      
      updateOrder('1', updates)
      
      expect(currentOrder.value?.status).toBe('completed')
      expect(currentOrder.value?.customer_name).toBe('Cliente Actual Actualizado')
      expect(currentOrder.value?.order_number).toBe('ORD-2024-001')
    })

    it('debería eliminar orden correctamente', () => {
      const { orders, addOrder, removeOrder } = useOrderState()
      
      addOrder(mockOrders[0])
      addOrder(mockOrders[1])
      expect(orders.value).toHaveLength(2)
      
      removeOrder('1')
      
      expect(orders.value).toHaveLength(1)
      expect(orders.value.find(o => o.id === '1')).toBeUndefined()
    })

    it('debería limpiar orden actual al eliminarla', () => {
      const { currentOrder, addOrder, removeOrder, setCurrentOrder } = useOrderState()
      
      addOrder(mockOrders[0])
      setCurrentOrder(mockOrders[0])
      
      removeOrder('1')
      
      expect(currentOrder.value).toBeNull()
    })
  })

  describe('Sistema de filtros', () => {
    it('debería permitir cambiar filtros', () => {
      const { searchQuery, statusFilter, customerFilter } = useOrderState()
      
      searchQuery.value = 'test search'
      statusFilter.value = 'pending'
      customerFilter.value = 'Cliente Test'
      
      expect(searchQuery.value).toBe('test search')
      expect(statusFilter.value).toBe('pending')
      expect(customerFilter.value).toBe('Cliente Test')
    })

    it('debería limpiar filtros con clearState', () => {
      const { searchQuery, statusFilter, customerFilter, clearState } = useOrderState()
      
      searchQuery.value = 'test search'
      statusFilter.value = 'pending'
      customerFilter.value = 'Cliente Test'
      
      clearState()
      
      expect(searchQuery.value).toBe('')
      expect(statusFilter.value).toBe('all')
      expect(customerFilter.value).toBe('')
    })
  })

  describe('Órdenes filtradas', () => {
    it('debería filtrar por status', () => {
      const { addOrder, filteredOrders, statusFilter } = useOrderState()
      
      // Add orders first
      mockOrders.forEach(order => addOrder(order))
      
      statusFilter.value = 'pending'
      
      expect(filteredOrders.value).toHaveLength(1)
      expect(filteredOrders.value[0].status).toBe('pending')
    })

    it('debería filtrar por búsqueda en múltiples campos', () => {
      const { addOrder, filteredOrders, searchQuery } = useOrderState()
      
      // Add orders first
      mockOrders.forEach(order => addOrder(order))
      
      searchQuery.value = 'ORD-2024-002'
      
      expect(filteredOrders.value).toHaveLength(1)
      expect(filteredOrders.value[0].order_number).toBe('ORD-2024-002')
    })

    it('debería filtrar por parte del nombre del cliente', () => {
      const { addOrder, filteredOrders, searchQuery } = useOrderState()
      
      // Add orders first
      mockOrders.forEach(order => addOrder(order))
      
      searchQuery.value = 'Cliente Test'
      
      expect(filteredOrders.value).toHaveLength(3)
    })

    it('debería combinar múltiples filtros', () => {
      const { addOrder, filteredOrders, statusFilter, searchQuery } = useOrderState()
      
      // Add orders first
      mockOrders.forEach(order => addOrder(order))
      
      statusFilter.value = 'pending'
      searchQuery.value = 'PART-001'
      
      expect(filteredOrders.value).toHaveLength(1)
      expect(filteredOrders.value[0].status).toBe('pending')
      expect(filteredOrders.value[0].part_number).toBe('PART-001')
    })
  })

  describe('Estadísticas de órdenes (orderStats fix)', () => {
    it('debería calcular estadísticas correctamente sin errores de TypeScript', () => {
      const { addOrder, orderStats } = useOrderState()
      
      // Add orders first
      mockOrders.forEach(order => addOrder(order))
      
      const stats = orderStats.value
      
      expect(stats.total).toBe(3)
      expect(stats.pending).toBe(1)
      expect(stats.in_progress).toBe(1)
      expect(stats.completed).toBe(1)
      expect(stats.rejected).toBe(0)
    })

    it('debería manejar lista vacía de órdenes', () => {
      const { orderStats, clearState } = useOrderState()
      
      clearState()
      
      const stats = orderStats.value
      
      expect(stats.total).toBe(0)
      expect(stats.pending).toBe(0)
      expect(stats.in_progress).toBe(0)
      expect(stats.completed).toBe(0)
      expect(stats.rejected).toBe(0)
    })

    it('debería actualizar estadísticas cuando cambian las órdenes filtradas', () => {
      const { addOrder, orderStats, statusFilter } = useOrderState()
      
      // Add orders first
      mockOrders.forEach(order => addOrder(order))
      
      // Sin filtros - todas las órdenes
      let stats = orderStats.value
      expect(stats.total).toBe(3)
      expect(stats.completed).toBe(1)
      
      // Con filtro por status - solo muestra stats generales, no filtradas
      statusFilter.value = 'completed'
      stats = orderStats.value
      expect(stats.total).toBe(3) // orderStats incluye todas las órdenes, no las filtradas
      expect(stats.completed).toBe(1)
    })
  })

  describe('Integración con nuevos campos de Order', () => {
    it('debería manejar Order con todos los campos opcionales', () => {
      const { addOrder, orders } = useOrderState()
      
      const orderWithAllFields: Order = {
        id: 'test-complete',
        customer_id: 'customer-test',
        status: 'pending',
        total_amount: 1000,
        order_date: '2024-01-20T10:00:00Z',
        created_at: '2024-01-20T10:00:00Z',
        updated_at: '2024-01-20T10:00:00Z',
        order_number: 'ORD-COMPLETE',
        customer_name: 'Cliente Completo',
        part_number: 'PART-COMPLETE',
        customer: {
          id: 'customer-test',
          name: 'Cliente Completo',
          email: 'test@example.com',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        },
        order_items: []
      }
      
      addOrder(orderWithAllFields)
      
      const addedOrder = orders.value.find(o => o.id === 'test-complete')
      expect(addedOrder).toBeDefined()
      expect(addedOrder?.order_number).toBe('ORD-COMPLETE')
      expect(addedOrder?.customer_name).toBe('Cliente Completo')
      expect(addedOrder?.part_number).toBe('PART-COMPLETE')
      expect(addedOrder?.customer?.name).toBe('Cliente Completo')
    })

    it('debería manejar Order con campos opcionales indefinidos', () => {
      const { addOrder, orders } = useOrderState()
      
      const orderWithMinimalFields: Order = {
        id: 'test-minimal',
        customer_id: 'customer-minimal',
        status: 'pending',
        total_amount: 500,
        order_date: '2024-01-21T10:00:00Z',
        created_at: '2024-01-21T10:00:00Z',
        updated_at: '2024-01-21T10:00:00Z'
      }
      
      addOrder(orderWithMinimalFields)
      
      const addedOrder = orders.value.find(o => o.id === 'test-minimal')
      expect(addedOrder).toBeDefined()
      expect(addedOrder?.order_number).toBeUndefined()
      expect(addedOrder?.customer_name).toBeUndefined()
      expect(addedOrder?.part_number).toBeUndefined()
      expect(addedOrder?.customer).toBeUndefined()
      expect(addedOrder?.order_items).toBeUndefined()
    })
  })
})