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
  // Estados reactivos
  const user = ref<AuthUser | null>(null)
  const isLoading = ref(true)
  const error = ref<string | null>(null)
  
  // Cache para evitar requests innecesarios
  const lastFetch = ref<Date | null>(null)
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
   */
  const fetchUser = async (force = false): Promise<void> => {
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
      
      const response = await $fetch<AuthUserResponse>('/api/auth/user')
      
      user.value = response.authenticated ? response.user : null
      lastFetch.value = new Date()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      error.value = errorMessage
      user.value = null
      
      // Log del error en desarrollo
      if (process.env.NODE_ENV === 'development') {
        console.error('Error fetching user:', errorMessage)
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