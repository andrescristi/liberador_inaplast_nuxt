/**
 * Índice de composables administrativos de usuarios
 * 
 * Proporciona acceso centralizado a todos los composables relacionados
 * con la administración de usuarios del sistema.
 * 
 * ARQUITECTURA v2.5.0:
 * - Patrón de separación de responsabilidades
 * - Validaciones con Zod
 * - Logging consistente
 * - Manejo de errores centralizado
 * - Repository pattern
 * - Estado reactivo
 * 
 * @author Inaplast Development Team
 * @since v2.5.0
 */

// Imports necesarios para useAdminUserSystem
import { useAdminUserAuth } from './useAdminUserAuth'
import { useAdminUserValidation } from './useAdminUserValidation'
import { useAdminUserRepository } from './useAdminUserRepository'
import { useAdminUserState } from './useAdminUserState'
import { useAdminUserCRUD } from './useAdminUserCRUD'
import { useAdminUserAPI } from './useAdminUserAPI'
import { useAdminProfileManager } from './useAdminProfileManager'

// Composables especializados
export { useAdminUserAuth } from './useAdminUserAuth'
export { useAdminUserValidation } from './useAdminUserValidation'
export { useAdminUserRepository } from './useAdminUserRepository'
export { useAdminUserState } from './useAdminUserState'
export { useAdminUserCRUD } from './useAdminUserCRUD'
export { useAdminUserAPI } from './useAdminUserAPI'
export { useAdminProfileManager } from './useAdminProfileManager'

/**
 * Composable unificado que combina toda la funcionalidad
 * 
 * Proporciona acceso a todos los composables especializados en una sola
 * interfaz. Útil para casos donde se necesite acceso a múltiples capas.
 * 
 * @example
 * ```typescript
 * const {
 *   crud,
 *   state,
 *   auth,
 *   validation,
 *   repository,
 *   api
 * } = useAdminUserSystem()
 * 
 * // Usar operaciones CRUD
 * const users = await crud.getAllUsers()
 * 
 * // Acceder al estado
 * const { userListState } = state
 * 
 * // Validar datos
 * const validData = validation.validateCreateUser(formData)
 * ```
 */
export const useAdminUserSystem = () => {
  const auth = useAdminUserAuth()
  const validation = useAdminUserValidation()
  const repository = useAdminUserRepository()
  const state = useAdminUserState()
  const crud = useAdminUserCRUD()
  const api = useAdminUserAPI()
  const profileManager = useAdminProfileManager()

  return {
    auth,
    validation,
    repository,
    state,
    crud,
    api,
    profileManager
  }
}

