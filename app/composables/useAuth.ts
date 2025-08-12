// Authentication composable for Supabase
import type { Profile } from '~/types'

export const useAuth = () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

  const signIn = async (email: string, password: string) => {
    // Log auth attempt in development mode
    
    // Validate parameters
    if (!email || !password) {
      throw new Error('Email y contraseña son requeridos')
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password
    })

    // Log auth response in development mode

    if (error) {
      // Handle authentication error
      // Provide more user-friendly error messages
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
    // Sign out user
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      // Handle sign out error
      throw new Error(error.message)
    }

    // Sign out successful, redirect to login
    
    // Clear any client-side state
    await nextTick()
    
    // Navigate to login page
    await navigateTo('/auth/login')
  }

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`
    })

    if (error) {
      throw new Error(error.message)
    }
  }

  const updatePassword = async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    })

    if (error) {
      // Provide more user-friendly error messages
      let errorMessage = error.message
      if (error.message.includes('weak')) {
        errorMessage = 'La contraseña no cumple con los requisitos de seguridad.'
      } else if (error.message.includes('same')) {
        errorMessage = 'La nueva contraseña debe ser diferente a la actual.'
      } else if (error.message.includes('invalid')) {
        errorMessage = 'La contraseña actual es incorrecta.'
      }
      throw new Error(errorMessage)
    }
  }

  const isAuthenticated = computed(() => !!user.value)

  // Get current user profile
  const getCurrentUserProfile = async (): Promise<Profile | null> => {
    if (!user.value) return null
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          user_id,
          first_name,
          last_name,
          user_role,
          created_at,
          updated_at
        `)
        .eq('user_id', user.value.id)
        .single()

      if (error) {
        // Handle user profile fetch error
        return null
      }

      // Add computed fields
      if (data) {
        const profile: Profile = {
          id: data.id,
          user_id: data.user_id,
          first_name: data.first_name,
          last_name: data.last_name,
          user_role: data.user_role,
          created_at: data.created_at,
          updated_at: data.updated_at,
          full_name: `${data.first_name} ${data.last_name}`,
          email: user.value.email || ''
        }
        return profile
      }

      return null
    } catch {
      // Handle getCurrentUserProfile error
      return null
    }
  }

  return {
    user: readonly(user),
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    isAuthenticated,
    getCurrentUserProfile
  }
}