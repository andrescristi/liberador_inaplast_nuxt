/**
 * Composable para manejo de API de Control de Calidad
 * 
 * Proporciona métodos reactivos para consultar planes de muestreo
 * y manejar estados de carga, errores y datos de respuesta.
 * 
 * @example
 * ```vue
 * <script setup>
 * const { consultarPlanMuestreo, loading, error, planMuestreo } = useCalidadAPI()
 * 
 * const tamanoLote = ref(500)
 * 
 * const obtenerPlan = async () => {
 *   await consultarPlanMuestreo(tamanoLote.value)
 *   if (!error.value) {
 *     // Debug: Plan obtenido
 *   }
 * }
 * </script>
 * ```
 */

export interface PlanMuestreoData {
  tamano_muestra: number
  numero_maximo_fallas: number
  tipo_inspeccion: string
  tamano_lote_desde: number
  tamano_lote_hasta: number
  nivel_inspeccion: string
  codigo_plan_muestreo: string
}

export interface CalidadAPIError {
  error: string
  code: string
}

export const useCalidadAPI = () => {
  // Estados reactivos
  const loading = ref(false)
  const error = ref<CalidadAPIError | null>(null)
  const planMuestreo = ref<PlanMuestreoData | null>(null)

  /**
   * Consultar plan de muestreo para un tamaño de lote específico
   * 
   * @param tamanoLote - Tamaño del lote a inspeccionar
   * @returns Promise que resuelve con los datos del plan o rechaza con error
   */
  const consultarPlanMuestreo = async (tamanoLote: number): Promise<PlanMuestreoData | null> => {
    if (!tamanoLote || tamanoLote <= 0) {
      error.value = {
        error: 'El tamaño del lote debe ser un número positivo',
        code: 'INVALID_INPUT'
      }
      return null
    }

    try {
      loading.value = true
      error.value = null
      planMuestreo.value = null

      const data = await $fetch<PlanMuestreoData>('/api/calidad/planes-muestreo', {
        method: 'GET',
        query: { tamano_lote: tamanoLote }
      })

      planMuestreo.value = data
      return data

    } catch (fetchError: unknown) {
      // Manejar diferentes tipos de errores
      if (fetchError && typeof fetchError === 'object' && 'statusCode' in fetchError && 'statusMessage' in fetchError) {
        const statusMessage = (fetchError as { statusMessage: string }).statusMessage
        try {
          // Intentar parsear mensaje de error como JSON
          const parsedError = JSON.parse(statusMessage)
          error.value = parsedError
        } catch {
          // Si no es JSON válido, usar el mensaje tal como está
          error.value = {
            error: statusMessage || 'Error al consultar plan de muestreo',
            code: 'API_ERROR'
          }
        }
      } else {
        // Error de red o conexión
        error.value = {
          error: 'Error de conexión al servidor',
          code: 'NETWORK_ERROR'
        }
      }

      // Error consultando plan de muestreo
      return null

    } finally {
      loading.value = false
    }
  }

  /**
   * Limpiar estados y errores
   */
  const limpiarEstado = () => {
    loading.value = false
    error.value = null
    planMuestreo.value = null
  }

  /**
   * Obtener mensaje de error amigable para el usuario
   */
  const getMensajeError = computed(() => {
    if (!error.value) return ''

    const errorMessages: Record<string, string> = {
      'MISSING_LOTE_SIZE': 'Debe proporcionar el tamaño del lote',
      'INVALID_LOTE_SIZE': 'El tamaño del lote debe ser un número positivo',
      'GRUPO_NOT_FOUND': 'No se encontró un grupo de muestreo para este tamaño de lote',
      'PLAN_NOT_FOUND': 'No se encontró un plan de muestreo con AQL 1.5 para este grupo',
      'INTERNAL_SERVER_ERROR': 'Error interno del servidor. Intente nuevamente',
      'NETWORK_ERROR': 'Error de conexión. Verifique su conexión a internet',
      'API_ERROR': 'Error al consultar la información. Intente nuevamente'
    }

    return errorMessages[error.value.code] || error.value.error
  })

  /**
   * Verificar si hay datos válidos
   */
  const tieneDatos = computed(() => {
    return planMuestreo.value !== null && !error.value
  })

  /**
   * Verificar si el estado está en reposo (sin carga ni error)
   */
  const estaInactivo = computed(() => {
    return !loading.value && !error.value && !planMuestreo.value
  })

  return {
    // Estados
    loading: readonly(loading),
    error: readonly(error),
    planMuestreo: readonly(planMuestreo),
    
    // Métodos
    consultarPlanMuestreo,
    limpiarEstado,
    
    // Computadas
    getMensajeError,
    tieneDatos,
    estaInactivo
  }
}