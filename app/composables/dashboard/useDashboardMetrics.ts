/**
 * Composable para manejar métricas del dashboard
 * Proporciona datos de métricas específicos por rol de usuario
 */

interface DashboardMetrics {
  pending: number
  completed: number
  rejected: number
  customers: number
}

interface MetricsResponse {
  success: boolean
  data: DashboardMetrics
  user_role: string
  timestamp: string
  error?: string
}

export function useDashboardMetrics() {
  const supabaseUser = useSupabaseUser()
  const supabaseClient = useSupabaseClient()
  
  // Estados reactivos
  const metrics = ref<DashboardMetrics>({
    pending: 0,
    completed: 0,
    rejected: 0,
    customers: 0
  })
  
  const loading = ref(false)
  const error = ref<string | null>(null)
  const lastUpdated = ref<string | null>(null)

  /**
   * Obtiene métricas del dashboard desde la API
   */
  const fetchMetrics = async (): Promise<void> => {
    if (!supabaseUser.value) {
      error.value = 'Usuario no autenticado'
      return
    }

    try {
      loading.value = true
      error.value = null

      // Obtener sesión actual
      const { data: { session } } = await supabaseClient.auth.getSession()
      const accessToken = session?.access_token

      if (!accessToken) {
        throw new Error('No se pudo obtener token de acceso')
      }

      // Llamar a la API con el token de autorización
      const response: MetricsResponse = await $fetch('/api/dashboard/metrics', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })

      if (response.success) {
        metrics.value = response.data
        lastUpdated.value = response.timestamp
      } else {
        throw new Error(response.error || 'Error al obtener métricas')
      }

    } catch (err) {
      console.error('Error fetching dashboard metrics:', err)
      error.value = err instanceof Error ? err.message : 'Error desconocido'
      
      // Fallback con datos vacíos
      metrics.value = {
        pending: 0,
        completed: 0,
        rejected: 0,
        customers: 0
      }
    } finally {
      loading.value = false
    }
  }

  /**
   * Refresca las métricas
   */
  const refresh = async (): Promise<void> => {
    await fetchMetrics()
  }

  /**
   * Computed para formatear métricas como array para mostrar en UI
   */
  const metricsArray = computed(() => [
    {
      key: 'pending',
      label: 'Pendientes',
      value: metrics.value.pending,
      color: 'bg-yellow-500',
      icon: 'bx:time-five',
      description: 'Inspecciones en espera'
    },
    {
      key: 'completed', 
      label: 'Completadas',
      value: metrics.value.completed,
      color: 'bg-green-500',
      icon: 'bx:check-circle',
      description: 'Inspecciones aprobadas'
    },
    {
      key: 'rejected',
      label: 'Rechazadas', 
      value: metrics.value.rejected,
      color: 'bg-red-500',
      icon: 'bx:x-circle',
      description: 'Inspecciones rechazadas'
    },
    {
      key: 'customers',
      label: 'Clientes',
      value: metrics.value.customers,
      color: 'bg-blue-500', 
      icon: 'bx:building',
      description: 'Clientes activos'
    }
  ])

  /**
   * Computed para determinar si hay datos disponibles
   */
  const hasData = computed(() => {
    return Object.values(metrics.value).some(value => value > 0)
  })

  /**
   * Computed para obtener el total de inspecciones
   */
  const totalInspections = computed(() => {
    return metrics.value.pending + metrics.value.completed + metrics.value.rejected
  })

  /**
   * Computed para calcular tasas de éxito
   */
  const successRate = computed(() => {
    const total = totalInspections.value
    if (total === 0) return 0
    return Math.round((metrics.value.completed / total) * 100)
  })

  return {
    // Estados
    metrics: readonly(metrics),
    loading: readonly(loading),
    error: readonly(error),
    lastUpdated: readonly(lastUpdated),
    
    // Métodos
    fetchMetrics,
    refresh,
    
    // Computed
    metricsArray,
    hasData,
    totalInspections,
    successRate
  }
}