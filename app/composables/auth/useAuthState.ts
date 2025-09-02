/**
 * Estado de usuario desde API personalizada
 */
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
 * Maneja estados reactivos usando endpoints API personalizados
 * Reemplaza useSupabaseUser() para evitar conexión directa
 */
export const useAuthState = () => {
  // Estados reactivos usando useState para SSR compatibility
  const user = useState<AuthUser | null>('auth.user', () => null)
  const isLoading = useState<boolean>('auth.isLoading', () => true)
  const error = useState<string | null>('auth.error', () => null)
  
  // Cache para evitar requests innecesarios
  const lastFetch = useState<Date | null>('auth.lastFetch', () => null)
  const CACHE_DURATION = 30 * 1000 // 30 seconds

  /**
   * Estado reactivo de autenticación
   */
  const isAuthenticated = computed(() => !!user.value)

  /**
   * ID del usuario actual
   */
  const userId = computed(() => user.value?.id)

  /**
   * Email del usuario actual
   */
  const userEmail = computed(() => user.value?.email)

  /**
   * Obtiene el usuario actual desde la API
   * Con soporte mejorado para dispositivos móviles
   */
  const fetchUser = async (force = false, retryCount = 0): Promise<void> => {
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
      
      const response = await $fetch<AuthUserResponse>('/api/auth/user', {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
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

  // Auto-fetch en el mount si es necesario
  onMounted(() => {
    if (!user.value && !lastFetch.value) {
      fetchUser()
    }
  })

  return {
    // Estados
    user: readonly(user),
    isAuthenticated: readonly(isAuthenticated),
    userId: readonly(userId),
    userEmail: readonly(userEmail),
    isLoading: readonly(isLoading),
    error: readonly(error),
    
    // Acciones
    fetchUser,
    refreshUser,
    clearUser
  }
}