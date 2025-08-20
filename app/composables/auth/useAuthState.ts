/**
 * Composable especializado para estado de autenticación
 * Maneja estados reactivos y computeds de autenticación
 */
export const useAuthState = () => {
  const user = useSupabaseUser()

  /**
   * Estado reactivo de autenticación
   */
  const isAuthenticated = computed(() => !!user.value)

  /**
   * ID del usuario actual
   */
  const userId = computed(() => user.value?.id)

  /**
   * Email del usuario actual
   */
  const userEmail = computed(() => user.value?.email)

  /**
   * Estado de carga del usuario
   */
  const isLoading = computed(() => user.value === undefined)

  return {
    user: readonly(user),
    isAuthenticated: readonly(isAuthenticated),
    userId: readonly(userId),
    userEmail: readonly(userEmail),
    isLoading: readonly(isLoading)
  }
}