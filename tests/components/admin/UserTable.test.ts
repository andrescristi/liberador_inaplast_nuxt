import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
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
      global: {
        stubs: {
          BaseTable: true,
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
        created_at: '2024-01-01'
      }
    ]

    mockUserManager.users.value = mockUsers

    const wrapper = mount(UserTable, {
      global: {
        stubs: {
          BaseTable: {
            props: ['columns', 'data', 'loading'],
            template: '<div>BaseTable</div>'
          },
          Icon: true
        }
      }
    })

    const baseTable = wrapper.findComponent({ name: 'BaseTable' })
    expect(baseTable.props('data')).toEqual(mockUsers)
    expect(baseTable.props('loading')).toBe(false)
  })

  it('debe mostrar estado de carga', () => {
    mockUserManager.loading.value = true

    const wrapper = mount(UserTable, {
      global: {
        stubs: {
          BaseTable: {
            props: ['columns', 'data', 'loading'],
            template: '<div>Loading...</div>'
          },
          Icon: true
        }
      }
    })

    const baseTable = wrapper.findComponent({ name: 'BaseTable' })
    expect(baseTable.props('loading')).toBe(true)
  })
})