import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock del sistema de autenticación híbrida
const mockVerifyHybridAuth = vi.fn()
vi.mock('~/server/utils/hybrid-auth', () => ({
  verifyHybridAuth: mockVerifyHybridAuth
}))

// Mock de Supabase server
const mockServerSupabaseServiceRole = vi.fn()
vi.mock('#supabase/server', () => ({
  serverSupabaseServiceRole: mockServerSupabaseServiceRole
}))

// Mock de createError
const mockCreateError = vi.fn((options) => {
  const error = new Error(options.statusMessage)
  error.statusCode = options.statusCode
  return error
})
vi.mock('h3', () => ({
  createError: mockCreateError,
  defineEventHandler: (handler) => handler
}))

// Simular el handler del endpoint
const createProfileHandler = () => {
  return async (event: any) => {
    try {
      // Verificar autenticación híbrida (JWT + Session)
      const auth = await mockVerifyHybridAuth(event)
      
      if (!auth) {
        throw mockCreateError({
          statusCode: 401,
          statusMessage: 'Autenticación requerida'
        })
      }

      // Usar service role para obtener datos del perfil
      const supabase = mockServerSupabaseServiceRole(event)
      
      // Obtener datos del perfil desde la tabla profiles
      const { data: profile, error } = await supabase
        .from('profiles')
        .select(`
          id,
          user_id,
          first_name,
          last_name,
          user_role,
          created_at,
          updated_at
        `)
        .eq('user_id', auth.userId)
        .single()

      if (error) {
        console.error('Error obteniendo perfil desde BD:', error)
        throw mockCreateError({
          statusCode: 404,
          statusMessage: `Error al obtener perfil: ${error.message}`
        })
      }

      // Combinar datos de auth híbrida y perfil
      return {
        // Datos de autenticación híbrida
        id: auth.userId,
        email: auth.email,
        email_confirmed_at: null,
        last_sign_in_at: null,
        
        // Datos del perfil
        profile_id: profile.id,
        user_id: profile.user_id,
        first_name: profile.first_name,
        last_name: profile.last_name,
        full_name: `${profile.first_name} ${profile.last_name}`,
        user_role: profile.user_role,
        
        // Timestamps
        auth_created_at: null,
        auth_updated_at: null,
        profile_created_at: profile.created_at,
        profile_updated_at: profile.updated_at,
        
        // Estado de autenticación
        authenticated: true
      }
    } catch (error: unknown) {
      // Si es un error de createError, re-lanzarlo
      if (error && typeof error === 'object' && 'statusCode' in error) {
        throw error
      }
      
      // Para otros errores, crear error genérico
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      throw mockCreateError({
        statusCode: 500,
        statusMessage: `Error al obtener perfil del usuario: ${errorMessage}`
      })
    }
  }
}

