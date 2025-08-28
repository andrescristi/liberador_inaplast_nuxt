import { serverSupabaseServiceRole, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const userId = getRouterParam(event, 'userId')

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

    // Verificar que el usuario solo acceda a su propio perfil
    if (user.id !== userId) {
      // Verificar si el usuario actual es admin
      const { data: currentUserProfile } = await supabase
        .from('profiles')
        .select('user_role')
        .eq('user_id', user.id)
        .single()

      if (!currentUserProfile || currentUserProfile.user_role !== 'Admin') {
        throw createError({
          statusCode: 403,
          statusMessage: 'Solo puedes acceder a tu propio perfil'
        })
      }
    }

    const { data, error } = await supabase
      .rpc('get_user_profile', { user_id_param: userId })

    if (error) {
      throw createError({
        statusCode: 404,
        statusMessage: `Error al obtener perfil: ${error.message}`
      })
    }

    return data || null
  } catch (error: unknown) {
    const statusCode = error && typeof error === 'object' && 'statusCode' in error ? (error.statusCode as number) : 500
    const statusMessage = error && typeof error === 'object' && 'statusMessage' in error ? (error.statusMessage as string) : 'Error al obtener perfil'
    throw createError({
      statusCode,
      statusMessage
    })
  }
})