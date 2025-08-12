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

    // Only admins can delete users
    if (currentUserProfile.user_role !== 'Admin') {
      throw createError({
        statusCode: 403,
        statusMessage: 'Solo los administradores pueden eliminar usuarios'
      })
    }

    // Cannot delete own account
    if (user.id === userId) {
      throw createError({
        statusCode: 403,
        statusMessage: 'No puedes eliminar tu propia cuenta'
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
        statusMessage: 'Usuario objetivo no encontrado'
      })
    }

    // Admins cannot delete other admins
    if (targetUserProfile.user_role === 'Admin') {
      throw createError({
        statusCode: 403,
        statusMessage: 'No se pueden eliminar otras cuentas de administrador'
      })
    }

    // Delete the user (this will cascade and delete the profile due to foreign key constraint)
    const { error } = await supabase.auth.admin.deleteUser(userId)
    
    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: `Error al eliminar usuario: ${error.message}`
      })
    }

    return { success: true, message: 'Usuario eliminado exitosamente' }
  } catch (error: unknown) {
    const statusCode = error && typeof error === 'object' && 'statusCode' in error ? (error.statusCode as number) : 500
    const statusMessage = error && typeof error === 'object' && 'statusMessage' in error ? (error.statusMessage as string) : 'Error al eliminar usuario'
    throw createError({
      statusCode,
      statusMessage
    })
  }
})