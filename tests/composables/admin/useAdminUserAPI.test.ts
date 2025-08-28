import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useAdminUserAPI } from '~/composables/admin/useAdminUserAPI'

describe('useAdminUserAPI', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Setup mock $fetch
    global.$fetch.mockImplementation(vi.fn())
  })

  describe('fetchUsers', () => {
    it('debe obtener usuarios exitosamente', async () => {
      const mockUsers = [
        { id: '1', email: 'user1@test.com', display_name: 'User 1' },
        { id: '2', email: 'user2@test.com', display_name: 'User 2' }
      ]

      global.$fetch.mockResolvedValueOnce(mockUsers)

      const { fetchUsers } = useAdminUserAPI()
      const result = await fetchUsers({ page: 1, limit: 10 })

      expect(result).toEqual(mockUsers)
      expect(global.$fetch).toHaveBeenCalledWith('/api/admin/users/list', {
        method: 'GET',
        query: { page: 1, limit: 10 }
      })
    })

    it('debe manejar errores al obtener usuarios', async () => {
      global.$fetch.mockRejectedValueOnce(new Error('Network error'))

      const { fetchUsers } = useAdminUserAPI()

      await expect(fetchUsers({ page: 1, limit: 10 })).rejects.toThrow('Network error')
    })
  })

  describe('fetchUserStats', () => {
    it('debe obtener estadísticas de usuarios', async () => {
      const mockStats = {
        totalUsers: 100,
        activeUsers: 80,
        inactiveUsers: 20,
        newUsersThisMonth: 10
      }

      global.$fetch.mockResolvedValueOnce(mockStats)

      const { fetchUserStats } = useAdminUserAPI()
      const result = await fetchUserStats()

      expect(result).toEqual(mockStats)
      expect(global.$fetch).toHaveBeenCalledWith('/api/admin/users/stats', {
        method: 'GET'
      })
    })
  })

  describe('resetUserPassword', () => {
    it('debe resetear contraseña exitosamente', async () => {
      const mockResponse = {
        success: true,
        message: 'Contraseña reseteada exitosamente'
      }

      global.$fetch.mockResolvedValueOnce(mockResponse)

      const { resetUserPassword } = useAdminUserAPI()
      const result = await resetUserPassword('user-id')

      expect(result).toEqual(mockResponse)
      expect(global.$fetch).toHaveBeenCalledWith('/api/admin/users/user-id/reset-password', {
        method: 'POST'
      })
    })

    it('debe manejar errores al resetear contraseña', async () => {
      global.$fetch.mockRejectedValueOnce(new Error('User not found'))

      const { resetUserPassword } = useAdminUserAPI()

      await expect(resetUserPassword('invalid-id')).rejects.toThrow('User not found')
    })
  })
})