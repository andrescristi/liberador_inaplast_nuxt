import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useAuthProfile } from '~/composables/auth/useAuthProfile'

// Mock de useAuthState
const mockAuthState = {
  user: ref({ id: 'user-id', email: 'test@test.com' }),
  isAuthenticated: ref(true)
}

vi.mock('~/composables/auth/useAuthState', () => ({
  useAuthState: () => mockAuthState
}))

describe('useAuthProfile', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Setup mock $fetch
    global.$fetch.mockImplementation(vi.fn())
    mockAuthState.isAuthenticated.value = true
  })

  describe('getCurrentUserProfile', () => {
    it('debe cargar perfil exitosamente', async () => {
      const mockProfileResponse = {
        id: 'user-id',
        email: 'test@test.com',
        profile_id: 'profile-id',
        user_id: 'user-id',
        first_name: 'Test',
        last_name: 'User',
        full_name: 'Test User',
        user_role: 'admin'
      }

      global.$fetch.mockResolvedValueOnce(mockProfileResponse)

      const { getCurrentUserProfile } = useAuthProfile()
      const result = await getCurrentUserProfile()

      expect(result).toEqual({
        id: 'profile-id',
        user_id: 'user-id',
        first_name: 'Test',
        last_name: 'User',
        user_role: 'admin',
        created_at: null,
        updated_at: null,
        full_name: 'Test User',
        email: 'test@test.com'
      })
      expect(global.$fetch).toHaveBeenCalledWith('/api/auth/profile')
    })

    it('debe retornar null si usuario no está autenticado', async () => {
      mockAuthState.isAuthenticated.value = false

      const { getCurrentUserProfile } = useAuthProfile()
      const result = await getCurrentUserProfile()

      expect(result).toBe(null)
      expect(global.$fetch).not.toHaveBeenCalled()
    })

    it('debe manejar errores al cargar perfil', async () => {
      const error = new Error('Profile not found')
      global.$fetch.mockRejectedValueOnce(error)

      const { getCurrentUserProfile, profile, profileError } = useAuthProfile()
      const result = await getCurrentUserProfile()

      expect(result).toBe(null)
      expect(profile.value).toBe(null)
      expect(profileError.value).toBe('Profile not found')
    })
  })

  describe('computed properties', () => {
    it('debe calcular hasProfile correctamente', () => {
      const { hasProfile, profile } = useAuthProfile()

      expect(hasProfile.value).toBe(false)

      profile.value = {
        id: 'profile-id',
        user_id: 'user-id',
        first_name: 'Test',
        last_name: 'User',
        user_role: 'admin',
        created_at: null,
        updated_at: null,
        full_name: 'Test User',
        email: 'test@test.com'
      }

      expect(hasProfile.value).toBe(true)
    })

    it('debe calcular displayName correctamente', () => {
      const { displayName, profile } = useAuthProfile()

      expect(displayName.value).toBe('')

      profile.value = {
        id: 'profile-id',
        user_id: 'user-id',
        first_name: 'Test',
        last_name: 'User',
        user_role: 'admin',
        created_at: null,
        updated_at: null,
        full_name: 'Test User',
        email: 'test@test.com'
      }

      expect(displayName.value).toBe('Test User')
    })
  })
})