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
      .from('tests')
      .select(`
        id,
        created_at,
        name,
        type
      `)
      .order('id', { ascending: true })

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: `Error al obtener tests: ${error.message}`
      })
    }

    return data
  } catch (error: unknown) {
    const statusCode = error && typeof error === 'object' && 'statusCode' in error ? (error.statusCode as number) : 500
    const statusMessage = error && typeof error === 'object' && 'statusMessage' in error ? (error.statusMessage as string) : 'Error al obtener tests'
    throw createError({
      statusCode,
      statusMessage
    })
  }
})