describe('/api/auth/profile', () => {
  let mockEvent: any
  let mockSupabase: any
  let profileHandler: any

  beforeEach(() => {
    vi.clearAllMocks()

    // Mock del evento H3
    mockEvent = {
      method: 'GET',
      url: '/api/auth/profile',
      headers: {
        'authorization': 'Bearer mock-jwt-token',
        'cookie': 'inaplast_session_id=mock-session-id'
      }
    }

    // Mock de Supabase con service role
    mockSupabase = {
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn()
    }

    mockServerSupabaseServiceRole.mockReturnValue(mockSupabase)
    
    // Crear handler
    profileHandler = createProfileHandler()
  })

  it('debe obtener perfil exitosamente con autenticación híbrida', async () => {
    // Configurar mocks exitosos
    mockVerifyHybridAuth.mockResolvedValue({
      userId: 'user-123',
      email: 'test@example.com',
      role: 'Admin',
      sessionId: 'session-123'
    })

    const mockProfile = {
      id: 'profile-123',
      user_id: 'user-123',
      first_name: 'Test',
      last_name: 'User',
      user_role: 'Admin',
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z'
    }

    mockSupabase.single.mockResolvedValue({
      data: mockProfile,
      error: null
    })

    // Ejecutar handler
    const result = await profileHandler(mockEvent)

    // Verificar resultado
    expect(result).toEqual({
      id: 'user-123',
      email: 'test@example.com',
      email_confirmed_at: null,
      last_sign_in_at: null,
      profile_id: 'profile-123',
      user_id: 'user-123',
      first_name: 'Test',
      last_name: 'User',
      full_name: 'Test User',
      user_role: 'Admin',
      auth_created_at: null,
      auth_updated_at: null,
      profile_created_at: '2023-01-01T00:00:00Z',
      profile_updated_at: '2023-01-01T00:00:00Z',
      authenticated: true
    })

    // Verificar llamadas
    expect(mockVerifyHybridAuth).toHaveBeenCalledWith(mockEvent)
    expect(mockSupabase.from).toHaveBeenCalledWith('profiles')
    expect(mockSupabase.eq).toHaveBeenCalledWith('user_id', 'user-123')
  })

  it('debe rechazar sin autenticación válida', async () => {
    // Configurar mock para fallo de autenticación
    mockVerifyHybridAuth.mockResolvedValue(null)

    // Ejecutar y verificar error
    await expect(profileHandler(mockEvent)).rejects.toThrow('Autenticación requerida')
    
    expect(mockSupabase.from).not.toHaveBeenCalled()
  })

  it('debe manejar error cuando no se encuentra el perfil', async () => {
    // Configurar mocks
    mockVerifyHybridAuth.mockResolvedValue({
      userId: 'user-123',
      email: 'test@example.com',
      role: 'Admin',
      sessionId: 'session-123'
    })

    mockSupabase.single.mockResolvedValue({
      data: null,
      error: { message: 'Profile not found' }
    })

    // Ejecutar y verificar error
    await expect(profileHandler(mockEvent)).rejects.toThrow('Error al obtener perfil: Profile not found')
    
    expect(mockVerifyHybridAuth).toHaveBeenCalledWith(mockEvent)
    expect(mockSupabase.from).toHaveBeenCalledWith('profiles')
  })

  it('debe usar service role para bypass RLS', async () => {
    // Configurar mocks exitosos
    mockVerifyHybridAuth.mockResolvedValue({
      userId: 'user-123',
      email: 'test@example.com',
      role: 'Inspector',
      sessionId: 'session-123'
    })

    const mockProfile = {
      id: 'profile-123',
      user_id: 'user-123',
      first_name: 'Inspector',
      last_name: 'Test',
      user_role: 'Inspector',
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z'
    }

    mockSupabase.single.mockResolvedValue({
      data: mockProfile,
      error: null
    })

    // Ejecutar handler
    const result = await profileHandler(mockEvent)

    // Verificar que se usó service role
    expect(mockServerSupabaseServiceRole).toHaveBeenCalledWith(mockEvent)
    
    // Verificar que se obtuvo el perfil correcto
    expect(result.user_role).toBe('Inspector')
    expect(result.full_name).toBe('Inspector Test')
  })

  it('debe manejar errores de verificación híbrida', async () => {
    // Configurar mock para error en verificación
    mockVerifyHybridAuth.mockRejectedValue(new Error('Invalid session'))

    // Ejecutar y verificar error
    await expect(profileHandler(mockEvent)).rejects.toThrow('Error al obtener perfil del usuario: Invalid session')
    
    expect(mockSupabase.from).not.toHaveBeenCalled()
  })

  it('debe construir full_name correctamente', async () => {
    // Configurar mocks exitosos
    mockVerifyHybridAuth.mockResolvedValue({
      userId: 'user-123',
      email: 'test@example.com',
      role: 'Supervisor',
      sessionId: 'session-123'
    })

    const mockProfile = {
      id: 'profile-123',
      user_id: 'user-123',
      first_name: 'Andrés',
      last_name: 'Cristi Le-Fort',
      user_role: 'Supervisor',
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z'
    }

    mockSupabase.single.mockResolvedValue({
      data: mockProfile,
      error: null
    })

    // Ejecutar handler
    const result = await profileHandler(mockEvent)

    // Verificar construcción de nombre completo
    expect(result.full_name).toBe('Andrés Cristi Le-Fort')
    expect(result.first_name).toBe('Andrés')
    expect(result.last_name).toBe('Cristi Le-Fort')
  })
})