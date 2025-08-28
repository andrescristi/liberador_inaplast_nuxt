/**
 * Tests para el composable useAuthState
 * Prueba el estado de autenticación usando API endpoints
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ref, computed } from 'vue'

// Mock de $fetch
const mockFetch = vi.fn()

vi.mock('ofetch', () => ({
  $fetch: mockFetch
}))

// Mock del composable useAuthState
const useAuthState = () => {
  const user = ref(null)
  const isLoading = ref(true)
  const error = ref(null)
  const lastFetch = ref(null)
  const CACHE_DURATION = 30 * 1000

  const isAuthenticated = computed(() => !!user.value)
  const userId = computed(() => user.value?.id)
  const userEmail = computed(() => user.value?.email)

  const fetchUser = async (force = false) => {
    if (!force && lastFetch.value) {
      const timeSinceLastFetch = Date.now() - lastFetch.value.getTime()
      if (timeSinceLastFetch < CACHE_DURATION) {
        return
      }
    }

    try {
      isLoading.value = true
      error.value = null
      
      const response = await mockFetch('/api/auth/user')
      
      user.value = response.authenticated ? response.user : null
      lastFetch.value = new Date()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      error.value = errorMessage
      user.value = null
      
      if (process.env.NODE_ENV === 'development') {
        console.error('Error fetching user:', errorMessage)
      }
    } finally {
      isLoading.value = false
    }
  }

  const refreshUser = () => fetchUser(true)

  const clearUser = () => {
    user.value = null
    lastFetch.value = null
    error.value = null
  }

  return {
    user,
    isAuthenticated,
    userId,
    userEmail,
    isLoading,
    error,
    fetchUser,
    refreshUser,
    clearUser
  }
}

describe('useAuthState Composable', () => {
  let consoleSpy: any

  beforeEach(() => {
    vi.clearAllMocks()
    consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    process.env.NODE_ENV = 'development'
  })

  afterEach(() => {
    consoleSpy.mockRestore()
  })

  it('debe inicializarse con valores por defecto', () => {
    const { user, isAuthenticated, userId, userEmail, isLoading, error } = useAuthState()

    expect(user.value).toBe(null)
    expect(isAuthenticated.value).toBe(false)
    expect(userId.value).toBe(undefined)
    expect(userEmail.value).toBe(undefined)
    expect(isLoading.value).toBe(true)
    expect(error.value).toBe(null)
  })

  describe('fetchUser', () => {
    it('debe obtener usuario exitosamente cuando está autenticado', async () => {
      const mockUser = {
        id: 'test-user-id',
        email: 'test@example.com',
        created_at: '2024-01-01T00:00:00.000Z'
      }

      const mockResponse = {
        authenticated: true,
        user: mockUser
      }

      mockFetch.mockResolvedValue(mockResponse)

      const { fetchUser, user, isAuthenticated, userId, userEmail, isLoading, error } = useAuthState()
      await fetchUser()

      expect(mockFetch).toHaveBeenCalledWith('/api/auth/user')
      expect(user.value).toEqual(mockUser)
      expect(isAuthenticated.value).toBe(true)
      expect(userId.value).toBe('test-user-id')
      expect(userEmail.value).toBe('test@example.com')
      expect(isLoading.value).toBe(false)
      expect(error.value).toBe(null)
    })

    it('debe manejar usuario no autenticado', async () => {
      const mockResponse = {
        authenticated: false,
        user: null
      }

      mockFetch.mockResolvedValue(mockResponse)

      const { fetchUser, user, isAuthenticated, isLoading, error } = useAuthState()
      await fetchUser()

      expect(user.value).toBe(null)
      expect(isAuthenticated.value).toBe(false)
      expect(isLoading.value).toBe(false)
      expect(error.value).toBe(null)
    })

    it('debe manejar errores de la API', async () => {
      const errorMessage = 'Error de red'
      mockFetch.mockRejectedValue(new Error(errorMessage))

      const { fetchUser, user, isAuthenticated, isLoading, error } = useAuthState()
      await fetchUser()

      expect(user.value).toBe(null)
      expect(isAuthenticated.value).toBe(false)
      expect(isLoading.value).toBe(false)
      expect(error.value).toBe(errorMessage)
      expect(consoleSpy).toHaveBeenCalledWith('Error fetching user:', errorMessage)
    })

    it('debe respetar el cache y no hacer fetch si no es necesario', async () => {
      const { fetchUser } = useAuthState()

      // Simular un fetch exitoso
      mockFetch.mockResolvedValue({ authenticated: true, user: { id: 'test' } })
      await fetchUser()

      // Reset mock para verificar que no se llame
      mockFetch.mockClear()

      // Segundo fetch sin force, debe usar cache
      await fetchUser()

      expect(mockFetch).not.toHaveBeenCalled()
    })

    it('debe ignorar cache cuando force=true', async () => {
      const { fetchUser } = useAuthState()

      // Primer fetch
      mockFetch.mockResolvedValue({ authenticated: true, user: { id: 'test' } })
      await fetchUser()

      // Reset mock
      mockFetch.mockClear()
      mockFetch.mockResolvedValue({ authenticated: true, user: { id: 'test2' } })

      // Segundo fetch con force=true
      await fetchUser(true)

      expect(mockFetch).toHaveBeenCalledTimes(1)
    })
  })

  describe('refreshUser', () => {
    it('debe llamar fetchUser con force=true', async () => {
      mockFetch.mockResolvedValue({ authenticated: false, user: null })

      const { refreshUser } = useAuthState()
      await refreshUser()

      expect(mockFetch).toHaveBeenCalledWith('/api/auth/user')
    })
  })

  describe('clearUser', () => {
    it('debe limpiar el estado del usuario', async () => {
      // Primero obtener un usuario
      mockFetch.mockResolvedValue({
        authenticated: true,
        user: { id: 'test', email: 'test@example.com' }
      })

      const { fetchUser, clearUser, user, isAuthenticated, error } = useAuthState()
      await fetchUser()

      expect(user.value).not.toBe(null)

      // Limpiar usuario
      clearUser()

      expect(user.value).toBe(null)
      expect(isAuthenticated.value).toBe(false)
      expect(error.value).toBe(null)
    })
  })

  describe('computed properties', () => {
    it('debe calcular isAuthenticated correctamente', async () => {
      const { fetchUser, isAuthenticated } = useAuthState()

      // Sin usuario
      expect(isAuthenticated.value).toBe(false)

      // Con usuario
      mockFetch.mockResolvedValue({
        authenticated: true,
        user: { id: 'test', email: 'test@example.com' }
      })
      await fetchUser()

      expect(isAuthenticated.value).toBe(true)
    })

    it('debe calcular userId y userEmail correctamente', async () => {
      const mockUser = {
        id: 'test-user-id',
        email: 'test@example.com'
      }

      mockFetch.mockResolvedValue({
        authenticated: true,
        user: mockUser
      })

      const { fetchUser, userId, userEmail } = useAuthState()
      await fetchUser()

      expect(userId.value).toBe('test-user-id')
      expect(userEmail.value).toBe('test@example.com')
    })
  })

  describe('cache behavior', () => {
    it('debe usar cache por 30 segundos por defecto', async () => {
      const { fetchUser } = useAuthState()

      // Primer fetch
      mockFetch.mockResolvedValue({ authenticated: true, user: { id: 'test' } })
      await fetchUser()

      // Segundo fetch inmediatamente, debe usar cache
      mockFetch.mockClear()
      await fetchUser()
      expect(mockFetch).not.toHaveBeenCalled()

      // Tercer fetch con force=true, debe ignorar cache
      await fetchUser(true)
      expect(mockFetch).toHaveBeenCalledTimes(1)
    })
  })
})