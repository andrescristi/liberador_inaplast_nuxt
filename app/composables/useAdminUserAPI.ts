import type { Profile, ProfileFilters, PaginatedResponse } from '~/types'

/**
 * Composable para operaciones de API relacionadas con administración de usuarios
 * 
 * Proporciona funciones optimizadas para el panel de administración:
 * - Búsqueda y filtrado de usuarios paginado
 * - Estadísticas agregadas por roles
 * - Manejo centralizado de errores de API
 * 
 * Todas las funciones requieren permisos de administrador a nivel de servidor.
 */
export const useAdminUserAPI = () => {
  
  /**
   * Obtiene lista paginada de usuarios con filtros opcionales
   * 
   * Construye dinámicamente la query string para evitar parámetros undefined/null
   * que podrían interferir con la API del servidor.
   * 
   * @param filters - Filtros de búsqueda y rol
   * @param page - Número de página (base 1)
   * @param pageSize - Elementos por página (máximo 100 en servidor)
   * @returns Lista paginada con metadatos de paginación
   * 
   * @throws {Error} Con mensaje en español si hay problemas de autenticación/autorización
   * @throws {Error} Con mensaje en español si hay errores de conectividad
   */
  const getAllUsersFromAPI = async (
    filters: ProfileFilters = {},
    page = 1,
    pageSize = 20
  ): Promise<PaginatedResponse<Profile>> => {
    try {
      // Construir query string dinámicamente para evitar parámetros vacíos
      const query = new URLSearchParams()
      
      // Solo agregar filtros que tengan valor para limpiar la URL
      if (filters.search) {
        query.append('search', filters.search)
      }
      
      if (filters.role_filter) {
        query.append('role_filter', filters.role_filter)
      }
      
      // Paginación siempre presente
      query.append('page', page.toString())
      query.append('page_size', pageSize.toString())

      // Llamada a API con type safety completo
      const response = await $fetch<PaginatedResponse<Profile>>(`/api/admin/users/list?${query.toString()}`)
      
      return response
    } catch (error: unknown) {
      // Manejo centralizado de errores con mensajes localizados
      
      // Errores de HTTP (401, 403, 500, etc.) vienen con statusCode y statusMessage
      if (error && typeof error === 'object' && 'statusCode' in error) {
        const fetchError = error as { statusCode: number; statusMessage: string }
        throw new Error(fetchError.statusMessage || 'Error al obtener usuarios')
      }
      
      // Errores de red o JavaScript vienen como Error instances
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      throw new Error(`Error al obtener usuarios: ${errorMessage}`)
    }
  }

  /**
   * Obtiene estadísticas agregadas de usuarios por rol
   * 
   * Endpoint optimizado que usa consultas agregadas en PostgreSQL
   * para evitar transferir toda la data de usuarios solo para contar.
   * 
   * Útil para:
   * - Dashboard de administración
   * - Métricas en tiempo real
   * - Reportes de sistema
   * 
   * @returns Objeto con conteos por rol y total general
   * 
   * @throws {Error} Con mensaje en español si hay problemas de permisos
   * @throws {Error} Con mensaje en español si la API está inaccesible
   */
  const getUserStatsFromAPI = async (): Promise<{
    total: number
    admins: number
    supervisors: number
    inspectors: number
  }> => {
    try {
      // Llamada a endpoint especializado en estadísticas
      // Más eficiente que getAllUsers().length
      const response = await $fetch<{
        total: number
        admins: number
        supervisors: number
        inspectors: number
      }>('/api/admin/users/stats')
      
      // Mapeo explícito para garantizar estructura consistente
      // Protege contra cambios en el formato de respuesta del servidor
      return {
        total: response.total,
        admins: response.admins,
        supervisors: response.supervisors,
        inspectors: response.inspectors
      }
    } catch (error: unknown) {
      // Manejo de errores idéntico al de getAllUsersFromAPI para consistencia
      
      // Errores HTTP estructurados (401 Unauthorized, 403 Forbidden, etc.)
      if (error && typeof error === 'object' && 'statusCode' in error) {
        const fetchError = error as { statusCode: number; statusMessage: string }
        throw new Error(fetchError.statusMessage || 'Error al obtener estadísticas')
      }
      
      // Errores de conectividad o parsing
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      throw new Error(`Error al obtener estadísticas: ${errorMessage}`)
    }
  }

  // Interfaz pública del composable
  // Solo exponer las funciones necesarias para mantener encapsulación
  return {
    getAllUsersFromAPI,
    getUserStatsFromAPI
  }
}