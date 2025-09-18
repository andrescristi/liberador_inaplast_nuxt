/**
 * Composable unificado para operaciones de API de administración de usuarios
 * 
 * Consolida y reemplaza el anterior useAdminUserAPI.ts proporcionando
 * una interfaz unificada que puede usar tanto llamadas directas a Supabase
 * como llamadas a endpoints de la API REST.
 * 
 * @author Inaplast Development Team
 * @since v2.5.0
 */

import type { ProfileFilters, PaginatedResponse, Profile, ProfileResponse } from '~/types'
import { useAdminUserCRUD } from './useAdminUserCRUD'
import { useLogger } from '~/composables/tools/useLogger'

export const useAdminUserAPI = () => {
  const crud = useAdminUserCRUD()
  const logger = useLogger()

  /**
   * Obtiene lista paginada de usuarios usando Supabase directamente
   * Reemplaza la función getAllUsersFromAPI del archivo anterior
   */
  const getAllUsersFromAPI = async (
    filters: ProfileFilters = {},
    page = 1,
    pageSize = 20
  ): Promise<PaginatedResponse<Profile>> => {
    try {
      logger.debug('Llamando a getAllUsers via composable CRUD', {
        filters,
        page,
        pageSize,
        action: 'get_all_users_from_api'
      })

      // Usar el composable CRUD que ya tiene toda la lógica
      const result = await crud.getAllUsers(filters, page, pageSize)
      
      return result
    } catch (error: unknown) {
      // Manejo de errores consistente con el anterior useAdminUserAPI
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      
      logger.error('Error en getAllUsersFromAPI', {
        error: errorMessage,
        filters,
        page,
        pageSize,
        action: 'get_all_users_from_api'
      })
      
      throw new Error(`Error al obtener usuarios: ${errorMessage}`)
    }
  }

  /**
   * Obtiene estadísticas de usuarios usando Supabase directamente
   * Reemplaza la función getUserStatsFromAPI del archivo anterior
   */
  const getUserStatsFromAPI = async (): Promise<{
    total: number
    admins: number
    supervisors: number
    inspectors: number
  }> => {
    try {
      logger.debug('Llamando a getUserStats via composable CRUD', {
        action: 'get_user_stats_from_api'
      })

      // Usar el composable CRUD que ya tiene toda la lógica
      const stats = await crud.getUserStats()
      
      return stats
    } catch (error: unknown) {
      // Manejo de errores consistente con el anterior useAdminUserAPI
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      
      logger.error('Error en getUserStatsFromAPI', {
        error: errorMessage,
        action: 'get_user_stats_from_api'
      })
      
      throw new Error(`Error al obtener estadísticas: ${errorMessage}`)
    }
  }

  /**
   * Obtiene lista de usuarios usando endpoint HTTP REST (si existe)
   * Esta función mantiene la funcionalidad original del archivo anterior
   * pero ahora delegada al composable CRUD para consistencia
   */
  const getAllUsersViaHTTP = async (
    filters: ProfileFilters = {},
    page = 1,
    pageSize = 20
  ): Promise<PaginatedResponse<ProfileResponse>> => {
    try {
      // Construir query string dinámicamente
      const query = new URLSearchParams()
      
      // Solo agregar filtros que tengan valor
      if (filters.search) {
        query.append('search', filters.search)
      }
      
      if (filters.role_filter) {
        query.append('role_filter', filters.role_filter)
      }
      
      // Paginación siempre presente
      query.append('page', page.toString())
      query.append('page_size', pageSize.toString())

      logger.debug('Realizando petición HTTP para obtener usuarios', {
        url: `/api/admin/users/list?${query.toString()}`,
        filters,
        page,
        pageSize,
        action: 'get_all_users_via_http'
      })

      // Llamada a API REST con type safety completo
      const response = await $fetch<PaginatedResponse<ProfileResponse>>(`/api/admin/users/list?${query.toString()}`)
      
      logger.info('Usuarios obtenidos via HTTP exitosamente', {
        total: response.total,
        returned: response.data.length,
        page: response.page,
        action: 'get_all_users_via_http'
      })
      
      return response
    } catch (error: unknown) {
      // Manejo centralizado de errores con mensajes localizados
      
      // Errores de HTTP (401, 403, 500, etc.)
      if (error && typeof error === 'object' && 'statusCode' in error) {
        const fetchError = error as { statusCode: number; statusMessage: string }
        
        logger.error('Error HTTP al obtener usuarios', {
          statusCode: fetchError.statusCode,
          statusMessage: fetchError.statusMessage,
          filters,
          page,
          pageSize,
          action: 'get_all_users_via_http'
        })
        
        throw new Error(fetchError.statusMessage || 'Error al obtener usuarios')
      }
      
      // Errores de red o JavaScript
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      
      logger.error('Error en getAllUsersViaHTTP', {
        error: errorMessage,
        filters,
        page,
        pageSize,
        action: 'get_all_users_via_http'
      })
      
      throw new Error(`Error al obtener usuarios: ${errorMessage}`)
    }
  }

  /**
   * Obtiene estadísticas usando endpoint HTTP REST (si existe)
   */
  const getUserStatsViaHTTP = async (): Promise<{
    total: number
    admins: number
    supervisors: number
    inspectors: number
  }> => {
    try {
      logger.debug('Realizando petición HTTP para obtener estadísticas', {
        url: '/api/admin/users/stats',
        action: 'get_user_stats_via_http'
      })

      // Llamada a endpoint especializado en estadísticas
      const response = await $fetch<{
        total: number
        admins: number
        supervisors: number
        inspectors: number
      }>('/api/admin/users/stats')
      
      // Mapeo explícito para garantizar estructura consistente
      const stats = {
        total: response.total,
        admins: response.admins,
        supervisors: response.supervisors,
        inspectors: response.inspectors
      }
      
      logger.info('Estadísticas obtenidas via HTTP exitosamente', {
        stats,
        action: 'get_user_stats_via_http'
      })
      
      return stats
    } catch (error: unknown) {
      // Errores HTTP estructurados (401 Unauthorized, 403 Forbidden, etc.)
      if (error && typeof error === 'object' && 'statusCode' in error) {
        const fetchError = error as { statusCode: number; statusMessage: string }
        
        logger.error('Error HTTP al obtener estadísticas', {
          statusCode: fetchError.statusCode,
          statusMessage: fetchError.statusMessage,
          action: 'get_user_stats_via_http'
        })
        
        throw new Error(fetchError.statusMessage || 'Error al obtener estadísticas')
      }
      
      // Errores de conectividad o parsing
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      
      logger.error('Error en getUserStatsViaHTTP', {
        error: errorMessage,
        action: 'get_user_stats_via_http'
      })
      
      throw new Error(`Error al obtener estadísticas: ${errorMessage}`)
    }
  }

  /**
   * Resetea la contraseña de un usuario usando el composable CRUD
   */
  const resetUserPassword = async (userId: string): Promise<void> => {
    try {
      logger.debug('Reseteando contraseña de usuario via CRUD', {
        userId,
        action: 'reset_user_password_from_api'
      })

      // Usar el composable CRUD que ya tiene toda la lógica
      await crud.resetUserPassword(userId)
      
      logger.info('Contraseña reseteada exitosamente via API composable', {
        userId,
        action: 'reset_user_password_from_api'
      })
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      
      logger.error('Error en resetUserPassword', {
        error: errorMessage,
        userId,
        action: 'reset_user_password_from_api'
      })
      
      throw new Error(`Error al resetear contraseña: ${errorMessage}`)
    }
  }

  /**
   * Resetea la contraseña usando endpoint HTTP REST
   */
  const resetUserPasswordViaHTTP = async (userId: string): Promise<void> => {
    try {
      logger.debug('Reseteando contraseña via HTTP endpoint', {
        userId,
        action: 'reset_user_password_via_http'
      })

      await $fetch(`/api/admin/users/${userId}/reset-password`, {
        method: 'POST'
      })

      logger.info('Contraseña reseteada exitosamente via HTTP', {
        userId,
        action: 'reset_user_password_via_http'
      })
    } catch (error: unknown) {
      // Errores HTTP estructurados
      if (error && typeof error === 'object' && 'statusCode' in error) {
        const fetchError = error as { statusCode: number; statusMessage: string }

        logger.error('Error HTTP al resetear contraseña', {
          statusCode: fetchError.statusCode,
          statusMessage: fetchError.statusMessage,
          userId,
          action: 'reset_user_password_via_http'
        })

        throw new Error(fetchError.statusMessage || 'Error al resetear contraseña')
      }

      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'

      logger.error('Error en resetUserPasswordViaHTTP', {
        error: errorMessage,
        userId,
        action: 'reset_user_password_via_http'
      })

      throw new Error(`Error al resetear contraseña: ${errorMessage}`)
    }
  }

  /**
   * Establece una nueva contraseña para un usuario usando endpoint HTTP REST
   */
  const setUserPasswordViaHTTP = async (userId: string, password: string): Promise<void> => {
    try {
      logger.debug('Estableciendo contraseña via HTTP endpoint', {
        userId,
        action: 'set_user_password_via_http'
      })

      await $fetch(`/api/admin/users/${userId}/set-password`, {
        method: 'POST',
        body: { password }
      })

      logger.info('Contraseña establecida exitosamente via HTTP', {
        userId,
        action: 'set_user_password_via_http'
      })
    } catch (error: unknown) {
      // Errores HTTP estructurados
      if (error && typeof error === 'object' && 'statusCode' in error) {
        const fetchError = error as { statusCode: number; statusMessage: string }

        logger.error('Error HTTP al establecer contraseña', {
          statusCode: fetchError.statusCode,
          statusMessage: fetchError.statusMessage,
          userId,
          action: 'set_user_password_via_http'
        })

        throw new Error(fetchError.statusMessage || 'Error al establecer contraseña')
      }

      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'

      logger.error('Error en setUserPasswordViaHTTP', {
        error: errorMessage,
        userId,
        action: 'set_user_password_via_http'
      })

      throw new Error(`Error al establecer contraseña: ${errorMessage}`)
    }
  }

  // Interfaz pública del composable
  // Mantiene compatibilidad con el archivo anterior pero con funcionalidad mejorada
  return {
    // Funciones principales (usan Supabase directamente)
    getAllUsersFromAPI,
    getUserStatsFromAPI,
    resetUserPassword,

    // Funciones adicionales (usan endpoints HTTP REST)
    getAllUsersViaHTTP,
    getUserStatsViaHTTP,
    resetUserPasswordViaHTTP,
    setUserPasswordViaHTTP,

    // Acceso directo al composable CRUD para operaciones avanzadas
    crud
  }
}