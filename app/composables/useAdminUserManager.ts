/**
 * Composable principal para gestión administrativa de usuarios
 * 
 * Actúa como orquestador principal que combina todos los composables especializados
 * manteniendo compatibilidad hacia atrás con la API existente.
 * 
 * REFACTORIZADO v2.5.0:
 * - Dividido en múltiples composables especializados
 * - Mejorado manejo de errores con logging consistente
 * - Agregadas validaciones con Zod
 * - Implementado patrón Repository
 * - Consolidada funcionalidad con useAdminUserAPI
 * 
 * @author Inaplast Development Team
 * @since v1.0.0
 * @version v2.5.0 - Refactorización arquitectónica mayor
 */

import type { Profile, ProfileRole, ProfileFilters, PaginatedResponse, CreateProfileForm, UpdateProfileForm } from '~/types'
import { useAdminUserCRUD } from './admin/useAdminUserCRUD'
import { useAdminUserState } from './admin/useAdminUserState'
import { useLogger } from './useLogger'

/**
 * Composable principal de administración de usuarios
 * 
 * Proporciona una interfaz unificada y compatible hacia atrás para todas
 * las operaciones de administración de usuarios.
 * 
 * @example
 * ```typescript
 * const {
 *   getAllUsers,
 *   createUser,
 *   updateUser,
 *   deleteUser,
 *   getUserStats
 * } = useAdminUserManager()
 * ```
 */
