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
 * Estado de una orden - coincide con enum de Supabase
 */
export type OrderStatus = 'Aprobado' | 'Rechazado'

/**
 * Test disponible en el sistema - mapea a tabla 'tests'
 */
export interface Test {
  id: number
  created_at: string
  name: string
  type: 'visual' | 'funcional'
}

/**
 * Orden principal - mapea exactamente a tabla 'orders' de Supabase
 */
export interface Order {
  id: string
  created_at: string
  updated_at: string
  numero_orden: number
  lote?: string
  cliente: string
  producto: string
  pedido: string
  fecha_fabricacion: string
  codigo_producto: string
  turno: string
  unidades_por_embalaje: number
  cantidad_embalajes: number
  muestreo_real?: number
  muestreo_recomendado?: number
  jefe_de_turno?: string
  orden_de_compra?: string
  numero_operario: string
  maquina: string
  inspector_calidad: string
  status: OrderStatus
  creado_por?: string
  usuario?: {
    id: string
    email: string
  }
  tests?: OrderTest[]
  liberador_profile?: {
    user_id: string
    first_name: string
    last_name: string
    user_role: string
  }
}

/**
 * Test de una orden - mapea a tabla 'orders_tests'
 */
export interface OrderTest {
  id: number
  created_at: string
  pregunta: number
  order: string
  aprobado: boolean
  cantidad_unidades_con_falla: number
  tests?: Test
}


// ============================================================================
// FORMULARIOS
// ============================================================================

/**
 * Datos de test para una orden - formato API
 */
export interface OrderTestData {
  test_id: number
  aprobado: boolean
  cantidad_unidades_con_falla?: number
}

/**
 * Formulario para crear una nueva orden - mapea a estructura de Supabase
 */
export interface CreateOrderForm {
  lote?: string
  cliente: string
  producto: string
  pedido: string
  fecha_fabricacion: string
  codigo_producto: string
  turno: string
  unidades_por_embalaje: number
  cantidad_embalajes: number
  jefe_de_turno?: string
  orden_de_compra?: string
  numero_operario: string
  maquina: string
  inspector_calidad: string
  orders_tests?: OrderTestData[]
  test_results?: { [testId: number]: boolean }
}

/**
 * Formulario para actualizar una orden existente - mapea a estructura de Supabase
 */
export interface UpdateOrderForm {
  lote?: string
  cliente?: string
  producto?: string
  pedido?: string
  fecha_fabricacion?: string
  codigo_producto?: string
  turno?: string
  unidades_por_embalaje?: number
  cantidad_embalajes?: number
  jefe_de_turno?: string
  orden_de_compra?: string
  numero_operario?: string
  maquina?: string
  inspector_calidad?: string
  status?: OrderStatus
  test_results?: { [testId: number]: boolean }
}


// ============================================================================
// FILTROS
// ============================================================================

/**
 * Filtros para búsqueda de órdenes - actualizado con status de Supabase
 */
export interface OrderFilters {
  status?: OrderStatus
  cliente?: string
  producto?: string
  turno?: string
  dateFrom?: string
  dateTo?: string
  search?: string
  liberador?: string
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