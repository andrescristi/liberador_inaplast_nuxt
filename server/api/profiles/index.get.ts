import { serverSupabaseServiceRole, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  try {
    const supabase = serverSupabaseServiceRole(event)
    const user = await serverSupabaseUser(event)

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Autenticación requerida'
      })
    }

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
      .eq('user_id', user.id)
      .single()

    if (error) {
      throw createError({
        statusCode: 404,
        statusMessage: `Error al obtener perfil: ${error.message}`
      })
    }

    return {
      id: data.id,
      user_id: data.user_id,
      first_name: data.first_name,
      last_name: data.last_name,
      user_role: data.user_role,
      created_at: data.created_at,
      updated_at: data.updated_at,
      full_name: `${data.first_name} ${data.last_name}`,
      email: user.email || ''
    }
  } catch (error: unknown) {
    const statusCode = error && typeof error === 'object' && 'statusCode' in error ? (error.statusCode as number) : 500
    const statusMessage = error && typeof error === 'object' && 'statusMessage' in error ? (error.statusMessage as string) : 'Error al obtener perfil'
    throw createError({
      statusCode,
      statusMessage
    })
  }
})