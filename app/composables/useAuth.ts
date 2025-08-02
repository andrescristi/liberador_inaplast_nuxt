// Authentication composable for Supabase
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
      email,
      password
    })

    console.log('Supabase auth response:', { data, error })

    if (error) {
      console.error('Supabase auth error:', error)
      throw new Error(error.message)
    }

    return data
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      throw new Error(error.message)
    }

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

  const updatePassword = async (password: string) => {
    const { error } = await supabase.auth.updateUser({
      password
    })

    if (error) {
      throw new Error(error.message)
    }
  }

  const isAuthenticated = computed(() => !!user.value)

  return {
    user: readonly(user),
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    isAuthenticated
  }
}