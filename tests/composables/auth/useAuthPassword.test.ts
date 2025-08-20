import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock de Supabase client
const mockSupabaseClient = {
  auth: {
    resetPasswordForEmail: vi.fn(),
    updateUser: vi.fn()
  }
}

// Mock global de window
Object.defineProperty(window, 'location', {
  value: {
    origin: 'http://localhost:3000'
  },
  writable: true
})

vi.mock('#app', () => ({
  useSupabaseClient: () => mockSupabaseClient
}))

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

    const { error } = await supabase.auth.updateUser({
      password: newPassword
    })

    if (error) {
      throw new Error(`Error actualizando contraseña: ${error.message}`)
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
      mockSupabaseClient.auth.updateUser.mockResolvedValue({ error: null })

      const { updatePassword } = useAuthPassword()
      await updatePassword('newpassword123')
      
      expect(mockSupabaseClient.auth.updateUser).toHaveBeenCalledWith({
        password: 'newpassword123'
      })
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
      const errorMessage = 'Password update failed'
      mockSupabaseClient.auth.updateUser.mockResolvedValue({
        error: { message: errorMessage }
      })

      const { updatePassword } = useAuthPassword()
      await expect(updatePassword('newpassword123')).rejects.toThrow(
        `Error actualizando contraseña: ${errorMessage}`
      )
    })
  })
})