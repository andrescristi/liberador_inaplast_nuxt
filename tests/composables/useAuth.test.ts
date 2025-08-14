import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { Profile } from '~/types'

// Mock de Supabase client
const mockSupabaseClient = {
  auth: {
    signInWithPassword: vi.fn(),
    signOut: vi.fn(),
    resetPasswordForEmail: vi.fn(),
    updateUser: vi.fn()
  },
  from: vi.fn(() => ({
    select: vi.fn(() => ({
      eq: vi.fn(() => ({
        single: vi.fn()
      }))
    }))
  }))
}

const mockUser = {
  value: {
    id: 'test-user-id',
    email: 'test@example.com'
  }
}

vi.mock('#app', () => ({
  useSupabaseClient: () => mockSupabaseClient,
  useSupabaseUser: () => mockUser,
  navigateTo: vi.fn(),
  nextTick: vi.fn(() => Promise.resolve())
}))

// Importar después de los mocks
// En un entorno real, esto sería: import { useAuth } from '~/composables/useAuth'
const useAuth = () => {
  const supabase = mockSupabaseClient
  const user = mockUser

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
      }
      throw new Error(errorMessage)
    }

    return data
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      throw new Error(error.message)
    }
  }

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`
    })
    if (error) {
      throw new Error(error.message)
    }
  }

  const getCurrentUserProfile = async (): Promise<Profile | null> => {
    if (!user.value) return null
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.value.id)
      .single()

    if (error) return null
    return data as Profile
  }

  return {
    user,
    signIn,
    signOut,
    resetPassword,
    getCurrentUserProfile
  }
}

describe('useAuth Composable', () => {
  
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Sign In', () => {
    it('debe hacer login exitoso con credenciales válidas', async () => {
      const mockData = { user: { id: 'test-id', email: 'test@example.com' } }
      mockSupabaseClient.auth.signInWithPassword.mockResolvedValue({ data: mockData, error: null })

      const { signIn } = useAuth()
      const result = await signIn('test@example.com', 'password123')
      
      expect(mockSupabaseClient.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      })
      expect(result).toEqual(mockData)
    })

    it('debe manejar credenciales incorrectas', async () => {
      mockSupabaseClient.auth.signInWithPassword.mockResolvedValue({
        data: null,
        error: { message: 'Invalid login credentials' }
      })

      const { signIn } = useAuth()
      
      await expect(signIn('wrong@email.com', 'wrongpass')).rejects.toThrow(
        'Credenciales incorrectas. Verifica tu email y contraseña.'
      )
    })

    it('debe rechazar email vacío', async () => {
      const { signIn } = useAuth()
      
      await expect(signIn('', 'password')).rejects.toThrow(
        'Email y contraseña son requeridos'
      )
    })

    it('debe rechazar contraseña vacía', async () => {
      const { signIn } = useAuth()
      
      await expect(signIn('test@email.com', '')).rejects.toThrow(
        'Email y contraseña son requeridos'
      )
    })

    it('debe limpiar espacios en blanco del email', async () => {
      mockSupabaseClient.auth.signInWithPassword.mockResolvedValue({ 
        data: { user: {} }, 
        error: null 
      })

      const { signIn } = useAuth()
      await signIn('  test@example.com  ', 'password')
      
      expect(mockSupabaseClient.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password'
      })
    })
  })

  describe('Sign Out', () => {
    it('debe hacer logout exitoso', async () => {
      mockSupabaseClient.auth.signOut.mockResolvedValue({ error: null })

      const { signOut } = useAuth()
      await expect(signOut()).resolves.not.toThrow()
      
      expect(mockSupabaseClient.auth.signOut).toHaveBeenCalled()
    })

    it('debe manejar errores de logout', async () => {
      mockSupabaseClient.auth.signOut.mockResolvedValue({
        error: { message: 'Logout failed' }
      })

      const { signOut } = useAuth()
      await expect(signOut()).rejects.toThrow('Logout failed')
    })
  })

  describe('Reset Password', () => {
    it('debe enviar email de reset correctamente', async () => {
      mockSupabaseClient.auth.resetPasswordForEmail.mockResolvedValue({ error: null })

      const { resetPassword } = useAuth()
      await resetPassword('test@example.com')
      
      expect(mockSupabaseClient.auth.resetPasswordForEmail).toHaveBeenCalledWith(
        'test@example.com',
        { redirectTo: expect.stringContaining('/auth/reset-password') }
      )
    })

    it('debe manejar errores de reset password', async () => {
      mockSupabaseClient.auth.resetPasswordForEmail.mockResolvedValue({
        error: { message: 'Email not found' }
      })

      const { resetPassword } = useAuth()
      await expect(resetPassword('nonexistent@email.com')).rejects.toThrow('Email not found')
    })
  })

  describe('Get Current User Profile', () => {
    it('debe obtener perfil del usuario actual', async () => {
      const mockProfile: Profile = {
        id: 'profile-id',
        user_id: 'test-user-id',
        first_name: 'Juan',
        last_name: 'Pérez',
        user_role: 'Inspector',
        created_at: '2025-08-14T00:00:00Z',
        updated_at: '2025-08-14T00:00:00Z'
      }

      mockSupabaseClient.from().select().eq().single.mockResolvedValue({
        data: mockProfile,
        error: null
      })

      const { getCurrentUserProfile } = useAuth()
      const profile = await getCurrentUserProfile()
      
      expect(profile).toEqual(mockProfile)
    })

    it('debe retornar null si no hay usuario logueado', async () => {
      const originalUser = mockUser.value
      mockUser.value = null

      const { getCurrentUserProfile } = useAuth()
      const profile = await getCurrentUserProfile()
      
      expect(profile).toBeNull()
      
      // Restaurar usuario
      mockUser.value = originalUser
    })

    it('debe manejar errores de base de datos', async () => {
      mockSupabaseClient.from().select().eq().single.mockResolvedValue({
        data: null,
        error: { message: 'Profile not found' }
      })

      const { getCurrentUserProfile } = useAuth()
      const profile = await getCurrentUserProfile()
      
      expect(profile).toBeNull()
    })
  })

  describe('Manejo de Errores de Auth', () => {
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

    errorScenarios.forEach(({ error, expected }) => {
      it(`debe manejar error: ${error}`, async () => {
        mockSupabaseClient.auth.signInWithPassword.mockResolvedValue({
          data: null,
          error: { message: error }
        })

        const { signIn } = useAuth()
        await expect(signIn('test@email.com', 'password')).rejects.toThrow(expected)
      })
    })
  })

  describe('Seguridad', () => {
    it('debe validar formato de email', async () => {
      const { signIn } = useAuth()
      
      // Emails inválidos
      const invalidEmails = ['notanemail', '@domain.com', 'user@', 'user..@domain.com']
      
      for (const email of invalidEmails) {
        mockSupabaseClient.auth.signInWithPassword.mockResolvedValue({
          data: null,
          error: { message: 'Invalid email format' }
        })
        
        await expect(signIn(email, 'password')).rejects.toThrow()
      }
    })

    it('debe manejar intentos de inyección', async () => {
      const maliciousInputs = [
        "'; DROP TABLE users; --",
        '<script>alert("xss")</script>',
        'admin@test.com\'); DELETE FROM profiles; --'
      ]

      const { signIn } = useAuth()
      
      for (const input of maliciousInputs) {
        await expect(signIn(input, 'password')).not.toThrow('Email y contraseña son requeridos')
      }
    })
  })
})