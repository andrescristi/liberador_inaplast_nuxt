/**
 * Composable para el sistema de autenticación híbrido JWT + Session
 * 
 * Combina JWT (stateless) almacenado localmente con Session ID (stateful) en cookies
 * Siguiendo el diagrama proporcionado por el usuario
 */

interface HybridAuthUser {
  id: string
  email: string
  role: string
  first_name?: string
  last_name?: string
  full_name?: string
}

interface AuthToken {
  access_token: string
  expires_at: number
  user_id: string
}

const AUTH_TOKEN_KEY = 'inaplast_hybrid_jwt'

export const useHybridAuth = () => {
  // Estado global reactivo
  const user = useState<HybridAuthUser | null>('hybrid_auth.user', () => null)
  const isLoading = useState<boolean>('hybrid_auth.loading', () => false)
  const error = useState<string | null>('hybrid_auth.error', () => null)

  /**
   * Estados computados
   */
  const isAuthenticated = computed(() => {
    if (import.meta.server) return false
    return !!user.value
  })

  const userRole = computed(() => user.value?.role || null)
  const isAdmin = computed(() => userRole.value === 'Admin')
  const isSupervisor = computed(() => userRole.value === 'Supervisor')
  const isInspector = computed(() => userRole.value === 'Inspector')

  /**
   * Almacena el JWT en localStorage
   */
  const setJWT = (jwt: string) => {
    if (import.meta.server) return
    
    try {
      // Decodificar JWT para extraer información
      const jwtParts = jwt.split('.')
      if (jwtParts.length !== 3) throw new Error('Invalid JWT format')
      
      const payload = JSON.parse(atob(jwtParts[1]!))
      
      const tokenData: AuthToken = {
        access_token: jwt,
        expires_at: payload.exp, // exp ya está en segundos (Unix timestamp)
        user_id: payload.user_id
      }
      
      // Debug log para verificar la expiración
      console.log('🔍 [setJWT] Token expiration:', {
        exp_seconds: payload.exp,
        exp_date: new Date(payload.exp * 1000).toISOString(),
        current_date: new Date().toISOString(),
        is_expired: Date.now() > payload.exp * 1000
      })
      
      localStorage.setItem(AUTH_TOKEN_KEY, JSON.stringify(tokenData))
    } catch (error) {
      console.error('Error guardando JWT:', error)
    }
  }

  /**
   * Obtiene el JWT desde localStorage
   */
  const getJWT = (): string | null => {
    if (import.meta.server) return null
    
    try {
      const tokenStr = localStorage.getItem(AUTH_TOKEN_KEY)
      if (!tokenStr) {
        console.log('🔍 [getJWT] No token found in localStorage')
        return null
      }
      
      const token = JSON.parse(tokenStr) as AuthToken
      const now = Date.now()
      const expirationMs = token.expires_at * 1000 // Convertir segundos a milisegundos
      
      console.log('🔍 [getJWT] Token validation:', {
        expires_at_seconds: token.expires_at,
        expires_at_date: new Date(expirationMs).toISOString(),
        current_date: new Date(now).toISOString(),
        current_ms: now,
        expiration_ms: expirationMs,
        is_expired: now > expirationMs,
        time_until_expiry_hours: Math.round((expirationMs - now) / (1000 * 60 * 60))
      })
      
      // Verificar si el token ha expirado
      if (now > expirationMs) {
        console.log('❌ [getJWT] Token expired, removing from localStorage')
        removeJWT()
        return null
      }
      
      console.log('✅ [getJWT] Token is valid')
      return token.access_token
    } catch (error) {
      console.error('❌ [getJWT] Error obteniendo JWT:', error)
      removeJWT()
      return null
    }
  }

  /**
   * Elimina el JWT del localStorage
   */
  const removeJWT = () => {
    if (import.meta.server) return
    
    try {
      console.log('🚨 [removeJWT] REMOVING JWT FROM LOCALSTORAGE!', {
        reason: 'Manual call to removeJWT',
        stack: new Error().stack,
        timestamp: new Date().toISOString()
      })
      localStorage.removeItem(AUTH_TOKEN_KEY)
    } catch (error) {
      console.error('❌ [removeJWT] Error eliminando JWT:', error)
    }
  }

  /**
   * Verifica si hay un JWT válido
   */
  const hasValidJWT = (): boolean => {
    return getJWT() !== null
  }

  /**
   * Obtiene headers de autorización para requests
   */
  const getAuthHeaders = (): Record<string, string> => {
    const jwt = getJWT()
    
    if (jwt) {
      return {
        'Authorization': `Bearer ${jwt}`,
        'X-Auth-Token': jwt // Backup header
      }
    }
    
    return {}
  }

  /**
   * Realizar login híbrido
   */
  const login = async (email: string, password: string) => {
    try {
      isLoading.value = true
      error.value = null

      const response = await $fetch<{
        success: boolean
        jwt: string
        user: HybridAuthUser
        message: string
      }>('/api/auth/login', {
        method: 'POST',
        body: { email, password }
      })

      if (response.success) {
        // Almacenar JWT localmente
        setJWT(response.jwt)
        
        // Actualizar estado del usuario
        user.value = response.user
        
        // Session ID se configura automáticamente via cookie
        
        return response.user
      }
      
      throw new Error(response.message || 'Error en el login')
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      error.value = errorMessage
      throw new Error(errorMessage)
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Realizar logout híbrido
   */
  const logout = async () => {
    try {
      isLoading.value = true
      
      // Llamar al endpoint de logout (limpia session del servidor)
      await $fetch('/api/auth/logout', { 
        method: 'POST',
        headers: getAuthHeaders()
      })
      
      // Limpiar JWT local
      removeJWT()
      
      // Limpiar estado
      user.value = null
      error.value = null
      
      // Redirigir al login
      await navigateTo('/auth/login')
      
    } catch (err) {
      console.error('Error durante logout:', err)
      // Limpiar de todas formas en caso de error
      removeJWT()
      user.value = null
      await navigateTo('/auth/login')
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Verificar estado de autenticación
   */
  const checkAuth = async () => {
    if (import.meta.server) return false
    
    try {
      // Verificar si hay JWT válido primero
      if (!hasValidJWT()) {
        user.value = null
        return false
      }

      // Verificar con el servidor (esto valida tanto JWT como session)
      const response = await $fetch<{
        user: HybridAuthUser | null
        authenticated: boolean
      }>('/api/auth/user', {
        headers: getAuthHeaders()
      })

      if (response.authenticated && response.user) {
        user.value = response.user
        return true
      } else {
        // Limpiar si el servidor dice que no está autenticado
        removeJWT()
        user.value = null
        return false
      }
      
    } catch {
      // En caso de error, limpiar estado
      removeJWT()
      user.value = null
      return false
    }
  }

  /**
   * Refrescar autenticación (extender sesión)
   */
  const refresh = async () => {
    try {
      const response = await $fetch<{
        success: boolean
        jwt: string
        user: HybridAuthUser
      }>('/api/auth/refresh', {
        method: 'POST',
        headers: getAuthHeaders()
      })

      if (response.success) {
        setJWT(response.jwt)
        user.value = response.user
        return response.user
      }
      
      throw new Error('Error refrescando sesión')
      
    } catch (error) {
      // Si falla el refresh, hacer logout
      await logout()
      throw error
    }
  }

  /**
   * Inicialización automática
   */
  const initialize = async () => {
    if (import.meta.server) return
    
    await checkAuth()
  }

  return {
    // Estado
    user,
    isLoading: readonly(isLoading),
    error: readonly(error),
    
    // Estados computados
    isAuthenticated,
    userRole,
    isAdmin,
    isSupervisor,
    isInspector,
    
    // Métodos
    login,
    logout,
    checkAuth,
    refresh,
    initialize,
    hasValidJWT,
    getAuthHeaders,
    setJWT,
    removeJWT
  }
}