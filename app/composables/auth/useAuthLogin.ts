/**
 * Composable especializado para operaciones de login/logout
 * Maneja únicamente la autenticación básica de usuarios
 */
import type { Database } from '../../../types/database.types'

export const useAuthLogin = () => {
  const supabase = useSupabaseClient<Database>()

  /**
   * Inicia sesión de usuario con validación y manejo de errores
   */
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

  /**
   * Cierra la sesión del usuario actual y redirige a login
   */
  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      throw new Error(`Error durante el logout: ${error.message}`)
    }
    
    await navigateTo('/auth/login')
  }

  return {
    signIn,
    signOut
  }
}