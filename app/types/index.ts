/**
 * Definiciones de tipos para el sistema de liberación Inaplast
 * 
 * Este archivo contiene todas las interfaces y tipos TypeScript
 * utilizados en la aplicación para garantizar type safety y
 * proporcionar autocompletado en el IDE.
 * 
 * Estructura:
 * - Tipos de perfiles y autenticación
 * - Entidades de base de datos (Customer, Product, Order)
 * - Formularios y validación
 * - Respuestas de API y paginación
 * - Filtros y búsquedas
 * - Métricas del dashboard
 * 
 * @author Inaplast Development Team
 * @since v1.0.0
 */

// ============================================================================
// TIPOS DE PERFILES Y AUTENTICACIÓN
// ============================================================================

/**
 * Roles disponibles en el sistema de liberación Inaplast
 * 
 * Jerarquía de permisos (de mayor a menor):
 * - Admin: Acceso completo al sistema, gestión de usuarios, configuración global
 * - Supervisor: Supervisión de procesos, acceso a reportes globales, aprobación de liberaciones
 * - Inspector: Creación y gestión de liberaciones asignadas, acceso limitado a sus propios datos
 */
export type ProfileRole = 'Admin' | 'Inspector' | 'Supervisor'

/**
 * Perfil de usuario del sistema
 * 
 * Representa un usuario registrado con sus datos básicos y rol.
 * Se combina con datos de Supabase Auth para formar el perfil completo.
 * 
 * @example
 * ```typescript
 * const userProfile: Profile = {
 *   id: 'uuid-profile-id',
 *   user_id: 'uuid-auth-user-id',
 *   first_name: 'Juan',
 *   last_name: 'Pérez',
 *   user_role: 'Inspector',
 *   created_at: '2023-01-01T00:00:00Z',
 *   updated_at: '2023-06-01T00:00:00Z',
 *   full_name: 'Juan Pérez', // Computed
 *   email: 'juan.perez@inaplast.com' // From auth.users
 * }
 * ```
 */
export interface Profile {
  /** ID único del perfil en la tabla profiles */
  id: string
  /** ID del usuario en Supabase Auth (FK a auth.users) */
  user_id: string
  /** Nombre del usuario */
  first_name: string
  /** Apellido del usuario */
  last_name: string
  /** Rol del usuario en el sistema */
  user_role: ProfileRole
  /** Fecha de creación del perfil */
  created_at: string
  /** Fecha de última actualización */
  updated_at: string
  /** Campo calculado: nombre completo (first_name + last_name) */
  full_name?: string
  /** Email del usuario (poblado desde auth.users) */
  email?: string
}

/**
 * Formulario para crear un nuevo perfil de usuario
 * 
 * Usado cuando se crea un perfil manualmente (sin autenticación)
 * o para actualizar datos básicos del perfil.
 */
export interface CreateProfileForm {
  /** Nombre del usuario (requerido) */
  first_name: string
  /** Apellido del usuario (requerido) */
  last_name: string
  /** Rol inicial del usuario */
  user_role: ProfileRole
}

/**
 * Formulario para actualizar un perfil existente
 * 
 * Todos los campos son opcionales para permitir actualizaciones parciales.
 */
export interface UpdateProfileForm {
  /** Nombre del usuario (opcional para actualizaciones parciales) */
  first_name?: string
  /** Apellido del usuario (opcional para actualizaciones parciales) */
  last_name?: string
  /** Rol del usuario (opcional, requiere permisos de admin) */
  user_role?: ProfileRole
}

/**
 * Formulario completo para crear un nuevo usuario
 * 
 * Incluye tanto credenciales de autenticación como datos del perfil.
 * Usado en el panel de administración para crear usuarios completos.
 * 
 * @example
 * ```typescript
 * const newUser: CreateUserForm = {
 *   email: 'inspector@inaplast.com',
 *   password: 'TempPassword123!',
 *   first_name: 'María',
 *   last_name: 'González',
 *   user_role: 'Inspector'
 * }
 * ```
 */
export interface CreateUserForm {
  /** Email único del usuario (para autenticación) */
  email: string
  /** Contraseña temporal (usuario debe cambiarla en primer login) */
  password: string
  /** Nombre del usuario */
  first_name: string
  /** Apellido del usuario */
  last_name: string
  /** Rol inicial del usuario */
  user_role: ProfileRole
}

/**
 * Filtros para búsqueda y filtrado de perfiles
 * 
 * Usado en el panel de administración para filtrar la lista de usuarios.
 */
export interface ProfileFilters {
  /** Término de búsqueda (busca en nombre, apellido y email) */
  search?: string
  /** Filtrar por rol específico */
  role_filter?: ProfileRole
}

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  address: string
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  stock_quantity: number
  created_at: string
  updated_at: string
}

export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled'

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

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  quantity: number
  unit_price: number
  subtotal: number
  product?: Product // Optional populated field
}

// Form types
export interface CreateOrderForm {
  customer_id: string
  items: {
    product_id: string
    quantity: number
    unit_price: number
  }[]
}

export interface CreateCustomerForm {
  name: string
  email: string
  phone: string
  address: string
}

export interface CreateProductForm {
  name: string
  description: string
  price: number
  stock_quantity: number
}

// API response types
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  per_page: number
  total_pages: number
}

// Dashboard metrics
export interface DashboardMetrics {
  pending_orders: number
  completed_orders: number
  cancelled_orders: number
  current_month_revenue: number
  current_week_revenue: number
}

