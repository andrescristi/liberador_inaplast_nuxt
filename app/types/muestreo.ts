/**
 * Tipos relacionados con muestreo y calidad
 * 
 * @author Inaplast Development Team
 * @since v2.6.0
 */

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

// ============================================================================
// FORMULARIOS
// ============================================================================

/**
 * Formulario para crear un plan de muestreo
 */
export interface CreatePlanMuestreoForm {
  codigo: string
  aql: string
  tamano_muestra?: number
  numero_maximo_fallas?: number
}

/**
 * Formulario para actualizar un plan de muestreo
 */
export interface UpdatePlanMuestreoForm {
  tamano_muestra?: number
  numero_maximo_fallas?: number
}

/**
 * Formulario para crear un grupo de muestreo
 */
export interface CreateGrupoMuestreoForm {
  tamano_lote_desde: number
  tamano_lote_hasta?: number
  nivel_inspeccion: string
  tipo_de_inspeccion?: string
  codigo_plan_muestreo?: string
}

/**
 * Formulario para actualizar un grupo de muestreo
 */
export interface UpdateGrupoMuestreoForm {
  tamano_lote_hasta?: number
  tipo_de_inspeccion?: string
  codigo_plan_muestreo?: string
}

// ============================================================================
// FILTROS
// ============================================================================

/**
 * Filtros para búsqueda de planes de muestreo
 */
export interface PlanMuestreoFilters {
  codigo?: string
  aql?: string
  search?: string
}

/**
 * Filtros para búsqueda de grupos de muestreo
 */
export interface GrupoMuestreoFilters {
  nivel_inspeccion?: string
  tipo_de_inspeccion?: string
  codigo_plan_muestreo?: string
  lote_size?: number // Para encontrar el grupo apropiado por tamaño de lote
  search?: string
}

// ============================================================================
// TIPOS EXTENDIDOS
// ============================================================================

/**
 * Plan de muestreo con detalles relacionados
 */
export interface PlanMuestreoWithDetails extends PlanDeMuestreo {
  /** Grupos de muestreo asociados a este plan */
  grupos_asociados?: GrupoMuestreo[]
  /** Número de relaciones activas */
  relaciones_count?: number
}

/**
 * Grupo de muestreo con detalles relacionados
 */
export interface GrupoMuestreoWithDetails extends GrupoMuestreo {
  /** Planes de muestreo asociados a este grupo */
  planes_asociados?: PlanDeMuestreo[]
  /** Plan de muestreo recomendado (relación directa) */
  plan_recomendado?: PlanDeMuestreo
}

// ============================================================================
// TIPOS PARA RECOMENDACIONES Y ESTADÍSTICAS
// ============================================================================

/**
 * Recomendación de muestreo
 */
export interface RecomendacionMuestreo {
  /** Grupo de muestreo aplicable */
  grupo: GrupoMuestreo
  /** Plan de muestreo recomendado */
  plan: PlanDeMuestreo
  /** Justificación de la recomendación */
  justificacion: string
}

/**
 * Estadísticas de muestreo
 */
export interface EstadisticasMuestreo {
  total_planes: number
  total_grupos: number
  total_relaciones: number
  planes_por_aql: { [aql: string]: number }
  grupos_por_nivel: { [nivel: string]: number }
  tipos_inspeccion: string[]
}