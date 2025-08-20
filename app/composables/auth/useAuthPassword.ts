/**
 * Composable especializado para gestión de contraseñas
 * Maneja reset de contraseñas y cambios de contraseña
 */
import type { Database } from '../../../types/database.types'

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
   * Actualiza la contraseña del usuario autenticado
   */
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