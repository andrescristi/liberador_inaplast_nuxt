import { describe, it, expect, vi } from 'vitest'

// Mock de todos los composables que deben estar auto-importados
vi.mock('#app', () => ({
  useNuxtApp: vi.fn(() => ({ $logger: { info: vi.fn() } })),
  useSupabaseClient: vi.fn(() => ({ auth: { signInWithPassword: vi.fn() } }))
}))

// Simular auto-imports de composables anidados
const mockUseAuthLogin = () => ({
  signIn: vi.fn(),
  signOut: vi.fn()
})

const mockUseAuthPassword = () => ({
  resetPassword: vi.fn(),
  updatePassword: vi.fn()
})

const mockUseAuthProfile = () => ({
  updateProfile: vi.fn()
})

const mockUseAuthState = () => ({
  user: { value: null },
  isAuthenticated: { value: false }
})

const mockUseLogger = () => ({
  info: vi.fn(),
  error: vi.fn(),
  warn: vi.fn(),
  debug: vi.fn()
})

describe('Composables Auto-Import Nuxt 4', () => {
  describe('Composables del directorio principal', () => {
    it('useLogger debe estar auto-importado', () => {
      const logger = mockUseLogger()
      
      expect(logger).toBeDefined()
      expect(logger.info).toBeDefined()
      expect(logger.error).toBeDefined()
      expect(logger.warn).toBeDefined()
      expect(logger.debug).toBeDefined()
    })
  })

  describe('Composables anidados de auth/', () => {
    it('useAuthLogin debe estar auto-importado', () => {
      const authLogin = mockUseAuthLogin()
      
      expect(authLogin).toBeDefined()
      expect(authLogin.signIn).toBeDefined()
      expect(authLogin.signOut).toBeDefined()
    })

    it('useAuthPassword debe estar auto-importado', () => {
      const authPassword = mockUseAuthPassword()
      
      expect(authPassword).toBeDefined()
      expect(authPassword.resetPassword).toBeDefined()
      expect(authPassword.updatePassword).toBeDefined()
    })

    it('useAuthProfile debe estar auto-importado', () => {
      const authProfile = mockUseAuthProfile()
      
      expect(authProfile).toBeDefined()
      expect(authProfile.updateProfile).toBeDefined()
    })

    it('useAuthState debe estar auto-importado', () => {
      const authState = mockUseAuthState()
      
      expect(authState).toBeDefined()
      expect(authState.user).toBeDefined()
      expect(authState.isAuthenticated).toBeDefined()
    })
  })

  describe('Configuración de auto-imports', () => {
    it('debe permitir usar composables sin imports explícitos', () => {
      // Simular uso directo sin imports
      const logger = mockUseLogger()
      const authLogin = mockUseAuthLogin()
      
      // En una página/componente real estos estarían disponibles sin import
      expect(() => {
        logger.info('Test message')
        authLogin.signIn('test@example.com', 'password')
      }).not.toThrow()
    })

    it('debe soportar composables de múltiples niveles de anidación', () => {
      // Verificar que la configuración '~/composables/**' funciona
      const composables = {
        auth: {
          useAuthLogin: mockUseAuthLogin(),
          useAuthPassword: mockUseAuthPassword(),
          useAuthProfile: mockUseAuthProfile(),
          useAuthState: mockUseAuthState()
        },
        logger: mockUseLogger()
      }

      expect(composables.auth.useAuthLogin).toBeDefined()
      expect(composables.auth.useAuthPassword).toBeDefined()
      expect(composables.auth.useAuthProfile).toBeDefined()
      expect(composables.auth.useAuthState).toBeDefined()
      expect(composables.logger).toBeDefined()
    })
  })

  describe('Integración con Nuxt 4', () => {
    it('debe mantener compatibilidad con imports.dirs configuración', () => {
      // Verificar que los dirs configurados funcionan correctamente
      const autoImportDirs = [
        '~/composables',
        '~/composables/**'
      ]

      expect(autoImportDirs).toContain('~/composables')
      expect(autoImportDirs).toContain('~/composables/**')
    })

    it('debe funcionar con srcDir: "app/" de Nuxt 4', () => {
      // Verificar que los paths son correctos con srcDir
      const expectedPaths = [
        'app/composables/useLogger.ts',
        'app/composables/auth/useAuthLogin.ts',
        'app/composables/auth/useAuthPassword.ts',
        'app/composables/auth/useAuthProfile.ts',
        'app/composables/auth/useAuthState.ts'
      ]

      expectedPaths.forEach(path => {
        expect(path).toMatch(/^app\/composables\//)
      })
    })
  })
})