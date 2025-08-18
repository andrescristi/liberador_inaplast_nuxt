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
  PlanDeMuestreo, 
  GrupoMuestreo, 
  PlanMuestreoWithDetails,
  GrupoMuestreoWithDetails,
  CreatePlanMuestreoForm,
  UpdatePlanMuestreoForm,
  CreateGrupoMuestreoForm,
  UpdateGrupoMuestreoForm,
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

  /**
   * Crea un nuevo plan de muestreo
   */
  const createPlanMuestreo = async (form: CreatePlanMuestreoForm): Promise<PlanDeMuestreo> => {
    try {
      const { data, error } = await supabase
        .from('planes_de_muestreo')
        .insert(form as any)
        .select()
        .single()

      if (error) throw error

      toast.success('Éxito', 'Plan de muestreo creado correctamente')
      return data
    } catch (error) {
      toast.error('Error', 'No se pudo crear el plan de muestreo')
      throw error
    }
  }

  /**
   * Actualiza un plan de muestreo existente
   */
  const updatePlanMuestreo = async (
    codigo: string,
    aql: string,
    form: UpdatePlanMuestreoForm
  ): Promise<PlanDeMuestreo> => {
    try {
      const { data, error } = await supabase
        .from('planes_de_muestreo')
        .update(form)
        .eq('codigo', codigo)
        .eq('aql', aql)
        .select()
        .single()

      if (error) throw error

      toast.success('Éxito', 'Plan de muestreo actualizado correctamente')
      return data
    } catch (error) {
      toast.error('Error', 'No se pudo actualizar el plan de muestreo')
      throw error
    }
  }

  /**
   * Elimina un plan de muestreo
   */
  const deletePlanMuestreo = async (codigo: string, aql: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('planes_de_muestreo')
        .delete()
        .eq('codigo', codigo)
        .eq('aql', aql)

      if (error) throw error

      toast.success('Éxito', 'Plan de muestreo eliminado correctamente')
    } catch (error) {
      toast.error('Error', 'No se pudo eliminar el plan de muestreo')
      throw error
    }
  }

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

  /**
   * Crea un nuevo grupo de muestreo
   */
  const createGrupoMuestreo = async (form: CreateGrupoMuestreoForm): Promise<GrupoMuestreo> => {
    try {
      const { data, error } = await supabase
        .from('grupos_muestreo')
        .insert(form)
        .select()
        .single()

      if (error) throw error

      toast.success('Éxito', 'Grupo de muestreo creado correctamente')
      return data
    } catch (error) {
      toast.error('Error', 'No se pudo crear el grupo de muestreo')
      throw error
    }
  }

  /**
   * Actualiza un grupo de muestreo existente
   */
  const updateGrupoMuestreo = async (
    tamanoLoteDesde: number,
    nivelInspeccion: string,
    form: UpdateGrupoMuestreoForm
  ): Promise<GrupoMuestreo> => {
    try {
      const { data, error } = await supabase
        .from('grupos_muestreo')
        .update(form)
        .eq('tamano_lote_desde', tamanoLoteDesde)
        .eq('nivel_inspeccion', nivelInspeccion)
        .select()
        .single()

      if (error) throw error

      toast.success('Éxito', 'Grupo de muestreo actualizado correctamente')
      return data
    } catch (error) {
      toast.error('Error', 'No se pudo actualizar el grupo de muestreo')
      throw error
    }
  }

  /**
   * Elimina un grupo de muestreo
   */
  const deleteGrupoMuestreo = async (
    tamanoLoteDesde: number,
    nivelInspeccion: string
  ): Promise<void> => {
    try {
      const { error } = await supabase
        .from('grupos_muestreo')
        .delete()
        .eq('tamano_lote_desde', tamanoLoteDesde)
        .eq('nivel_inspeccion', nivelInspeccion)

      if (error) throw error

      toast.success('Éxito', 'Grupo de muestreo eliminado correctamente')
    } catch (error) {
      toast.error('Error', 'No se pudo eliminar el grupo de muestreo')
      throw error
    }
  }

  // ============================================================================
  // RECOMENDACIONES Y UTILIDADES
  // ============================================================================

  /**
   * Obtiene recomendación de muestreo para un tamaño de lote específico
   */
  const getRecomendacionMuestreo = async (
    tamanoLote: number,
    nivelInspeccion: string = 'I',
    aqlDeseado?: string
  ): Promise<RecomendacionMuestreo | null> => {
    try {
      // Buscar el grupo de muestreo apropiado
      const { data: grupos, error: gruposError } = await supabase
        .from('grupos_muestreo')
        .select(`
          *,
          grupos_planes(
            *,
            planes_de_muestreo(*)
          )
        `)
        .eq('nivel_inspeccion', nivelInspeccion)
        .lte('tamano_lote_desde', tamanoLote)
        .or(`tamano_lote_hasta.gte.${tamanoLote},tamano_lote_hasta.is.null`)
        .order('tamano_lote_desde', { ascending: false })
        .limit(1)

      if (gruposError) throw gruposError

      if (!grupos || grupos.length === 0) {
        return null
      }

      const grupo = grupos[0]
      
      // Si hay un plan directo recomendado, usarlo
      if (grupo.codigo_plan_muestreo && !aqlDeseado) {
        const { data: planDirecto, error: planError } = await supabase
          .from('planes_de_muestreo')
          .select('*')
          .eq('codigo', grupo.codigo_plan_muestreo)
          .limit(1)
          .single()

        if (!planError && planDirecto) {
          return {
            grupo,
            plan: planDirecto,
            justificacion: `Plan recomendado directamente para lotes de ${grupo.tamano_lote_desde} a ${grupo.tamano_lote_hasta || '∞'} unidades con nivel de inspección ${nivelInspeccion}`
          }
        }
      }

      // Buscar en las relaciones grupo-planes
      const planesDisponibles = grupo.grupos_planes
        ?.map(gp => gp.planes_de_muestreo)
        .filter(Boolean) || []

      if (planesDisponibles.length === 0) {
        return {
          grupo,
          plan: { codigo: 'N/A', aql: 'N/A', tamano_muestra: 0, numero_maximo_fallas: 0 },
          justificacion: 'No hay planes de muestreo definidos para este rango de lote'
        }
      }

      // Si se especifica AQL, buscar el plan con ese AQL
      if (aqlDeseado) {
        const planAQL = planesDisponibles.find(p => p.aql === aqlDeseado)
        if (planAQL) {
          return {
            grupo,
            plan: planAQL,
            justificacion: `Plan seleccionado para AQL ${aqlDeseado} con nivel de inspección ${nivelInspeccion}`
          }
        }
      }

      // Usar el primer plan disponible
      return {
        grupo,
        plan: planesDisponibles[0],
        justificacion: `Plan sugerido para lotes de ${grupo.tamano_lote_desde} a ${grupo.tamano_lote_hasta || '∞'} unidades`
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

      // Contar planes por AQL
      const planesPorAQLCount: { [aql: string]: number } = {}
      planesPorAQL?.forEach(p => {
        planesPorAQLCount[p.aql] = (planesPorAQLCount[p.aql] || 0) + 1
      })

      // Contar grupos por nivel
      const gruposPorNivelCount: { [nivel: string]: number } = {}
      gruposPorNivel?.forEach(g => {
        gruposPorNivelCount[g.nivel_inspeccion] = (gruposPorNivelCount[g.nivel_inspeccion] || 0) + 1
      })

      // Tipos únicos de inspección
      const tiposUnicos = [...new Set(tiposInspeccion?.map(t => t.tipo_de_inspeccion).filter(Boolean))]

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
          plan_info:planes_de_muestreo(*)
        `)
        .eq('grupo_tamano_lote_desde', tamanoLoteDesde)
        .eq('grupo_nivel_inspeccion', nivelInspeccion)

      if (error) throw error
      return data || []
    } catch (error) {
      toast.error('Error', 'No se pudieron cargar las relaciones del grupo')
      throw error
    }
  }

  /**
   * Asigna un plan a un grupo específico
   */
  const asignarPlanAGrupo = async (
    tamanoLoteDesde: number,
    nivelInspeccion: string,
    codigoPlan: string
  ) => {
    try {
      const { error } = await supabase
        .from('grupos_planes')
        .insert({
          grupo_tamano_lote_desde: tamanoLoteDesde,
          grupo_nivel_inspeccion: nivelInspeccion,
          codigo_plan: codigoPlan,
          fecha_asignacion: new Date().toISOString()
        })

      if (error) throw error
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al asignar el plan al grupo'
      
      if (errorMessage.includes('duplicate') || errorMessage.includes('already exists')) {
        throw new Error('Este plan ya está asignado a este grupo')
      }
      
      throw new Error(errorMessage)
    }
  }

  /**
   * Desasigna un plan de un grupo específico
   */
  const desasignarPlanDeGrupo = async (
    tamanoLoteDesde: number,
    nivelInspeccion: string,
    codigoPlan: string
  ) => {
    try {
      const { error } = await supabase
        .from('grupos_planes')
        .delete()
        .eq('grupo_tamano_lote_desde', tamanoLoteDesde)
        .eq('grupo_nivel_inspeccion', nivelInspeccion)
        .eq('codigo_plan', codigoPlan)

      if (error) throw error
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al desasignar el plan del grupo'
      throw new Error(errorMessage)
    }
  }

  /**
   * Obtiene todos los planes asignados a un grupo
   */
  const getPlanesAsignadosAGrupo = async (
    tamanoLoteDesde: number,
    nivelInspeccion: string
  ): Promise<PlanDeMuestreo[]> => {
    try {
      const { data, error } = await supabase
        .from('grupos_planes')
        .select(`
          planes_de_muestreo(*)
        `)
        .eq('grupo_tamano_lote_desde', tamanoLoteDesde)
        .eq('grupo_nivel_inspeccion', nivelInspeccion)

      if (error) throw error
      
      return data?.map(item => item.planes_de_muestreo).filter(Boolean) || []
    } catch (error) {
      toast.error('Error', 'No se pudieron cargar los planes asignados al grupo')
      throw error
    }
  }

  return {
    // Planes de muestreo
    getPlanesMuestreo,
    getPlanMuestreo,
    createPlanMuestreo,
    updatePlanMuestreo,
    deletePlanMuestreo,

    // Grupos de muestreo
    getGruposMuestreo,
    getGrupoMuestreo,
    createGrupoMuestreo,
    updateGrupoMuestreo,
    deleteGrupoMuestreo,

    // Relaciones grupos-planes
    getRelacionesGrupoPlanes,
    asignarPlanAGrupo,
    desasignarPlanDeGrupo,
    getPlanesAsignadosAGrupo,

    // Utilidades
    getRecomendacionMuestreo,
    getEstadisticasMuestreo
  }
}