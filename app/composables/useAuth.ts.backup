/**
 * Composable de autenticación para Supabase
 * 
 * Maneja todas las operaciones de autenticación del sistema Inaplast incluyendo:
 * - Login/logout de usuarios
 * - Gestión de perfiles y roles
 * - Reseteo de contraseñas
 * - Actualización de metadata de usuarios
 * - Estados de autenticación reactivos
 * 
 * @example
 * ```typescript
 * const { signIn, signOut, isAuthenticated, getCurrentUserProfile, resetPassword } = useAuth()
 * 
 * // Login de usuario
 * try {
 *   await signIn('user@example.com', 'password123')
 *   console.log('Login exitoso')
 * } catch (error) {
 *   console.error('Error de login:', error.message)
 * }
 * 
 * // Obtener perfil actual
 * const profile = await getCurrentUserProfile()
 * if (profile) {
 *   console.log(`Bienvenido ${profile.full_name}, rol: ${profile.user_role}`)
 * }
 * 
 * // Verificar estado de autenticación
 * if (isAuthenticated.value) {
 *   // Usuario autenticado
 * }
 * ```
 * 
 * @author Inaplast Development Team
 * @since v1.0.0
 */
import type { Profile } from '~/types'
import type { Database } from '../../types/database.types'

export const useAuth = () => {
  const supabase = useSupabaseClient<Database>()
  const user = useSupabaseUser()

  /**
   * Inicia sesión de usuario con validación y manejo de errores
   * 
   * Características:
   * - Validación de parámetros de entrada
   * - Manejo de errores específicos con mensajes en español
   * - Actualización automática de metadata del usuario con rol
   * - Integración con JWT claims para autorización
   * 
   * @param {string} email - Email del usuario (se elimina whitespace automáticamente)
   * @param {string} password - Contraseña del usuario
   * @returns {Promise<AuthResponse>} Respuesta de autenticación de Supabase
   * 
   * @throws {Error} 'Email y contraseña son requeridos' - Si faltan parámetros
   * @throws {Error} 'Credenciales incorrectas...' - Si las credenciales son inválidas
   * @throws {Error} 'Por favor confirma tu email...' - Si el email no está confirmado
   * @throws {Error} 'Demasiados intentos...' - Si se excede el rate limit
   * 
   * @example
   * ```typescript
   * try {
   *   const result = await signIn('inspector@inaplast.com', 'securePassword123')
   *   // Usuario autenticado exitosamente
   *   console.log('Login exitoso:', result.user.email)
   * } catch (error) {
   *   // Manejar error específico
   *   toast.error('Error de autenticación', error.message)
   * }
   * ```
   */
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

    // After successful login, update user metadata with role for JWT claims
    if (data.user) {
      try {
        // Get user profile to get the role
        const { data: profile } = await supabase
          .from('profiles')
          .select('user_role')
          .eq('user_id', data.user.id)
          .single()

        if (profile) {
          // Update user metadata with role for JWT claims
          await supabase.auth.updateUser({
            data: {
              user_role: profile.user_role
            }
          })
        }
      } catch (updateError) {
        // Don't fail the login if we can't update metadata
        // eslint-disable-next-line no-console
        console.warn('Could not update user metadata:', updateError)
      }
    }

    return data
  }

  /**
   * Cierra la sesión del usuario actual y redirige a login
   * 
   * Realiza limpieza completa del estado de autenticación:
   * - Cierra la sesión en Supabase
   * - Limpia el estado del cliente
   * - Redirige automáticamente a la página de login
   * 
   * @async
   * @throws {Error} Si hay problemas durante el proceso de logout
   * 
   * @example
   * ```typescript
   * try {
   *   await signOut()
   *   // Usuario deslogueado y redirigido a /auth/login
   * } catch (error) {
   *   console.error('Error durante logout:', error.message)
   * }
   * ```
   */
  const signOut = async () => {
    // Cerrar sesión en Supabase
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      // Manejar error de logout
      throw new Error(error.message)
    }

    // Logout exitoso, limpiar estado del cliente
    await nextTick()
    
    // Navegar a la página de login
    await navigateTo('/auth/login')
  }

  /**
   * Envía email de reseteo de contraseña al usuario
   * 
   * Genera un enlace seguro de reseteo que redirige a la página
   * de cambio de contraseña de la aplicación.
   * 
   * @param {string} email - Email del usuario que solicita el reseteo
   * 
   * @throws {Error} Si el email no existe o hay problemas de conectividad
   * 
   * @example
   * ```typescript
   * try {
   *   await resetPassword('user@inaplast.com')
   *   toast.success('Email enviado', 'Revisa tu bandeja de entrada')
   * } catch (error) {
   *   toast.error('Error', 'No se pudo enviar el email de reseteo')
   * }
   * ```
   */
  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`
    })

    if (error) {
      throw new Error(error.message)
    }
  }

  /**
   * Actualiza la contraseña del usuario autenticado
   * 
   * Valida la nueva contraseña y proporciona mensajes de error
   * amigables en español para diferentes escenarios.
   * 
   * @param {string} newPassword - Nueva contraseña del usuario
   * 
   * @throws {Error} 'La contraseña no cumple con los requisitos...' - Si es muy débil
   * @throws {Error} 'La nueva contraseña debe ser diferente...' - Si es igual a la actual
   * @throws {Error} 'La contraseña actual es incorrecta.' - Si la validación falla
   * 
   * @example
   * ```typescript
   * try {
   *   await updatePassword('newSecurePassword123!')
   *   toast.success('Contraseña actualizada exitosamente')
   * } catch (error) {
   *   toast.error('Error', error.message)
   * }
   * ```
   */
  const updatePassword = async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    })

    if (error) {
      // Proporcionar mensajes de error amigables
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

  /**
   * Computed reactivo que indica si hay un usuario autenticado
   * 
   * @returns {ComputedRef<boolean>} true si hay usuario autenticado, false en caso contrario
   */
  const isAuthenticated = computed(() => !!user.value)

  /**
   * Obtiene el perfil completo del usuario autenticado actual
   * 
   * Combina datos de Supabase Auth (email) con datos del perfil (nombres, rol)
   * y calcula campos adicionales como full_name.
   * 
   * @async
   * @returns {Promise<Profile | null>} Perfil completo del usuario o null si no está autenticado
   * 
   * @example
   * ```typescript
   * const profile = await getCurrentUserProfile()
   * if (profile) {
   *   console.log(`Usuario: ${profile.full_name}`)
   *   console.log(`Rol: ${profile.user_role}`)
   *   console.log(`Email: ${profile.email}`)
   * } else {
   *   console.log('Usuario no autenticado')
   * }
   * ```
   */
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