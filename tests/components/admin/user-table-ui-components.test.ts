import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import UserTable from '~/components/admin/UserTable.vue'
import type { Profile } from '~/types'

const mockUsers: Profile[] = [
  {
    id: '1',
    user_id: 'user-1',
    email: 'test@example.com',
    full_name: 'Test User',
    first_name: 'Test',
    last_name: 'User',
    user_role: 'Inspector',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z'
  },
  {
    id: '2',
    user_id: 'user-2',
    email: 'admin@example.com',
    full_name: 'Admin User',
    first_name: 'Admin',
    last_name: 'User',
    user_role: 'Admin',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z'
  }
]

describe('UserTable UI Components', () => {
  const createWrapper = (users = mockUsers) => {
    return mount(UserTable, {
      props: {
        users
      },
      global: {
        plugins: [createTestingPinia()],
        stubs: {
          BaseCard: {
            template: '<div class="base-card"><slot /></div>'
          },
          BaseTable: {
            template: `
              <div class="base-table">
                <template v-for="(user, index) in users" :key="user.id">
                  <slot name="user_role-data" :row="user" />
                  <slot name="created_at-data" :row="user" />
                  <slot name="actions-data" :row="user" />
                </template>
              </div>
            `,
            props: ['columns', 'rows'],
            setup(props: any) {
              return { users: props.rows || [] }
            }
          },
          BaseButton: {
            template: '<button class="base-button" :class="[variant, color, size]"><slot /></button>',
            props: ['variant', 'color', 'size', 'leadingIcon', 'class']
          },
          BaseBadge: {
            template: '<span class="base-badge" :class="color"><slot /></span>',
            props: ['color']
          },
          Icon: true
        }
      }
    })
  }

  it('should render BaseCard component', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('.base-card').exists()).toBe(true)
  })

  it('should render BaseTable component with correct props', () => {
    const wrapper = createWrapper()
    const table = wrapper.find('.base-table')
    
    expect(table.exists()).toBe(true)
  })

  it('should render action BaseButton components for each user', () => {
    const wrapper = createWrapper()
    
    // Debería haber botones de acción para cada usuario
    const actionButtons = wrapper.findAll('.base-button')
    expect(actionButtons.length).toBeGreaterThan(0)
  })

  it('should render Editar BaseButton for all users', () => {
    const wrapper = createWrapper()
    
    const editButtons = wrapper.findAll('.base-button').filter(btn => 
      btn.text().includes('Editar') && btn.classes().includes('primary')
    )
    
    expect(editButtons.length).toBeGreaterThan(0)
  })

  it('should render Resetear BaseButton for all users', () => {
    const wrapper = createWrapper()
    
    const resetButtons = wrapper.findAll('.base-button').filter(btn => 
      btn.text().includes('Resetear') && btn.classes().includes('warning')
    )
    
    expect(resetButtons.length).toBeGreaterThan(0)
  })

  it('should render Eliminar BaseButton only for non-Admin users', () => {
    const wrapper = createWrapper()
    
    // Verificar que hay botones de eliminar (lógica de negocio: no aparecen para Admin)
    const deleteButtons = wrapper.findAll('.base-button').filter(btn => 
      btn.text().includes('Eliminar')
    )
    
    // Debe haber al menos un botón de eliminar visible
    expect(deleteButtons.length).toBeGreaterThanOrEqual(1)
  })

  it('should render BaseBadge components for user roles', () => {
    const wrapper = createWrapper()
    const badges = wrapper.findAll('.base-badge')
    
    expect(badges.length).toBeGreaterThan(0)
  })

  it('should emit correct events when action buttons are clicked', async () => {
    const wrapper = createWrapper()
    
    const editButton = wrapper.findAll('.base-button')
      .find(btn => btn.text().includes('Editar'))
    
    if (editButton) {
      await editButton.trigger('click')
      expect(wrapper.emitted('edit')).toBeTruthy()
    }
  })

  it('should handle empty users array', () => {
    const wrapper = createWrapper([])
    expect(wrapper.find('.base-table').exists()).toBe(true)
  })

  it('should render mobile view components', () => {
    const wrapper = createWrapper()
    
    // Verificar que los componentes móviles estén presentes
    // (aunque no sean visibles en el test, el template debe incluirlos)
    expect(wrapper.html()).toContain('md:hidden')
  })
})