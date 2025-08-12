import type { Profile, ProfileFilters, PaginatedResponse } from '~/types'

export const useAdminUsers = () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

  const listUsers = async (
    filters: ProfileFilters = {},
    page = 1,
    pageSize = 20
  ): Promise<PaginatedResponse<Profile>> => {
    if (!user.value) {
      throw new Error('Usuario no autenticado')
    }

    // Get the session to get the access token
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session?.access_token) {
      throw new Error('No se pudo obtener el token de acceso')
    }

    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
        ...(filters.search && { search: filters.search }),
        ...(filters.role_filter && { roleFilter: filters.role_filter })
      })
      
      const response = await fetch(
        `https://ohgyqnxrtvjjambumksj.supabase.co/functions/v1/list-admin-users?${queryParams.toString()}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json'
          }
        }
      )

      

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Error HTTP: ${response.status}`)
      }

      const data = await response.json()
      

      // La edge function devuelve la respuesta bajo la propiedad "users"
      const usersData = data.users || data
      
      if (!Array.isArray(usersData)) {
        // Si no hay usuarios o respuesta inesperada
        return {
          data: [],
          total: 0,
          page,
          per_page: pageSize,
          total_pages: 0
        }
      }

      // Mapear los datos de usuarios y aplicar filtros localmente
      let filteredUsers = usersData.map((user: Record<string, unknown>) => ({
        id: user.id as string,
        user_id: user.user_id as string,
        first_name: user.first_name as string,
        last_name: user.last_name as string,
        user_role: user.user_role as 'Admin' | 'Inspector' | 'Supervisor',
        created_at: user.created_at as string,
        updated_at: user.updated_at as string,
        full_name: `${user.first_name} ${user.last_name}`,
        email: (user.email as string) || ''
      }))

      // Aplicar filtros localmente ya que la edge function no los maneja
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        filteredUsers = filteredUsers.filter(user => 
          user.first_name.toLowerCase().includes(searchLower) ||
          user.last_name.toLowerCase().includes(searchLower) ||
          user.full_name.toLowerCase().includes(searchLower) ||
          (user.email && typeof user.email === 'string' && user.email.toLowerCase().includes(searchLower))
        )
      }

      if (filters.role_filter) {
        filteredUsers = filteredUsers.filter(user => user.user_role === filters.role_filter)
      }

      // Aplicar paginación local
      const total = filteredUsers.length
      const totalPages = Math.ceil(total / pageSize)
      const startIndex = (page - 1) * pageSize
      const endIndex = startIndex + pageSize
      const paginatedUsers = filteredUsers.slice(startIndex, endIndex)

      return {
        data: paginatedUsers,
        total,
        page,
        per_page: pageSize,
        total_pages: totalPages
      }

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      throw new Error(`Error al obtener usuarios: ${errorMessage}`)
    }
  }

  return {
    listUsers
  }
}