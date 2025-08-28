import { describe, it, expect, vi, beforeEach } from 'vitest'
import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'
import { createError } from 'h3'

const mockServerSupabaseClient = vi.mocked(serverSupabaseClient)
const mockServerSupabaseUser = vi.mocked(serverSupabaseUser)
const mockCreateError = vi.mocked(createError)

describe('/api/profiles/current.get', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debe obtener perfil actual exitosamente', async () => {
    const mockProfile = {
      id: 'profile-id',
      user_id: 'user-id',
      display_name: 'Test User',
      company: 'Test Company'
    }

    const mockSupabase = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: mockProfile,
              error: null
            })
          })
        })
      })
    }
    
    mockServerSupabaseClient.mockResolvedValue(mockSupabase)
    mockServerSupabaseUser.mockResolvedValue({ id: 'user-id' })

    const mockEvent = {}
    const handler = await import('../../../server/api/profiles/current.get')
    
    const result = await handler.default(mockEvent)
    
    expect(result).toEqual(mockProfile)
    expect(mockSupabase.from).toHaveBeenCalledWith('profiles')
  })

  it('debe manejar usuarios no autenticados', async () => {
    mockServerSupabaseUser.mockResolvedValue(null)
    mockCreateError.mockImplementation(({ statusCode, statusMessage }) => {
      const error = new Error(statusMessage)
      ;(error as Error & { statusCode: number }).statusCode = statusCode
      throw error
    })

    const mockEvent = {}
    const handler = await import('../../../server/api/profiles/current.get')
    
    await expect(handler.default(mockEvent)).rejects.toThrow('Autenticación requerida')
  })

  it('debe manejar perfil no encontrado', async () => {
    const mockSupabase = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: null,
              error: { message: 'Profile not found' }
            })
          })
        })
      })
    }
    
    mockServerSupabaseClient.mockResolvedValue(mockSupabase)
    mockServerSupabaseUser.mockResolvedValue({ id: 'user-id' })
    mockCreateError.mockImplementation(({ statusCode, statusMessage }) => {
      const error = new Error(statusMessage)
      ;(error as Error & { statusCode: number }).statusCode = statusCode
      throw error
    })

    const mockEvent = {}
    const handler = await import('../../../server/api/profiles/current.get')
    
    await expect(handler.default(mockEvent)).rejects.toThrow('Perfil no encontrado')
  })
})