/**
 * Tipos relacionados con órdenes, clientes y productos
 * 
 * @author Inaplast Development Team
 * @since v2.6.0
 */

// ============================================================================
// ENTIDADES PRINCIPALES
// ============================================================================

/**
 * Estado de una orden
 */
export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled'

/**
 * Cliente del sistema
 */
export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  address: string
  created_at: string
  updated_at: string
}

/**
 * Producto del sistema
 */
export interface Product {
  id: string
  name: string
  description: string
  price: number
  stock_quantity: number
  created_at: string
  updated_at: string
}

/**
 * Orden principal - actualizada para coincidir con la API
 */
export interface Order {
  id: string
  lote?: string
  cliente: string
  producto: string
  pedido: string
  fecha_fabricacion: string
  codigo_producto: string
  turno: string
  cantidad_unidades: number
  jefe_de_turno?: string
  orden_de_compra?: string
  numero_operario: string
  maquina: string
  inspector_calidad: string
  status?: OrderStatus
  created_at?: string
  updated_at?: string
  tests?: OrderTest[]
}

/**
 * Test de una orden
 */
export interface OrderTest {
  id: string
  aprobado: boolean
  created_at: string
  tests?: {
    id: number
    name: string
    type: string
  }
}

/**
 * Item de una orden
 */
export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  quantity: number
  unit_price: number
  subtotal: number
  product?: Product // Optional populated field
}

// ============================================================================
// FORMULARIOS
// ============================================================================

/**
 * Formulario para crear una nueva orden - actualizado
 */
export interface CreateOrderForm {
  lote?: string
  cliente: string
  producto: string
  pedido: string
  fecha_fabricacion: string
  codigo_producto: string
  turno: string
  cantidad_unidades: number
  jefe_de_turno?: string
  orden_de_compra?: string
  numero_operario: string
  maquina: string
  inspector_calidad: string
  test_results?: { [testId: number]: boolean }
}

/**
 * Formulario para actualizar una orden existente - actualizado
 */
export interface UpdateOrderForm {
  lote?: string
  cliente?: string
  producto?: string
  pedido?: string
  fecha_fabricacion?: string
  codigo_producto?: string
  turno?: string
  cantidad_unidades?: number
  jefe_de_turno?: string
  orden_de_compra?: string
  numero_operario?: string
  maquina?: string
  inspector_calidad?: string
  status?: OrderStatus
  test_results?: { [testId: number]: boolean }
}

/**
 * Formulario para crear un nuevo cliente
 */
export interface CreateCustomerForm {
  name: string
  email: string
  phone: string
  address: string
}

/**
 * Formulario para crear un nuevo producto
 */
export interface CreateProductForm {
  name: string
  description: string
  price: number
  stock_quantity: number
}

// ============================================================================
// FILTROS
// ============================================================================

/**
 * Filtros para búsqueda de órdenes - actualizado
 */
export interface OrderFilters {
  status?: OrderStatus
  cliente?: string
  producto?: string
  turno?: string
  fecha_from?: string
  fecha_to?: string
  search?: string
}

/**
 * Filtros para búsqueda de clientes
 */
export interface CustomerFilters {
  search?: string
}

/**
 * Filtros para búsqueda de productos
 */
export interface ProductFilters {
  search?: string
  low_stock?: boolean
}

// ============================================================================
// TIPOS AUXILIARES
// ============================================================================

/**
 * Respuesta paginada para APIs
 */
export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
}

/**
 * Item para timeline de estado de orden
 */
export interface StatusTimelineItem {
  status: OrderStatus
  timestamp: string
  completed: boolean
}