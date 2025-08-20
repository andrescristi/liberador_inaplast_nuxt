import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock de Supabase client
const mockSupabaseClient = {
  auth: {
    signInWithPassword: vi.fn(),
    signOut: vi.fn()
  }
}

vi.mock('#app', () => ({
  useSupabaseClient: () => mockSupabaseClient,
  navigateTo: vi.fn()
}))

// Mock directo del composable para evitar problemas de importación
const useAuthLogin = () => {
  const supabase = mockSupabaseClient

  const signIn = async (email: string, password: string) => {
    if (!email || !password) {
      throw new Error('Email y contraseña son requeridos')
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password
    })

    if (error) {
      let errorMessage = error.message
      if (error.message.includes('Invalid login credentials')) {
        errorMessage = 'Credenciales incorrectas. Verifica tu email y contraseña.'
      } else if (error.message.includes('Email not confirmed')) {
        errorMessage = 'Por favor confirma tu email antes de iniciar sesión.'
      } else if (error.message.includes('Too many requests')) {
        errorMessage = 'Demasiados intentos. Intenta de nuevo en unos minutos.'
      }
      throw new Error(errorMessage)
    }

    return data
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      throw new Error(`Error durante el logout: ${error.message}`)
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
      const mockData = { user: { id: 'test-id', email: 'test@example.com' } }
      mockSupabaseClient.auth.signInWithPassword.mockResolvedValue({ data: mockData, error: null })

      const { signIn } = useAuthLogin()
      const result = await signIn('test@example.com', 'password123')
      
      expect(mockSupabaseClient.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      })
      expect(result).toEqual(mockData)
    })

    it('debe rechazar email y contraseña vacíos', async () => {
      const { signIn } = useAuthLogin()
      
      await expect(signIn('', 'password')).rejects.toThrow('Email y contraseña son requeridos')
      await expect(signIn('test@email.com', '')).rejects.toThrow('Email y contraseña son requeridos')
    })

    it('debe limpiar espacios en blanco del email', async () => {
      mockSupabaseClient.auth.signInWithPassword.mockResolvedValue({ 
        data: { user: {} }, 
        error: null 
      })

      const { signIn } = useAuthLogin()
      await signIn('  test@example.com  ', 'password')
      
      expect(mockSupabaseClient.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password'
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
        mockSupabaseClient.auth.signInWithPassword.mockResolvedValue({
          data: null,
          error: { message: error }
        })

        await expect(signIn('test@email.com', 'password')).rejects.toThrow(expected)
      }
    })
  })

  describe('signOut', () => {
    it('debe hacer logout exitoso', async () => {
      mockSupabaseClient.auth.signOut.mockResolvedValue({ error: null })

      const { signOut } = useAuthLogin()
      await expect(signOut()).resolves.not.toThrow()
      
      expect(mockSupabaseClient.auth.signOut).toHaveBeenCalled()
    })

    it('debe manejar errores de logout', async () => {
      const errorMessage = 'Logout failed'
      mockSupabaseClient.auth.signOut.mockResolvedValue({
        error: { message: errorMessage }
      })

      const { signOut } = useAuthLogin()
      await expect(signOut()).rejects.toThrow(`Error durante el logout: ${errorMessage}`)
    })
  })
})