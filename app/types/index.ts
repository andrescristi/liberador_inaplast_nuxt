/**
 * Definiciones de tipos para el sistema de liberación Inaplast
 * 
 * Este archivo actúa como punto central de exportación para todos los tipos
 * del sistema, organizados por dominio para mejor mantenibilidad.
 * 
 * Estructura modular:
 * - auth.ts: Tipos de perfiles y autenticación
 * - orders.ts: Entidades de órdenes, clientes y productos
 * - muestreo.ts: Tipos de muestreo y calidad
 * - api.ts: Respuestas de API y paginación
 * - dashboard.ts: Métricas del dashboard
 * 
 * @author Inaplast Development Team
 * @since v2.6.0
 */

// ============================================================================
// RE-EXPORTS POR DOMINIO
// ============================================================================

// Tipos de autenticación y perfiles
export type {
  ProfileRole,
  Profile,
  CreateProfileForm,
  UpdateProfileForm,
  CreateUserForm,
  ProfileFilters
} from './auth'

// Tipos de órdenes, clientes y productos
export type {
  OrderStatus,
  Customer,
  Product,
  Order,
  OrderItem,
  CreateOrderForm,
  UpdateOrderForm,
  CreateCustomerForm,
  CreateProductForm,
  OrderFilters,
  CustomerFilters,
  ProductFilters,
  StatusTimelineItem
} from './orders'

// Tipos de muestreo y calidad
export type {
  PlanDeMuestreo,
  GrupoMuestreo,
  GrupoPlanes,
  CreatePlanMuestreoForm,
  UpdatePlanMuestreoForm,
  CreateGrupoMuestreoForm,
  UpdateGrupoMuestreoForm,
  PlanMuestreoFilters,
  GrupoMuestreoFilters,
  PlanMuestreoWithDetails,
  GrupoMuestreoWithDetails,
  RecomendacionMuestreo,
  EstadisticasMuestreo
} from './muestreo'

// Tipos de API y paginación
export type {
  PaginatedResponse
} from './api'

// Tipos de dashboard y métricas
export type {
  DashboardMetrics
} from './dashboard'