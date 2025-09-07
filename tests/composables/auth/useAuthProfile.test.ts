import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useAuthProfile } from '~/composables/auth/useAuthProfile'

// Mock de useHybridAuth
const mockHybridAuth = {
  hasValidJWT: vi.fn(() => true),
  getAuthHeaders: vi.fn(() => ({ Authorization: 'Bearer mock-jwt-token' }))
}

vi.mock('~/composables/auth/useHybridAuth', () => ({
  useHybridAuth: () => mockHybridAuth
}))

describe('useAuthProfile', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Setup mock $fetch
    global.$fetch.mockImplementation(vi.fn())
    mockHybridAuth.hasValidJWT.mockReturnValue(true)
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
      expect(global.$fetch).toHaveBeenCalledWith('/api/auth/profile', {
        headers: { Authorization: 'Bearer mock-jwt-token' }
      })
    })

    it('debe retornar null si no hay JWT válido', async () => {
      mockHybridAuth.hasValidJWT.mockReturnValue(false)

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

    it('debe usar cache cuando está disponible', async () => {
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
      
      // Primera llamada - debe hacer fetch
      await getCurrentUserProfile()
      expect(global.$fetch).toHaveBeenCalledTimes(1)
      
      // Segunda llamada inmediata - debe usar cache
      await getCurrentUserProfile()
      expect(global.$fetch).toHaveBeenCalledTimes(1)
    })

    it('debe forzar refresh cuando force es true', async () => {
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

      global.$fetch.mockResolvedValue(mockProfileResponse)

      const { getCurrentUserProfile } = useAuthProfile()
      
      // Primera llamada
      await getCurrentUserProfile()
      expect(global.$fetch).toHaveBeenCalledTimes(1)
      
      // Segunda llamada con force=true - debe hacer nuevo fetch
      await getCurrentUserProfile(true)
      expect(global.$fetch).toHaveBeenCalledTimes(2)
    })
  })

  describe('verificación de roles', () => {
    it('debe verificar rol correctamente', async () => {
      const mockProfileResponse = {
        id: 'user-id',
        email: 'test@test.com',
        profile_id: 'profile-id',
        user_id: 'user-id',
        first_name: 'Test',
        last_name: 'User',
        full_name: 'Test User',
        user_role: 'Admin'
      }

      global.$fetch.mockResolvedValueOnce(mockProfileResponse)

      const { hasRole, isAdmin, isSupervisor, isInspector } = useAuthProfile()
      
      expect(await hasRole('Admin')).toBe(true)
      expect(await hasRole('Inspector')).toBe(false)
      expect(await isAdmin()).toBe(true)
      expect(await isSupervisor()).toBe(false)
      expect(await isInspector()).toBe(false)
    })
  })

  describe('gestión de cache', () => {
    it('debe limpiar cache correctamente', () => {
      const { profile, profileError, clearProfile } = useAuthProfile()
      
      // Simular datos en cache
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
      profileError.value = 'Some error'
      
      clearProfile()
      
      expect(profile.value).toBe(null)
      expect(profileError.value).toBe(null)
    })
  })

  describe('computed properties', () => {
    it('debe verificar estados reactivos', () => {
      const { profile, isProfileLoading, profileError } = useAuthProfile()

      expect(profile.value).toBe(null)
      expect(isProfileLoading.value).toBe(false)
      expect(profileError.value).toBe(null)
    })
  })
})