/**
 * Estado de usuario desde API personalizada con soporte para tokens
 */
import { useAuthToken } from './useAuthToken'
interface AuthUser {
  id: string
  email?: string
  email_confirmed_at?: string
  created_at?: string
  updated_at?: string
  last_sign_in_at?: string
}

interface AuthUserResponse {
  user: AuthUser | null
  authenticated: boolean
}

/**
 * Composable especializado para estado de autenticación
 * Maneja estados reactivos de manera más robusta para SSR
 */
export const useAuthState = () => {
  const { getAuthHeaders, hasValidToken } = useAuthToken()
  
  // Use simpler refs that are more predictable in SSR/client transitions
  const user = ref<AuthUser | null>(null)
  const isLoading = ref<boolean>(false) // Start with false to avoid loading states during SSR
  const error = ref<string | null>(null)
  
  // Cache para evitar requests innecesarios
  const lastFetch = ref<Date | null>(null)
  const CACHE_DURATION = 30 * 1000 // 30 seconds

  /**
   * Estado reactivo de autenticación
   */
  const isAuthenticated = computed(() => {
    // Ensure this computation is safe during SSR
    if (import.meta.server) return false
    return !!user.value
  })

  /**
   * ID del usuario actual
   */
  const userId = computed(() => {
    if (import.meta.server) return undefined
    return user.value?.id
  })

  /**
   * Email del usuario actual
   */
  const userEmail = computed(() => {
    if (import.meta.server) return undefined
    return user.value?.email
  })

  /**
   * Obtiene el usuario actual desde la API
   * Con manejo robusto de SSR y errores
   */
  const fetchUser = async (force = false, retryCount = 0): Promise<void> => {
    // Don't run during SSR to avoid initialization issues
    if (import.meta.server) {
      return
    }

    const MAX_RETRIES = 2
    
    // Verificar cache si no es forzado
    if (!force && lastFetch.value) {
      const timeSinceLastFetch = Date.now() - lastFetch.value.getTime()
      if (timeSinceLastFetch < CACHE_DURATION) {
        return
      }
    }

    try {
      isLoading.value = true
      error.value = null
      
      // Wait for client to be ready
      if (typeof window === 'undefined') {
        return
      }

      const response = await $fetch<AuthUserResponse>('/api/auth/user', {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          ...getAuthHeaders() // Incluir headers de autorización
        }
      })
      
      user.value = response.authenticated ? response.user : null
      lastFetch.value = new Date()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      error.value = errorMessage
      user.value = null
      
      // Reintentar para dispositivos móviles en caso de error de sesión
      if (retryCount < MAX_RETRIES && errorMessage.includes('Auth session missing')) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)))
        return fetchUser(true, retryCount + 1)
      }
      
      // Log del error en desarrollo
      if (process.env.NODE_ENV === 'development') {
        console.error('Error fetching user:', errorMessage, 'Retry count:', retryCount)
      }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Refresca el estado del usuario
   */
  const refreshUser = () => fetchUser(true)

  /**
   * Limpia el estado del usuario (usado en logout)
   */
  const clearUser = () => {
    user.value = null
    lastFetch.value = null
    error.value = null
  }

  // Auto-fetch en el mount si es necesario, pero solo en el cliente
  if (import.meta.client) {
    onMounted(() => {
      // Give some time for the app to stabilize
      nextTick(() => {
        if (!user.value && !lastFetch.value) {
          fetchUser()
        }
      })
    })
  }

  return {
    // Estados - no usar readonly para evitar problemas de inicialización
    user,
    isAuthenticated,
    userId,
    userEmail,
    isLoading,
    error,
    
    // Acciones
    fetchUser,
    refreshUser,
    clearUser
  }
}