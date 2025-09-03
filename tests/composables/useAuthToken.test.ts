import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useAuthToken } from '~/composables/auth/useAuthToken'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}

// Mock import.meta
vi.stubGlobal('localStorage', localStorageMock)

describe('useAuthToken', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('setToken', () => {
    it('should save token to localStorage', () => {
      const { setToken } = useAuthToken()
      const tokenData = {
        access_token: 'test-access-token',
        refresh_token: 'test-refresh-token',
        expires_at: Math.floor(Date.now() / 1000) + 3600,
        user_id: 'test-user-id'
      }

      setToken(tokenData)

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'inaplast_auth_token',
        JSON.stringify(tokenData)
      )
    })

    it('should handle localStorage errors gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('localStorage error')
      })

      const { setToken } = useAuthToken()
      const tokenData = {
        access_token: 'test-access-token',
        refresh_token: 'test-refresh-token',
        expires_at: Math.floor(Date.now() / 1000) + 3600,
        user_id: 'test-user-id'
      }

      expect(() => setToken(tokenData)).not.toThrow()
      expect(consoleSpy).toHaveBeenCalledWith('Error saving auth token:', expect.any(Error))

      consoleSpy.mockRestore()
    })
  })

  describe('getToken', () => {
    it('should return null when no token exists', () => {
      localStorageMock.getItem.mockReturnValue(null)
      const { getToken } = useAuthToken()

      const result = getToken()

      expect(result).toBeNull()
      expect(localStorageMock.getItem).toHaveBeenCalledWith('inaplast_auth_token')
    })

    it('should return parsed token when valid token exists', () => {
      const tokenData = {
        access_token: 'test-access-token',
        refresh_token: 'test-refresh-token',
        expires_at: Math.floor(Date.now() / 1000) + 3600,
        user_id: 'test-user-id'
      }
      localStorageMock.getItem.mockReturnValue(JSON.stringify(tokenData))
      const { getToken } = useAuthToken()

      const result = getToken()

      expect(result).toEqual(tokenData)
    })

    it('should remove expired token and return null', () => {
      const expiredTokenData = {
        access_token: 'test-access-token',
        refresh_token: 'test-refresh-token',
        expires_at: Math.floor(Date.now() / 1000) - 3600, // Expired 1 hour ago
        user_id: 'test-user-id'
      }
      localStorageMock.getItem.mockReturnValue(JSON.stringify(expiredTokenData))
      const { getToken } = useAuthToken()

      const result = getToken()

      expect(result).toBeNull()
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('inaplast_auth_token')
    })

    it('should handle JSON parsing errors gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      localStorageMock.getItem.mockReturnValue('invalid-json')
      const { getToken } = useAuthToken()

      const result = getToken()

      expect(result).toBeNull()
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('inaplast_auth_token')
      expect(consoleSpy).toHaveBeenCalledWith('Error retrieving auth token:', expect.any(Error))

      consoleSpy.mockRestore()
    })
  })

  describe('hasValidToken', () => {
    it('should return true when valid token exists', () => {
      const tokenData = {
        access_token: 'test-access-token',
        refresh_token: 'test-refresh-token',
        expires_at: Math.floor(Date.now() / 1000) + 3600,
        user_id: 'test-user-id'
      }
      localStorageMock.getItem.mockReturnValue(JSON.stringify(tokenData))
      const { hasValidToken } = useAuthToken()

      const result = hasValidToken()

      expect(result).toBe(true)
    })

    it('should return false when no valid token exists', () => {
      localStorageMock.getItem.mockReturnValue(null)
      const { hasValidToken } = useAuthToken()

      const result = hasValidToken()

      expect(result).toBe(false)
    })
  })

  describe('getAccessToken', () => {
    it('should return access token when valid token exists', () => {
      const tokenData = {
        access_token: 'test-access-token',
        refresh_token: 'test-refresh-token',
        expires_at: Math.floor(Date.now() / 1000) + 3600,
        user_id: 'test-user-id'
      }
      localStorageMock.getItem.mockReturnValue(JSON.stringify(tokenData))
      const { getAccessToken } = useAuthToken()

      const result = getAccessToken()

      expect(result).toBe('test-access-token')
    })

    it('should return null when no valid token exists', () => {
      localStorageMock.getItem.mockReturnValue(null)
      const { getAccessToken } = useAuthToken()

      const result = getAccessToken()

      expect(result).toBeNull()
    })
  })

  describe('getAuthHeaders', () => {
    it('should return auth headers when valid token exists', () => {
      const tokenData = {
        access_token: 'test-access-token',
        refresh_token: 'test-refresh-token',
        expires_at: Math.floor(Date.now() / 1000) + 3600,
        user_id: 'test-user-id'
      }
      localStorageMock.getItem.mockReturnValue(JSON.stringify(tokenData))
      const { getAuthHeaders } = useAuthToken()

      const result = getAuthHeaders()

      expect(result).toEqual({
        'Authorization': 'Bearer test-access-token',
        'X-Auth-Token': 'test-access-token'
      })
    })

    it('should return empty headers when no valid token exists', () => {
      localStorageMock.getItem.mockReturnValue(null)
      const { getAuthHeaders } = useAuthToken()

      const result = getAuthHeaders()

      expect(result).toEqual({})
    })
  })

  describe('removeToken', () => {
    it('should remove token from localStorage', () => {
      const { removeToken } = useAuthToken()

      removeToken()

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('inaplast_auth_token')
    })

    it('should handle localStorage errors gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      localStorageMock.removeItem.mockImplementation(() => {
        throw new Error('localStorage error')
      })

      const { removeToken } = useAuthToken()

      expect(() => removeToken()).not.toThrow()
      expect(consoleSpy).toHaveBeenCalledWith('Error removing auth token:', expect.any(Error))

      consoleSpy.mockRestore()
    })
  })
})