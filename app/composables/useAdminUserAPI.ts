import type { Profile, ProfileFilters, PaginatedResponse } from '~/types'

export const useAdminUserAPI = () => {
  
  const getAllUsersFromAPI = async (
    filters: ProfileFilters = {},
    page = 1,
    pageSize = 20
  ): Promise<PaginatedResponse<Profile>> => {
    try {
      const query = new URLSearchParams()
      
      if (filters.search) {
        query.append('search', filters.search)
      }
      
      if (filters.role_filter) {
        query.append('role_filter', filters.role_filter)
      }
      
      query.append('page', page.toString())
      query.append('page_size', pageSize.toString())

      const response = await $fetch<PaginatedResponse<Profile>>(`/api/admin/users/list?${query.toString()}`)
      
      return response
    } catch (error: unknown) {
      // Handle fetch errors
      if (error && typeof error === 'object' && 'statusCode' in error) {
        const fetchError = error as { statusCode: number; statusMessage: string }
        throw new Error(fetchError.statusMessage || 'Error al obtener usuarios')
      }
      
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      throw new Error(`Error al obtener usuarios: ${errorMessage}`)
    }
  }

  const getUserStatsFromAPI = async (): Promise<{
    total: number
    admins: number
    supervisors: number
    inspectors: number
  }> => {
    try {
      const response = await $fetch<{
        total: number
        admins: number
        supervisors: number
        inspectors: number
      }>('/api/admin/users/stats')
      
      return {
        total: response.total,
        admins: response.admins,
        supervisors: response.supervisors,
        inspectors: response.inspectors
      }
    } catch (error: unknown) {
      // Handle fetch errors
      if (error && typeof error === 'object' && 'statusCode' in error) {
        const fetchError = error as { statusCode: number; statusMessage: string }
        throw new Error(fetchError.statusMessage || 'Error al obtener estadísticas')
      }
      
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      throw new Error(`Error al obtener estadísticas: ${errorMessage}`)
    }
  }

  return {
    getAllUsersFromAPI,
    getUserStatsFromAPI
  }
}