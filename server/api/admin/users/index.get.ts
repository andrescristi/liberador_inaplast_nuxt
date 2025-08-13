import { requireAdminAuth } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  // Validar permisos de administrador COMPLETAMENTE en server-side
  await requireAdminAuth(event)
  
  const query = getQuery(event)
  const { 
    page = 1, 
    pageSize = 20, 
    search, 
    role_filter 
  } = query

  try {
    const { serverSupabaseServiceRole } = await import('#supabase/server')
    const supabase = serverSupabaseServiceRole(event)
    
    const { data, error } = await supabase.rpc('get_all_profiles', {
      search_term: search || null,
      role_filter: role_filter || null,
      page_num: Number(page),
      page_size: Number(pageSize)
    })

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: `Error de base de datos: ${error.message}`
      })
    }

    if (!data || data.length === 0) {
      return {
        data: [],
        total: 0,
        page: Number(page),
        per_page: Number(pageSize),
        total_pages: 0
      }
    }

    const total = data[0]?.total_count || 0
    const profiles = data.map((item: Record<string, unknown>) => ({
      id: item.id as string,
      user_id: item.user_id as string,
      first_name: item.first_name as string,
      last_name: item.last_name as string,
      user_role: item.user_role as string,
      created_at: item.created_at as string,
      updated_at: item.updated_at as string,
      full_name: item.full_name as string,
      email: item.email as string
    }))

    return {
      data: profiles,
      total,
      page: Number(page),
      per_page: Number(pageSize),
      total_pages: Math.ceil(total / Number(pageSize))
    }
  } catch (error: unknown) {
    const statusCode = error && typeof error === 'object' && 'statusCode' in error ? (error.statusCode as number) : 500
    const statusMessage = error && typeof error === 'object' && 'statusMessage' in error ? (error.statusMessage as string) : 'Error al obtener usuarios'
    throw createError({
      statusCode,
      statusMessage
    })
  }
})