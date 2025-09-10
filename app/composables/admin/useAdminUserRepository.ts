/**
 * Repository para operaciones CRUD de usuarios administrativos
 * 
 * Implementa el patrón Repository para centralizar todas las operaciones
 * de base de datos relacionadas con usuarios. Proporciona una capa de
 * abstracción sobre Supabase con manejo consistente de errores.
 * 
 * @author Inaplast Development Team
 * @since v2.5.0
 */

import type { 
  Profile, 
  ProfileFilters, 
  CreateProfileForm, 
  UpdateProfileForm,
  PaginatedResponse 
} from '~/types'
import type { Database } from '~/types/database.types'
import { useLogger } from '~/composables/tools/useLogger'

export const useAdminUserRepository = () => {
  const supabase = useSupabaseClient<Database>()
  const logger = useLogger()

  /**
   * Obtiene lista paginada de usuarios con filtros
   */
  const findUsers = async (
    filters: ProfileFilters = {},
    page = 1,
    pageSize = 20
  ): Promise<PaginatedResponse<Profile>> => {
    try {
      logger.debug('Iniciando búsqueda de usuarios', {
        filters,
        page,
        pageSize,
        action: 'find_users'
      })

      const offset = (page - 1) * pageSize

      // Construir query base
      let query = supabase
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

      // Aplicar filtros
      if (filters.search) {
        query = query.or(`first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%`)
      }

      if (filters.role_filter) {
        query = query.eq('user_role', filters.role_filter)
      }

      // Aplicar paginación y ordenamiento
      query = query
        .range(offset, offset + pageSize - 1)
        .order('created_at', { ascending: false })

      const { data, error, count } = await query

      if (error) {
        logger.error('Error al buscar usuarios en base de datos', {
          error: error.message,
          code: error.code,
          filters,
          page,
          pageSize,
          action: 'find_users'
        })
        throw new Error(`Error al buscar usuarios: ${error.message}`)
      }

      // Transformar datos
      const profiles = (data || []).map((profile) => ({
        ...profile,
        full_name: `${profile.first_name} ${profile.last_name}`,
        email: '' // Se poblará en el servicio si es necesario
      }))

      const result = {
        data: profiles,
        total: count || 0,
        page,
        per_page: pageSize,
        total_pages: Math.ceil((count || 0) / pageSize)
      }

      logger.debug('Búsqueda de usuarios completada', {
        total: count,
        returned: profiles.length,
        action: 'find_users'
      })

      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      logger.error('Error en findUsers', {
        error: errorMessage,
        filters,
        page,
        pageSize,
        action: 'find_users'
      })
      throw new Error(`Error al obtener usuarios: ${errorMessage}`)
    }
  }

  /**
   * Obtiene un usuario por su ID
   */
  const findUserById = async (userId: string): Promise<Profile | null> => {
    try {
      logger.debug('Buscando usuario por ID', {
        userId,
        action: 'find_user_by_id'
      })

      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          user_id,
          first_name,
          last_name,
          user_role,
          created_at,
          updated_at
        `)
        .eq('user_id', userId)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          logger.debug('Usuario no encontrado', {
            userId,
            action: 'find_user_by_id'
          })
          return null
        }
        
        logger.error('Error al buscar usuario por ID', {
          error: error.message,
          code: error.code,
          userId,
          action: 'find_user_by_id'
        })
        throw new Error(`Error al buscar usuario: ${error.message}`)
      }

      // Obtener email del usuario de auth
      const { data: authUser } = await supabase.auth.admin.getUserById(userId)
      
      const profile = {
        ...data,
        full_name: `${data.first_name} ${data.last_name}`,
        email: authUser.user?.email || ''
      }

      logger.debug('Usuario encontrado', {
        userId,
        role: profile.user_role,
        action: 'find_user_by_id'
      })

      return profile
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      logger.error('Error en findUserById', {
        error: errorMessage,
        userId,
        action: 'find_user_by_id'
      })
      throw new Error(`Error al buscar usuario: ${errorMessage}`)
    }
  }

  /**
   * Crea un nuevo usuario con cuenta de autenticación
   */
  const createUser = async (
    email: string,
    password: string,
    profileData: CreateProfileForm
  ): Promise<Profile> => {
    try {
      logger.info('Iniciando creación de usuario', {
        email,
        role: profileData.user_role,
        name: `${profileData.first_name} ${profileData.last_name}`,
        action: 'create_user'
      })

      // Crear usuario en auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          first_name: profileData.first_name,
          last_name: profileData.last_name
        }
      })

      if (authError) {
        logger.error('Error al crear cuenta de autenticación', {
          error: authError.message,
          email,
          action: 'create_user'
        })
        throw new Error(`Error al crear cuenta: ${authError.message}`)
      }

      if (!authData.user) {
        const error = 'No se pudo crear la cuenta de usuario'
        logger.error(error, { email, action: 'create_user' })
        throw new Error(error)
      }

      // Actualizar perfil
      const { data: profileUpdateData, error: profileError } = await supabase
        .from('profiles')
        .update({
          first_name: profileData.first_name,
          last_name: profileData.last_name,
          user_role: profileData.user_role
        })
        .eq('user_id', authData.user.id)
        .select()
        .single()

      if (profileError) {
        logger.error('Error al actualizar perfil después de crear usuario', {
          error: profileError.message,
          userId: authData.user.id,
          email,
          action: 'create_user'
        })
        
        // Intentar limpiar el usuario de auth si falla el perfil
        await supabase.auth.admin.deleteUser(authData.user.id)
        throw new Error(`Error al crear perfil: ${profileError.message}`)
      }

      const newProfile = {
        ...profileUpdateData,
        full_name: `${profileUpdateData.first_name} ${profileUpdateData.last_name}`,
        email: authData.user.email || ''
      }

      logger.info('Usuario creado exitosamente', {
        userId: newProfile.user_id,
        email: newProfile.email,
        role: newProfile.user_role,
        name: newProfile.full_name,
        action: 'create_user'
      })

      return newProfile
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      logger.error('Error en createUser', {
        error: errorMessage,
        email,
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
      logger.info('Iniciando actualización de usuario', {
        userId,
        updates: Object.keys(profileData),
        emailUpdate: !!email,
        action: 'update_user'
      })

      // Actualizar email si se proporciona
      if (email) {
        const { error: authError } = await supabase.auth.admin.updateUserById(userId, {
          email
        })
        
        if (authError) {
          logger.error('Error al actualizar email del usuario', {
            error: authError.message,
            userId,
            newEmail: email,
            action: 'update_user'
          })
          throw new Error(`Error al actualizar email: ${authError.message}`)
        }
      }

      // Actualizar perfil
      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...profileData,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select()
        .single()

      if (error) {
        logger.error('Error al actualizar perfil', {
          error: error.message,
          code: error.code,
          userId,
          profileData,
          action: 'update_user'
        })
        throw new Error(`Error al actualizar perfil: ${error.message}`)
      }

      // Obtener email actualizado
      const { data: authUser } = await supabase.auth.admin.getUserById(userId)

      const updatedProfile = {
        ...data,
        full_name: `${data.first_name} ${data.last_name}`,
        email: authUser.user?.email || ''
      }

      logger.info('Usuario actualizado exitosamente', {
        userId,
        changes: Object.keys(profileData),
        emailChanged: !!email,
        action: 'update_user'
      })

      return updatedProfile
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      logger.error('Error en updateUser', {
        error: errorMessage,
        userId,
        action: 'update_user'
      })
      throw new Error(`Error al actualizar usuario: ${errorMessage}`)
    }
  }

  /**
   * Elimina un usuario y su cuenta de autenticación
   */
  const deleteUser = async (userId: string): Promise<void> => {
    try {
      logger.info('Iniciando eliminación de usuario', {
        userId,
        action: 'delete_user'
      })

      // Obtener información del usuario antes de eliminarlo (para logs)
      const { data: userData } = await supabase.auth.admin.getUserById(userId)
      const { data: profileData } = await supabase
        .from('profiles')
        .select('first_name, last_name, user_role')
        .eq('user_id', userId)
        .single()

      // Eliminar usuario (esto también elimina el perfil por CASCADE)
      const { error } = await supabase.auth.admin.deleteUser(userId)
      
      if (error) {
        logger.error('Error al eliminar usuario', {
          error: error.message,
          userId,
          action: 'delete_user'
        })
        throw new Error(`Error al eliminar usuario: ${error.message}`)
      }

      logger.info('Usuario eliminado exitosamente', {
        userId,
        email: userData.user?.email,
        name: profileData ? `${profileData.first_name} ${profileData.last_name}` : 'Desconocido',
        role: profileData?.user_role,
        action: 'delete_user'
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      logger.error('Error en deleteUser', {
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
      logger.info('Iniciando reset de contraseña', {
        userId,
        action: 'reset_password'
      })

      const { data: userData } = await supabase.auth.admin.getUserById(userId)
      
      if (!userData.user?.email) {
        const error = 'Email del usuario no encontrado'
        logger.error(error, { userId, action: 'reset_password' })
        throw new Error(error)
      }

      const { error } = await supabase.auth.resetPasswordForEmail(userData.user.email)
      
      if (error) {
        logger.error('Error al enviar reset de contraseña', {
          error: error.message,
          userId,
          email: userData.user.email,
          action: 'reset_password'
        })
        throw new Error(`Error al resetear contraseña: ${error.message}`)
      }

      logger.info('Reset de contraseña enviado exitosamente', {
        userId,
        email: userData.user.email,
        action: 'reset_password'
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      logger.error('Error en resetUserPassword', {
        error: errorMessage,
        userId,
        action: 'reset_password'
      })
      throw new Error(`Error al resetear contraseña: ${errorMessage}`)
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
      logger.debug('Obteniendo estadísticas de usuarios', {
        action: 'get_user_stats'
      })

      const { data, error } = await supabase
        .from('profiles')
        .select('user_role')

      if (error) {
        logger.error('Error al obtener estadísticas', {
          error: error.message,
          code: error.code,
          action: 'get_user_stats'
        })
        throw new Error(`Error al obtener estadísticas: ${error.message}`)
      }

      const stats = {
        total: data.length,
        admins: data.filter(p => p.user_role === 'Admin').length,
        supervisors: data.filter(p => p.user_role === 'Supervisor').length,
        inspectors: data.filter(p => p.user_role === 'Inspector').length
      }

      logger.debug('Estadísticas obtenidas', {
        stats,
        action: 'get_user_stats'
      })

      return stats
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      logger.error('Error en getUserStats', {
        error: errorMessage,
        action: 'get_user_stats'
      })
      throw new Error(`Error al obtener estadísticas: ${errorMessage}`)
    }
  }

  return {
    findUsers,
    findUserById,
    createUser,
    updateUser,
    deleteUser,
    resetUserPassword,
    getUserStats
  }
}