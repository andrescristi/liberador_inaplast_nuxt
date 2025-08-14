import { serverSupabaseServiceRole, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const userId = getRouterParam(event, 'id')

  if (!userId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'El ID del usuario es requerido'
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

    // Only admins can reset passwords for other users
    if (currentUserProfile.user_role !== 'Admin') {
      throw createError({
        statusCode: 403,
        statusMessage: 'Solo los administradores pueden restablecer contraseñas'
      })
    }

    // Get target user's email
    const { data: userData } = await supabase.auth.admin.getUserById(userId)
    if (!userData.user?.email) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Email del usuario no encontrado'
      })
    }

    // Send password reset email
    const { error } = await supabase.auth.resetPasswordForEmail(userData.user.email)
    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: `Error al enviar email de restablecimiento: ${error.message}`
      })
    }

    return { 
      success: true, 
      message: 'Email de restablecimiento de contraseña enviado exitosamente' 
    }
  } catch (error: unknown) {
    const statusCode = error && typeof error === 'object' && 'statusCode' in error ? (error.statusCode as number) : 500
    const statusMessage = error && typeof error === 'object' && 'statusMessage' in error ? (error.statusMessage as string) : 'Error al restablecer contraseña'
    throw createError({
      statusCode,
      statusMessage
    })
  }
})