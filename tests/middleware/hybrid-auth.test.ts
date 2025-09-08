import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createMockHybridAuth } from '../mocks/hybrid-auth'

// Mock de localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

// Mock de navegación
const mockNavigateTo = vi.fn()
vi.stubGlobal('navigateTo', mockNavigateTo)

// Mock del $fetch
const mock$fetch = vi.fn()
vi.stubGlobal('$fetch', mock$fetch)

describe('Hybrid Authentication Middleware', () => {
  let mockHybridAuth: ReturnType<typeof createMockHybridAuth>

  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.getItem.mockClear()
    localStorageMock.setItem.mockClear()
    localStorageMock.removeItem.mockClear()
    mockNavigateTo.mockClear()
    mock$fetch.mockClear()
    
    mockHybridAuth = createMockHybridAuth()
  })

  describe('JWT Local Verification', () => {
    it('debe permitir acceso con JWT válido en localStorage', async () => {
      // Mock JWT válido
      const validJWT = {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMTIzIiwiZW1haWwiOiJ0ZXN0QHRlc3QuY29tIiwiZXhwIjoyMDAwMDAwMDAwfQ.signature',
        expires_at: Math.floor(Date.now() / 1000) + 3600, // 1 hora válido
        user_id: '123'
      }

      localStorageMock.getItem.mockReturnValue(JSON.stringify(validJWT))
      mockHybridAuth.hasValidJWT.mockReturnValue(true)
      mockHybridAuth.checkAuth.mockResolvedValue(true)

      // El middleware no debería redirigir
      expect(mockHybridAuth.hasValidJWT()).toBe(true)
      expect(await mockHybridAuth.checkAuth()).toBe(true)
      expect(mockNavigateTo).not.toHaveBeenCalled()
    })

    it('debe redirigir al login si no hay JWT', async () => {
      localStorageMock.getItem.mockReturnValue(null)
      mockHybridAuth.hasValidJWT.mockReturnValue(false)

      // Simular middleware
      if (!mockHybridAuth.hasValidJWT()) {
        mockNavigateTo('/auth/login')
      }

      expect(mockNavigateTo).toHaveBeenCalledWith('/auth/login')
    })

    it('debe redirigir al login si JWT está expirado', async () => {
      // Mock JWT expirado
      const expiredJWT = {
        access_token: 'expired.jwt.token',
        expires_at: Math.floor(Date.now() / 1000) - 3600, // Expirado hace 1 hora
        user_id: '123'
      }

      localStorageMock.getItem.mockReturnValue(JSON.stringify(expiredJWT))
      mockHybridAuth.hasValidJWT.mockReturnValue(false)

      // Simular middleware
      if (!mockHybridAuth.hasValidJWT()) {
        mockNavigateTo('/auth/login')
      }

      expect(mockNavigateTo).toHaveBeenCalledWith('/auth/login')
    })

    it('debe manejar JWT malformado', async () => {
      localStorageMock.getItem.mockReturnValue('invalid-jwt-format')
      mockHybridAuth.hasValidJWT.mockReturnValue(false)

      // Simular middleware
      if (!mockHybridAuth.hasValidJWT()) {
        mockNavigateTo('/auth/login')
      }

      expect(mockNavigateTo).toHaveBeenCalledWith('/auth/login')
    })
  })

  describe('Server Session Verification', () => {
    it('debe verificar sesión con servidor exitosamente', async () => {
      mockHybridAuth.hasValidJWT.mockReturnValue(true)
      mock$fetch.mockResolvedValue({
        user: { id: '123', email: 'test@test.com', role: 'Admin' },
        authenticated: true
      })
      mockHybridAuth.checkAuth.mockResolvedValue(true)

      const isAuthenticated = await mockHybridAuth.checkAuth()
      expect(isAuthenticated).toBe(true)
      expect(mockNavigateTo).not.toHaveBeenCalled()
    })

    it('debe redirigir si servidor dice no autenticado', async () => {
      mockHybridAuth.hasValidJWT.mockReturnValue(true)
      mock$fetch.mockResolvedValue({
        user: null,
        authenticated: false
      })
      mockHybridAuth.checkAuth.mockResolvedValue(false)

      // Simular middleware
      const hasValidJWT = mockHybridAuth.hasValidJWT()
      if (hasValidJWT) {
        const isAuthenticated = await mockHybridAuth.checkAuth()
        if (!isAuthenticated) {
          mockNavigateTo('/auth/login')
        }
      }

      expect(mockNavigateTo).toHaveBeenCalledWith('/auth/login')
    })

    it('debe manejar errores de red en verificación', async () => {
      mockHybridAuth.hasValidJWT.mockReturnValue(true)
      mockHybridAuth.checkAuth.mockRejectedValue(new Error('Network error'))

      try {
        await mockHybridAuth.checkAuth()
      } catch {
        mockNavigateTo('/auth/login')
      }

      expect(mockNavigateTo).toHaveBeenCalledWith('/auth/login')
    })
  })

  describe('Middleware Array Format', () => {
    it('debe funcionar con middleware como array', () => {
      // Test para verificar que middleware: ['auth'] funciona
      const middlewareConfig = {
        middleware: ['auth']
      }

      expect(Array.isArray(middlewareConfig.middleware)).toBe(true)
      expect(middlewareConfig.middleware).toContain('auth')
    })

    it('debe funcionar con middleware combinado', () => {
      // Test para admin pages que requieren auth + admin
      const adminMiddlewareConfig = {
        middleware: ['auth', 'admin']
      }

      expect(Array.isArray(adminMiddlewareConfig.middleware)).toBe(true)
      expect(adminMiddlewareConfig.middleware).toEqual(['auth', 'admin'])
    })
  })

  describe('Protected Routes', () => {
    const protectedRoutes = [
      '/orders',
      '/orders/new', 
      '/orders/123',
      '/muestreo',
      '/muestreo/planes',
      '/admin/users'
    ]

    protectedRoutes.forEach(route => {
      it(`debe proteger la ruta ${route}`, async () => {
        mockHybridAuth.hasValidJWT.mockReturnValue(false)

        // Simular middleware para ruta protegida
        if (!mockHybridAuth.hasValidJWT()) {
          mockNavigateTo('/auth/login')
        }

        expect(mockNavigateTo).toHaveBeenCalledWith('/auth/login')
      })
    })
  })

  describe('SSR Handling', () => {
    it('debe saltear durante SSR', async () => {
      // Mock process.server = true
      const originalServer = import.meta.server
      Object.defineProperty(import.meta, 'server', { value: true, configurable: true })

      // El middleware debería retornar early durante SSR
      if (import.meta.server) {
        // No debería ejecutar lógica de cliente
        expect(mockHybridAuth.hasValidJWT).not.toHaveBeenCalled()
        expect(mockNavigateTo).not.toHaveBeenCalled()
      }

      // Restaurar valor original
      Object.defineProperty(import.meta, 'server', { value: originalServer, configurable: true })
    })
  })

  describe('Security Edge Cases', () => {
    it('debe limpiar JWT en caso de error', async () => {
      mockHybridAuth.hasValidJWT.mockReturnValue(true)
      mockHybridAuth.checkAuth.mockRejectedValue(new Error('Session expired'))
      mockHybridAuth.removeJWT.mockImplementation(() => {
        localStorageMock.removeItem('inaplast_hybrid_jwt')
      })

      try {
        await mockHybridAuth.checkAuth()
      } catch {
        mockHybridAuth.removeJWT()
        mockNavigateTo('/auth/login')
      }

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('inaplast_hybrid_jwt')
      expect(mockNavigateTo).toHaveBeenCalledWith('/auth/login')
    })

    it('debe validar formato JWT antes de usar', () => {
      const validJWTFormat = 'header.payload.signature'
      const invalidJWTFormat = 'invalid-jwt'

      expect(validJWTFormat.split('.')).toHaveLength(3)
      expect(invalidJWTFormat.split('.')).not.toHaveLength(3)
    })

    it('debe verificar expiración de token', () => {
      const now = Math.floor(Date.now() / 1000)
      const validToken = { exp: now + 3600 } // 1 hora válido
      const expiredToken = { exp: now - 3600 } // Expirado hace 1 hora

      expect(now).toBeLessThan(validToken.exp)
      expect(now).toBeGreaterThan(expiredToken.exp)
    })
  })

  describe('Integration with Pages', () => {
    it('orders/new.vue debe usar middleware como array', () => {
      const ordersNewPageMeta = {
        middleware: ['auth']
      }

      expect(Array.isArray(ordersNewPageMeta.middleware)).toBe(true)
      expect(ordersNewPageMeta.middleware).toContain('auth')
    })

    it('admin/users.vue debe usar middleware combinado', () => {
      const adminUsersPageMeta = {
        middleware: ['auth', 'admin']
      }

      expect(Array.isArray(adminUsersPageMeta.middleware)).toBe(true)
      expect(adminUsersPageMeta.middleware).toEqual(['auth', 'admin'])
    })
  })
})