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
 * Orden principal
 */
export interface Order {
  id: string
  customer_id: string
  status: OrderStatus
  total_amount: number
  order_date: string
  created_at: string
  updated_at: string
  customer?: Customer // Optional populated field
  order_items?: OrderItem[] // Optional populated field
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
 * Formulario para crear una nueva orden
 */
export interface CreateOrderForm {
  customer_id: string
  items: {
    product_id: string
    quantity: number
    unit_price: number
  }[]
}

/**
 * Formulario para actualizar una orden existente
 */
export interface UpdateOrderForm {
  status?: OrderStatus
  customer_id?: string
  items?: {
    product_id: string
    quantity: number
    unit_price: number
  }[]
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
 * Filtros para búsqueda de órdenes
 */
export interface OrderFilters {
  status?: OrderStatus
  customer_id?: string
  date_from?: string
  date_to?: string
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
 * Item para timeline de estado de orden
 */
export interface StatusTimelineItem {
  status: OrderStatus
  timestamp: string
  completed: boolean
}