export default defineEventHandler(async (event) => {
  const userId = getRouterParam(event, 'id')
  const body = await readBody(event)
  const { first_name, last_name, user_role, email } = body

  if (!userId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'User ID is required'
    })
  }

  if (user_role && !['Admin', 'Supervisor', 'Inspector'].includes(user_role)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid user role. Must be Admin, Supervisor, or Inspector'
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

    // Get target user's profile
    const { data: targetUserProfile, error: targetUserError } = await supabase
      .from('profiles')
      .select('user_role')
      .eq('user_id', userId)
      .single()

    if (targetUserError || !targetUserProfile) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Target user not found'
      })
    }

    const isCurrentUser = user.id === userId
    const isCurrentUserAdmin = currentUserProfile.user_role === 'Admin'
    const isTargetUserAdmin = targetUserProfile.user_role === 'Admin'

    // Permission checks:
    // 1. Users can update their own profile (except role)
    // 2. Admins can update any profile except other admins
    if (isCurrentUser) {
      // User updating their own profile - cannot change role
      if (user_role !== undefined) {
        throw createError({
          statusCode: 403,
          statusMessage: 'You cannot change your own role'
        })
      }
    } else {
      // User trying to update another user's profile
      if (!isCurrentUserAdmin) {
        throw createError({
          statusCode: 403,
          statusMessage: 'Only admins can update other users'
        })
      }

      if (isTargetUserAdmin) {
        throw createError({
          statusCode: 403,
          statusMessage: 'Admins cannot update other admin accounts'
        })
      }
    }

    // Update email if provided and user has permission
    if (email && !isCurrentUser) {
      const { error: authError } = await supabase.auth.admin.updateUserById(userId, {
        email
      })
      if (authError) {
        throw createError({
          statusCode: 400,
          statusMessage: `Email update error: ${authError.message}`
        })
      }
    }

    const updateData: any = {}
    if (first_name !== undefined) updateData.first_name = first_name
    if (last_name !== undefined) updateData.last_name = last_name
    if (user_role !== undefined && !isCurrentUser) updateData.user_role = user_role

    if (Object.keys(updateData).length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No fields to update'
      })
    }

    updateData.updated_at = new Date().toISOString()

    const { data, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: `Profile update error: ${error.message}`
      })
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
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Failed to update user'
    })
  }
})