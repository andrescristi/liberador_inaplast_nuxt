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
  // Use lazy initialization to avoid circular dependencies and initialization order issues
  const login = useAuthLogin()
  const profile = useAuthProfile()
  const password = useAuthPassword()
  const state = useAuthState()

  // Defensive checks to ensure all composables are properly initialized
  if (import.meta.client) {
    if (!login || !profile || !password || !state) {
      console.warn('Auth composables not properly initialized')
      return {
        signIn: async () => { throw new Error('Auth not initialized') },
        signOut: async () => { throw new Error('Auth not initialized') },
        getCurrentUserProfile: async () => { throw new Error('Auth not initialized') },
        updateUserProfile: async () => { throw new Error('Auth not initialized') },
        hasRole: () => false,
        isAdmin: computed(() => false),
        resetPassword: async () => { throw new Error('Auth not initialized') },
        updatePassword: async () => { throw new Error('Auth not initialized') },
        user: computed(() => null),
        isAuthenticated: computed(() => false),
        userId: computed(() => null),
        userEmail: computed(() => null),
        isLoading: computed(() => false)
      }
    }
  }

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