import { serverSupabaseServiceRole, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const userId = getRouterParam(event, 'id')
  const body = await readBody(event)
  const { first_name, last_name, user_role, email } = body

  if (!userId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'El ID del usuario es requerido'
    })
  }

  if (user_role && !['Admin', 'Supervisor', 'Inspector'].includes(user_role)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Rol de usuario inválido. Debe ser Admin, Supervisor o Inspector'
    })
  }

  try {
    const supabase = serverSupabaseServiceRole(event)
    const user = await serverSupabaseUser(event)

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Autenticación requerida'
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
        statusMessage: 'No se pueden verificar los permisos del usuario'
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
        statusMessage: 'Usuario objetivo no encontrado'
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
          statusMessage: 'No puedes cambiar tu propio rol'
        })
      }
    } else {
      // User trying to update another user's profile
      if (!isCurrentUserAdmin) {
        throw createError({
          statusCode: 403,
          statusMessage: 'Solo los administradores pueden actualizar otros usuarios'
        })
      }

      if (isTargetUserAdmin) {
        throw createError({
          statusCode: 403,
          statusMessage: 'Los administradores no pueden actualizar otras cuentas de administrador'
        })
      }
    }

    // Track if email will be updated
    let emailUpdated = false
    
    // Update email if provided and user has permission
    if (email && !isCurrentUser) {
      const { error: authError } = await supabase.auth.admin.updateUserById(userId, {
        email
      })
      if (authError) {
        throw createError({
          statusCode: 400,
          statusMessage: `Error al actualizar email: ${authError.message}`
        })
      }
      emailUpdated = true
    }

    const updateData: { first_name?: string; last_name?: string; user_role?: string; updated_at?: string } = {}
    if (first_name !== undefined) updateData.first_name = first_name
    if (last_name !== undefined) updateData.last_name = last_name
    if (user_role !== undefined && !isCurrentUser) updateData.user_role = user_role

    // Check if there are any updates (profile data or email)
    if (Object.keys(updateData).length === 0 && !emailUpdated) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No hay campos para actualizar'
      })
    }

    // Only update profile if there are profile fields to update
    let data
    if (Object.keys(updateData).length > 0) {
      updateData.updated_at = new Date().toISOString()

      const result = await supabase
        .from('profiles')
        .update(updateData)
        .eq('user_id', userId)
        .select()
        .single()

      if (result.error) {
        throw createError({
          statusCode: 500,
          statusMessage: `Error al actualizar perfil: ${result.error.message}`
        })
      }
      data = result.data
    } else {
      // If only email was updated, get current profile data
      const result = await supabase
        .from('profiles')
        .select()
        .eq('user_id', userId)
        .single()

      if (result.error) {
        throw createError({
          statusCode: 500,
          statusMessage: `Error al obtener perfil: ${result.error.message}`
        })
      }
      data = result.data
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
    const statusCode = error && typeof error === 'object' && 'statusCode' in error ? (error.statusCode as number) : 500
    const statusMessage = error && typeof error === 'object' && 'statusMessage' in error ? (error.statusMessage as string) : 'Error al actualizar usuario'
    throw createError({
      statusCode,
      statusMessage
    })
  }
})