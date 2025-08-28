/**
 * Tipos relacionados con métricas y dashboard
 * 
 * @author Inaplast Development Team
 * @since v2.6.0
 */

// ============================================================================
// MÉTRICAS DEL DASHBOARD
// ============================================================================

/**
 * Métricas principales del dashboard
 * 
 * Proporciona estadísticas clave sobre órdenes y revenue
 * para mostrar en el dashboard principal del sistema.
 * 
 * @example
 * ```typescript
 * const metrics: DashboardMetrics = {
 *   pending_orders: 25,
 *   completed_orders: 150,
 *   cancelled_orders: 5,
 *   current_month_revenue: 45000.50,
 *   current_week_revenue: 12000.25
 * }
 * ```
 */
export interface DashboardMetrics {
  /** Número de órdenes pendientes */
  pending_orders: number
  /** Número de órdenes completadas */
  completed_orders: number
  /** Número de órdenes canceladas */
  cancelled_orders: number
  /** Revenue del mes actual */
  current_month_revenue: number
  /** Revenue de la semana actual */
  current_week_revenue: number
}