/**
 * Composable para manejo de autorización de administrador
 * 
 * Centraliza toda la lógica de autorización para operaciones administrativas
 * de usuarios. Proporciona validaciones consistentes de permisos.
 * 
 * @author Inaplast Development Team
 * @since v2.5.0
 */

export const useAdminUserAuth = () => {
  const { getCurrentUserProfile } = useAuthProfile()
  const logger = useLogger()

  /**
   * Verifica si el usuario actual tiene permisos de administrador
   * 
   * @returns {Promise<boolean>} true si es administrador, false de lo contrario
   * @throws {Error} Si hay error al verificar el perfil
   */
  const checkIsAdmin = async (): Promise<boolean> => {
    try {
      const profile = await getCurrentUserProfile()
      const isAdmin = profile?.user_role === 'Admin'
      
      if (!isAdmin) {
        logger.warn('Acceso denegado: usuario no es administrador', {
          userId: profile?.user_id,
          role: profile?.user_role,
          action: 'admin_permission_check'
        })
      }
      
      return isAdmin
    } catch (error) {
      logger.error('Error al verificar permisos de administrador', {
        error: error instanceof Error ? error.message : 'Error desconocido',
        action: 'admin_permission_check'
      })
      return false
    }
  }

  /**
   * Valida permisos de administrador y lanza excepción si no los tiene
   * 
   * @param {string} action - Nombre de la acción que requiere permisos
   * @throws {Error} Si no tiene permisos de administrador
   */
  const requireAdminAccess = async (action: string): Promise<void> => {
    const isAdmin = await checkIsAdmin()
    
    if (!isAdmin) {
      const error = new Error('Acceso denegado. Se requieren privilegios de administrador.')
      
      logger.warn('Acceso denegado para acción administrativa', {
        action,
        error: error.message
      })
      
      throw error
    }

    logger.debug('Acceso administrativo autorizado', {
      action,
      timestamp: new Date().toISOString()
    })
  }

  /**
   * Valida que un usuario no puede eliminar su propia cuenta
   * 
   * @param {string} targetUserId - ID del usuario objetivo
   * @throws {Error} Si intenta eliminar su propia cuenta
   */
  const validateSelfDeletion = (targetUserId: string): void => {
    const user = useSupabaseUser()
    const currentUserId = user.value?.id
    
    if (currentUserId === targetUserId) {
      const error = new Error('No puedes eliminar tu propia cuenta')
      
      logger.warn('Intento de auto-eliminación bloqueado', {
        userId: currentUserId,
        targetUserId,
        action: 'self_deletion_attempt'
      })
      
      throw error
    }
  }

  return {
    checkIsAdmin,
    requireAdminAccess,
    validateSelfDeletion
  }
}