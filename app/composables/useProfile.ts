// Profile management composable for user profiles and roles
import type { Profile, ProfileRole, CreateProfileForm, UpdateProfileForm, ProfileFilters, PaginatedResponse } from '~/types'

export const useProfile = () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

  // Get current user's profile
  const getCurrentProfile = async (): Promise<Profile | null> => {
    if (!user.value) return null

    // Getting current user profile

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
      throw new Error('Failed to fetch user profile: ' + error.message)
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
  }

  // Get profile by user ID
  const getProfileByUserId = async (userId: string): Promise<Profile | null> => {
    const { data, error } = await supabase
      .rpc('get_user_profile', { user_id_param: userId })

    if (error) {
      // Handle profile fetch error
      throw new Error('Failed to fetch profile')
    }

    return data || null
  }

  // Update current user's profile
  const updateProfile = async (profileData: UpdateProfileForm): Promise<Profile> => {
    if (!user.value) {
      throw new Error('User not authenticated')
    }

    const { data, error } = await supabase
      .from('profiles')
      .update(profileData)
      .eq('user_id', user.value.id)
      .select()
      .single()

    if (error) {
      // Handle profile update error
      throw new Error('Failed to update profile')
    }

    // Add computed fields with the updated data
    const profile: Profile = {
      ...data,
      full_name: `${data.first_name || ''} ${data.last_name || ''}`.trim(),
      email: user.value.email || ''
    }
    return profile
  }

  // Check if current user has specific role
  const hasRole = async (role: ProfileRole): Promise<boolean> => {
    if (!user.value) return false

    const { data, error } = await supabase
      .rpc('user_has_role', { 
        required_role: role, 
        user_id_param: user.value.id 
      })

    if (error) {
      // Handle user role check error
      return false
    }

    return data || false
  }

  // Check if current user is admin
  const isAdmin = async (): Promise<boolean> => {
    if (!user.value) return false

    const { data, error } = await supabase
      .rpc('is_admin', { user_id_param: user.value.id })

    if (error) {
      // Handle admin status check error
      return false
    }

    return data || false
  }

  // Get all profiles (admin only)
  const getAllProfiles = async (
    page = 1,
    perPage = 20,
    filters: ProfileFilters = {}
  ): Promise<PaginatedResponse<Profile>> => {
    const { data, error } = await supabase
      .rpc('get_all_profiles', {
        search_term: filters.search || null,
        role_filter: filters.role_filter || null,
        page_num: page,
        page_size: perPage
      })

    if (error) {
      // Handle all profiles fetch error
      throw new Error('Failed to fetch profiles')
    }

    const profiles = data || []
    const totalCount = profiles[0]?.total_count || 0

    return {
      data: profiles.map((row: Record<string, unknown>) => ({
        id: row.id,
        user_id: row.user_id,
        first_name: row.first_name,
        last_name: row.last_name,
        full_name: row.full_name,
        user_role: row.user_role,
        email: row.email,
        created_at: row.created_at,
        updated_at: row.updated_at
      })),
      total: totalCount,
      page,
      per_page: perPage,
      total_pages: Math.ceil(totalCount / perPage)
    }
  }

  // Create new profile (admin only)
  const createProfile = async (userId: string, profileData: CreateProfileForm): Promise<Profile> => {
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        user_id: userId,
        ...profileData
      })
      .select()
      .single()

    if (error) {
      // Handle profile creation error
      throw new Error('Failed to create profile')
    }

    return data
  }

  // Update any profile (admin only)
  const updateAnyProfile = async (profileId: string, profileData: UpdateProfileForm): Promise<Profile> => {
    const { data, error } = await supabase
      .from('profiles')
      .update(profileData)
      .eq('id', profileId)
      .select()
      .single()

    if (error) {
      // Handle profile update error
      throw new Error('Failed to update profile')
    }

    return data
  }

  // Delete profile (admin only, cannot delete own profile)
  const deleteProfile = async (profileId: string): Promise<void> => {
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', profileId)

    if (error) {
      // Handle profile deletion error
      throw new Error('Failed to delete profile')
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