/**
 * Mappers de transformación de nombres entre BD (snake_case) y aplicación (camelCase)
 * Centraliza la conversión para mantener consistencia en el proyecto
 * 
 * @author Inaplast Development Team
 * @since Fase 2 Refactoring
 */

// ============================================================================
// TIPOS DE TRANSFORMACIÓN
// ============================================================================

/**
 * Tipos de campos de BD (snake_case) para tipos de aplicación (camelCase)
 */
export interface DBUser {
  user_id: string
  first_name: string
  last_name: string
  user_role: string
  created_at: string
  updated_at: string
}

export interface AppUser {
  userId: string
  firstName: string
  lastName: string
  userRole: string
  createdAt: string
  updatedAt: string
}

export interface DBOrder {
  fecha_fabricacion: string
  codigo_producto: string
  cantidad_unidades_por_embalaje: number
  jefe_de_turno?: string
  orden_de_compra?: string
  numero_operario: string
  inspector_calidad: string
  cantidad_embalajes: number
  created_at: string
  updated_at: string
}

export interface AppOrder {
  fechaFabricacion: string
  codigoProducto: string
  cantidadUnidadesPorEmbalaje: number
  jefeDeTurno?: string
  ordenDeCompra?: string
  numeroOperario: string
  inspectorCalidad: string
  cantidadEmbalajes: number
  createdAt: string
  updatedAt: string
}

// ============================================================================
// MAPPERS DE USUARIO
// ============================================================================

/**
 * Convierte datos de usuario de BD (snake_case) a aplicación (camelCase)
 */
export const mapDBUserToApp = (dbUser: Partial<DBUser>): Partial<AppUser> => {
  return {
    ...(dbUser.user_id && { userId: dbUser.user_id }),
    ...(dbUser.first_name && { firstName: dbUser.first_name }),
    ...(dbUser.last_name && { lastName: dbUser.last_name }),
    ...(dbUser.user_role && { userRole: dbUser.user_role }),
    ...(dbUser.created_at && { createdAt: dbUser.created_at }),
    ...(dbUser.updated_at && { updatedAt: dbUser.updated_at })
  }
}

/**
 * Convierte datos de usuario de aplicación (camelCase) a BD (snake_case)
 */
export const mapAppUserToDB = (appUser: Partial<AppUser>): Partial<DBUser> => {
  return {
    ...(appUser.userId && { user_id: appUser.userId }),
    ...(appUser.firstName && { first_name: appUser.firstName }),
    ...(appUser.lastName && { last_name: appUser.lastName }),
    ...(appUser.userRole && { user_role: appUser.userRole }),
    ...(appUser.createdAt && { created_at: appUser.createdAt }),
    ...(appUser.updatedAt && { updated_at: appUser.updatedAt })
  }
}

// ============================================================================
// MAPPERS DE ORDEN
// ============================================================================

/**
 * Convierte datos de orden de BD (snake_case) a aplicación (camelCase)
 */
export const mapDBOrderToApp = (dbOrder: Partial<DBOrder>): Partial<AppOrder> => {
  return {
    ...(dbOrder.fecha_fabricacion && { fechaFabricacion: dbOrder.fecha_fabricacion }),
    ...(dbOrder.codigo_producto && { codigoProducto: dbOrder.codigo_producto }),
    ...(dbOrder.cantidad_unidades_por_embalaje && { 
      cantidadUnidadesPorEmbalaje: dbOrder.cantidad_unidades_por_embalaje 
    }),
    ...(dbOrder.jefe_de_turno && { jefeDeTurno: dbOrder.jefe_de_turno }),
    ...(dbOrder.orden_de_compra && { ordenDeCompra: dbOrder.orden_de_compra }),
    ...(dbOrder.numero_operario && { numeroOperario: dbOrder.numero_operario }),
    ...(dbOrder.inspector_calidad && { inspectorCalidad: dbOrder.inspector_calidad }),
    ...(dbOrder.cantidad_embalajes && { cantidadEmbalajes: dbOrder.cantidad_embalajes }),
    ...(dbOrder.created_at && { createdAt: dbOrder.created_at }),
    ...(dbOrder.updated_at && { updatedAt: dbOrder.updated_at })
  }
}

