/**
 * Composable especializado para gestión de perfiles de usuario
 * Maneja operaciones relacionadas con datos de perfil y roles
 * Usa el sistema de autenticación híbrida directamente
 */
import type { Profile } from '../../types'
import { useHybridAuth } from './useHybridAuth'

/**
 * Respuesta completa del perfil desde API
 */
interface ProfileResponse {
  // Datos de autenticación
  id: string
  email: string
  email_confirmed_at?: string
  last_sign_in_at?: string
  
  // Datos del perfil
  profile_id: string
  user_id: string
  first_name: string
  last_name: string
  full_name: string
  user_role: string
  
  // Timestamps
  auth_created_at?: string
  auth_updated_at?: string
  profile_created_at?: string
  profile_updated_at?: string
  
  // Estado
  authenticated: boolean
}

export const useAuthProfile = () => {
  // Usar sistema híbrido directamente
  const { hasValidJWT, getAuthHeaders } = useHybridAuth()

  // Estados reactivos para cache
  const profile = ref<Profile | null>(null)
  const isProfileLoading = ref(false)
  const profileError = ref<string | null>(null)
  const lastProfileFetch = ref<Date | null>(null)
  const PROFILE_CACHE_DURATION = 60 * 1000 // 1 minuto

  /**
   * Obtiene el perfil completo del usuario autenticado actual
   * Usa el endpoint /api/auth/profile en lugar de Supabase directo
   */
  const getCurrentUserProfile = async (force = false): Promise<Profile | null> => {
    const hasJWT = hasValidJWT()
    // Getting current user profile
    
    if (!hasJWT) {
      return null
    }

    // Verificar cache si no es forzado
    if (!force && profile.value && lastProfileFetch.value) {
      const timeSinceLastFetch = Date.now() - lastProfileFetch.value.getTime()
      if (timeSinceLastFetch < PROFILE_CACHE_DURATION) {
        return profile.value
      }
    }

    try {
      isProfileLoading.value = true
      profileError.value = null
      
      // Fetching profile from API
      const response = await $fetch<ProfileResponse>('/api/auth/profile', {
        headers: getAuthHeaders()
      })
      // Profile response received
      
      // Convertir respuesta API a formato Profile
      const profileData: Profile = {
        id: response.profile_id,
        user_id: response.user_id,
        first_name: response.first_name,
        last_name: response.last_name,
        user_role: response.user_role as Profile['user_role'],
        created_at: response.profile_created_at || null,
        updated_at: response.profile_updated_at || null,
        full_name: response.full_name,
        email: response.email
      }
      
      profile.value = profileData
      lastProfileFetch.value = new Date()
      // Profile saved successfully
      
      return profileData
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      profileError.value = errorMessage
      profile.value = null
      
      // eslint-disable-next-line no-console
      console.error('❌ [useAuthProfile] Error fetching user profile:', errorMessage, error)
      
      return null
    } finally {
      isProfileLoading.value = false
    }
  }

  /**
   * Actualiza el perfil del usuario autenticado
   * TODO: Implementar endpoint /api/auth/profile PUT cuando sea necesario
   */
  const updateUserProfile = async (_updates: Partial<Profile>) => {
    if (!hasValidJWT()) {
      throw new Error('No hay usuario autenticado')
    }

    try {
      // Por ahora lanza error - endpoint no implementado
      throw new Error('Actualización de perfil no implementada aún - usar panel de admin')
      
      // TODO: Implementar cuando se cree el endpoint
      // await $fetch('/api/auth/profile', {
      //   method: 'PUT',
      //   body: updates
      // })
      // 
      // // Refrescar cache después de actualizar
      // await getCurrentUserProfile(true)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      throw new Error(`Error actualizando perfil: ${errorMessage}`)
    }
  }

  /**
   * Verifica si el usuario tiene un rol específico
   */
  const hasRole = async (role: string): Promise<boolean> => {
    const userProfile = await getCurrentUserProfile()
    return userProfile?.user_role === role
  }

  /**
   * Verifica si el usuario es administrador
   */
  const isAdmin = async (): Promise<boolean> => {
    return await hasRole('Admin')
  }
  
  /**
   * Verifica si el usuario es supervisor
   */
  const isSupervisor = async (): Promise<boolean> => {
    return await hasRole('Supervisor')
  }
  
  /**
   * Verifica si el usuario es inspector
   */
  const isInspector = async (): Promise<boolean> => {
    return await hasRole('Inspector')
  }
  
  /**
   * Refresca el cache del perfil
   */
  const refreshProfile = () => getCurrentUserProfile(true)
  
  /**
   * Limpia el cache del perfil
   */
  const clearProfile = () => {
    profile.value = null
    lastProfileFetch.value = null
    profileError.value = null
  }

  return {
    // Estados
    profile: readonly(profile),
    isProfileLoading: readonly(isProfileLoading),
    profileError: readonly(profileError),
    
    // Acciones principales
    getCurrentUserProfile,
    updateUserProfile,
    
    // Verificación de roles
    hasRole,
    isAdmin,
    isSupervisor,
    isInspector,
    
    // Gestión de cache
    refreshProfile,
    clearProfile
  }
}