// Filter types
export interface OrderFilters {
  status?: OrderStatus
  customer_id?: string
  date_from?: string
  date_to?: string
  search?: string
}

export interface CustomerFilters {
  search?: string
}

export interface ProductFilters {
  search?: string
  low_stock?: boolean
}

// Status timeline item
export interface StatusTimelineItem {
  status: OrderStatus
  timestamp: string
  completed: boolean
}

// ============================================================================
// TIPOS DE MUESTREO Y CALIDAD
// ============================================================================

/**
 * Plan de muestreo - Define los parámetros de calidad para inspecciones
 * 
 * Representa un plan de muestreo estadístico basado en estándares de calidad
 * como MIL-STD o ISO 2859. Cada plan define el tamaño de muestra y el
 * número máximo de defectos permitidos para un AQL específico.
 * 
 * @example
 * ```typescript
 * const plan: PlanDeMuestreo = {
 *   codigo: 'A',
 *   aql: '0,065',
 *   tamano_muestra: 2,
 *   numero_maximo_fallas: 0
 * }
 * ```
 */
export interface PlanDeMuestreo {
  /** Código del plan (A, B, C, D, etc.) - parte de PK compuesta */
  codigo: string
  /** Nivel de calidad aceptable (AQL) - parte de PK compuesta */
  aql: string
  /** Tamaño de muestra requerido */
  tamano_muestra?: number
  /** Número máximo de fallas permitidas */
  numero_maximo_fallas?: number
}

/**
 * Grupo de muestreo - Define rangos de lotes y niveles de inspección
 * 
 * Asocia rangos de tamaño de lote con códigos de plan de muestreo
 * según el tipo y nivel de inspección requerido.
 * 
 * @example
 * ```typescript
 * const grupo: GrupoMuestreo = {
 *   tamano_lote_desde: 2,
 *   tamano_lote_hasta: 8,
 *   nivel_inspeccion: 'I',
 *   tipo_de_inspeccion: 'General',
 *   codigo_plan_muestreo: 'A'
 * }
 * ```
 */
export interface GrupoMuestreo {
  /** Tamaño mínimo del lote - parte de PK compuesta */
  tamano_lote_desde: number
  /** Tamaño máximo del lote (opcional) */
  tamano_lote_hasta?: number
  /** Nivel de inspección (I, II, III) - parte de PK compuesta */
  nivel_inspeccion: string
  /** Tipo de inspección (General, Especial, etc.) */
  tipo_de_inspeccion?: string
  /** Código del plan de muestreo recomendado */
  codigo_plan_muestreo?: string
}

/**
 * Relación grupos-planes - Tabla de unión many-to-many
 * 
 * Conecta grupos de muestreo con planes de muestreo específicos
 * para diferentes combinaciones de AQL y nivel de inspección.
 */
export interface GrupoPlanes {
  /** Tamaño mínimo del lote (FK a grupos_muestreo) */
  tamano_lote_desde?: number
  /** Nivel de inspección (FK a grupos_muestreo) */
  nivel_inspeccion?: string
  /** Código del plan (FK a planes_de_muestreo) */
  codigo?: string
  /** AQL del plan (FK a planes_de_muestreo) */
  aql?: string
}

// Formularios para crear/actualizar planes de muestreo
export interface CreatePlanMuestreoForm {
  codigo: string
  aql: string
  tamano_muestra?: number
  numero_maximo_fallas?: number
}

export interface UpdatePlanMuestreoForm {
  tamano_muestra?: number
  numero_maximo_fallas?: number
}

// Formularios para crear/actualizar grupos de muestreo
export interface CreateGrupoMuestreoForm {
  tamano_lote_desde: number
  tamano_lote_hasta?: number
  nivel_inspeccion: string
  tipo_de_inspeccion?: string
  codigo_plan_muestreo?: string
}

export interface UpdateGrupoMuestreoForm {
  tamano_lote_hasta?: number
  tipo_de_inspeccion?: string
  codigo_plan_muestreo?: string
}

// Filtros para búsqueda de planes y grupos
export interface PlanMuestreoFilters {
  codigo?: string
  aql?: string
  search?: string
}

export interface GrupoMuestreoFilters {
  nivel_inspeccion?: string
  tipo_de_inspeccion?: string
  codigo_plan_muestreo?: string
  lote_size?: number // Para encontrar el grupo apropiado por tamaño de lote
  search?: string
}

// Respuesta combinada para mostrar relaciones
export interface PlanMuestreoWithDetails extends PlanDeMuestreo {
  /** Grupos de muestreo asociados a este plan */
  grupos_asociados?: GrupoMuestreo[]
  /** Número de relaciones activas */
  relaciones_count?: number
}

export interface GrupoMuestreoWithDetails extends GrupoMuestreo {
  /** Planes de muestreo asociados a este grupo */
  planes_asociados?: PlanDeMuestreo[]
  /** Plan de muestreo recomendado (relación directa) */
  plan_recomendado?: PlanDeMuestreo
}

// Tipos para recomendación de muestreo
export interface RecomendacionMuestreo {
  /** Grupo de muestreo aplicable */
  grupo: GrupoMuestreo
  /** Plan de muestreo recomendado */
  plan: PlanDeMuestreo
  /** Justificación de la recomendación */
  justificacion: string
}

// Tipos para estadísticas de muestreo
export interface EstadisticasMuestreo {
  total_planes: number
  total_grupos: number
  total_relaciones: number
  planes_por_aql: { [aql: string]: number }
  grupos_por_nivel: { [nivel: string]: number }
  tipos_inspeccion: string[]
}