export default defineEventHandler(async (event) => {
  const userId = getRouterParam(event, 'id')

  if (!userId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'User ID is required'
    })
  }

  try {
    const supabase = serverSupabaseServiceRole(event)
    const user = await serverSupabaseUser(event)

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Authentication required'
      })
    }

    // Get current user's profile
    const { data: currentUserProfile, error: currentUserError } = await supabase
      .from('profiles')
      .select('user_role')
      .eq('user_id', user.id)
      .single()

    if (currentUserError || !currentUserProfile) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Unable to verify user permissions'
      })
    }

    // Only admins can delete users
    if (currentUserProfile.user_role !== 'Admin') {
      throw createError({
        statusCode: 403,
        statusMessage: 'Only admins can delete users'
      })
    }

    // Cannot delete own account
    if (user.id === userId) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Cannot delete your own account'
      })
    }

    // Get target user's profile to check if it's another admin
    const { data: targetUserProfile, error: targetUserError } = await supabase
      .from('profiles')
      .select('user_role')
      .eq('user_id', userId)
      .single()

    if (targetUserError) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Target user not found'
      })
    }

    // Admins cannot delete other admins
    if (targetUserProfile.user_role === 'Admin') {
      throw createError({
        statusCode: 403,
        statusMessage: 'Cannot delete other admin accounts'
      })
    }

    // Delete the user (this will cascade and delete the profile due to foreign key constraint)
    const { error } = await supabase.auth.admin.deleteUser(userId)
    
    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: `Failed to delete user: ${error.message}`
      })
    }

    return { success: true, message: 'User deleted successfully' }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Failed to delete user'
    })
  }
})