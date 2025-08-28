/**
 * Composable para operaciones CRUD de usuarios administrativos
 * 
 * Combina repository, validaciones y autorización para proporcionar
 * operaciones CRUD completas con manejo consistente de errores y logging.
 * 
 * @author Inaplast Development Team
 * @since v2.5.0
 */

import type { 
  Profile, 
  ProfileFilters, 
  CreateProfileForm, 
  UpdateProfileForm,
  PaginatedResponse,
  ProfileRole
} from '~/types'
import { useAdminUserRepository } from './useAdminUserRepository'
import { useAdminUserValidation } from './useAdminUserValidation'
import { useAdminUserAuth } from './useAdminUserAuth'
import { useAdminUserState } from './useAdminUserState'
import { useLogger } from '~/composables/useLogger'

export const useAdminUserCRUD = () => {
  const repository = useAdminUserRepository()
  const validation = useAdminUserValidation()
  const auth = useAdminUserAuth()
  const state = useAdminUserState()
  const logger = useLogger()

  /**
   * Obtiene lista paginada de usuarios con validación y autorización
   */
  const getAllUsers = async (
    filters: ProfileFilters = {},
    page = 1,
    pageSize = 20
  ): Promise<PaginatedResponse<Profile>> => {
    try {
      // Autorización
      await auth.requireAdminAccess('get_all_users')
      
      // Validación
      const validFilters = validation.validateUserFilters(filters) || {}
      const { page: validPage, pageSize: validPageSize } = validation.validatePagination(page, pageSize)
      
      // Sanitizar término de búsqueda si existe
      if (validFilters.search) {
        validFilters.search = validation.sanitizeSearchText(validFilters.search)
      }
      
      // Actualizar estado de carga
      state.setUserListLoading(true)
      
      // Ejecutar operación
      const result = await repository.findUsers(validFilters, validPage, validPageSize)
      
      // Actualizar estado
      state.setUserList(result.data, result.total, result.page, result.per_page)
      
      logger.info('Lista de usuarios obtenida exitosamente', {
        filters: validFilters,
        page: validPage,
        pageSize: validPageSize,
        total: result.total,
        returned: result.data.length,
        action: 'get_all_users'
      })
      
      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      state.setUserListError(errorMessage)
      
      logger.error('Error al obtener lista de usuarios', {
        error: errorMessage,
        filters,
        page,
        pageSize,
        action: 'get_all_users'
      })
      
      throw new Error(`Error al obtener usuarios: ${errorMessage}`)
    }
  }

  /**
   * Obtiene un usuario específico por ID
   */
  const getUserById = async (userId: string): Promise<Profile | null> => {
    try {
      // Autorización
      await auth.requireAdminAccess('get_user_by_id')
      
      // Validación
      const validUserId = validation.validateUUID(userId)
      
      // Ejecutar operación
      const user = await repository.findUserById(validUserId)
      
      // Actualizar estado si se encuentra el usuario
      if (user) {
        state.setSelectedUser(user)
        
        logger.info('Usuario obtenido por ID', {
          userId: validUserId,
          userName: user.full_name,
          role: user.user_role,
          action: 'get_user_by_id'
        })
      } else {
        logger.info('Usuario no encontrado por ID', {
          userId: validUserId,
          action: 'get_user_by_id'
        })
      }
      
      return user
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      
      logger.error('Error al obtener usuario por ID', {
        error: errorMessage,
        userId,
        action: 'get_user_by_id'
      })
      
      throw new Error(`Error al obtener usuario: ${errorMessage}`)
    }
  }

  /**
   * Crea un nuevo usuario con validación completa
   */
  const createUser = async (
    email: string,
    password: string,
    profileData: CreateProfileForm
  ): Promise<Profile> => {
    try {
      // Autorización
      await auth.requireAdminAccess('create_user')
      
      // Validación
      const validData = validation.validateCreateUser({
        email,
        password,
        ...profileData
      })
      
      // Ejecutar operación
      const newUser = await repository.createUser(
        validData.email,
        validData.password,
        {
          first_name: validData.first_name,
          last_name: validData.last_name,
          user_role: validData.user_role
        }
      )
      
      // Actualizar estado local
      state.addUserToList(newUser)
      
      logger.info('Usuario creado exitosamente', {
        userId: newUser.user_id,
        email: newUser.email,
        name: newUser.full_name,
        role: newUser.user_role,
        action: 'create_user'
      })
      
      return newUser
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      
      logger.error('Error al crear usuario', {
        error: errorMessage,
        email,
        profileData: {
          first_name: profileData.first_name,
          last_name: profileData.last_name,
          user_role: profileData.user_role
        },
        action: 'create_user'
      })
      
      throw new Error(`Error al crear usuario: ${errorMessage}`)
    }
  }

  /**
   * Actualiza un usuario existente
   */
  const updateUser = async (
    userId: string,
    profileData: UpdateProfileForm,
    email?: string
  ): Promise<Profile> => {
    try {
      // Autorización
      await auth.requireAdminAccess('update_user')
      
      // Validación
      const validUserId = validation.validateUUID(userId)
      const validProfileData = validation.validateUpdateUser(profileData)
      const validEmail = email ? validation.validateEmail(email) : undefined
      
      // Ejecutar operación
      const updatedUser = await repository.updateUser(
        validUserId,
        validProfileData,
        validEmail
      )
      
      // Actualizar estado local
      state.updateUserInList(updatedUser)
      
      logger.info('Usuario actualizado exitosamente', {
        userId: validUserId,
        changes: Object.keys(validProfileData),
        emailChanged: !!validEmail,
        name: updatedUser.full_name,
        role: updatedUser.user_role,
        action: 'update_user'
      })
      
      return updatedUser
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      
      logger.error('Error al actualizar usuario', {
        error: errorMessage,
        userId,
        profileData,
        email,
        action: 'update_user'
      })
      
      throw new Error(`Error al actualizar usuario: ${errorMessage}`)
    }
  }

  /**
   * Elimina un usuario con validaciones de seguridad
   */
  const deleteUser = async (userId: string): Promise<void> => {
    try {
      // Autorización
      await auth.requireAdminAccess('delete_user')
      
      // Validación
      const validUserId = validation.validateUUID(userId)
      
      // Validar que no se elimine a sí mismo
      auth.validateSelfDeletion(validUserId)
      
      // Ejecutar operación
      await repository.deleteUser(validUserId)
      
      // Actualizar estado local
      state.removeUserFromList(validUserId)
      
      logger.info('Usuario eliminado exitosamente', {
        userId: validUserId,
        action: 'delete_user'
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      
      logger.error('Error al eliminar usuario', {
        error: errorMessage,
        userId,
        action: 'delete_user'
      })
      
      throw new Error(`Error al eliminar usuario: ${errorMessage}`)
    }
  }

  /**
   * Reinicia la contraseña de un usuario
   */
  const resetUserPassword = async (userId: string): Promise<void> => {
    try {
      // Autorización
      await auth.requireAdminAccess('reset_user_password')
      
      // Validación
      const validUserId = validation.validateUUID(userId)
      
      // Ejecutar operación
      await repository.resetUserPassword(validUserId)
      
      logger.info('Contraseña reiniciada exitosamente', {
        userId: validUserId,
        action: 'reset_user_password'
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      
      logger.error('Error al reiniciar contraseña', {
        error: errorMessage,
        userId,
        action: 'reset_user_password'
      })
      
      throw new Error(`Error al reiniciar contraseña: ${errorMessage}`)
    }
  }

  /**
   * Obtiene estadísticas de usuarios por rol
   */
  const getUserStats = async (): Promise<{
    total: number
    admins: number
    supervisors: number
    inspectors: number
  }> => {
    try {
      // Autorización
      await auth.requireAdminAccess('get_user_stats')
      
      // Actualizar estado de carga
      state.setUserStatsLoading(true)
      
      // Ejecutar operación
      const stats = await repository.getUserStats()
      
      // Actualizar estado
      state.setUserStats(stats)
      
      logger.info('Estadísticas de usuarios obtenidas', {
        stats,
        action: 'get_user_stats'
      })
      
      return stats
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      state.setUserStatsError(errorMessage)
      
      logger.error('Error al obtener estadísticas de usuarios', {
        error: errorMessage,
        action: 'get_user_stats'
      })
      
      throw new Error(`Error al obtener estadísticas: ${errorMessage}`)
    }
  }

  /**
   * Obtiene opciones de roles disponibles
   */
  const getRoleOptions = (): { label: string; value: ProfileRole }[] => [
    { label: 'Administrador', value: 'Admin' },
    { label: 'Supervisor', value: 'Supervisor' },
    { label: 'Inspector', value: 'Inspector' }
  ]

  /**
   * Valida si el usuario actual es administrador
   */
  const checkIsAdmin = async (): Promise<boolean> => {
    try {
      return await auth.checkIsAdmin()
    } catch (error) {
      logger.error('Error al verificar permisos de administrador', {
        error: error instanceof Error ? error.message : 'Error desconocido',
        action: 'check_is_admin'
      })
      return false
    }
  }

  return {
    // Operaciones CRUD principales
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    resetUserPassword,
    getUserStats,
    
    // Utilidades
    getRoleOptions,
    checkIsAdmin,
    
    // Estado (para acceso directo si es necesario)
    state
  }
}