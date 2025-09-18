import { serverSupabaseClient, serverSupabaseUser, serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const userId = getRouterParam(event, 'id')
  const body = await readBody(event)

  if (!userId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'El ID del usuario es requerido'
    })
  }

  if (!body?.password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'La nueva contraseña es requerida'
    })
  }

  // Validación básica de contraseña
  if (body.password.length < 8) {
    throw createError({
      statusCode: 400,
      statusMessage: 'La contraseña debe tener al menos 8 caracteres'
    })
  }

  try {
    const user = await serverSupabaseUser(event)

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Autenticación requerida'
      })
    }

    // Usar service role para todas las operaciones admin
    const supabaseServiceRole = serverSupabaseServiceRole(event)

    // Verificar que el usuario actual es administrador
    const { data: currentUserProfile, error: currentUserError } = await supabaseServiceRole
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

    // Solo administradores pueden establecer contraseñas para otros usuarios
    if (currentUserProfile.user_role !== 'Admin') {
      throw createError({
        statusCode: 403,
        statusMessage: 'Solo los administradores pueden establecer contraseñas'
      })
    }

    // Verificar que el usuario objetivo existe
    const { data: targetUser, error: targetUserError } = await supabaseServiceRole.auth.admin.getUserById(userId)

    if (targetUserError || !targetUser.user) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Usuario no encontrado'
      })
    }

    // Establecer la nueva contraseña usando admin API
    const { error: updateError } = await supabaseServiceRole.auth.admin.updateUserById(userId, {
      password: body.password
    })

    if (updateError) {
      throw createError({
        statusCode: 500,
        statusMessage: `Error al establecer la contraseña: ${updateError.message}`
      })
    }

    return {
      success: true,
      message: 'Contraseña establecida exitosamente'
    }
  } catch (error: unknown) {
    const statusCode = error && typeof error === 'object' && 'statusCode' in error ? (error.statusCode as number) : 500
    const statusMessage = error && typeof error === 'object' && 'statusMessage' in error ? (error.statusMessage as string) : 'Error al establecer contraseña'
    throw createError({
      statusCode,
      statusMessage
    })
  }
})