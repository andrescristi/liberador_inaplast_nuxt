import { useAuthLogin } from './useAuthLogin'
import { useAuthProfile } from './useAuthProfile'  
import { useAuthPassword } from './useAuthPassword'
import { useAuthState } from './useAuthState'

/**
 * Composable principal de autenticación
 * Versión simplificada para evitar problemas de inicialización
 * 
 * @example
 * ```typescript
 * const { signIn, signOut, isAuthenticated } = useAuth()
 * ```
 */
export const useAuth = () => {
  // Initialize composables in the correct order
  const state = useAuthState()
  const login = useAuthLogin()
  const profile = useAuthProfile()
  const password = useAuthPassword()

  return {
    // Core state
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    userId: state.userId,
    userEmail: state.userEmail,
    isLoading: state.isLoading,
    
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
    updatePassword: password.updatePassword
  }
}

// Re-export individual composables for specific use cases
export { useAuthLogin } from './useAuthLogin'
export { useAuthProfile } from './useAuthProfile'
export { useAuthPassword } from './useAuthPassword'
export { useAuthState } from './useAuthState'
export { useAuthToken } from './useAuthToken'