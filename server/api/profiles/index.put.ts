import { serverSupabaseServiceRole, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { first_name, last_name } = body

  try {
    const supabase = serverSupabaseServiceRole(event)
    const user = await serverSupabaseUser(event)

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Autenticación requerida'
      })
    }

    const updateData: { first_name?: string; last_name?: string; updated_at: string } = {
      updated_at: new Date().toISOString()
    }
    
    if (first_name !== undefined) updateData.first_name = first_name
    if (last_name !== undefined) updateData.last_name = last_name

    if (Object.keys(updateData).length === 1) { // Only updated_at
      throw createError({
        statusCode: 400,
        statusMessage: 'No hay campos para actualizar'
      })
    }

    const { data, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: `Error al actualizar perfil: ${error.message}`
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
    const statusMessage = error && typeof error === 'object' && 'statusMessage' in error ? (error.statusMessage as string) : 'Error al actualizar perfil'
    throw createError({
      statusCode,
      statusMessage
    })
  }
})