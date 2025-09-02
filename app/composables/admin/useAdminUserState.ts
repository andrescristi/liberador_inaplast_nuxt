/**
 * Composable para gestión de estado de usuarios administrativos
 * 
 * Centraliza el manejo de estado reactivo para operaciones de administración
 * de usuarios, incluyendo filtros, búsqueda, paginación y caché de datos.
 * 
 * @author Inaplast Development Team
 * @since v2.5.0
 */

import type { ProfileRole, ProfileFilters, Profile } from '~/types'
import { useLogger } from '~/composables/tools/useLogger'

interface UserListState {
  users: Profile[]
  total: number
  currentPage: number
  pageSize: number
  totalPages: number
  isLoading: boolean
  error: string | null
  lastFetch: Date | null
}

interface UserStatsState {
  total: number
  admins: number
  supervisors: number
  inspectors: number
  isLoading: boolean
  error: string | null
  lastFetch: Date | null
}

export const useAdminUserState = () => {
  const logger = useLogger()

  // Estado reactivo para lista de usuarios
  const userListState = ref<UserListState>({
    users: [],
    total: 0,
    currentPage: 1,
    pageSize: 20,
    totalPages: 0,
    isLoading: false,
    error: null,
    lastFetch: null
  })

  // Estado reactivo para estadísticas
  const userStatsState = ref<UserStatsState>({
    total: 0,
    admins: 0,
    supervisors: 0,
    inspectors: 0,
    isLoading: false,
    error: null,
    lastFetch: null
  })

  // Estado reactivo para filtros
  const filtersState = ref<ProfileFilters>({
    search: '',
    role_filter: undefined
  })

  // Estado reactivo para usuario seleccionado
  const selectedUser = ref<Profile | null>(null)

  /**
   * Actualiza el estado de la lista de usuarios
   */
  const setUserList = (
    users: Profile[],
    total: number,
    page: number,
    pageSize: number
  ) => {
    userListState.value = {
      ...userListState.value,
      users,
      total,
      currentPage: page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
      isLoading: false,
      error: null,
      lastFetch: new Date()
    }

    logger.debug('Estado de lista de usuarios actualizado', {
      usersCount: users.length,
      total,
      page,
      totalPages: userListState.value.totalPages,
      action: 'set_user_list'
    })
  }

  /**
   * Actualiza el estado de carga de la lista
   */
  const setUserListLoading = (isLoading: boolean) => {
    userListState.value.isLoading = isLoading
    
    if (isLoading) {
      userListState.value.error = null
    }
  }

  /**
   * Establece un error en la lista de usuarios
   */
  const setUserListError = (error: string) => {
    userListState.value.error = error
    userListState.value.isLoading = false
    
    logger.error('Error en lista de usuarios', {
      error,
      action: 'set_user_list_error'
    })
  }

  /**
   * Actualiza el estado de estadísticas
   */
  const setUserStats = (stats: {
    total: number
    admins: number
    supervisors: number
    inspectors: number
  }) => {
    userStatsState.value = {
      ...stats,
      isLoading: false,
      error: null,
      lastFetch: new Date()
    }

    logger.debug('Estadísticas de usuarios actualizadas', {
      stats,
      action: 'set_user_stats'
    })
  }

  /**
   * Actualiza el estado de carga de estadísticas
   */
  const setUserStatsLoading = (isLoading: boolean) => {
    userStatsState.value.isLoading = isLoading
    
    if (isLoading) {
      userStatsState.value.error = null
    }
  }

  /**
   * Establece un error en las estadísticas
   */
  const setUserStatsError = (error: string) => {
    userStatsState.value.error = error
    userStatsState.value.isLoading = false
    
    logger.error('Error en estadísticas de usuarios', {
      error,
      action: 'set_user_stats_error'
    })
  }

  /**
   * Actualiza los filtros de búsqueda
   */
  const setFilters = (filters: ProfileFilters) => {
    filtersState.value = { ...filters }
    
    logger.debug('Filtros actualizados', {
      filters,
      action: 'set_filters'
    })
  }

  /**
   * Limpia los filtros
   */
  const clearFilters = () => {
    filtersState.value = {
      search: '',
      role_filter: undefined
    }
    
    logger.debug('Filtros limpiados', { action: 'clear_filters' })
  }

  /**
   * Establece el término de búsqueda
   */
  const setSearchTerm = (search: string) => {
    filtersState.value.search = search
    
    logger.debug('Término de búsqueda actualizado', {
      search,
      action: 'set_search_term'
    })
  }

  /**
   * Establece el filtro de rol
   */
  const setRoleFilter = (role: ProfileRole | undefined) => {
    filtersState.value.role_filter = role
    
    logger.debug('Filtro de rol actualizado', {
      role,
      action: 'set_role_filter'
    })
  }

  /**
   * Establece el usuario seleccionado
   */
  const setSelectedUser = (user: Profile | null) => {
    selectedUser.value = user
    
    logger.debug('Usuario seleccionado actualizado', {
      userId: user?.user_id,
      userName: user?.full_name,
      action: 'set_selected_user'
    })
  }

  /**
   * Actualiza la página actual
   */
  const setCurrentPage = (page: number) => {
    userListState.value.currentPage = page
    
    logger.debug('Página actual actualizada', {
      page,
      action: 'set_current_page'
    })
  }

  /**
   * Actualiza el tamaño de página
   */
  const setPageSize = (size: number) => {
    userListState.value.pageSize = size
    userListState.value.currentPage = 1 // Reset a la primera página
    
    logger.debug('Tamaño de página actualizado', {
      size,
      action: 'set_page_size'
    })
  }

  /**
   * Agrega un nuevo usuario a la lista local
   */
  const addUserToList = (user: Profile) => {
    userListState.value.users.unshift(user)
    userListState.value.total += 1
    
    // Recalcular páginas
    userListState.value.totalPages = Math.ceil(
      userListState.value.total / userListState.value.pageSize
    )
    
    logger.debug('Usuario agregado a la lista local', {
      userId: user.user_id,
      userName: user.full_name,
      newTotal: userListState.value.total,
      action: 'add_user_to_list'
    })
  }

  /**
   * Actualiza un usuario en la lista local
   */
  const updateUserInList = (updatedUser: Profile) => {
    const index = userListState.value.users.findIndex(
      user => user.user_id === updatedUser.user_id
    )
    
    if (index !== -1) {
      userListState.value.users[index] = updatedUser
      
      // Actualizar usuario seleccionado si coincide
      if (selectedUser.value?.user_id === updatedUser.user_id) {
        selectedUser.value = updatedUser
      }
      
      logger.debug('Usuario actualizado en lista local', {
        userId: updatedUser.user_id,
        userName: updatedUser.full_name,
        index,
        action: 'update_user_in_list'
      })
    }
  }

  /**
   * Remueve un usuario de la lista local
   */
  const removeUserFromList = (userId: string) => {
    const index = userListState.value.users.findIndex(
      user => user.user_id === userId
    )
    
    if (index !== -1) {
      userListState.value.users.splice(index, 1)
      userListState.value.total -= 1
      
      // Recalcular páginas
      userListState.value.totalPages = Math.ceil(
        userListState.value.total / userListState.value.pageSize
      )
      
      // Limpiar usuario seleccionado si coincide
      if (selectedUser.value?.user_id === userId) {
        selectedUser.value = null
      }
      
      logger.debug('Usuario removido de lista local', {
        userId,
        newTotal: userListState.value.total,
        action: 'remove_user_from_list'
      })
    }
  }

  /**
   * Limpia todo el estado
   */
  const resetState = () => {
    userListState.value = {
      users: [],
      total: 0,
      currentPage: 1,
      pageSize: 20,
      totalPages: 0,
      isLoading: false,
      error: null,
      lastFetch: null
    }
    
    userStatsState.value = {
      total: 0,
      admins: 0,
      supervisors: 0,
      inspectors: 0,
      isLoading: false,
      error: null,
      lastFetch: null
    }
    
    filtersState.value = {
      search: '',
      role_filter: undefined
    }
    
    selectedUser.value = null
    
    logger.debug('Estado completamente reiniciado', { action: 'reset_state' })
  }

  /**
   * Verifica si necesita refrescar datos basado en tiempo transcurrido
   */
  const needsRefresh = (maxAge: number = 5 * 60 * 1000): boolean => { // 5 minutos por defecto
    const lastFetch = userListState.value.lastFetch
    if (!lastFetch) return true
    
    const age = Date.now() - lastFetch.getTime()
    return age > maxAge
  }

  // Computed properties
  const hasUsers = computed(() => userListState.value.users.length > 0)
  const hasFilters = computed(() => 
    !!(filtersState.value.search || filtersState.value.role_filter)
  )
  const isFirstPage = computed(() => userListState.value.currentPage === 1)
  const isLastPage = computed(() => 
    userListState.value.currentPage >= userListState.value.totalPages
  )
  const canGoNext = computed(() => !isLastPage.value && !userListState.value.isLoading)
  const canGoPrevious = computed(() => !isFirstPage.value && !userListState.value.isLoading)

  return {
    // Estado reactivo (readonly)
    userListState: readonly(userListState),
    userStatsState: readonly(userStatsState),
    filtersState: readonly(filtersState),
    selectedUser: readonly(selectedUser),
    
    // Acciones de lista
    setUserList,
    setUserListLoading,
    setUserListError,
    addUserToList,
    updateUserInList,
    removeUserFromList,
    
    // Acciones de estadísticas
    setUserStats,
    setUserStatsLoading,
    setUserStatsError,
    
    // Acciones de filtros
    setFilters,
    clearFilters,
    setSearchTerm,
    setRoleFilter,
    
    // Acciones de navegación
    setSelectedUser,
    setCurrentPage,
    setPageSize,
    
    // Utilidades
    resetState,
    needsRefresh,
    
    // Computed properties
    hasUsers,
    hasFilters,
    isFirstPage,
    isLastPage,
    canGoNext,
    canGoPrevious
  }
}