import type { ProfileResponse, PaginatedResponse } from '~/types'
import { serverSupabaseUser, serverSupabaseServiceRole } from '#supabase/server'
import type { Database } from '../../../../app/types/database.types'

export default defineEventHandler(async (event): Promise<PaginatedResponse<ProfileResponse>> => {
  const query = getQuery(event)
  const { 
    search = '', 
    role_filter = '', 
    page = 1, 
    page_size = 20 
  } = query

  // Parse query parameters
  const currentPage = parseInt(page as string) || 1
  const pageSize = parseInt(page_size as string) || 20
  const searchTerm = search as string || ''
  const roleFilter = role_filter as string || ''

  // Create service role client for admin operations (bypasses RLS)
  const supabase = serverSupabaseServiceRole<Database>(event)

  try {
    // Get user from the request headers (Nuxt should handle auth)
    const supabaseUser = await serverSupabaseUser(event)
    
    if (!supabaseUser) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Usuario no autenticado'
      })
    }

    // Check if user is admin using service role client (bypasses RLS)
    const { data: adminCheck } = await supabase
      .from('profiles')
      .select('user_role')
      .eq('user_id', supabaseUser.id)
      .single()

    if (!adminCheck || adminCheck.user_role !== 'Admin') {
      throw createError({
        statusCode: 403,
        statusMessage: 'Acceso denegado. Se requieren privilegios de administrador.'
      })
    }

    // Calculate offset for pagination
    const offset = (currentPage - 1) * pageSize

    // Build the query using service role client (bypasses RLS to get all users)
    let query_builder = supabase
      .from('profiles')
      .select(`
        id,
        user_id,
        first_name,
        last_name,
        user_role,
        created_at,
        updated_at
      `, { count: 'exact' })

    // Apply filters
    if (searchTerm) {
      query_builder = query_builder.or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%`)
    }

    if (roleFilter && (roleFilter === 'Admin' || roleFilter === 'Supervisor' || roleFilter === 'Inspector')) {
      query_builder = query_builder.eq('user_role', roleFilter)
    }

    // Apply pagination and ordering
    query_builder = query_builder
      .range(offset, offset + pageSize - 1)
      .order('created_at', { ascending: false })

    const { data, error, count } = await query_builder

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: `Error al obtener usuarios: ${error.message}`
      })
    }

    // Get emails for all users using admin client and normalize to camelCase
    const profilesWithEmails = await Promise.all((data || []).map(async (profile) => {
      try {
        const { data: authUser } = await supabase.auth.admin.getUserById(profile.user_id)
        return {
          id: profile.id,
          userId: profile.user_id,
          firstName: profile.first_name,
          lastName: profile.last_name,
          userRole: profile.user_role,
          createdAt: profile.created_at,
          updatedAt: profile.updated_at,
          fullName: `${profile.first_name} ${profile.last_name}`,
          email: authUser.user?.email || ''
        }
      } catch (error) {
        // If getting the email fails, log error and return profile without email
        event.context.logger.error({
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
          userId: profile.user_id,
          context: 'admin/users/list.get - getUserById'
        }, 'Error getting user email')
        return {
          id: profile.id,
          userId: profile.user_id,
          firstName: profile.first_name,
          lastName: profile.last_name,
          userRole: profile.user_role,
          createdAt: profile.created_at,
          updatedAt: profile.updated_at,
          fullName: `${profile.first_name} ${profile.last_name}`,
          email: ''
        }
      }
    }))

    return {
      data: profilesWithEmails,
      total: count || 0,
      page: currentPage,
      per_page: pageSize,
      total_pages: Math.ceil((count || 0) / pageSize)
    }
  } catch (error: unknown) {
    if ('statusCode' in (error as object)) {
      throw error // Re-throw createError errors
    }
    
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
    throw createError({
      statusCode: 500,
      statusMessage: `Error interno del servidor: ${errorMessage}`
    })
  }
})