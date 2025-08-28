import { describe, it, expect, vi, beforeEach } from 'vitest'
import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'
import { createError } from 'h3'

const mockServerSupabaseClient = vi.mocked(serverSupabaseClient)
const mockServerSupabaseUser = vi.mocked(serverSupabaseUser)
const mockCreateError = vi.mocked(createError)

describe('/api/auth/logout.post', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debe cerrar sesión exitosamente', async () => {
    const mockSupabase = {
      auth: {
        signOut: vi.fn().mockResolvedValue({ error: null })
      }
    }
    
    mockServerSupabaseClient.mockResolvedValue(mockSupabase)
    mockServerSupabaseUser.mockResolvedValue({ id: 'user-id' })

    const mockEvent = {}
    const handler = await import('../../../server/api/auth/logout.post')
    
    const result = await handler.default(mockEvent)
    
    expect(result).toEqual({
      success: true,
      message: 'Cierre de sesión exitoso'
    })
    expect(mockSupabase.auth.signOut).toHaveBeenCalled()
  })

  it('debe manejar usuarios no autenticados', async () => {
    mockServerSupabaseUser.mockResolvedValue(null)
    mockCreateError.mockImplementation(({ statusCode, statusMessage }) => {
      const error = new Error(statusMessage)
      ;(error as Error & { statusCode: number }).statusCode = statusCode
      throw error
    })

    const mockEvent = {}
    const handler = await import('../../../server/api/auth/logout.post')
    
    await expect(handler.default(mockEvent)).rejects.toThrow('Autenticación requerida')
  })

  it('debe manejar errores de Supabase', async () => {
    const mockSupabase = {
      auth: {
        signOut: vi.fn().mockResolvedValue({
          error: { message: 'Session error' }
        })
      }
    }
    
    mockServerSupabaseClient.mockResolvedValue(mockSupabase)
    mockServerSupabaseUser.mockResolvedValue({ id: 'user-id' })
    mockCreateError.mockImplementation(({ statusCode, statusMessage }) => {
      const error = new Error(statusMessage)
      ;(error as Error & { statusCode: number }).statusCode = statusCode
      throw error
    })

    const mockEvent = {}
    const handler = await import('../../../server/api/auth/logout.post')
    
    await expect(handler.default(mockEvent)).rejects.toThrow('Error cerrando sesión: Session error')
  })
})