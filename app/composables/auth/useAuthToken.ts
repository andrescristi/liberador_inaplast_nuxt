/**
 * Composable para manejar tokens de autenticación
 * Solución específica para problemas de timing en Vercel con cookies de sesión
 */

interface AuthToken {
  access_token: string
  refresh_token: string
  expires_at: number
  user_id: string
}

const AUTH_TOKEN_KEY = 'inaplast_auth_token'

export const useAuthToken = () => {
  
  /**
   * Guarda el token en localStorage
   */
  const setToken = (tokenData: AuthToken) => {
    if (import.meta.server) return
    
    try {
      localStorage.setItem(AUTH_TOKEN_KEY, JSON.stringify(tokenData))
    } catch (error) {
      console.error('Error saving auth token:', error)
    }
  }
  
  /**
   * Obtiene el token desde localStorage
   */
  const getToken = (): AuthToken | null => {
    if (import.meta.server) return null
    
    try {
      const tokenStr = localStorage.getItem(AUTH_TOKEN_KEY)
      if (!tokenStr) return null
      
      const token = JSON.parse(tokenStr) as AuthToken
      
      // Verificar si el token ha expirado
      if (Date.now() > token.expires_at * 1000) {
        removeToken()
        return null
      }
      
      return token
    } catch (error) {
      console.error('Error retrieving auth token:', error)
      removeToken()
      return null
    }
  }
  
  /**
   * Remueve el token del localStorage
   */
  const removeToken = () => {
    if (import.meta.server) return
    
    try {
      localStorage.removeItem(AUTH_TOKEN_KEY)
    } catch (error) {
      console.error('Error removing auth token:', error)
    }
  }
  
  /**
   * Verifica si hay un token válido
   */
  const hasValidToken = (): boolean => {
    return getToken() !== null
  }
  
  /**
   * Obtiene el access token para requests
   */
  const getAccessToken = (): string | null => {
    const token = getToken()
    return token?.access_token || null
  }
  
  /**
   * Obtiene headers de autorización para requests
   */
  const getAuthHeaders = (): Record<string, string> => {
    const accessToken = getAccessToken()
    
    if (accessToken) {
      return {
        'Authorization': `Bearer ${accessToken}`,
        'X-Auth-Token': accessToken // Backup header para Vercel
      }
    }
    
    return {}
  }
  
  return {
    setToken,
    getToken,
    removeToken,
    hasValidToken,
    getAccessToken,
    getAuthHeaders
  }
}