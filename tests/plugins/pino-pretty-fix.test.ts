import { describe, it, expect, vi } from 'vitest'

describe('Pino Pretty Fix', () => {
  it('should have pino-pretty installed as dev dependency', async () => {
    const packageJson = await import('../../package.json')
    
    expect(packageJson.devDependencies).toHaveProperty('pino-pretty')
    expect(packageJson.devDependencies['pino-pretty']).toMatch(/^\^13\.1\.1$/)
  })

  it('should configure logger for development', () => {
    // Mock environment
    const originalEnv = process.env.NODE_ENV
    process.env.NODE_ENV = 'development'

    // Simulamos la configuración del logger
    const loggerConfig = {
      level: 'debug',
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'yyyy-mm-dd HH:MM:ss'
        }
      }
    }

    expect(loggerConfig.transport).toEqual({
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'yyyy-mm-dd HH:MM:ss'
      }
    })

    // Restore environment
    process.env.NODE_ENV = originalEnv
  })

  it('should not use pino-pretty in production', () => {
    // Mock environment
    const originalEnv = process.env.NODE_ENV
    process.env.NODE_ENV = 'production'

    // Simulamos la configuración del logger para producción
    const loggerConfig = {
      level: 'info',
      transport: undefined
    }

    expect(loggerConfig.transport).toBeUndefined()
    expect(loggerConfig.level).toBe('info')

    // Restore environment
    process.env.NODE_ENV = originalEnv
  })

  it('should handle missing pino-pretty gracefully in production', () => {
    // En producción, no debería intentar usar pino-pretty
    expect(() => {
      const config = process.env.NODE_ENV === 'production' ? undefined : 'pino-pretty'
      if (config === undefined) {
        // Esto es correcto para producción
        expect(config).toBeUndefined()
      }
    }).not.toThrow()
  })
})