/**
 * Composable especializado para gestión de contraseñas
 * Maneja reset de contraseñas y cambios de contraseña
 */
import type { Database } from '~/types/database.types'

export const useAuthPassword = () => {
  const supabase = useSupabaseClient<Database>()

  /**
   * Envía email de recuperación de contraseña
   */
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

  /**
   * Actualiza la contraseña del usuario autenticado a través de la API del servidor
   */
  const updatePassword = async (newPassword: string) => {
    if (!newPassword || newPassword.length < 6) {
      throw new Error('La contraseña debe tener al menos 6 caracteres')
    }

    try {
      const response = await $fetch('/api/auth/update-password', {
        method: 'POST',
        body: {
          password: newPassword
        }
      })

      return response
    } catch (error: unknown) {
      // Si es un error de fetch con statusMessage, usar ese mensaje
      if (error && typeof error === 'object' && 'data' in error && 
          error.data && typeof error.data === 'object' && 'statusMessage' in error.data) {
        throw new Error(error.data.statusMessage as string)
      }
      // Si es un error con message directo
      if (error instanceof Error) {
        throw new Error(error.message)
      }
      // Fallback genérico
      throw new Error('Error actualizando contraseña')
    }
  }

  return {
    resetPassword,
    updatePassword
  }
}