export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const { 
    page = 1, 
    pageSize = 20, 
    search, 
    role_filter 
  } = query

  try {
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
        statusMessage: `Database error: ${error.message}`
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
    const profiles = data.map((item: any) => ({
      id: item.id,
      user_id: item.user_id,
      first_name: item.first_name,
      last_name: item.last_name,
      user_role: item.user_role,
      created_at: item.created_at,
      updated_at: item.updated_at,
      full_name: item.full_name,
      email: item.email
    }))

    return {
      data: profiles,
      total,
      page: Number(page),
      per_page: Number(pageSize),
      total_pages: Math.ceil(total / Number(pageSize))
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Failed to fetch users'
    })
  }
})