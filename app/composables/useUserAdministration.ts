import type { Profile, ProfileRole, ProfileFilters, PaginatedResponse, CreateProfileForm, UpdateProfileForm } from '~/types'
import type { Database } from '../../types/database.types'

export const useUserAdministration = () => {
  const supabase = useSupabaseClient<Database>()
  const user = useSupabaseUser()
  const { getCurrentUserProfile } = useAuth()

  const checkIsAdmin = async (): Promise<boolean> => {
    const profile = await getCurrentUserProfile()
    return profile?.user_role === 'Admin'
  }

  const getAllUsers = async (
    filters: ProfileFilters = {},
    page = 1,
    pageSize = 20
  ): Promise<PaginatedResponse<Profile>> => {
    if (!await checkIsAdmin()) {
      throw new Error('Acceso denegado. Se requieren privilegios de administrador.')
    }

    try {
      // Calculate offset for pagination
      const offset = (page - 1) * pageSize

      // Build the query
      let query = supabase
        .from('profiles')
        .select(`
          id,
          user_id,
          first_name,
          last_name,
          user_role,
          created_at,
          updated_at
        `, { count: 'exact' })

      // Apply filters
      if (filters.search) {
        query = query.or(`first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%`)
      }

      if (filters.role_filter) {
        query = query.eq('user_role', filters.role_filter)
      }

      // Apply pagination
      query = query.range(offset, offset + pageSize - 1)

      const { data, error, count } = await query

      if (error) {
        throw error
      }

      // Transform profiles and add full_name
      const profilesWithEmails = (data || []).map((profile) => ({
        ...profile,
        full_name: `${profile.first_name} ${profile.last_name}`,
        email: '' // Email will be populated separately if needed
      }))

      return {
        data: profilesWithEmails,
        total: count || 0,
        page,
        per_page: pageSize,
        total_pages: Math.ceil((count || 0) / pageSize)
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      throw new Error(`Error al obtener usuarios: ${errorMessage}`)
    }
  }

  const getUserById = async (userId: string): Promise<Profile | null> => {
    if (!await checkIsAdmin()) {
      throw new Error('Access denied. Admin privileges required.')
    }

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
        .eq('user_id', userId)
        .single()

      if (error) {
        if (error.code === 'PGRST116') return null
        throw error
      }

      const { data: authUser } = await supabase.auth.admin.getUserById(userId)
      
      return {
        id: data.id,
        user_id: data.user_id,
        first_name: data.first_name,
        last_name: data.last_name,
        user_role: data.user_role,
        created_at: data.created_at,
        updated_at: data.updated_at,
        full_name: `${data.first_name} ${data.last_name}`,
        email: authUser.user?.email || ''
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      throw new Error(`Failed to fetch user: ${errorMessage}`)
    }
  }

  const createUser = async (
    email: string,
    password: string,
    profileData: CreateProfileForm
  ): Promise<Profile> => {
    if (!await checkIsAdmin()) {
      throw new Error('Access denied. Admin privileges required.')
    }

    try {
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          first_name: profileData.first_name,
          last_name: profileData.last_name
        }
      })

      if (authError) throw authError

      if (!authData.user) {
        throw new Error('Failed to create user account')
      }

      const { data: profileUpdateData, error: profileError } = await supabase
        .from('profiles')
        .update({
          first_name: profileData.first_name,
          last_name: profileData.last_name,
          user_role: profileData.user_role
        })
        .eq('user_id', authData.user.id)
        .select()
        .single()

      if (profileError) throw profileError

      // Log the activity
      await supabase.rpc('log_user_activity', {
        p_actor_user_id: user.value?.id,
        p_target_user_id: authData.user.id,
        p_activity_type: 'user_created',
        p_activity_description: `Created user: ${profileData.first_name} ${profileData.last_name} (${email}) with role ${profileData.user_role}`,
        p_metadata: {
          email,
          role: profileData.user_role,
          name: `${profileData.first_name} ${profileData.last_name}`
        }
      })

      return {
        id: profileUpdateData.id,
        user_id: profileUpdateData.user_id,
        first_name: profileUpdateData.first_name,
        last_name: profileUpdateData.last_name,
        user_role: profileUpdateData.user_role,
        created_at: profileUpdateData.created_at,
        updated_at: profileUpdateData.updated_at,
        full_name: `${profileUpdateData.first_name} ${profileUpdateData.last_name}`,
        email: authData.user.email || ''
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      throw new Error(`Failed to create user: ${errorMessage}`)
    }
  }

  const updateUser = async (
    userId: string,
    profileData: UpdateProfileForm,
    email?: string
  ): Promise<Profile> => {
    if (!await checkIsAdmin()) {
      throw new Error('Access denied. Admin privileges required.')
    }

    try {
      if (email) {
        const { error: authError } = await supabase.auth.admin.updateUserById(userId, {
          email
        })
        if (authError) throw authError
      }

      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...profileData,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select()
        .single()

      if (error) throw error

      const { data: authUser } = await supabase.auth.admin.getUserById(userId)

      // Log the activity
      const changes = []
      if (profileData.first_name) changes.push(`first_name: ${profileData.first_name}`)
      if (profileData.last_name) changes.push(`last_name: ${profileData.last_name}`)
      if (profileData.user_role) changes.push(`role: ${profileData.user_role}`)
      if (email) changes.push(`email: ${email}`)

      await supabase.rpc('log_user_activity', {
        p_actor_user_id: user.value?.id,
        p_target_user_id: userId,
        p_activity_type: profileData.user_role ? 'user_role_changed' : 'user_updated',
        p_activity_description: `Updated user: ${changes.join(', ')}`,
        p_metadata: JSON.parse(JSON.stringify({
          changes: profileData,
          new_email: email
        }))
      })

      return {
        id: data.id,
        user_id: data.user_id,
        first_name: data.first_name,
        last_name: data.last_name,
        user_role: data.user_role,
        created_at: data.created_at,
        updated_at: data.updated_at,
        full_name: `${data.first_name} ${data.last_name}`,
        email: authUser.user?.email || ''
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      throw new Error(`Failed to update user: ${errorMessage}`)
    }
  }

  const deleteUser = async (userId: string): Promise<void> => {
    if (!await checkIsAdmin()) {
      throw new Error('Access denied. Admin privileges required.')
    }

    const currentUser = user.value
    if (currentUser?.id === userId) {
      throw new Error('Cannot delete your own account')
    }

    try {
      // Get user info before deletion for logging
      const { data: userData } = await supabase.auth.admin.getUserById(userId)
      const { data: profileData } = await supabase
        .from('profiles')
        .select('first_name, last_name, user_role')
        .eq('user_id', userId)
        .single()

      const { error } = await supabase.auth.admin.deleteUser(userId)
      if (error) throw error

      // Log the activity
      if (userData.user && profileData) {
        await supabase.rpc('log_user_activity', {
          p_actor_user_id: user.value?.id,
          p_target_user_id: null, // User is deleted, so no target
          p_activity_type: 'user_deleted',
          p_activity_description: `Deleted user: ${profileData.first_name} ${profileData.last_name} (${userData.user.email})`,
          p_metadata: {
            deleted_user_email: userData.user.email,
            deleted_user_name: `${profileData.first_name} ${profileData.last_name}`,
            deleted_user_role: profileData.user_role
          }
        })
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      throw new Error(`Failed to delete user: ${errorMessage}`)
    }
  }

  const resetUserPassword = async (userId: string): Promise<void> => {
    if (!await checkIsAdmin()) {
      throw new Error('Access denied. Admin privileges required.')
    }

    try {
      const { data: userData } = await supabase.auth.admin.getUserById(userId)
      if (!userData.user?.email) {
        throw new Error('User email not found')
      }

      const { error } = await supabase.auth.resetPasswordForEmail(userData.user.email)
      if (error) throw error

      // Log the activity
      await supabase.rpc('log_user_activity', {
        p_actor_user_id: user.value?.id,
        p_target_user_id: userId,
        p_activity_type: 'password_reset',
        p_activity_description: `Password reset requested for user: ${userData.user.email}`,
        p_metadata: {
          reset_email: userData.user.email
        }
      })
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      throw new Error(`Failed to reset password: ${errorMessage}`)
    }
  }

  const getUserStats = async (): Promise<{
    total: number
    admins: number
    supervisors: number
    inspectors: number
  }> => {
    if (!await checkIsAdmin()) {
      throw new Error('Access denied. Admin privileges required.')
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('user_role')

      if (error) throw error

      const stats = {
        total: data.length,
        admins: data.filter(p => p.user_role === 'Admin').length,
        supervisors: data.filter(p => p.user_role === 'Supervisor').length,
        inspectors: data.filter(p => p.user_role === 'Inspector').length
      }

      return stats
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      throw new Error(`Failed to fetch user statistics: ${errorMessage}`)
    }
  }

  const getRoleOptions = (): { label: string; value: ProfileRole }[] => [
    { label: 'Administrador', value: 'Admin' },
    { label: 'Supervisor', value: 'Supervisor' },
    { label: 'Inspector', value: 'Inspector' }
  ]

  const getActivityLogs = async (
    limit = 50,
    offset = 0,
    activityType?: string,
    targetUserId?: string
  ): Promise<{
    id: string;
    actor_user_id: string;
    target_user_id: string | null;
    activity_type: string;
    activity_description: string;
    metadata: Record<string, unknown>;
    created_at: string;
  }[]> => {
    if (!await checkIsAdmin()) {
      throw new Error('Access denied. Admin privileges required.')
    }

    try {
      const { data, error } = await supabase.rpc('get_activity_logs', {
        p_limit: limit,
        p_offset: offset,
        p_activity_type: activityType || null,
        p_target_user_id: targetUserId || null
      })

      if (error) throw error
      return data || []
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      throw new Error(`Failed to fetch activity logs: ${errorMessage}`)
    }
  }

  return {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    resetUserPassword,
    getUserStats,
    getRoleOptions,
    getActivityLogs,
    checkIsAdmin
  }
}