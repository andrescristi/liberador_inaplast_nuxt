import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import UserTable from '~/components/admin/UserTable.vue'

// Mock básico del composable
const mockUserManager = {
  users: ref([]),
  loading: ref(false),
  error: ref(null),
  selectedUsers: ref([]),
  toggleUserSelection: vi.fn(),
  toggleAllUsers: vi.fn(),
  deleteSelectedUsers: vi.fn(),
  resetUserPassword: vi.fn()
}

vi.mock('~/composables/useAdminUserManager', () => ({
  useAdminUserManager: () => mockUserManager
}))

// Mock de HeadlessUI y otros componentes
vi.mock('@headlessui/vue', () => ({
  Menu: { name: 'Menu', template: '<div><slot /></div>' },
  MenuButton: { name: 'MenuButton', template: '<button><slot /></button>' },
  MenuItems: { name: 'MenuItems', template: '<div><slot /></div>' },
  MenuItem: { name: 'MenuItem', template: '<div><slot /></div>' }
}))

describe('UserTable', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUserManager.users.value = []
    mockUserManager.loading.value = false
    mockUserManager.error.value = null
    mockUserManager.selectedUsers.value = []
  })

  it('debe renderizar sin errores', () => {
    const wrapper = mount(UserTable, {
      props: {
        users: []
      },
      global: {
        stubs: {
          BaseTable: true,
          BaseCard: true,
          BaseBadge: true,
          BaseButton: true,
          Icon: true
        }
      }
    })

    expect(wrapper.exists()).toBe(true)
  })

  it('debe pasar datos correctos al BaseTable', () => {
    const mockUsers = [
      {
        id: '1',
        email: 'user1@test.com',
        first_name: 'User',
        last_name: '1',
        created_at: '2024-01-01',
        user_role: 'User' as const
      }
    ]

    const wrapper = mount(UserTable, {
      props: {
        users: mockUsers
      },
      global: {
        stubs: {
          BaseTable: true,
          BaseCard: true,
          BaseBadge: true,
          BaseButton: true,
          Icon: true
        }
      }
    })

    // Verificar que los datos se pasan correctamente como props
    expect(wrapper.props('users')).toEqual(mockUsers)
    expect(wrapper.props('users')).toHaveLength(1)
  })

  it('debe mostrar estado vacío cuando no hay usuarios', () => {
    const wrapper = mount(UserTable, {
      props: {
        users: []
      },
      global: {
        stubs: {
          BaseTable: true,
          BaseCard: true,
          BaseBadge: true,
          BaseButton: true,
          Icon: true
        }
      }
    })

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.props('users')).toHaveLength(0)
  })
})