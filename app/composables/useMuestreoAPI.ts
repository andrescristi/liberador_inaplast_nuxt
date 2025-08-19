/**
 * Composable para gestionar operaciones de muestreo y calidad
 * 
 * Proporciona funciones para interactuar con las tablas de muestreo:
 * - planes_de_muestreo: Definiciones de planes de calidad
 * - grupos_muestreo: Rangos de lote y niveles de inspección
 * - grupos_planes: Relaciones entre grupos y planes
 * 
 * @author Inaplast Development Team
 * @since v1.0.0
 */

import type { 
  PlanMuestreoWithDetails,
  GrupoMuestreoWithDetails,
  PlanMuestreoFilters,
  GrupoMuestreoFilters,
  EstadisticasMuestreo,
  RecomendacionMuestreo,
  PaginatedResponse
} from '~/types'

export const useMuestreoAPI = () => {
  const supabase = useSupabaseClient()
  const toast = useToast()

  // ============================================================================
  // PLANES DE MUESTREO
  // ============================================================================

  /**
   * Obtiene todos los planes de muestreo con paginación y filtros
   */
  const getPlanesMuestreo = async (
    filters: PlanMuestreoFilters = {},
    page = 1,
    limit = 50
  ): Promise<PaginatedResponse<PlanMuestreoWithDetails>> => {
    try {
      let query = supabase
        .from('planes_de_muestreo')
        .select(`
          *,
          grupos_planes!inner(
            tamano_lote_desde,
            nivel_inspeccion,
            grupos_muestreo(*)
          )
        `, { count: 'exact' })

      // Aplicar filtros
      if (filters.codigo) {
        query = query.eq('codigo', filters.codigo)
      }
      if (filters.aql) {
        query = query.eq('aql', filters.aql)
      }
      if (filters.search) {
        query = query.or(`codigo.ilike.%${filters.search}%,aql.ilike.%${filters.search}%`)
      }

      // Paginación
      const offset = (page - 1) * limit
      query = query.range(offset, offset + limit - 1)

      const { data, error, count } = await query.order('codigo', { ascending: true })

      if (error) throw error

      return {
        data: data || [],
        total: count || 0,
        page,
        per_page: limit,
        total_pages: Math.ceil((count || 0) / limit)
      }
    } catch (error) {
      toast.error('Error', 'No se pudieron cargar los planes de muestreo')
      throw error
    }
  }

  /**
   * Obtiene un plan de muestreo específico por código y AQL
   */
  const getPlanMuestreo = async (codigo: string, aql: string): Promise<PlanMuestreoWithDetails | null> => {
    try {
      const { data, error } = await supabase
        .from('planes_de_muestreo')
        .select(`
          *,
          grupos_planes(
            *,
            grupos_muestreo(*)
          )
        `)
        .eq('codigo', codigo)
        .eq('aql', aql)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      toast.error('Error', 'No se pudo cargar el plan de muestreo')
      throw error
    }
  }

  // Las operaciones de escritura han sido removidas - solo operaciones de lectura permitidas

  // ============================================================================
  // GRUPOS DE MUESTREO
  // ============================================================================

  /**
   * Obtiene todos los grupos de muestreo con paginación y filtros
   */
  const getGruposMuestreo = async (
    filters: GrupoMuestreoFilters = {},
    page = 1,
    limit = 50
  ): Promise<PaginatedResponse<GrupoMuestreoWithDetails>> => {
    try {
      let query = supabase
        .from('grupos_muestreo')
        .select(`
          *,
          grupos_planes(
            *,
            planes_de_muestreo(*)
          )
        `, { count: 'exact' })

      // Aplicar filtros
      if (filters.nivel_inspeccion) {
        query = query.eq('nivel_inspeccion', filters.nivel_inspeccion)
      }
      if (filters.tipo_de_inspeccion) {
        query = query.eq('tipo_de_inspeccion', filters.tipo_de_inspeccion)
      }
      if (filters.codigo_plan_muestreo) {
        query = query.eq('codigo_plan_muestreo', filters.codigo_plan_muestreo)
      }
      if (filters.lote_size) {
        query = query
          .lte('tamano_lote_desde', filters.lote_size)
          .or(`tamano_lote_hasta.gte.${filters.lote_size},tamano_lote_hasta.is.null`)
      }
      if (filters.search) {
        query = query.or(`nivel_inspeccion.ilike.%${filters.search}%,tipo_de_inspeccion.ilike.%${filters.search}%`)
      }

      // Paginación
      const offset = (page - 1) * limit
      query = query.range(offset, offset + limit - 1)

      const { data, error, count } = await query.order('tamano_lote_desde', { ascending: true })

      if (error) throw error

      return {
        data: data || [],
        total: count || 0,
        page,
        per_page: limit,
        total_pages: Math.ceil((count || 0) / limit)
      }
    } catch (error) {
      toast.error('Error', 'No se pudieron cargar los grupos de muestreo')
      throw error
    }
  }

  /**
   * Obtiene un grupo de muestreo específico
   */
  const getGrupoMuestreo = async (
    tamanoLoteDesde: number,
    nivelInspeccion: string
  ): Promise<GrupoMuestreoWithDetails | null> => {
    try {
      const { data, error } = await supabase
        .from('grupos_muestreo')
        .select(`
          *,
          grupos_planes(
            *,
            planes_de_muestreo(*)
          )
        `)
        .eq('tamano_lote_desde', tamanoLoteDesde)
        .eq('nivel_inspeccion', nivelInspeccion)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      toast.error('Error', 'No se pudo cargar el grupo de muestreo')
      throw error
    }
  }

  // Las operaciones de escritura han sido removidas - solo operaciones de lectura permitidas

  // ============================================================================
  // RECOMENDACIONES Y UTILIDADES
  // ============================================================================

  /**
   * Obtiene recomendación de muestreo para un tamaño de lote específico
   * Utiliza el endpoint del backend para obtener los datos
   */
  const getRecomendacionMuestreo = async (
    tamanoLote: number,
    _nivelInspeccion: string = 'S1',
    aqlDeseado: string = '1,5'
  ): Promise<RecomendacionMuestreo | null> => {
    try {
      const data = await $fetch(`/api/calidad/planes-muestreo?tamano_lote=${tamanoLote}`)
      
      if (!data || 'error' in data) {
        return null
      }

      // Convertir la respuesta del backend al formato esperado
      return {
        grupo: {
          tamano_lote_desde: data.tamano_lote_desde,
          tamano_lote_hasta: data.tamano_lote_hasta,
          nivel_inspeccion: data.nivel_inspeccion,
          tipo_de_inspeccion: data.tipo_inspeccion,
          codigo_plan_muestreo: data.codigo_plan_muestreo
        },
        plan: {
          codigo: data.codigo_plan_muestreo,
          aql: aqlDeseado,
          tamano_muestra: data.tamano_muestra,
          numero_maximo_fallas: data.numero_maximo_fallas
        },
        justificacion: `Plan recomendado para lotes de ${data.tamano_lote_desde} a ${data.tamano_lote_hasta} unidades con nivel de inspección ${data.nivel_inspeccion} y AQL ${aqlDeseado}`
      }
    } catch (error) {
      toast.error('Error', 'No se pudo obtener la recomendación de muestreo')
      throw error
    }
  }

  /**
   * Obtiene estadísticas generales del sistema de muestreo
   */
  const getEstadisticasMuestreo = async (): Promise<EstadisticasMuestreo> => {
    try {
      const [
        { count: totalPlanes },
        { count: totalGrupos },
        { count: totalRelaciones },
        { data: planesPorAQL },
        { data: gruposPorNivel },
        { data: tiposInspeccion }
      ] = await Promise.all([
        supabase.from('planes_de_muestreo').select('*', { count: 'exact', head: true }),
        supabase.from('grupos_muestreo').select('*', { count: 'exact', head: true }),
        supabase.from('grupos_planes').select('*', { count: 'exact', head: true }),
        supabase
          .from('planes_de_muestreo')
          .select('aql')
          .order('aql'),
        supabase
          .from('grupos_muestreo')
          .select('nivel_inspeccion')
          .order('nivel_inspeccion'),
        supabase
          .from('grupos_muestreo')
          .select('tipo_de_inspeccion')
          .not('tipo_de_inspeccion', 'is', null)
          .order('tipo_de_inspeccion')
      ])

      // Procesar datos con tipos seguros
      const planesPorAQLCount: { [aql: string]: number } = {}
      if (planesPorAQL) {
        planesPorAQL.forEach((p: any) => {
          if (p.aql) {
            planesPorAQLCount[p.aql] = (planesPorAQLCount[p.aql] || 0) + 1
          }
        })
      }

      // Contar grupos por nivel
      const gruposPorNivelCount: { [nivel: string]: number } = {}
      if (gruposPorNivel) {
        gruposPorNivel.forEach((g: any) => {
          if (g.nivel_inspeccion) {
            gruposPorNivelCount[g.nivel_inspeccion] = (gruposPorNivelCount[g.nivel_inspeccion] || 0) + 1
          }
        })
      }

      // Tipos únicos de inspección
      const tiposUnicos = tiposInspeccion ? [...new Set(tiposInspeccion.map((t: any) => t.tipo_de_inspeccion).filter(Boolean))] : []

      return {
        total_planes: totalPlanes || 0,
        total_grupos: totalGrupos || 0,
        total_relaciones: totalRelaciones || 0,
        planes_por_aql: planesPorAQLCount,
        grupos_por_nivel: gruposPorNivelCount,
        tipos_inspeccion: tiposUnicos
      }
    } catch (error) {
      toast.error('Error', 'No se pudieron cargar las estadísticas de muestreo')
      throw error
    }
  }

  // ============================================================================
  // RELACIONES GRUPOS-PLANES
  // ============================================================================

  /**
   * Obtiene las relaciones de un grupo específico con sus planes asociados
   */
  const getRelacionesGrupoPlanes = async (
    tamanoLoteDesde: number,
    nivelInspeccion: string
  ) => {
    try {
      const { data, error } = await supabase
        .from('grupos_planes')
        .select(`
          *,
          planes_de_muestreo(*)
        `)
        .eq('tamano_lote_desde', tamanoLoteDesde)
        .eq('nivel_inspeccion', nivelInspeccion)

      if (error) throw error
      return data || []
    } catch (error) {
      toast.error('Error', 'No se pudieron cargar las relaciones del grupo')
      throw error
    }
  }

  // Las operaciones de escritura han sido removidas - solo operaciones de lectura permitidas

  /**
   * Obtiene todos los planes asignados a un grupo
   */
  const getPlanesAsignadosAGrupo = async (
    tamanoLoteDesde: number,
    nivelInspeccion: string
  ): Promise<any[]> => {
    try {
      const { data, error } = await supabase
        .from('grupos_planes')
        .select(`
          planes_de_muestreo(*)
        `)
        .eq('tamano_lote_desde', tamanoLoteDesde)
        .eq('nivel_inspeccion', nivelInspeccion)

      if (error) throw error
      
      return data?.map((item: any) => item.planes_de_muestreo).filter(Boolean) || []
    } catch (error) {
      toast.error('Error', 'No se pudieron cargar los planes asignados al grupo')
      throw error
    }
  }

  return {
    // Planes de muestreo (solo lectura)
    getPlanesMuestreo,
    getPlanMuestreo,

    // Grupos de muestreo (solo lectura)
    getGruposMuestreo,
    getGrupoMuestreo,

    // Relaciones grupos-planes (solo lectura)
    getRelacionesGrupoPlanes,
    getPlanesAsignadosAGrupo,

    // Utilidades
    getRecomendacionMuestreo,
    getEstadisticasMuestreo
  }
}