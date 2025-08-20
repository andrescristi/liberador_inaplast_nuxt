/**
 * Composable especializado para gestión de perfiles de usuario
 * Maneja operaciones relacionadas con datos de perfil y roles
 */
import type { Profile } from '../../types'
import type { Database } from '../../../types/database.types'

export const useAuthProfile = () => {
  const supabase = useSupabaseClient<Database>()
  const user = useSupabaseUser()

  /**
   * Obtiene el perfil completo del usuario autenticado actual
   */
  const getCurrentUserProfile = async (): Promise<Profile | null> => {
    if (!user.value) {
      return null
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.value.id)
      .single()

    if (error) {
      if (import.meta.server) {
        const { $logger } = useNuxtApp()
        if ($logger && typeof ($logger as any).error === 'function') {
          ($logger as any).error({
            error: error.message,
            userId: user.value.id,
            context: 'useAuthProfile.getCurrentUserProfile'
          }, 'Error fetching user profile')
        }
      }
      return null
    }

    return {
      ...data,
      full_name: `${data.first_name} ${data.last_name}`,
      email: user.value.email || ''
    } as Profile
  }

  /**
   * Actualiza el perfil del usuario autenticado
   */
  const updateUserProfile = async (updates: Partial<Profile>) => {
    if (!user.value) {
      throw new Error('No hay usuario autenticado')
    }

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('user_id', user.value.id)

    if (error) {
      throw new Error(`Error actualizando perfil: ${error.message}`)
    }
  }

  /**
   * Verifica si el usuario tiene un rol específico
   */
  const hasRole = async (role: string): Promise<boolean> => {
    const profile = await getCurrentUserProfile()
    return profile?.user_role === role
  }

  /**
   * Verifica si el usuario es administrador
   */
  const isAdmin = async (): Promise<boolean> => {
    return await hasRole('Admin')
  }

  return {
    getCurrentUserProfile,
    updateUserProfile,
    hasRole,
    isAdmin
  }
}