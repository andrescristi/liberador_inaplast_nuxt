import { defineStore } from 'pinia'

/**
 * Store de Pinia para el sistema de autenticación híbrido
 * 
 * Centraliza el estado de autenticación global de la aplicación
 * utilizando el sistema híbrido JWT + Session
 */

interface HybridAuthUser {
  id: string
  email: string
  role: string
  first_name?: string
  last_name?: string
  full_name?: string
}

interface AuthState {
  user: HybridAuthUser | null
  isLoading: boolean
  error: string | null
  isInitialized: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    isLoading: false,
    error: null,
    isInitialized: false
  }),

  getters: {
    /**
     * Indica si el usuario está autenticado
     */
    isAuthenticated: (state): boolean => !!state.user,

    /**
     * Rol del usuario actual
     */
    userRole: (state): string | null => state.user?.role || null,

    /**
     * Verifica si el usuario es Admin
     */
    isAdmin: (state): boolean => state.user?.role === 'Admin',

    /**
     * Verifica si el usuario es Supervisor
     */
    isSupervisor: (state): boolean => state.user?.role === 'Supervisor',

    /**
     * Verifica si el usuario es Inspector
     */
    isInspector: (state): boolean => state.user?.role === 'Inspector',

    /**
     * Nombre completo del usuario
     */
    fullName: (state): string => {
      if (!state.user) return ''
      return state.user.full_name || `${state.user.first_name || ''} ${state.user.last_name || ''}`.trim()
    },

    /**
     * Iniciales del usuario para avatars
     */
    userInitials: (state): string => {
      if (!state.user) return ''
      const firstName = state.user.first_name || ''
      const lastName = state.user.last_name || ''
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
    }
  },

  actions: {
    /**
     * Actualiza el estado del usuario
     */
    setUser(user: HybridAuthUser | null) {
      this.user = user
      this.error = null
    },

    /**
     * Establece el estado de carga
     */
    setLoading(loading: boolean) {
      this.isLoading = loading
    },

    /**
     * Establece un error de autenticación
     */
    setError(error: string | null) {
      this.error = error
    },

    /**
     * Marca el store como inicializado
     */
    setInitialized(initialized: boolean) {
      this.isInitialized = initialized
    },

    /**
     * Realizar login usando el composable híbrido
     */
    async login(email: string, password: string): Promise<HybridAuthUser> {
      this.setLoading(true)
      this.setError(null)

      try {
        const { useHybridAuth } = await import('~/composables/auth/useHybridAuth')
        const { login } = useHybridAuth()
        
        const user = await login(email, password)
        this.setUser(user)
        
        return user
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error en el login'
        this.setError(errorMessage)
        throw error
      } finally {
        this.setLoading(false)
      }
    },

    /**
     * Realizar logout usando el composable híbrido
     */
    async logout(): Promise<void> {
      this.setLoading(true)

      try {
        const { useHybridAuth } = await import('~/composables/auth/useHybridAuth')
        const { logout } = useHybridAuth()
        
        await logout()
        this.setUser(null)
        this.setError(null)
        
      } catch (error) {
        console.error('Error durante logout en store:', error)
        // Limpiar estado de todas formas
        this.setUser(null)
      } finally {
        this.setLoading(false)
      }
    },

    /**
     * Verificar estado de autenticación
     */
    async checkAuth(): Promise<boolean> {
      if (import.meta.server) return false

      // Si ya está inicializado y tenemos usuario, no verificar nuevamente
      if (this.isInitialized && this.user) {
        return true
      }

      this.setLoading(true)

      try {
        const { useHybridAuth } = await import('~/composables/auth/useHybridAuth')
        const { checkAuth } = useHybridAuth()
        
        const isAuthenticated = await checkAuth()
        
        if (!isAuthenticated) {
          this.setUser(null)
        }

        this.setInitialized(true)
        return isAuthenticated
        
      } catch (error) {
        console.error('Error verificando autenticación:', error)
        this.setUser(null)
        this.setInitialized(true)
        return false
      } finally {
        this.setLoading(false)
      }
    },

    /**
     * Refrescar la sesión
     */
    async refresh(): Promise<boolean> {
      try {
        const { useHybridAuth } = await import('~/composables/auth/useHybridAuth')
        const { refresh } = useHybridAuth()
        
        const user = await refresh()
        this.setUser(user)
        return true
        
      } catch (error) {
        console.error('Error refrescando sesión:', error)
        // Si falla el refresh, limpiar estado
        this.setUser(null)
        return false
      }
    },

    /**
     * Inicializar el store de autenticación
     */
    async initialize(): Promise<void> {
      if (import.meta.server) return

      await this.checkAuth()
    },

    /**
     * Limpiar el estado del store
     */
    clear() {
      this.user = null
      this.error = null
      this.isLoading = false
      this.isInitialized = false
    }
  }
})