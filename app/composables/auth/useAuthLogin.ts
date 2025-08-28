/**
 * Composable especializado para operaciones de login/logout
 * Usa endpoints API del servidor en lugar de conexión directa a Supabase
 */
import { useAuthState } from './useAuthState'

interface LoginResponse {
  success: boolean
  message: string
  user?: {
    id: string
    email: string
    [key: string]: unknown
  }
}

interface LogoutResponse {
  success: boolean
  message: string
  logged_out: boolean
  timestamp: string
}

export const useAuthLogin = () => {
  const { clearUser, refreshUser } = useAuthState()

  /**
   * Inicia sesión de usuario con validación y manejo de errores
   */
  const signIn = async (email: string, password: string) => {
    if (!email || !password) {
      throw new Error('Email y contraseña son requeridos')
    }

    try {
      // Usar endpoint del servidor para login
      const response = await $fetch<LoginResponse>('/api/auth/login', {
        method: 'POST',
        body: {
          email: email.trim(),
          password
        }
      })

      if (!response.success) {
        throw new Error(response.message || 'Error durante el inicio de sesión')
      }

      // Refrescar el estado del usuario después del login exitoso
      await refreshUser()

      return response
    } catch (error: unknown) {
      // Mapear errores comunes de Supabase a mensajes en español
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

  /**
   * Cierra la sesión del usuario actual usando API del servidor
   */
  const signOut = async () => {
    try {
      const response = await $fetch<LogoutResponse>('/api/auth/logout', {
        method: 'POST'
      })

      if (!response.success) {
        throw new Error(response.message || 'Error durante el cierre de sesión')
      }

      // Limpiar el estado local del usuario
      clearUser()
      
      // Redirigir a la página de login
      await navigateTo('/auth/login')
      
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