/**
 * Tipos relacionados con respuestas de API y paginación
 * 
 * @author Inaplast Development Team
 * @since v2.6.0
 */

// ============================================================================
// TIPOS DE RESPUESTAS DE API
// ============================================================================

/**
 * Respuesta paginada genérica para APIs REST
 * 
 * Estructura estándar para todas las respuestas que incluyen paginación,
 * proporcionando información sobre la página actual, total de elementos
 * y navegación.
 * 
 * @template T Tipo de los elementos en el array de datos
 * 
 * @example
 * ```typescript
 * const response: PaginatedResponse<Order> = {
 *   data: [order1, order2],
 *   total: 150,
 *   page: 1,
 *   per_page: 20,
 *   total_pages: 8
 * }
 * ```
 */
export interface PaginatedResponse<T> {
  /** Array de elementos para la página actual */
  data: T[]
  /** Total de elementos en toda la colección */
  total: number
  /** Número de página actual (1-indexed) */
  page: number
  /** Elementos por página */
  per_page: number
  /** Total de páginas disponibles */
  total_pages: number
}