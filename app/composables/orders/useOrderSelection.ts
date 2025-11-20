import { ref, computed } from 'vue'

/**
 * Composable para manejar la selección múltiple de órdenes
 */
export function useOrderSelection() {
  // Estado de selección usando Set para mejor performance
  const selectedOrders = ref<Set<string>>(new Set())

  // Verificar si una orden está seleccionada
  const isOrderSelected = (orderId: string): boolean => {
    return selectedOrders.value.has(orderId)
  }

  // Alternar selección de una orden
  const toggleOrderSelection = (orderId: string): void => {
    const newSet = new Set(selectedOrders.value)

    if (newSet.has(orderId)) {
      newSet.delete(orderId)
    } else {
      newSet.add(orderId)
    }

    selectedOrders.value = newSet
  }

  // Seleccionar todas las órdenes
  const selectAllOrders = (orderIds: string[]): void => {
    selectedOrders.value = new Set(orderIds)
  }

  // Deseleccionar todas las órdenes
  const clearSelection = (): void => {
    selectedOrders.value = new Set()
  }

  // Número de órdenes seleccionadas
  const selectedCount = computed(() => selectedOrders.value.size)

  // Array de IDs seleccionados (útil para enviar al backend)
  const selectedOrderIds = computed(() => Array.from(selectedOrders.value))

  // Verificar si hay órdenes seleccionadas
  const hasSelection = computed(() => selectedOrders.value.size > 0)

  // Verificar si todas las órdenes están seleccionadas
  const areAllSelected = (orderIds: string[]): boolean => {
    if (orderIds.length === 0) return false
    return orderIds.every(id => selectedOrders.value.has(id))
  }

  // Alternar selección de todas las órdenes
  const toggleSelectAll = (orderIds: string[]): void => {
    if (areAllSelected(orderIds)) {
      clearSelection()
    } else {
      selectAllOrders(orderIds)
    }
  }

  return {
    selectedOrders,
    isOrderSelected,
    toggleOrderSelection,
    selectAllOrders,
    clearSelection,
    selectedCount,
    selectedOrderIds,
    hasSelection,
    areAllSelected,
    toggleSelectAll
  }
}
