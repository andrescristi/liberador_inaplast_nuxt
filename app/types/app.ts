/**
 * Tipos de aplicación usando camelCase
 * Estos tipos representan las estructuras de datos tal como se usan en la interfaz de usuario
 * 
 * @author Inaplast Development Team
 * @since Fase 3 Refactoring
 */

import type { ProfileRole } from './auth'
import type { OrderStatus } from './orders'

// ============================================================================
// TIPOS DE APLICACIÓN (camelCase)
// ============================================================================

/**
 * Usuario de aplicación - interfaz de usuario con camelCase
 */
export interface AppUser {
  id: string
  userId: string
  firstName: string
  lastName: string
  userRole: ProfileRole
  createdAt: string | null
  updatedAt: string | null
  fullName?: string
  email?: string
}

/**
 * Orden de aplicación - interfaz de usuario con camelCase
 */
export interface AppOrder {
  id: string
  createdAt: string
  updatedAt: string
  lote?: string
  cliente: string
  producto: string
  pedido: string
  fechaFabricacion: string
  codigoProducto: string
  turno: string
  cantidadEmbalajes: number
  unidadesPorEmbalaje?: number
  jefeDeTurno?: string
  ordenDeCompra?: string
  numeroOperario: string
  maquina: string
  inspectorCalidad: string
  status: OrderStatus
  tests?: AppOrderTest[]
}

/**
 * Test de orden para aplicación - camelCase
 */
export interface AppOrderTest {
  id: number
  createdAt: string
  pregunta: number
  order: string
  aprobado: boolean
  cantidadUnidadesConFalla: number
  tests?: AppTest
}

/**
 * Test para aplicación - camelCase
 */
export interface AppTest {
  id: number
  createdAt: string
  name: string
  type: 'visual' | 'funcional'
}

/**
 * Datos de producción para aplicación (OCR) - camelCase
 */
export interface AppProductionData {
  lote?: string
  cliente?: string
  producto?: string
  pedido?: string
  fechaFabricacion?: Date | string
  codigoProducto?: string
  turno?: string
  unidadesPorEmbalaje?: string
  jefeDeTurno?: string
  ordenDeCompra?: string
  numeroOperario?: string
  maquina?: string
  inspectorCalidad?: string
}

// ============================================================================
// FORMULARIOS DE APLICACIÓN (camelCase)
// ============================================================================

/**
 * Formulario para crear orden - aplicación camelCase
 */
export interface AppCreateOrderForm {
  lote?: string
  cliente: string
  producto: string
  pedido: string
  fechaFabricacion: string
  codigoProducto: string
  turno: string
  cantidadEmbalajes: number
  unidadesPorEmbalaje?: number
  jefeDeTurno?: string
  ordenDeCompra?: string
  numeroOperario: string
  maquina: string
  inspectorCalidad: string
  ordersTests?: AppOrderTestData[]
  testResults?: { [testId: number]: boolean }
}

/**
 * Datos de test para orden - aplicación camelCase
 */
export interface AppOrderTestData {
  testId: number
  aprobado: boolean
  cantidadUnidadesConFalla?: number
}

/**
 * Formulario para actualizar orden - aplicación camelCase
 */
export interface AppUpdateOrderForm {
  lote?: string
  cliente?: string
  producto?: string
  pedido?: string
  fechaFabricacion?: string
  codigoProducto?: string
  turno?: string
  cantidadEmbalajes?: number
  unidadesPorEmbalaje?: number
  jefeDeTurno?: string
  ordenDeCompra?: string
  numeroOperario?: string
  maquina?: string
  inspectorCalidad?: string
  status?: OrderStatus
  testResults?: { [testId: number]: boolean }
}

/**
 * Formulario para crear usuario - aplicación camelCase
 */
export interface AppCreateUserForm {
  email: string
  password: string
  firstName: string
  lastName: string
  userRole: ProfileRole
}

/**
 * Formulario para actualizar perfil - aplicación camelCase
 */
export interface AppUpdateProfileForm {
  firstName?: string
  lastName?: string
  userRole?: ProfileRole
}

// ============================================================================
// FILTROS DE APLICACIÓN (camelCase)
// ============================================================================

/**
 * Filtros de orden para aplicación - camelCase
 */
export interface AppOrderFilters {
  status?: OrderStatus
  cliente?: string
  producto?: string
  turno?: string
  dateFrom?: string
  dateTo?: string
  search?: string
}

/**
 * Filtros de perfil para aplicación - camelCase
 */
export interface AppProfileFilters {
  search?: string
  roleFilter?: ProfileRole
}

// ============================================================================
// PAGINACIÓN DE APLICACIÓN (camelCase)
// ============================================================================

/**
 * Paginación para aplicación - camelCase
 */
export interface AppPagination {
  page: number
  perPage: number
  total: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

/**
 * Respuesta paginada para aplicación - camelCase
 */
export interface AppPaginatedResponse<T> {
  success: boolean
  data: T[]
  pagination: AppPagination
}

// ============================================================================
// ESTADOS DE APLICACIÓN (camelCase)
// ============================================================================

/**
 * Estado de usuario híbrido para aplicación - camelCase
 */
export interface AppHybridAuthUser {
  id: string
  email: string
  role: string
  firstName?: string
  lastName?: string
  fullName?: string
}

/**
 * Estado de autenticación para aplicación
 */
export interface AppAuthState {
  user: AppHybridAuthUser | null
  isLoading: boolean
  error: string | null
  isInitialized: boolean
}

/**
 * Estado de órdenes para aplicación
 */
export interface AppOrdersState {
  orders: AppOrder[]
  currentOrder: AppOrder | null
  loading: boolean
  error: string | null
  pagination: AppPagination
  filters: AppOrderFilters
}

// ============================================================================
// RESPUESTAS DE API APLICACIÓN (camelCase)
// ============================================================================

/**
 * Respuesta de OCR para aplicación - camelCase
 */
export interface AppOCRResponse {
  text: string
  productionData?: AppProductionData
  success: boolean
  error?: string
  metadata?: {
    filename?: string
    processedAt: string
    model: string
    processingTimeMs?: number
    originalSizeKB?: number
    finalSizeKB?: number
  }
}

/**
 * Timeline de estado para aplicación - camelCase
 */
export interface AppStatusTimelineItem {
  status: OrderStatus
  timestamp: string
  completed: boolean
}