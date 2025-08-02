// Authentication composable for Supabase
import type { Profile } from '~/types'

export const useAuth = () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

  const signIn = async (email: string, password: string) => {
    console.log('useAuth signIn called with:', { email, passwordLength: password?.length })
    
    // Validate parameters
    if (!email || !password) {
      throw new Error('Email y contraseña son requeridos')
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password
    })

    console.log('Supabase auth response:', { data, error })

    if (error) {
      console.error('Supabase auth error:', error)
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
    try {
      console.log('Signing out user...')
      
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('Sign out error:', error)
        throw new Error(error.message)
      }

      console.log('Sign out successful, redirecting to login...')
      
      // Clear any client-side state
      await nextTick()
      
      // Navigate to login page
      await navigateTo('/auth/login')
      
    } catch (error) {
      console.error('Unexpected sign out error:', error)
      throw error
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

  const updatePassword = async (password: string) => {
    const { error } = await supabase.auth.updateUser({
      password
    })

    if (error) {
      throw new Error(error.message)
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
        console.error('Error fetching user profile:', error)
        return null
      }

      // Add computed fields
      if (data) {
        const profile: Profile = {
          ...data,
          full_name: `${data.first_name} ${data.last_name}`,
          email: user.value.email || ''
        }
        return profile
      }

      return null
    } catch (error) {
      console.error('Error in getCurrentUserProfile:', error)
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