export const useAdminUserManager = () => {
  const crud = useAdminUserCRUD()
  const state = useAdminUserState()
  const logger = useLogger()

  /**
   * Obtiene lista paginada de usuarios con filtros
   * 
   * Mantiene la misma interfaz que la versión anterior pero ahora
   * utiliza la arquitectura refactorizada con mejor manejo de errores.
   * 
   * @param filters - Filtros de búsqueda y rol
   * @param page - Número de página (base 1)
   * @param pageSize - Elementos por página
   * @returns Lista paginada de usuarios
   */
  const getAllUsers = async (
    filters: ProfileFilters = {},
    page = 1,
    pageSize = 20
  ): Promise<PaginatedResponse<Profile>> => {
    try {
      logger.debug('useAdminUserManager.getAllUsers llamado', {
        filters,
        page,
        pageSize,
        action: 'admin_manager_get_all_users'
      })
      
      return await crud.getAllUsers(filters, page, pageSize)
    } catch (error) {
      logger.error('Error en useAdminUserManager.getAllUsers', {
        error: error instanceof Error ? error.message : 'Error desconocido',
        filters,
        page,
        pageSize,
        action: 'admin_manager_get_all_users'
      })
      throw error
    }
  }

  /**
   * Obtiene un usuario específico por ID
   * 
   * @param userId - ID del usuario a obtener
   * @returns Usuario encontrado o null si no existe
   */
  const getUserById = async (userId: string): Promise<Profile | null> => {
    try {
      logger.debug('useAdminUserManager.getUserById llamado', {
        userId,
        action: 'admin_manager_get_user_by_id'
      })
      
      return await crud.getUserById(userId)
    } catch (error) {
      logger.error('Error en useAdminUserManager.getUserById', {
        error: error instanceof Error ? error.message : 'Error desconocido',
        userId,
        action: 'admin_manager_get_user_by_id'
      })
      throw error
    }
  }

  /**
   * Crea un nuevo usuario con cuenta de autenticación
   * 
   * @param email - Email del nuevo usuario
   * @param password - Contraseña temporal
   * @param profileData - Datos del perfil
   * @returns Usuario creado
   */
  const createUser = async (
    email: string,
    password: string,
    profileData: CreateProfileForm
  ): Promise<Profile> => {
    try {
      logger.info('useAdminUserManager.createUser llamado', {
        email,
        profileData: {
          first_name: profileData.first_name,
          last_name: profileData.last_name,
          user_role: profileData.user_role
        },
        action: 'admin_manager_create_user'
      })
      
      return await crud.createUser(email, password, profileData)
    } catch (error) {
      logger.error('Error en useAdminUserManager.createUser', {
        error: error instanceof Error ? error.message : 'Error desconocido',
        email,
        profileData,
        action: 'admin_manager_create_user'
      })
      throw error
    }
  }

  /**
   * Actualiza un usuario existente
   * 
   * @param userId - ID del usuario a actualizar
   * @param profileData - Datos a actualizar
   * @param email - Nuevo email (opcional)
   * @returns Usuario actualizado
   */
  const updateUser = async (
    userId: string,
    profileData: UpdateProfileForm,
    email?: string
  ): Promise<Profile> => {
    try {
      logger.info('useAdminUserManager.updateUser llamado', {
        userId,
        profileData,
        emailUpdate: !!email,
        action: 'admin_manager_update_user'
      })
      
      return await crud.updateUser(userId, profileData, email)
    } catch (error) {
      logger.error('Error en useAdminUserManager.updateUser', {
        error: error instanceof Error ? error.message : 'Error desconocido',
        userId,
        profileData,
        email,
        action: 'admin_manager_update_user'
      })
      throw error
    }
  }

  /**
   * Elimina un usuario y su cuenta de autenticación
   * 
   * @param userId - ID del usuario a eliminar
   */
  const deleteUser = async (userId: string): Promise<void> => {
    try {
      logger.info('useAdminUserManager.deleteUser llamado', {
        userId,
        action: 'admin_manager_delete_user'
      })
      
      await crud.deleteUser(userId)
    } catch (error) {
      logger.error('Error en useAdminUserManager.deleteUser', {
        error: error instanceof Error ? error.message : 'Error desconocido',
        userId,
        action: 'admin_manager_delete_user'
      })
      throw error
    }
  }

  /**
   * Reinicia la contraseña de un usuario
   * 
   * @param userId - ID del usuario
   */
  const resetUserPassword = async (userId: string): Promise<void> => {
    try {
      logger.info('useAdminUserManager.resetUserPassword llamado', {
        userId,
        action: 'admin_manager_reset_password'
      })
      
      await crud.resetUserPassword(userId)
    } catch (error) {
      logger.error('Error en useAdminUserManager.resetUserPassword', {
        error: error instanceof Error ? error.message : 'Error desconocido',
        userId,
        action: 'admin_manager_reset_password'
      })
      throw error
    }
  }

  /**
   * Obtiene estadísticas de usuarios por rol
   * 
   * @returns Estadísticas agregadas por rol
   */
  const getUserStats = async (): Promise<{
    total: number
    admins: number
    supervisors: number
    inspectors: number
  }> => {
    try {
      logger.debug('useAdminUserManager.getUserStats llamado', {
        action: 'admin_manager_get_stats'
      })
      
      return await crud.getUserStats()
    } catch (error) {
      logger.error('Error en useAdminUserManager.getUserStats', {
        error: error instanceof Error ? error.message : 'Error desconocido',
        action: 'admin_manager_get_stats'
      })
      throw error
    }
  }

  /**
   * Obtiene opciones de roles disponibles
   * 
   * @returns Lista de opciones de rol con etiquetas localizadas
   */
  const getRoleOptions = (): { label: string; value: ProfileRole }[] => {
    return crud.getRoleOptions()
  }

  /**
   * Verifica si el usuario actual es administrador
   * 
   * @returns true si es administrador, false de lo contrario
   */
  const checkIsAdmin = async (): Promise<boolean> => {
    try {
      return await crud.checkIsAdmin()
    } catch (error) {
      logger.error('Error en useAdminUserManager.checkIsAdmin', {
        error: error instanceof Error ? error.message : 'Error desconocido',
        action: 'admin_manager_check_admin'
      })
      return false
    }
  }

  /**
   * Obtiene logs de actividad del sistema
   * 
   * NOTA: Esta función está pendiente de implementación en la base de datos.
   * Actualmente retorna un array vacío para mantener compatibilidad.
   * 
   * @param _limit - Límite de registros (no usado actualmente)
   * @param _offset - Offset para paginación (no usado actualmente)
   * @param _activityType - Tipo de actividad a filtrar (no usado actualmente)
   * @param _targetUserId - ID del usuario objetivo (no usado actualmente)
   * @returns Array vacío hasta que se implemente la función en BD
   */
  const getActivityLogs = async (
    _limit = 50,
    _offset = 0,
    _activityType?: string,
    _targetUserId?: string
  ): Promise<{
    id: string;
    actor_user_id: string;
    target_user_id: string | null;
    activity_type: string;
    activity_description: string;
    metadata: Record<string, unknown>;
    created_at: string;
  }[]> => {
    try {
      await crud.checkIsAdmin() // Verificar permisos
      
      logger.info('useAdminUserManager.getActivityLogs llamado', {
        limit: _limit,
        offset: _offset,
        activityType: _activityType,
        targetUserId: _targetUserId,
        action: 'admin_manager_get_activity_logs'
      })
      
      // TODO: Implementar función get_activity_logs en la base de datos
      // const { data, error } = await supabase.rpc('get_activity_logs', {
      //   p_limit: limit,
      //   p_offset: offset,
      //   p_activity_type: activityType || null,
      //   p_target_user_id: targetUserId || null
      // })
      // if (error) throw error
      // return data || []
      
      logger.warn('getActivityLogs no implementado - retornando array vacío', {
        action: 'admin_manager_get_activity_logs'
      })
      
      return []
    } catch (error) {
      logger.error('Error en useAdminUserManager.getActivityLogs', {
        error: error instanceof Error ? error.message : 'Error desconocido',
        action: 'admin_manager_get_activity_logs'
      })
      throw new Error(`Error al obtener logs de actividad: ${error instanceof Error ? error.message : 'Error desconocido'}`)
    }
  }

  // Interfaz pública del composable
  // Mantiene 100% compatibilidad hacia atrás con la versión anterior
  return {
    // Operaciones CRUD principales (interfaz compatible)
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    resetUserPassword,
    getUserStats,
    getRoleOptions,
    getActivityLogs,
    checkIsAdmin,
    
    // Acceso a funcionalidades avanzadas de la nueva arquitectura
    // (para uso avanzado sin romper compatibilidad)
    _internal: {
      crud,
      state
    }
  }
}