import { describe, it, expect, vi, beforeEach } from 'vitest'
import { serverSupabaseClient } from '#supabase/server'
import { createError, readBody } from 'h3'

const mockServerSupabaseClient = vi.mocked(serverSupabaseClient)
const mockCreateError = vi.mocked(createError)
const mockReadBody = vi.mocked(readBody)

describe('/api/auth/login.post', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debe autenticar usuario exitosamente', async () => {
    const mockSupabase = {
      auth: {
        signInWithPassword: vi.fn().mockResolvedValue({
          data: { user: { id: 'user-id', email: 'test@test.com' } },
          error: null
        })
      }
    }
    
    mockServerSupabaseClient.mockResolvedValue(mockSupabase)
    mockReadBody.mockResolvedValue({
      email: 'test@test.com',
      password: 'password123'
    })

    const mockEvent = {}
    const handler = await import('../../../server/api/auth/login.post')
    
    const result = await handler.default(mockEvent)
    
    expect(result).toEqual({
      success: true,
      message: 'Inicio de sesión exitoso',
      user: { id: 'user-id', email: 'test@test.com' }
    })
    expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: 'test@test.com',
      password: 'password123'
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
})