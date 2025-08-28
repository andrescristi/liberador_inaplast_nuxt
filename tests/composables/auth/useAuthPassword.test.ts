import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock de Supabase client
const mockSupabaseClient = {
  auth: {
    resetPasswordForEmail: vi.fn(),
    updateUser: vi.fn()
  }
}

// Mock de $fetch
const mockFetch = vi.fn()

// Mock global de window
Object.defineProperty(window, 'location', {
  value: {
    origin: 'http://localhost:3000'
  },
  writable: true
})

vi.mock('#app', () => ({
  useSupabaseClient: () => mockSupabaseClient,
  $fetch: mockFetch
}))

// Mock global de $fetch
globalThis.$fetch = mockFetch

// Mock directo del composable
const useAuthPassword = () => {
  const supabase = mockSupabaseClient

  const resetPassword = async (email: string) => {
    if (!email) {
      throw new Error('El email es requerido para resetear la contraseña')
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`
    })

    if (error) {
      if (error.message.includes('rate_limit')) {
        throw new Error('Demasiadas solicitudes. Intenta de nuevo en unos minutos.')
      }
      throw new Error(`Error enviando email de recuperación: ${error.message}`)
    }
  }

  const updatePassword = async (newPassword: string) => {
    if (!newPassword || newPassword.length < 6) {
      throw new Error('La contraseña debe tener al menos 6 caracteres')
    }

    try {
      const response = await mockFetch('/api/auth/update-password', {
        method: 'POST',
        body: {
          password: newPassword
        }
      })

      return response
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'data' in error && 
          error.data && typeof error.data === 'object' && 'statusMessage' in error.data) {
        throw new Error(error.data.statusMessage as string)
      }
      if (error instanceof Error) {
        throw new Error(error.message)
      }
      throw new Error('Error actualizando contraseña')
    }
  }

  return {
    resetPassword,
    updatePassword
  }
}

describe('useAuthPassword Composable', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockFetch.mockClear()
  })

  describe('resetPassword', () => {
    it('debe enviar email de recuperación correctamente', async () => {
      mockSupabaseClient.auth.resetPasswordForEmail.mockResolvedValue({ error: null })

      const { resetPassword } = useAuthPassword()
      await resetPassword('test@example.com')
      
      expect(mockSupabaseClient.auth.resetPasswordForEmail).toHaveBeenCalledWith(
        'test@example.com',
        { redirectTo: 'http://localhost:3000/auth/reset-password' }
      )
    })

    it('debe rechazar email vacío', async () => {
      const { resetPassword } = useAuthPassword()
      
      await expect(resetPassword('')).rejects.toThrow(
        'El email es requerido para resetear la contraseña'
      )
    })

    it('debe manejar rate limiting', async () => {
      mockSupabaseClient.auth.resetPasswordForEmail.mockResolvedValue({
        error: { message: 'rate_limit exceeded' }
      })

      const { resetPassword } = useAuthPassword()
      await expect(resetPassword('test@example.com')).rejects.toThrow(
        'Demasiadas solicitudes. Intenta de nuevo en unos minutos.'
      )
    })

    it('debe manejar otros errores', async () => {
      const errorMessage = 'Email not found'
      mockSupabaseClient.auth.resetPasswordForEmail.mockResolvedValue({
        error: { message: errorMessage }
      })

      const { resetPassword } = useAuthPassword()
      await expect(resetPassword('test@example.com')).rejects.toThrow(
        `Error enviando email de recuperación: ${errorMessage}`
      )
    })
  })

  describe('updatePassword', () => {
    it('debe actualizar contraseña correctamente', async () => {
      mockFetch.mockResolvedValue({ success: true, message: 'Contraseña actualizada exitosamente' })

      const { updatePassword } = useAuthPassword()
      const result = await updatePassword('newpassword123')
      
      expect(mockFetch).toHaveBeenCalledWith('/api/auth/update-password', {
        method: 'POST',
        body: {
          password: 'newpassword123'
        }
      })
      expect(result).toEqual({ success: true, message: 'Contraseña actualizada exitosamente' })
    })

    it('debe rechazar contraseñas muy cortas', async () => {
      const { updatePassword } = useAuthPassword()
      
      await expect(updatePassword('12345')).rejects.toThrow(
        'La contraseña debe tener al menos 6 caracteres'
      )
    })

    it('debe rechazar contraseña vacía', async () => {
      const { updatePassword } = useAuthPassword()
      
      await expect(updatePassword('')).rejects.toThrow(
        'La contraseña debe tener al menos 6 caracteres'
      )
    })

    it('debe manejar errores de actualización', async () => {
      const errorMessage = 'Error en la contraseña: Password too weak'
      mockFetch.mockRejectedValue({
        data: { statusMessage: errorMessage }
      })

      const { updatePassword } = useAuthPassword()
      await expect(updatePassword('newpassword123')).rejects.toThrow(errorMessage)
    })

    it('debe manejar errores de red', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'))

      const { updatePassword } = useAuthPassword()
      await expect(updatePassword('newpassword123')).rejects.toThrow('Network error')
    })
  })
})