/**
 * Convierte datos de orden de aplicación (camelCase) a BD (snake_case)
 */
export const mapAppOrderToDB = (appOrder: Partial<AppOrder>): Partial<DBOrder> => {
  return {
    ...(appOrder.fechaFabricacion && { fecha_fabricacion: appOrder.fechaFabricacion }),
    ...(appOrder.codigoProducto && { codigo_producto: appOrder.codigoProducto }),
    ...(appOrder.cantidadUnidadesPorEmbalaje && { 
      cantidad_unidades_por_embalaje: appOrder.cantidadUnidadesPorEmbalaje 
    }),
    ...(appOrder.jefeDeTurno && { jefe_de_turno: appOrder.jefeDeTurno }),
    ...(appOrder.ordenDeCompra && { orden_de_compra: appOrder.ordenDeCompra }),
    ...(appOrder.numeroOperario && { numero_operario: appOrder.numeroOperario }),
    ...(appOrder.inspectorCalidad && { inspector_calidad: appOrder.inspectorCalidad }),
    ...(appOrder.cantidadEmbalajes && { cantidad_embalajes: appOrder.cantidadEmbalajes }),
    ...(appOrder.createdAt && { created_at: appOrder.createdAt }),
    ...(appOrder.updatedAt && { updated_at: appOrder.updatedAt })
  }
}

// ============================================================================
// MAPPERS GENÉRICOS
// ============================================================================

/**
 * Convierte un objeto de snake_case a camelCase de manera genérica
 */
export const snakeToCamel = <T extends Record<string, unknown>>(obj: T): Record<string, unknown> => {
  const result: Record<string, unknown> = {}
  
  for (const [key, value] of Object.entries(obj)) {
    // Convertir snake_case a camelCase
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
    result[camelKey] = value
  }
  
  return result
}

/**
 * Convierte un objeto de camelCase a snake_case de manera genérica
 */
export const camelToSnake = <T extends Record<string, unknown>>(obj: T): Record<string, unknown> => {
  const result: Record<string, unknown> = {}
  
  for (const [key, value] of Object.entries(obj)) {
    // Convertir camelCase a snake_case
    const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)
    result[snakeKey] = value
  }
  
  return result
}

// ============================================================================
// CONSTANTES DE MAPEO
// ============================================================================

/**
 * Mapeo de campos específicos para casos especiales
 */
export const FIELD_MAPPINGS = {
  // Auth fields
  user_id: 'userId',
  first_name: 'firstName',
  last_name: 'lastName',
  full_name: 'fullName',
  user_role: 'userRole',
  
  // Order fields
  fecha_fabricacion: 'fechaFabricacion',
  codigo_producto: 'codigoProducto',
  cantidad_unidades_por_embalaje: 'cantidadUnidadesPorEmbalaje',
  jefe_de_turno: 'jefeDeTurno',
  orden_de_compra: 'ordenDeCompra',
  numero_operario: 'numeroOperario',
  inspector_calidad: 'inspectorCalidad',
  cantidad_embalajes: 'cantidadEmbalajes',
  
  // Common fields
  created_at: 'createdAt',
  updated_at: 'updatedAt',
  
  // Pagination fields
  per_page: 'perPage',
  total_pages: 'totalPages',
  
  // Filter fields
  date_from: 'dateFrom',
  date_to: 'dateTo'
} as const

/**
 * Mapeo inverso para conversión de camelCase a snake_case
 */
export const REVERSE_FIELD_MAPPINGS = Object.fromEntries(
  Object.entries(FIELD_MAPPINGS).map(([snake, camel]) => [camel, snake])
) as Record<string, string>