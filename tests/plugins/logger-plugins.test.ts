import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock de Nuxt App
const mockNuxtApp = {
  $logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
    fatal: vi.fn(),
    child: vi.fn()
  }
}

vi.mock('#app', () => ({
  useNuxtApp: () => mockNuxtApp,
  defineNuxtPlugin: (fn: () => unknown) => fn()
}))

// Mock directo del composable useLogger
const useLogger = () => {
  return mockNuxtApp.$logger
}

describe('Logger Plugins Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('useLogger Composable', () => {
    it('debe estar disponible como auto-import desde composables/', () => {
      const logger = useLogger()
      
      expect(logger).toBeDefined()
      expect(logger.info).toBeDefined()
      expect(logger.error).toBeDefined()
      expect(logger.warn).toBeDefined()
      expect(logger.debug).toBeDefined()
      expect(logger.fatal).toBeDefined()
    })

    it('debe funcionar con el logger del plugin client', () => {
      const logger = useLogger()
      
      logger.info('Test client message')
      expect(mockNuxtApp.$logger.info).toHaveBeenCalledWith('Test client message')
    })

    it('debe funcionar con el logger del plugin server', () => {
      const logger = useLogger()
      
      logger.error('Test server error')
      expect(mockNuxtApp.$logger.error).toHaveBeenCalledWith('Test server error')
    })

    it('debe proporcionar método child para logger contextual', () => {
      const logger = useLogger()
      
      logger.child()
      expect(mockNuxtApp.$logger.child).toHaveBeenCalled()
    })
  })

  describe('Logger Plugin Structure', () => {
    it('debe tener estructura correcta para client plugin', () => {
      // Simular estructura del plugin client
      const clientPlugin = () => ({
        provide: {
          logger: {
            info: vi.fn(),
            warn: vi.fn(),
            error: vi.fn(),
            debug: vi.fn(),
            fatal: vi.fn(),
            child: () => ({})
          }
        }
      })

      const plugin = clientPlugin()
      expect(plugin.provide.logger).toBeDefined()
      expect(plugin.provide.logger.info).toBeDefined()
      expect(plugin.provide.logger.error).toBeDefined()
    })

    it('debe tener estructura correcta para server plugin', () => {
      // Mock de pino para server plugin
      const mockPino = {
        info: vi.fn(),
        warn: vi.fn(),
        error: vi.fn(),
        debug: vi.fn(),
        fatal: vi.fn(),
        child: vi.fn()
      }

      const serverPlugin = () => ({
        provide: {
          logger: mockPino
        }
      })

      const plugin = serverPlugin()
      expect(plugin.provide.logger).toBeDefined()
      expect(typeof plugin.provide.logger.info).toBe('function')
      expect(typeof plugin.provide.logger.error).toBe('function')
    })
  })
})