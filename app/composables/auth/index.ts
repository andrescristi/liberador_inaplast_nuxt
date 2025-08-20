// Import all auth composables
import { useAuthLogin } from './useAuthLogin'
import { useAuthProfile } from './useAuthProfile'  
import { useAuthPassword } from './useAuthPassword'
import { useAuthState } from './useAuthState'

/**
 * Composable principal de autenticación
 * Combina todos los composables especializados en una interfaz única
 * 
 * @example
 * ```typescript
 * const { signIn, signOut, getCurrentUserProfile, isAuthenticated } = useAuth()
 * ```
 */
export const useAuth = () => {
  const login = useAuthLogin()
  const profile = useAuthProfile()
  const password = useAuthPassword()
  const state = useAuthState()

  return {
    // Login/Logout
    signIn: login.signIn,
    signOut: login.signOut,
    
    // Profile management
    getCurrentUserProfile: profile.getCurrentUserProfile,
    updateUserProfile: profile.updateUserProfile,
    hasRole: profile.hasRole,
    isAdmin: profile.isAdmin,
    
    // Password management
    resetPassword: password.resetPassword,
    updatePassword: password.updatePassword,
    
    // State
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    userId: state.userId,
    userEmail: state.userEmail,
    isLoading: state.isLoading
  }
}

// Re-export individual composables for specific use cases
export { useAuthLogin } from './useAuthLogin'
export { useAuthProfile } from './useAuthProfile'
export { useAuthPassword } from './useAuthPassword'
export { useAuthState } from './useAuthState'