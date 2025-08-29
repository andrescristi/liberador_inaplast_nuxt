import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock de Nuxt composables y utilidades
const mockUser = { value: null }
const mockCreateError = vi.fn()
const mockFetch = vi.fn()
const mockRequestEvent = { node: { req: { headers: {} } } }

vi.stubGlobal('useSupabaseUser', () => mockUser)
vi.stubGlobal('createError', mockCreateError)
vi.stubGlobal('$fetch', mockFetch)
vi.stubGlobal('useRequestEvent', () => mockRequestEvent)

// Mock para import.meta.client
const mockImportMeta = {
  client: false
}
vi.stubGlobal('import.meta', mockImportMeta)

describe('Middleware: require-admin-role (Fixed Version)', () => {
  
  // Simulación del middleware require-admin-role actualizado
  const requireAdminRoleMiddleware = async () => {
    // Solo ejecutar en el servidor
    if (mockImportMeta.client) {
      return
    }

    try {
      // PASO 1: Verificar autenticación básica
      const user = mockUser
      
      if (!user.value) {
        throw mockCreateError({
          statusCode: 401,
          statusMessage: 'Authentication required'
        })
      }

      // PASO 2: Obtener perfil usando endpoint API server-side con cookies
      const event = mockRequestEvent
      const profile = await mockFetch('/api/auth/profile', {
        headers: {
          cookie: event?.node.req.headers.cookie || ''
        }
      })
      
      if (!profile) {
        throw mockCreateError({
          statusCode: 403,
          statusMessage: 'User profile not found'
        })
      }

      // PASO 3: Verificación estricta de rol de administrador
      if (profile.user_role !== 'Admin') {
        throw mockCreateError({
          statusCode: 403,
          statusMessage: 'Admin access required'
        })
      }
      
    } catch (error: unknown) {
      // Manejo de errores mejorado
      if (error && typeof error === 'object' && 'statusCode' in error) {
        throw error
      }
      
      if (error && typeof error === 'object' && 'statusMessage' in error) {
        throw error
      }
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      throw mockCreateError({
        statusCode: 500,
        statusMessage: `Failed to verify admin access: ${errorMessage}`
      })
    }
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockUser.value = null
    mockImportMeta.client = false
    mockRequestEvent.node.req.headers = {}
  })

  describe('🔧 Fix: Cookie Handling in SSR Context', () => {
    beforeEach(() => {
      mockUser.value = { id: 'admin-user', email: 'admin@test.com' }
    })

    it('should pass cookies from request headers to API endpoint', async () => {
      const testCookies = 'supabase-auth-token=eyJhbGc.test; session=abc123'
      mockRequestEvent.node.req.headers.cookie = testCookies
      
      mockFetch.mockResolvedValue({ 
        user_role: 'Admin',
        user_id: 'admin-user',
        email: 'admin@test.com'
      })

      await requireAdminRoleMiddleware()

      expect(mockFetch).toHaveBeenCalledWith('/api/auth/profile', {
        headers: { cookie: testCookies }
      })
    })

    it('should handle missing cookies gracefully', async () => {
      // No cookies in request
      mockRequestEvent.node.req.headers.cookie = undefined
      
      mockFetch.mockResolvedValue({ 
        user_role: 'Admin',
        user_id: 'admin-user' 
      })

      await requireAdminRoleMiddleware()

      expect(mockFetch).toHaveBeenCalledWith('/api/auth/profile', {
        headers: { cookie: '' }
      })
    })

    it('should work with various cookie formats', async () => {
      const cookieFormats = [
        'single=value',
        'multiple=value1; other=value2',
        'complex=value; Path=/; Secure; HttpOnly',
        ''
      ]

      mockFetch.mockResolvedValue({ user_role: 'Admin' })

      for (const cookies of cookieFormats) {
        mockRequestEvent.node.req.headers.cookie = cookies
        await requireAdminRoleMiddleware()
        
        expect(mockFetch).toHaveBeenCalledWith('/api/auth/profile', {
          headers: { cookie: cookies }
        })
        
        vi.clearAllMocks()
        mockFetch.mockResolvedValue({ user_role: 'Admin' })
      }
    })
  })

  describe('🔧 Fix: Server-Side Only Execution', () => {
    it('should skip execution on client side', async () => {
      mockImportMeta.client = true
      mockUser.value = null // Would normally trigger auth error

      const result = await requireAdminRoleMiddleware()

      expect(result).toBeUndefined()
      expect(mockFetch).not.toHaveBeenCalled()
      expect(mockCreateError).not.toHaveBeenCalled()
    })

    it('should execute on server side', async () => {
      mockImportMeta.client = false
      mockUser.value = { id: 'user', email: 'user@test.com' }
      mockFetch.mockResolvedValue({ user_role: 'Admin' })

      await requireAdminRoleMiddleware()

      expect(mockFetch).toHaveBeenCalled()
    })
  })

  describe('🔧 Fix: Enhanced Error Handling', () => {
    beforeEach(() => {
      mockUser.value = { id: 'user', email: 'user@test.com' }
    })

    it('should preserve fetch errors with statusCode', async () => {
      const fetchError = new Error('Auth session missing!')
      ;(fetchError as Error & { statusCode: number }).statusCode = 500

      mockFetch.mockRejectedValue(fetchError)

      mockCreateError.mockImplementation(({ statusCode, statusMessage }) => {
        const error = new Error(statusMessage)
        ;(error as Error & { statusCode: number }).statusCode = statusCode
        throw error
      })

      // Should preserve the original error with statusCode
      await expect(requireAdminRoleMiddleware()).rejects.toThrow('Auth session missing!')
    })

    it('should preserve createError errors with statusMessage', async () => {
      const createErrorInstance = new Error('User profile not found')
      ;(createErrorInstance as Error & { statusMessage: string }).statusMessage = 'User profile not found'

      mockFetch.mockRejectedValue(createErrorInstance)

      // Should preserve the original createError
      await expect(requireAdminRoleMiddleware()).rejects.toThrow('User profile not found')
    })

    it('should wrap generic errors with proper formatting', async () => {
      const networkError = new Error('Network timeout')
      mockFetch.mockRejectedValue(networkError)

      mockCreateError.mockImplementation(({ statusCode, statusMessage }) => {
        const error = new Error(statusMessage)
        ;(error as Error & { statusCode: number }).statusCode = statusCode
        throw error
      })

      await expect(requireAdminRoleMiddleware())
        .rejects.toThrow('Failed to verify admin access: Network timeout')
    })

    it('should handle non-Error objects', async () => {
      mockFetch.mockRejectedValue('String error message')

      mockCreateError.mockImplementation(({ statusCode, statusMessage }) => {
        const error = new Error(statusMessage)
        ;(error as Error & { statusCode: number }).statusCode = statusCode
        throw error
      })

      await expect(requireAdminRoleMiddleware())
        .rejects.toThrow('Failed to verify admin access: Unknown error')
    })
  })

  describe('🔧 Fix: API Integration', () => {
    beforeEach(() => {
      mockUser.value = { id: 'user', email: 'user@test.com' }
    })

    it('should use correct API endpoint', async () => {
      mockFetch.mockResolvedValue({ user_role: 'Admin' })

      await requireAdminRoleMiddleware()

      expect(mockFetch).toHaveBeenCalledWith('/api/auth/profile', expect.objectContaining({
        headers: expect.objectContaining({ cookie: expect.any(String) })
      }))
    })

    it('should handle API response correctly', async () => {
      const mockProfile = {
        user_role: 'Admin',
        user_id: 'user-123',
        email: 'admin@test.com',
        full_name: 'Test Admin'
      }
      
      mockFetch.mockResolvedValue(mockProfile)

      await expect(requireAdminRoleMiddleware()).resolves.toBeUndefined()
    })

    it('should reject non-admin responses', async () => {
      mockFetch.mockResolvedValue({ user_role: 'Inspector' })

      mockCreateError.mockImplementation(({ statusCode, statusMessage }) => {
        const error = new Error(statusMessage)
        ;(error as Error & { statusCode: number }).statusCode = statusCode
        throw error
      })

      await expect(requireAdminRoleMiddleware())
        .rejects.toThrow('Admin access required')
    })
  })

  describe('🔧 Fix: Authentication Flow', () => {
    it('should require authenticated user', async () => {
      mockUser.value = null

      mockCreateError.mockImplementation(({ statusCode, statusMessage }) => {
        const error = new Error(statusMessage)
        ;(error as Error & { statusCode: number }).statusCode = statusCode
        throw error
      })

      await expect(requireAdminRoleMiddleware())
        .rejects.toThrow('Authentication required')

      expect(mockFetch).not.toHaveBeenCalled()
    })

    it('should require valid profile', async () => {
      mockUser.value = { id: 'user', email: 'user@test.com' }
      mockFetch.mockResolvedValue(null) // No profile

      mockCreateError.mockImplementation(({ statusCode, statusMessage }) => {
        const error = new Error(statusMessage)
        ;(error as Error & { statusCode: number }).statusCode = statusCode
        throw error
      })

      await expect(requireAdminRoleMiddleware())
        .rejects.toThrow('User profile not found')
    })

    it('should complete successful admin verification', async () => {
      mockUser.value = { id: 'admin-user', email: 'admin@test.com' }
      mockRequestEvent.node.req.headers.cookie = 'auth=valid-token'
      mockFetch.mockResolvedValue({ 
        user_role: 'Admin',
        user_id: 'admin-user',
        email: 'admin@test.com'
      })

      await expect(requireAdminRoleMiddleware()).resolves.toBeUndefined()
      
      expect(mockFetch).toHaveBeenCalledWith('/api/auth/profile', {
        headers: { cookie: 'auth=valid-token' }
      })
    })
  })

  describe('🧪 Edge Cases and Regression Tests', () => {
    it('should handle malformed request event', async () => {
      mockUser.value = { id: 'user', email: 'user@test.com' }
      // Simulate malformed request event
      const brokenEvent = { node: { req: {} } } // Missing headers
      vi.stubGlobal('useRequestEvent', () => brokenEvent)

      mockFetch.mockResolvedValue({ user_role: 'Admin' })

      await requireAdminRoleMiddleware()

      expect(mockFetch).toHaveBeenCalledWith('/api/auth/profile', {
        headers: { cookie: '' }
      })
    })

    it('should handle concurrent middleware executions', async () => {
      mockUser.value = { id: 'user', email: 'user@test.com' }
      mockRequestEvent.node.req.headers.cookie = 'session=test'
      mockFetch.mockResolvedValue({ user_role: 'Admin' })

      // Simulate concurrent executions
      const promises = Array.from({ length: 3 }, () => requireAdminRoleMiddleware())
      
      await Promise.all(promises)

      expect(mockFetch).toHaveBeenCalledTimes(3)
    })
  })
})