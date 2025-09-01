import { describe, it, expect, vi, beforeEach } from 'vitest'
import { serverSupabaseClient } from '#supabase/server'
import { createError, readBody, setHeader } from 'h3'

// Usar credenciales reales del .env para tests de integración
const TEST_EMAIL = process.env.USER || 'test@test.com'
const TEST_PASSWORD = process.env.PASSWD || 'password123'

const mockServerSupabaseClient = vi.mocked(serverSupabaseClient)
const mockCreateError = vi.mocked(createError)
const mockReadBody = vi.mocked(readBody)
const mockSetHeader = vi.mocked(setHeader)

// Mock de los módulos
vi.mock('#supabase/server')
vi.mock('h3')

describe('/api/auth/login.post', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debe autenticar usuario exitosamente con credenciales del .env', async () => {
    const mockSupabase = {
      auth: {
        signInWithPassword: vi.fn().mockResolvedValue({
          data: { 
            user: { id: 'user-id', email: TEST_EMAIL },
            session: { access_token: 'mock-token' }
          },
          error: null
        })
      }
    }
    
    mockServerSupabaseClient.mockResolvedValue(mockSupabase)
    mockReadBody.mockResolvedValue({
      email: TEST_EMAIL,
      password: TEST_PASSWORD
    })

    const mockEvent = {
      context: { logger: { info: vi.fn() } }
    }
    
    const handler = await import('../../../server/api/auth/login.post')
    
    const result = await handler.default(mockEvent)
    
    expect(result).toEqual({
      success: true,
      message: 'Inicio de sesión exitoso',
      user: { id: 'user-id', email: TEST_EMAIL },
      session: { access_token: 'mock-token' }
    })
    expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: TEST_EMAIL,
      password: TEST_PASSWORD
    })
  })

  it('debe rechazar email inválido', async () => {
    mockReadBody.mockResolvedValue({
      email: 'invalid-email',
      password: 'password123'
    })
    mockCreateError.mockImplementation(({ statusCode, statusMessage }) => {
      const error = new Error(statusMessage)
      ;(error as Error & { statusCode: number }).statusCode = statusCode
      throw error
    })

    const mockEvent = {}
    const handler = await import('../../../server/api/auth/login.post')
    
    await expect(handler.default(mockEvent)).rejects.toThrow('Email debe ser válido')
  })

  it('debe rechazar contraseña muy corta', async () => {
    mockReadBody.mockResolvedValue({
      email: 'test@test.com',
      password: '123'
    })
    mockCreateError.mockImplementation(({ statusCode, statusMessage }) => {
      const error = new Error(statusMessage)
      ;(error as Error & { statusCode: number }).statusCode = statusCode
      throw error
    })

    const mockEvent = {}
    const handler = await import('../../../server/api/auth/login.post')
    
    await expect(handler.default(mockEvent)).rejects.toThrow('Contraseña debe tener al menos 6 caracteres')
  })

  it('debe manejar credenciales incorrectas', async () => {
    const mockSupabase = {
      auth: {
        signInWithPassword: vi.fn().mockResolvedValue({
          data: null,
          error: { message: 'Invalid credentials' }
        })
      }
    }
    
    mockServerSupabaseClient.mockResolvedValue(mockSupabase)
    mockReadBody.mockResolvedValue({
      email: 'test@test.com',
      password: 'wrongpassword'
    })
    mockCreateError.mockImplementation(({ statusCode, statusMessage }) => {
      const error = new Error(statusMessage)
      ;(error as Error & { statusCode: number }).statusCode = statusCode
      throw error
    })

    const mockEvent = {}
    const handler = await import('../../../server/api/auth/login.post')
    
    await expect(handler.default(mockEvent)).rejects.toThrow('Credenciales incorrectas')
  })

  describe('Mejoras para dispositivos móviles', () => {
    it('debe configurar headers correctos para compatibilidad móvil', async () => {
      const mockSupabase = {
        auth: {
          signInWithPassword: vi.fn().mockResolvedValue({
            data: { 
              user: { id: 'user-id', email: TEST_EMAIL },
              session: { access_token: 'mock-token' }
            },
            error: null
          })
        }
      }
      
      mockServerSupabaseClient.mockResolvedValue(mockSupabase)
      mockReadBody.mockResolvedValue({
        email: TEST_EMAIL,
        password: TEST_PASSWORD
      })

      const mockEvent = {
        context: { logger: { info: vi.fn() } }
      }
      
      const handler = await import('../../../server/api/auth/login.post')
      
      await handler.default(mockEvent)
      
      // Verificar que se configuran los headers correctos para móviles
      expect(mockSetHeader).toHaveBeenCalledWith(mockEvent, 'Cache-Control', 'private, no-cache, no-store, must-revalidate')
      expect(mockSetHeader).toHaveBeenCalledWith(mockEvent, 'Expires', '0')
      expect(mockSetHeader).toHaveBeenCalledWith(mockEvent, 'Pragma', 'no-cache')
      expect(mockSetHeader).toHaveBeenCalledWith(mockEvent, 'Vary', 'User-Agent')
    })

    it('debe manejar credenciales del .env correctamente', async () => {
      expect(TEST_EMAIL).toBeDefined()
      expect(TEST_PASSWORD).toBeDefined()
      expect(TEST_EMAIL.length).toBeGreaterThan(0)
      expect(TEST_PASSWORD.length).toBeGreaterThan(5)
    })
  })
})