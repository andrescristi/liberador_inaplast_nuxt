import { describe, it, expect, vi, beforeEach } from 'vitest'
import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'
import { createError, readBody } from 'h3'

const mockServerSupabaseClient = vi.mocked(serverSupabaseClient)
const mockServerSupabaseUser = vi.mocked(serverSupabaseUser) 
const mockCreateError = vi.mocked(createError)
const mockReadBody = vi.mocked(readBody)

describe('/api/auth/update-password.post', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debe actualizar contraseña exitosamente', async () => {
    const mockSupabase = {
      auth: {
        updateUser: vi.fn().mockResolvedValue({ error: null })
      }
    }
    
    mockServerSupabaseClient.mockResolvedValue(mockSupabase)
    mockServerSupabaseUser.mockResolvedValue({ id: 'user-id' })
    mockReadBody.mockResolvedValue({ password: 'newpassword123' })

    const mockEvent = {}
    const handler = await import('../../../server/api/auth/update-password.post')
    
    const result = await handler.default(mockEvent)
    
    expect(result).toEqual({
      success: true,
      message: 'Contraseña actualizada exitosamente'
    })
    expect(mockSupabase.auth.updateUser).toHaveBeenCalledWith({
      password: 'newpassword123'
    })
  })

  it('debe rechazar contraseñas muy cortas', async () => {
    mockServerSupabaseUser.mockResolvedValue({ id: 'user-id' })
    mockReadBody.mockResolvedValue({ password: '12345' })
    mockCreateError.mockImplementation(({ statusCode, statusMessage }) => {
      const error = new Error(statusMessage)
      ;(error as Error & { statusCode: number }).statusCode = statusCode
      throw error
    })

    const mockEvent = {}
    const handler = await import('../../../server/api/auth/update-password.post')
    
    await expect(handler.default(mockEvent)).rejects.toThrow('La contraseña debe tener al menos 6 caracteres')
  })

  it('debe rechazar usuarios no autenticados', async () => {
    mockServerSupabaseUser.mockResolvedValue(null)
    mockCreateError.mockImplementation(({ statusCode, statusMessage }) => {
      const error = new Error(statusMessage)
      ;(error as Error & { statusCode: number }).statusCode = statusCode
      throw error
    })

    const mockEvent = {}
    const handler = await import('../../../server/api/auth/update-password.post')
    
    await expect(handler.default(mockEvent)).rejects.toThrow('Autenticación requerida')
  })

  it('debe manejar errores de Supabase', async () => {
    const mockSupabase = {
      auth: {
        updateUser: vi.fn().mockResolvedValue({ 
          error: { message: 'Password too weak' } 
        })
      }
    }
    
    mockServerSupabaseClient.mockResolvedValue(mockSupabase)
    mockServerSupabaseUser.mockResolvedValue({ id: 'user-id' })
    mockReadBody.mockResolvedValue({ password: 'newpassword123' })
    mockCreateError.mockImplementation(({ statusCode, statusMessage }) => {
      const error = new Error(statusMessage)
      ;(error as Error & { statusCode: number }).statusCode = statusCode
      throw error
    })

    const mockEvent = {}
    const handler = await import('../../../server/api/auth/update-password.post')
    
    await expect(handler.default(mockEvent)).rejects.toThrow('Error en la contraseña: Password too weak')
  })
})