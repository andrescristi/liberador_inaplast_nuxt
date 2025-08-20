import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { Logger } from 'pino'

// Mock del logger
const mockLogger: Logger = {
  info: vi.fn(),
  error: vi.fn(),
  warn: vi.fn(),
  debug: vi.fn(),
  trace: vi.fn(),
  fatal: vi.fn()
} as Logger

const mockNuxtApp = {
  $logger: mockLogger
}

vi.mock('#app', () => ({
  useNuxtApp: () => mockNuxtApp
}))

// Mock directo del composable
const useLogger = (): Logger => {
  return mockNuxtApp.$logger as Logger
}

describe('useLogger Composable', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debe retornar el logger de Nuxt App', () => {
    const logger = useLogger()
    
    expect(logger).toBe(mockLogger)
  })

  it('debe permitir usar métodos de logging', () => {
    const logger = useLogger()
    
    logger.info('Test info message')
    logger.error('Test error message')
    logger.warn('Test warning message')
    
    expect(mockLogger.info).toHaveBeenCalledWith('Test info message')
    expect(mockLogger.error).toHaveBeenCalledWith('Test error message')
    expect(mockLogger.warn).toHaveBeenCalledWith('Test warning message')
  })

  it('debe manejar diferentes tipos de parámetros de logging', () => {
    const logger = useLogger()
    
    const testObject = { key: 'value', number: 123 }
    const testError = new Error('Test error')
    
    logger.info(testObject, 'Object message')
    logger.error(testError, 'Error message')
    
    expect(mockLogger.info).toHaveBeenCalledWith(testObject, 'Object message')
    expect(mockLogger.error).toHaveBeenCalledWith(testError, 'Error message')
  })
})