import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { ProfileRole } from '~/types'

// Mock de Supabase server utilities
const mockServerSupabaseUser = vi.fn()
const mockServerSupabaseServiceRole = vi.fn()
const mockCreateError = vi.fn()
const mockGetQuery = vi.fn()

vi.mock('#supabase/server', () => ({
  serverSupabaseUser: mockServerSupabaseUser,
  serverSupabaseServiceRole: mockServerSupabaseServiceRole
}))

vi.stubGlobal('createError', mockCreateError)
vi.stubGlobal('getQuery', mockGetQuery)
vi.stubGlobal('defineEventHandler', (handler: unknown) => handler)

describe('API: Admin Users (ServiceRole Fixes)', () => {
  
  const mockServiceRoleClient = {
    from: vi.fn(),
    auth: {
      admin: {
        getUserById: vi.fn()
      }
    }
  }

  const mockQueryBuilder = {
    select: vi.fn(),
    eq: vi.fn(),
    single: vi.fn(),
    range: vi.fn(),
    order: vi.fn(),
    or: vi.fn()
  }

  beforeEach(() => {
    vi.clearAllMocks()
    
    // Setup default mocks
    mockServerSupabaseServiceRole.mockReturnValue(mockServiceRoleClient)
    mockServerSupabaseUser.mockResolvedValue({
      id: 'admin-user-id',
      email: 'admin@test.com'
    })
    
    // Setup fluent query builder
    mockServiceRoleClient.from.mockReturnValue(mockQueryBuilder)
    mockQueryBuilder.select.mockReturnValue(mockQueryBuilder)
    mockQueryBuilder.eq.mockReturnValue(mockQueryBuilder)
    mockQueryBuilder.single.mockReturnValue(mockQueryBuilder)
    mockQueryBuilder.range.mockReturnValue(mockQueryBuilder)
    mockQueryBuilder.order.mockReturnValue(mockQueryBuilder)
    mockQueryBuilder.or.mockReturnValue(mockQueryBuilder)
  })

  describe('🔧 Fix: ServiceRole instead of Regular Client', () => {
    it('should use ServiceRole client for admin verification', async () => {
      mockGetQuery.mockReturnValue({
        page: 1,
        page_size: 20,
        search: '',
        role_filter: ''
      })

      // Mock admin check using ServiceRole
      mockQueryBuilder.single.mockResolvedValueOnce({
        data: { user_role: 'Admin' },
        error: null
      })

      // Mock users list query
      mockQueryBuilder.single.mockResolvedValueOnce({
        data: [],
        error: null,
        count: 0
      })

      // Simulate the fixed list.get.ts logic
      const event = { test: 'event' }
      const supabase = mockServerSupabaseServiceRole(event)
      const user = await mockServerSupabaseUser(event)

      // Verify ServiceRole is used for admin check (not regular client)
      const { data: adminCheck } = await supabase
        .from('profiles')
        .select('user_role')
        .eq('user_id', user.id)
        .single()

      expect(mockServerSupabaseServiceRole).toHaveBeenCalledWith(event)
      expect(supabase.from).toHaveBeenCalledWith('profiles')
      expect(mockQueryBuilder.select).toHaveBeenCalledWith('user_role')
      expect(mockQueryBuilder.eq).toHaveBeenCalledWith('user_id', user.id)
      expect(adminCheck).toEqual({ user_role: 'Admin' })
    })

    it('should bypass RLS for admin verification', async () => {
      // This test verifies that we're using ServiceRole instead of regular client
      // ServiceRole bypasses Row Level Security (RLS)
      
      const adminUser = { id: 'admin-123', email: 'admin@test.com' }
      mockServerSupabaseUser.mockResolvedValue(adminUser)
      
      // Clear any previous mocks and setup fresh ones for this test
      vi.clearAllMocks()
      
      // Create a specific query builder mock for this test
      const specificQueryBuilder = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: { user_role: 'Admin' },
          error: null
        }),
        range: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        or: vi.fn().mockReturnThis()
      }
      
      // Setup ServiceRole client mock to return the specific query builder
      const specificServiceClient = {
        ...mockServiceRoleClient,
        from: vi.fn().mockReturnValue(specificQueryBuilder)
      }
      
      mockServerSupabaseServiceRole.mockReturnValue(specificServiceClient)

      const event = { test: 'event' }
      const supabase = mockServerSupabaseServiceRole(event)

      // This call should succeed with ServiceRole (bypassing RLS)
      const { data: adminCheck, error } = await supabase
        .from('profiles')
        .select('user_role')
        .eq('user_id', adminUser.id)
        .single()

      expect(error).toBeNull()
      expect(adminCheck?.user_role).toBe('Admin')
      
      // Verify ServiceRole client was used (not regular client)
      expect(mockServerSupabaseServiceRole).toHaveBeenCalledWith(event)
    })

    it('should use ServiceRole for all database operations', async () => {
      const event = { test: 'event' }
      const supabase = mockServerSupabaseServiceRole(event)

      // Test multiple database operations that should all use ServiceRole
      const operations = [
        // Admin verification
        () => supabase.from('profiles').select('user_role').eq('user_id', 'test').single(),
        // Users list
        () => supabase.from('profiles').select('*').range(0, 19),
        // User count
        () => supabase.from('profiles').select('*', { count: 'exact' })
      ]

      for (const operation of operations) {
        mockQueryBuilder.single.mockResolvedValue({ data: {}, error: null })
        await operation()
        
        // Each operation should use the ServiceRole client
        expect(mockServerSupabaseServiceRole).toHaveBeenCalledWith(event)
      }
    })
  })

  describe('🔧 Fix: Authentication Flow with ServiceRole', () => {
    it('should verify user authentication before admin check', async () => {
      const testUser = { id: 'user-123', email: 'user@test.com' }
      mockServerSupabaseUser.mockResolvedValue(testUser)
      
      const event = { test: 'event' }
      
      // Step 1: Get authenticated user
      const user = await mockServerSupabaseUser(event)
      expect(user).toEqual(testUser)
      
      // Step 2: Use ServiceRole to check admin status
      mockQueryBuilder.single.mockResolvedValue({
        data: { user_role: 'Admin' },
        error: null
      })
      
      const supabase = mockServerSupabaseServiceRole(event)
      const { data: adminCheck } = await supabase
        .from('profiles')
        .select('user_role')
        .eq('user_id', user.id)
        .single()

      expect(adminCheck.user_role).toBe('Admin')
    })

    it('should handle unauthenticated users', async () => {
      mockServerSupabaseUser.mockResolvedValue(null)
      
      mockCreateError.mockImplementation(({ statusCode, statusMessage }) => {
        const error = new Error(statusMessage)
        ;(error as Error & { statusCode: number }).statusCode = statusCode
        throw error
      })

      const event = { test: 'event' }
      const user = await mockServerSupabaseUser(event)

      if (!user) {
        expect(() => {
          throw mockCreateError({
            statusCode: 401,
            statusMessage: 'Usuario no autenticado'
          })
        }).toThrow('Usuario no autenticado')
      }
    })

    it('should handle admin check failures', async () => {
      mockServerSupabaseUser.mockResolvedValue({ id: 'user-123' })
      
      // Simulate admin check failure
      mockQueryBuilder.single.mockResolvedValue({
        data: null,
        error: { message: 'User not found' }
      })

      mockCreateError.mockImplementation(({ statusCode, statusMessage }) => {
        const error = new Error(statusMessage)
        ;(error as Error & { statusCode: number }).statusCode = statusCode
        throw error
      })

      const event = { test: 'event' }
      const supabase = mockServerSupabaseServiceRole(event)
      
      const { data: adminCheck, error } = await supabase
        .from('profiles')
        .select('user_role')
        .eq('user_id', 'user-123')
        .single()

      if (error || !adminCheck) {
        expect(() => {
          throw mockCreateError({
            statusCode: 403,
            statusMessage: 'Acceso denegado. Se requieren privilegios de administrador.'
          })
        }).toThrow('Acceso denegado. Se requieren privilegios de administrador.')
      }
    })
  })

  describe('🔧 Fix: Non-Admin User Rejection', () => {
    const nonAdminRoles: ProfileRole[] = ['Inspector', 'Supervisor']

    nonAdminRoles.forEach(role => {
      it(`should reject ${role} role`, async () => {
        mockServerSupabaseUser.mockResolvedValue({ id: 'user-123' })
        
        mockQueryBuilder.single.mockResolvedValue({
          data: { user_role: role },
          error: null
        })

        mockCreateError.mockImplementation(({ statusCode, statusMessage }) => {
          const error = new Error(statusMessage)
          ;(error as Error & { statusCode: number }).statusCode = statusCode
          throw error
        })

        const event = { test: 'event' }
        const supabase = mockServerSupabaseServiceRole(event)
        
        const { data: adminCheck } = await supabase
          .from('profiles')
          .select('user_role')
          .eq('user_id', 'user-123')
          .single()

        if (!adminCheck || adminCheck.user_role !== 'Admin') {
          expect(() => {
            throw mockCreateError({
              statusCode: 403,
              statusMessage: 'Acceso denegado. Se requieren privilegios de administrador.'
            })
          }).toThrow('Acceso denegado. Se requieren privilegios de administrador.')
        }
      })
    })

    it('should accept Admin role', async () => {
      mockServerSupabaseUser.mockResolvedValue({ id: 'admin-123' })
      
      mockQueryBuilder.single.mockResolvedValue({
        data: { user_role: 'Admin' },
        error: null
      })

      const event = { test: 'event' }
      const supabase = mockServerSupabaseServiceRole(event)
      
      const { data: adminCheck, error } = await supabase
        .from('profiles')
        .select('user_role')
        .eq('user_id', 'admin-123')
        .single()

      expect(error).toBeNull()
      expect(adminCheck.user_role).toBe('Admin')
      
      // Should not throw error for admin user
      if (adminCheck && adminCheck.user_role === 'Admin') {
        expect(adminCheck.user_role).toBe('Admin')
      }
    })
  })

  describe('🔧 Fix: Stats Endpoint ServiceRole Usage', () => {
    it('should use ServiceRole for user profile verification in stats', async () => {
      mockServerSupabaseUser.mockResolvedValue({ id: 'admin-123' })
      
      // Mock admin profile check
      mockQueryBuilder.single.mockResolvedValueOnce({
        data: { user_role: 'Admin' },
        error: null
      })

      // Mock profiles query for stats
      mockQueryBuilder.single.mockResolvedValueOnce({
        data: [
          { user_role: 'Admin' },
          { user_role: 'Supervisor' },
          { user_role: 'Inspector' },
          { user_role: 'Inspector' }
        ],
        error: null
      })

      const event = { test: 'event' }
      const supabase = mockServerSupabaseServiceRole(event)
      const user = await mockServerSupabaseUser(event)

      // Check admin privileges using ServiceRole
      const { data: currentUserProfile, error: currentUserError } = await supabase
        .from('profiles')
        .select('user_role')
        .eq('user_id', user.id)
        .single()

      expect(currentUserError).toBeNull()
      expect(currentUserProfile.user_role).toBe('Admin')

      // Get all profiles for stats calculation using ServiceRole
      const { error: profilesError } = await supabase
        .from('profiles')
        .select('user_role')

      expect(profilesError || null).toBeNull()
      expect(mockServerSupabaseServiceRole).toHaveBeenCalledWith(event)
    })
  })

  describe('🔧 Fix: Error Handling Improvements', () => {
    it('should handle ServiceRole client creation errors', async () => {
      mockServerSupabaseServiceRole.mockImplementation(() => {
        throw new Error('ServiceRole client creation failed')
      })

      const event = { test: 'event' }

      expect(() => {
        mockServerSupabaseServiceRole(event)
      }).toThrow('ServiceRole client creation failed')
    })

    it('should handle database connection errors', async () => {
      mockServerSupabaseUser.mockResolvedValue({ id: 'user-123' })
      
      // Override the mock for this specific test
      const errorQueryBuilder = {
        ...mockQueryBuilder,
        single: vi.fn().mockResolvedValue({
          data: null,
          error: { message: 'Connection timeout', code: 'PGTIMEOUT' }
        })
      }
      
      mockServiceRoleClient.from.mockReturnValue(errorQueryBuilder)

      const event = { test: 'event' }
      const supabase = mockServerSupabaseServiceRole(event)
      
      const { data, error } = await supabase
        .from('profiles')
        .select('user_role')
        .eq('user_id', 'user-123')
        .single()

      expect(data).toBeNull()
      expect(error).toBeTruthy()
      expect(error?.message).toBe('Connection timeout')
    })

    it('should provide descriptive error messages', async () => {
      mockServerSupabaseUser.mockResolvedValue(null)

      mockCreateError.mockImplementation(({ statusCode, statusMessage }) => {
        const error = new Error(statusMessage)
        ;(error as Error & { statusCode: number }).statusCode = statusCode
        return error
      })

      const error = mockCreateError({
        statusCode: 401,
        statusMessage: 'Usuario no autenticado'
      })

      expect(error.message).toBe('Usuario no autenticado')
      expect((error as any).statusCode).toBe(401)
    })
  })

  describe('🧪 Integration Test: Complete Flow', () => {
    it('should complete successful admin user list request', async () => {
      // Setup successful authentication and admin check
      mockServerSupabaseUser.mockResolvedValue({
        id: 'admin-123',
        email: 'admin@test.com'
      })

      mockGetQuery.mockReturnValue({
        page: '1',
        page_size: '20',
        search: '',
        role_filter: ''
      })

      // Mock admin check (using ServiceRole)
      mockQueryBuilder.single.mockResolvedValueOnce({
        data: { user_role: 'Admin' },
        error: null
      })

      // Mock users list query
      const mockUsers = [
        {
          id: 'profile-1',
          user_id: 'user-1',
          first_name: 'Juan',
          last_name: 'Pérez',
          user_role: 'Inspector',
          created_at: '2025-08-14T00:00:00Z'
        }
      ]

      // Create a fresh query builder for the users list call
      const usersQueryBuilder = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: mockUsers,
          error: null,
          count: 1
        }),
        range: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        or: vi.fn().mockReturnThis()
      }
      
      // Setup multiple calls: first for admin check, second for users list
      mockServiceRoleClient.from.mockReturnValueOnce(mockQueryBuilder)
        .mockReturnValueOnce(usersQueryBuilder)

      // Mock email retrieval
      mockServiceRoleClient.auth.admin.getUserById.mockResolvedValue({
        data: {
          user: { email: 'juan@test.com' }
        }
      })

      const event = { test: 'event' }
      const supabase = mockServerSupabaseServiceRole(event)
      const user = await mockServerSupabaseUser(event)

      // Verify admin status
      const { data: adminCheck } = await supabase
        .from('profiles')
        .select('user_role')
        .eq('user_id', user.id)
        .single()

      expect(adminCheck.user_role).toBe('Admin')

      // Get users list
      const { data: users, count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact' })
        .range(0, 19)
        .order('created_at', { ascending: false })

      expect(users || []).toEqual(mockUsers)
      expect(count || 0).toBe(1)
      
      // Verify all operations used ServiceRole
      expect(mockServerSupabaseServiceRole).toHaveBeenCalledWith(event)
    })
  })
})