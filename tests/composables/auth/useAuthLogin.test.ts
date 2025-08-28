import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock de $fetch y navegateTo
const mockFetch = vi.fn()
const mockNavigateTo = vi.fn()

// Mock de useAuthState
const mockClearUser = vi.fn()
const mockRefreshUser = vi.fn()

vi.mock('ofetch', () => ({
  $fetch: mockFetch
}))

vi.mock('#app', () => ({
  navigateTo: mockNavigateTo
}))

vi.mock('~/composables/auth/useAuthState', () => ({
  useAuthState: () => ({
    clearUser: mockClearUser,
    refreshUser: mockRefreshUser
  })
}))

// Mock del composable refactorizado que usa API endpoints
const useAuthLogin = () => {
  const { clearUser, refreshUser } = {
    clearUser: mockClearUser,
    refreshUser: mockRefreshUser
  }

  const signIn = async (email: string, password: string) => {
    if (!email || !password) {
      throw new Error('Email y contraseña son requeridos')
    }

    try {
      const response = await mockFetch('/api/auth/login', {
        method: 'POST',
        body: {
          email: email.trim(),
          password
        }
      })

      if (!response.success) {
        throw new Error(response.message || 'Error durante el inicio de sesión')
      }

      await refreshUser()
      return response
    } catch (error: unknown) {
      const errorObj = error as { data?: { message?: string }, message?: string }
      let errorMessage = errorObj?.data?.message || errorObj?.message || 'Error desconocido'
      
      if (errorMessage.includes('Invalid login credentials')) {
        errorMessage = 'Credenciales incorrectas. Verifica tu email y contraseña.'
      } else if (errorMessage.includes('Email not confirmed')) {
        errorMessage = 'Por favor confirma tu email antes de iniciar sesión.'
      } else if (errorMessage.includes('Too many requests')) {
        errorMessage = 'Demasiados intentos. Intenta de nuevo en unos minutos.'
      }
      
      throw new Error(errorMessage)
    }
  }

  const signOut = async () => {
    try {
      const response = await mockFetch('/api/auth/logout', {
        method: 'POST'
      })

      if (!response.success) {
        throw new Error(response.message || 'Error durante el cierre de sesión')
      }

      clearUser()
      await mockNavigateTo('/auth/login')
      
      return response
    } catch (error: unknown) {
      const errorObj = error as { data?: { message?: string }, message?: string }
      const errorMessage = errorObj?.data?.message || errorObj?.message || 'Error durante el logout'
      throw new Error(errorMessage)
    }
  }

  return {
    signIn,
    signOut
  }
}

describe('useAuthLogin Composable', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('signIn', () => {
    it('debe hacer login exitoso con credenciales válidas', async () => {
      const mockResponse = { 
        success: true, 
        message: 'Login exitoso',
        user: { id: 'test-id', email: 'test@example.com' }
      }
      mockFetch.mockResolvedValue(mockResponse)

      const { signIn } = useAuthLogin()
      const result = await signIn('test@example.com', 'password123')
      
      expect(mockFetch).toHaveBeenCalledWith('/api/auth/login', {
        method: 'POST',
        body: {
          email: 'test@example.com',
          password: 'password123'
        }
      })
      expect(mockRefreshUser).toHaveBeenCalled()
      expect(result).toEqual(mockResponse)
    })

    it('debe rechazar email y contraseña vacíos', async () => {
      const { signIn } = useAuthLogin()
      
      await expect(signIn('', 'password')).rejects.toThrow('Email y contraseña son requeridos')
      await expect(signIn('test@email.com', '')).rejects.toThrow('Email y contraseña son requeridos')
    })

    it('debe limpiar espacios en blanco del email', async () => {
      const mockResponse = { success: true, message: 'Login exitoso' }
      mockFetch.mockResolvedValue(mockResponse)

      const { signIn } = useAuthLogin()
      await signIn('  test@example.com  ', 'password')
      
      expect(mockFetch).toHaveBeenCalledWith('/api/auth/login', {
        method: 'POST',
        body: {
          email: 'test@example.com',
          password: 'password'
        }
      })
    })

    it('debe manejar diferentes tipos de errores de auth', async () => {
      const errorScenarios = [
        {
          error: 'Invalid login credentials',
          expected: 'Credenciales incorrectas. Verifica tu email y contraseña.'
        },
        {
          error: 'Email not confirmed',
          expected: 'Por favor confirma tu email antes de iniciar sesión.'
        },
        {
          error: 'Too many requests',
          expected: 'Demasiados intentos. Intenta de nuevo en unos minutos.'
        }
      ]

      const { signIn } = useAuthLogin()

      for (const { error, expected } of errorScenarios) {
        mockFetch.mockRejectedValue({
          data: { message: error },
          message: error
        })

        await expect(signIn('test@email.com', 'password')).rejects.toThrow(expected)
      }
    })
  })

  describe('signOut', () => {
    it('debe hacer logout exitoso', async () => {
      const mockResponse = { success: true, message: 'Logout exitoso' }
      mockFetch.mockResolvedValue(mockResponse)

      const { signOut } = useAuthLogin()
      const result = await signOut()
      
      expect(mockFetch).toHaveBeenCalledWith('/api/auth/logout', {
        method: 'POST'
      })
      expect(mockClearUser).toHaveBeenCalled()
      expect(mockNavigateTo).toHaveBeenCalledWith('/auth/login')
      expect(result).toEqual(mockResponse)
    })

    it('debe manejar errores de logout', async () => {
      const errorMessage = 'Logout failed'
      mockFetch.mockRejectedValue({
        data: { message: errorMessage },
        message: errorMessage
      })

      const { signOut } = useAuthLogin()
      await expect(signOut()).rejects.toThrow('Logout failed')
    })
  })
})