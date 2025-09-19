import { describe, it, expect, vi, beforeEach } from 'vitest'

// Ahora sí importamos el composable que queremos testear
import { useAdminUserAPI } from '~/composables/admin/useAdminUserAPI'

// Mock todos los composables necesarios antes de importar useAdminUserAPI
const mockCrudFunctions = {
  getAllUsers: vi.fn(),
  getUserStats: vi.fn(),
  resetUserPassword: vi.fn()
}

vi.mock('~/composables/admin/useAdminUserCRUD', () => ({
  useAdminUserCRUD: () => mockCrudFunctions
}))

vi.mock('~/composables/tools/useLogger', () => ({
  useLogger: () => ({
    debug: vi.fn(),
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn()
  })
}))

describe('useAdminUserAPI', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Setup mock $fetch
    global.$fetch = vi.fn()
  })

  describe('getAllUsersFromAPI', () => {
    it('debe obtener usuarios exitosamente usando el composable CRUD', async () => {
      const mockUsers = {
        data: [
          { id: '1', email: 'user1@test.com', display_name: 'User 1' },
          { id: '2', email: 'user2@test.com', display_name: 'User 2' }
        ],
        total: 2,
        page: 1,
        totalPages: 1
      }

      mockCrudFunctions.getAllUsers.mockResolvedValueOnce(mockUsers)

      const { getAllUsersFromAPI } = useAdminUserAPI()
      const result = await getAllUsersFromAPI({}, 1, 10)

      expect(result).toEqual(mockUsers)
      expect(mockCrudFunctions.getAllUsers).toHaveBeenCalledWith({}, 1, 10)
    })

    it('debe manejar errores al obtener usuarios', async () => {
      mockCrudFunctions.getAllUsers.mockRejectedValueOnce(new Error('Network error'))

      const { getAllUsersFromAPI } = useAdminUserAPI()

      await expect(getAllUsersFromAPI({}, 1, 10)).rejects.toThrow('Error al obtener usuarios: Network error')
    })
  })

  describe('getUserStatsFromAPI', () => {
    it('debe obtener estadísticas de usuarios usando el composable CRUD', async () => {
      const mockStats = {
        total: 100,
        admins: 10,
        supervisors: 20,
        inspectors: 70
      }

      mockCrudFunctions.getUserStats.mockResolvedValueOnce(mockStats)

      const { getUserStatsFromAPI } = useAdminUserAPI()
      const result = await getUserStatsFromAPI()

      expect(result).toEqual(mockStats)
      expect(mockCrudFunctions.getUserStats).toHaveBeenCalledWith()
    })

    it('debe manejar errores al obtener estadísticas', async () => {
      mockCrudFunctions.getUserStats.mockRejectedValueOnce(new Error('Database error'))

      const { getUserStatsFromAPI } = useAdminUserAPI()

      await expect(getUserStatsFromAPI()).rejects.toThrow('Error al obtener estadísticas: Database error')
    })
  })

  describe('resetUserPassword', () => {
    it('debe resetear contraseña exitosamente usando el composable CRUD', async () => {
      mockCrudFunctions.resetUserPassword.mockResolvedValueOnce()

      const { resetUserPassword } = useAdminUserAPI()
      await resetUserPassword('user-id')

      expect(mockCrudFunctions.resetUserPassword).toHaveBeenCalledWith('user-id')
    })

    it('debe manejar errores al resetear contraseña', async () => {
      mockCrudFunctions.resetUserPassword.mockRejectedValueOnce(new Error('User not found'))

      const { resetUserPassword } = useAdminUserAPI()

      await expect(resetUserPassword('invalid-id')).rejects.toThrow('Error al resetear contraseña: User not found')
    })
  })

  describe('getAllUsersViaHTTP', () => {
    it('debe obtener usuarios via HTTP exitosamente', async () => {
      const mockResponse = {
        data: [
          { id: '1', email: 'user1@test.com', display_name: 'User 1' },
          { id: '2', email: 'user2@test.com', display_name: 'User 2' }
        ],
        total: 2,
        page: 1,
        totalPages: 1
      }

      global.$fetch.mockResolvedValueOnce(mockResponse)

      const { getAllUsersViaHTTP } = useAdminUserAPI()
      const result = await getAllUsersViaHTTP({}, 1, 10)

      expect(result).toEqual(mockResponse)
      expect(global.$fetch).toHaveBeenCalledWith('/api/admin/users/list?page=1&page_size=10')
    })

    it('debe manejar errores HTTP al obtener usuarios', async () => {
      global.$fetch.mockRejectedValueOnce({
        statusCode: 500,
        statusMessage: 'Internal Server Error'
      })

      const { getAllUsersViaHTTP } = useAdminUserAPI()

      await expect(getAllUsersViaHTTP({}, 1, 10)).rejects.toThrow('Internal Server Error')
    })
  })

  describe('getUserStatsViaHTTP', () => {
    it('debe obtener estadísticas via HTTP exitosamente', async () => {
      const mockStats = {
        total: 100,
        admins: 10,
        supervisors: 20,
        inspectors: 70
      }

      global.$fetch.mockResolvedValueOnce(mockStats)

      const { getUserStatsViaHTTP } = useAdminUserAPI()
      const result = await getUserStatsViaHTTP()

      expect(result).toEqual(mockStats)
      expect(global.$fetch).toHaveBeenCalledWith('/api/admin/users/stats')
    })
  })

  describe('resetUserPasswordViaHTTP', () => {
    it('debe resetear contraseña via HTTP exitosamente', async () => {
      global.$fetch.mockResolvedValueOnce()

      const { resetUserPasswordViaHTTP } = useAdminUserAPI()
      await resetUserPasswordViaHTTP('user-id')

      expect(global.$fetch).toHaveBeenCalledWith('/api/admin/users/user-id/reset-password', {
        method: 'POST'
      })
    })

    it('debe manejar errores HTTP al resetear contraseña', async () => {
      global.$fetch.mockRejectedValueOnce({
        statusCode: 404,
        statusMessage: 'User not found'
      })

      const { resetUserPasswordViaHTTP } = useAdminUserAPI()

      await expect(resetUserPasswordViaHTTP('invalid-id')).rejects.toThrow('User not found')
    })
  })
})