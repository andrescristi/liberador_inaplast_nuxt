/**
 * Composable para administración de perfiles de terceros
 * Permite a administradores gestionar perfiles de cualquier usuario del sistema
 * 
 * @author Inaplast Development Team
 * @since v2.7.1
 */
import type { Profile, ProfileRole, CreateProfileForm, UpdateProfileForm, ProfileFilters, PaginatedResponse } from '~/types'

export const useAdminProfileManager = () => {

  // Get current user's profile
  const getCurrentProfile = async (): Promise<Profile | null> => {
    try {
      const data = await $fetch<Profile>('/api/profiles')
      return data
    } catch {
      throw new Error('Error al obtener perfil del usuario')
    }
  }

  // Get profile by user ID
  const getProfileByUserId = async (userId: string): Promise<Profile | null> => {
    try {
      const data = await $fetch<Profile>(`/api/profiles/${userId}`)
      return data
    } catch {
      throw new Error('Error al obtener perfil')
    }
  }

  // Update current user's profile
  const updateProfile = async (profileData: UpdateProfileForm): Promise<Profile> => {
    try {
      const data = await $fetch<Profile>('/api/profiles', {
        method: 'PUT',
        body: profileData
      })
      return data
    } catch {
      throw new Error('Error al actualizar perfil')
    }
  }

  // Check if current user has specific role
  const hasRole = async (role: ProfileRole): Promise<boolean> => {
    try {
      const profile = await getCurrentProfile()
      return profile?.user_role === role || false
    } catch {
      return false
    }
  }

  // Check if current user is admin
  const isAdmin = async (): Promise<boolean> => {
    try {
      const profile = await getCurrentProfile()
      return profile?.user_role === 'Admin' || false
    } catch {
      return false
    }
  }

  // Get all profiles (admin only) - usar admin/users/list endpoint existente
  const getAllProfiles = async (
    page = 1,
    perPage = 20,
    filters: ProfileFilters = {}
  ): Promise<PaginatedResponse<Profile>> => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        per_page: perPage.toString(),
        ...(filters.search && { search: filters.search }),
        ...(filters.role_filter && { role_filter: filters.role_filter })
      })
      
      const data = await $fetch<PaginatedResponse<Profile>>(`/api/admin/users/list?${params}`)
      return data
    } catch {
      throw new Error('Error al obtener perfiles')
    }
  }

  // Create new profile (admin only) - usar admin/users endpoint existente
  const createProfile = async (userId: string, profileData: CreateProfileForm): Promise<Profile> => {
    try {
      const data = await $fetch<Profile>('/api/admin/users', {
        method: 'POST',
        body: {
          user_id: userId,
          ...profileData
        }
      })
      return data
    } catch {
      throw new Error('Error al crear perfil')
    }
  }

  // Update any profile (admin only) - usar admin/users endpoint existente
  const updateAnyProfile = async (userId: string, profileData: UpdateProfileForm): Promise<Profile> => {
    try {
      const data = await $fetch<Profile>(`/api/admin/users/${userId}`, {
        method: 'PUT',
        body: profileData
      })
      return data
    } catch {
      throw new Error('Error al actualizar perfil')
    }
  }

  // Delete profile (admin only) - usar admin/users endpoint existente
  const deleteProfile = async (userId: string): Promise<void> => {
    try {
      await $fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE'
      })
    } catch {
      throw new Error('Error al eliminar perfil')
    }
  }

  // Get role hierarchy level (for UI permissions)
  const getRoleLevel = (role: ProfileRole): number => {
    switch (role) {
      case 'Admin': return 3
      case 'Supervisor': return 2
      case 'Inspector': return 1
      default: return 0
    }
  }

  // Check if role can perform action on target role
  const canManageRole = (userRole: ProfileRole, targetRole: ProfileRole): boolean => {
    return getRoleLevel(userRole) > getRoleLevel(targetRole)
  }

  // Get available roles for current user to assign
  const getAssignableRoles = async (): Promise<ProfileRole[]> => {
    const profile = await getCurrentProfile()
    if (!profile) return []

    const currentLevel = getRoleLevel(profile.user_role)
    const allRoles: ProfileRole[] = ['Inspector', 'Supervisor', 'Admin']
    
    // Users can only assign roles lower than their own
    return allRoles.filter(role => getRoleLevel(role) < currentLevel)
  }

  return {
    // Profile management
    getCurrentProfile,
    getProfileByUserId,
    updateProfile,
    
    // Role checking
    hasRole,
    isAdmin,
    
    // Admin functions
    getAllProfiles,
    createProfile,
    updateAnyProfile,
    deleteProfile,
    
    // Utility functions
    getRoleLevel,
    canManageRole,
    getAssignableRoles
  }
}