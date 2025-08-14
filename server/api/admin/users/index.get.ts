/**
 * API Endpoint: GET /api/admin/users
 * 
 * Obtiene lista paginada de usuarios del sistema con filtros opcionales.
 * Requiere permisos de administrador y utiliza service role para acceso completo.
 * 
 * @route GET /api/admin/users
 * @access Admin only - Verificado con requireAdminAuth middleware
 * @auth Service Role - Bypassa RLS para acceso completo a profiles
 * 
 * @param {QueryParams} query - Parámetros de consulta opcionales
 * @param {number} [query.page=1] - Número de página (base 1)
 * @param {number} [query.pageSize=20] - Elementos por página (max 100)
 * @param {string} [query.search] - Término de búsqueda (nombre, apellido, email)
 * @param {ProfileRole} [query.role_filter] - Filtro por rol específico
 * 
 * @returns {PaginatedResponse<Profile>} Lista paginada de perfiles con emails
 * @returns {Profile[]} data - Array de perfiles con datos completos
 * @returns {number} total - Total de registros que coinciden con los filtros
 * @returns {number} page - Página actual
 * @returns {number} per_page - Elementos por página
 * @returns {number} total_pages - Total de páginas disponibles
 * 
 * @throws {401} No autorizado - Usuario no autenticado
 * @throws {403} Sin permisos - Usuario no es administrador
 * @throws {500} Error de base de datos - Problemas con RPC o conexión
 * 
 * @example
 * ```
 * // Obtener primera página con 10 usuarios
 * GET /api/admin/users?page=1&pageSize=10
 * 
 * // Buscar usuarios con término específico
 * GET /api/admin/users?search=juan&role_filter=Inspector
 * 
 * // Respuesta exitosa:
 * {
 *   "data": [
 *     {
 *       "id": "uuid-1",
 *       "user_id": "auth-uuid-1",
 *       "first_name": "Juan",
 *       "last_name": "Pérez",
 *       "user_role": "Inspector",
 *       "email": "juan@inaplast.com",
 *       "full_name": "Juan Pérez",
 *       "created_at": "2023-01-01T00:00:00Z",
 *       "updated_at": "2023-06-01T00:00:00Z"
 *     }
 *   ],
 *   "total": 45,
 *   "page": 1,
 *   "per_page": 10,
 *   "total_pages": 5
 * }
 * ```
 * 
 * @since v1.0.0
 */

import { requireAdminAuth } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  // Validar permisos de administrador COMPLETAMENTE en server-side
  await requireAdminAuth(event)
  
  // Extraer y validar parámetros de query
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