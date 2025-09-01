/**
 * Tests para el diseño responsivo de UserTable.vue
 * 
 * Cubre las mejoras implementadas:
 * - Vista de tabla en desktop (md+)
 * - Vista de tarjetas en móvil (<md)
 * - Badge de rol corregido para no cortarse
 * - Estado vacío optimizado
 * - Acciones organizadas correctamente
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import UserTable from '~/components/admin/UserTable.vue'
import type { Profile } from '~/types'

// Mock data
const mockUsers: Profile[] = [
  {
    id: 'user-1',
    full_name: 'Juan Pérez González',
    email: 'juan.perez@example.com',
    user_role: 'Inspector',
    created_at: '2023-01-15T10:30:00Z',
    updated_at: '2023-01-15T10:30:00Z'
  },
  {
    id: 'user-2', 
    full_name: 'María López Administradora',
    email: 'maria.lopez.admin@example.com',
    user_role: 'Admin',
    created_at: '2023-01-10T08:15:00Z',
    updated_at: '2023-01-10T08:15:00Z'
  },
  {
    id: 'user-3',
    full_name: 'Carlos Supervisor Manager',
    email: 'carlos.supervisor@example.com',
    user_role: 'Supervisor',
    created_at: '2023-01-12T14:45:00Z',
    updated_at: '2023-01-12T14:45:00Z'
  }
]

// Mock de componentes UI
vi.mock('~/components/ui/BaseCard.vue', () => ({
  default: {
    name: 'BaseCard',
    template: '<div class="base-card"><slot /></div>'
  }
}))

vi.mock('~/components/ui/BaseTable.vue', () => ({
  default: {
    name: 'BaseTable',
    props: ['columns', 'rows'],
    template: `
      <table class="base-table">
        <thead>
          <tr>
            <th v-for="col in columns" :key="col.key">{{ col.label }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.id">
            <td>{{ row.full_name }}</td>
            <td>{{ row.email }}</td>
            <td><slot name="user_role-data" :row="row" /></td>
            <td><slot name="created_at-data" :row="row" /></td>
            <td><slot name="actions-data" :row="row" /></td>
          </tr>
        </tbody>
      </table>
    `
  }
}))

vi.mock('~/components/ui/BaseBadge.vue', () => ({
  default: {
    name: 'BaseBadge',
    props: ['color'],
    template: '<span class="badge" :class="[color]"><slot /></span>'
  }
}))

vi.mock('~/components/ui/BaseButton.vue', () => ({
  default: {
    name: 'BaseButton',
    props: ['variant', 'color', 'size', 'leadingIcon'],
    emits: ['click'],
    template: '<button @click="$emit(\'click\')"><slot /></button>'
  }
}))

describe('UserTable - Diseño Responsivo', () => {
  describe('Vista Desktop', () => {
    let wrapper: any

    beforeEach(() => {
      wrapper = mount(UserTable, {
        props: {
          users: mockUsers
        },
        global: {
          stubs: {
            'Icon': {
              name: 'Icon',
              props: ['name'],
              template: '<span>{{ name }}</span>'
            }
          }
        }
      })
    })

    it('debería mostrar la tabla en desktop (hidden en móvil)', () => {
      const desktopTable = wrapper.find('.hidden.md\\:block')
      expect(desktopTable.exists()).toBe(true)
      
      const table = wrapper.find('.base-table')
      expect(table.exists()).toBe(true)
    })

    it('debería tener las columnas correctas', () => {
      const headers = wrapper.findAll('th')
      expect(headers).toHaveLength(5)
      expect(headers[0].text()).toBe('Nombre')
      expect(headers[1].text()).toBe('Email')
      expect(headers[2].text()).toBe('Rol')
      expect(headers[3].text()).toBe('Fecha de Creación')
      expect(headers[4].text()).toBe('Acciones')
    })

    it('debería renderizar todos los usuarios en filas', () => {
      const rows = wrapper.findAll('tbody tr')
      expect(rows).toHaveLength(mockUsers.length)
    })

    it('debería mostrar badges de rol correctos', () => {
      const badges = wrapper.findAll('.badge')
      expect(badges).toHaveLength(mockUsers.length) // Una para cada usuario en desktop
      
      // Verificar texto de roles
      expect(wrapper.text()).toContain('Inspector')
      expect(wrapper.text()).toContain('Administrador')
      expect(wrapper.text()).toContain('Supervisor')
    })

    it('debería mostrar botones de acción', () => {
      const editButtons = wrapper.findAll('button').filter((btn: any) => btn.text().includes('Editar'))
      const resetButtons = wrapper.findAll('button').filter((btn: any) => btn.text().includes('Resetear'))
      const deleteButtons = wrapper.findAll('button').filter((btn: any) => btn.text().includes('Eliminar'))
      
      expect(editButtons.length).toBe(mockUsers.length)
      expect(resetButtons.length).toBe(mockUsers.length)
      expect(deleteButtons.length).toBe(mockUsers.length - 1) // Admin no tiene botón eliminar
    })
  })

  describe('Vista Móvil', () => {
    let wrapper: any

    beforeEach(() => {
      wrapper = mount(UserTable, {
        props: {
          users: mockUsers
        },
        global: {
          stubs: {
            'Icon': {
              name: 'Icon',
              props: ['name'],
              template: '<span>{{ name }}</span>'
            }
          }
        }
      })
    })

    it('debería mostrar tarjetas en móvil (ocultar en desktop)', () => {
      const mobileCards = wrapper.find('.md\\:hidden.space-y-4')
      expect(mobileCards.exists()).toBe(true)
    })

    it('debería renderizar una tarjeta por usuario', () => {
      const cards = wrapper.findAll('.bg-white.border.border-gray-200.rounded-lg')
      expect(cards).toHaveLength(mockUsers.length)
    })

    it('debería mostrar información completa en cada tarjeta', () => {
      const cards = wrapper.findAll('.bg-white.border.border-gray-200.rounded-lg')
      const firstCard = cards[0]
      
      // Header de la tarjeta
      expect(firstCard.text()).toContain('Juan Pérez González')
      expect(firstCard.text()).toContain('juan.perez@example.com')
      
      // Badge de rol
      expect(firstCard.find('.badge').exists()).toBe(true)
      
      // Fecha de creación
      expect(firstCard.text()).toContain('Creado:')
      
      // Botones de acción
      expect(firstCard.text()).toContain('Editar')
      expect(firstCard.text()).toContain('Resetear')
      expect(firstCard.text()).toContain('Eliminar')
    })

    it('debería tener layout flex correcto para evitar overflow', () => {
      const cardHeaders = wrapper.findAll('.flex.items-start.justify-between')
      expect(cardHeaders.length).toBeGreaterThan(0)
      
      // Verificar que el contenido principal tiene flex-1 y min-w-0
      const contentDivs = wrapper.findAll('.flex-1.min-w-0')
      expect(contentDivs.length).toBe(mockUsers.length)
      
      // Verificar que el badge tiene flex-shrink-0
      const badgeContainers = wrapper.findAll('.flex-shrink-0')
      expect(badgeContainers.length).toBe(mockUsers.length)
    })

    it('debería truncar texto largo con clase truncate', () => {
      const truncatedElements = wrapper.findAll('.truncate')
      expect(truncatedElements.length).toBeGreaterThanOrEqual(mockUsers.length * 2) // Nombre y email por usuario
    })

    it('debería tener badges con whitespace-nowrap', () => {
      const badges = wrapper.findAll('.badge.whitespace-nowrap')
      expect(badges.length).toBeGreaterThan(0)
    })

    it('debería organizar botones de acción en filas flexibles', () => {
      const actionContainers = wrapper.findAll('.flex.flex-wrap.gap-2')
      expect(actionContainers.length).toBe(mockUsers.length)
      
      // Los botones deben tener flex-1 para distribución uniforme
      const flexButtons = wrapper.findAll('button.flex-1')
      expect(flexButtons.length).toBeGreaterThan(0)
    })

    it('no debería mostrar botón eliminar para usuarios Admin', () => {
      const cards = wrapper.findAll('.bg-white.border.border-gray-200.rounded-lg')
      const adminCard = cards[1] // María López es Admin (index 1)
      
      expect(adminCard.text()).toContain('Editar')
      expect(adminCard.text()).toContain('Resetear')
      expect(adminCard.text()).not.toContain('Eliminar')
    })
  })

  describe('Estado Vacío', () => {
    let wrapper: any

    beforeEach(() => {
      wrapper = mount(UserTable, {
        props: {
          users: [] // Sin usuarios
        },
        global: {
          stubs: {
            'Icon': {
              name: 'Icon',
              props: ['name'],
              template: '<span>{{ name }}</span>'
            }
          }
        }
      })
    })

    it('debería mostrar estado vacío en móvil cuando no hay usuarios', () => {
      const emptyState = wrapper.find('.text-center.py-8')
      expect(emptyState.exists()).toBe(true)
      
      expect(wrapper.text()).toContain('No hay usuarios')
      expect(wrapper.text()).toContain('No se encontraron registros.')
    })

    it('debería mostrar ícono de estado vacío', () => {
      const emptyIcon = wrapper.find('span').filter((node: any) => node.text() === 'bx:user-x')
      expect(emptyIcon.exists()).toBe(true)
    })
  })

  describe('Funcionalidad de Badges', () => {
    let wrapper: any

    beforeEach(() => {
      wrapper = mount(UserTable, {
        props: {
          users: mockUsers
        },
        global: {
          stubs: {
            'Icon': {
              name: 'Icon',
              props: ['name'],
              template: '<span>{{ name }}</span>'
            }
          }
        }
      })
    })

    it('debería asignar colores correctos a los badges por rol', () => {
      const badges = wrapper.findAll('.badge')
      
      // Verificar que los badges tienen las clases de color correctas
      const adminBadges = badges.filter((badge: any) => badge.classes().includes('blue'))
      const supervisorBadges = badges.filter((badge: any) => badge.classes().includes('green'))  
      const inspectorBadges = badges.filter((badge: any) => badge.classes().includes('yellow'))
      
      expect(adminBadges.length).toBe(2) // Admin badge en desktop y móvil
      expect(supervisorBadges.length).toBe(2) // Supervisor badge en desktop y móvil
      expect(inspectorBadges.length).toBe(2) // Inspector badge en desktop y móvil
    })

    it('debería mostrar etiquetas de rol en español', () => {
      expect(wrapper.text()).toContain('Administrador') // Admin -> Administrador
      expect(wrapper.text()).toContain('Supervisor') // Supervisor -> Supervisor
      expect(wrapper.text()).toContain('Inspector') // Inspector -> Inspector
    })
  })

  describe('Eventos y Emisiones', () => {
    let wrapper: any

    beforeEach(() => {
      wrapper = mount(UserTable, {
        props: {
          users: mockUsers
        },
        global: {
          stubs: {
            'Icon': {
              name: 'Icon',
              props: ['name'],
              template: '<span>{{ name }}</span>'
            }
          }
        }
      })
    })

    it('debería emitir evento edit al hacer clic en botón editar', async () => {
      const editButtons = wrapper.findAll('button').filter((btn: any) => btn.text().includes('Editar'))
      
      await editButtons[0].trigger('click')
      
      expect(wrapper.emitted('edit')).toBeTruthy()
      expect(wrapper.emitted('edit')?.[0]?.[0]).toEqual(mockUsers[0])
    })

    it('debería emitir evento resetPassword al hacer clic en resetear', async () => {
      const resetButtons = wrapper.findAll('button').filter((btn: any) => btn.text().includes('Resetear'))
      
      await resetButtons[0].trigger('click')
      
      expect(wrapper.emitted('resetPassword')).toBeTruthy()
      expect(wrapper.emitted('resetPassword')?.[0]?.[0]).toEqual(mockUsers[0])
    })

    it('debería emitir evento delete al hacer clic en eliminar', async () => {
      const deleteButtons = wrapper.findAll('button').filter((btn: any) => btn.text().includes('Eliminar'))
      
      await deleteButtons[0].trigger('click')
      
      expect(wrapper.emitted('delete')).toBeTruthy()
      expect(wrapper.emitted('delete')?.[0]?.[0]).toEqual(mockUsers[0])
    })
  })

  describe('Formateo de Fechas', () => {
    let wrapper: any

    beforeEach(() => {
      wrapper = mount(UserTable, {
        props: {
          users: mockUsers
        },
        global: {
          stubs: {
            'Icon': {
              name: 'Icon',
              props: ['name'],
              template: '<span>{{ name }}</span>'
            }
          }
        }
      })
    })

    it('debería formatear fechas correctamente en español', () => {
      // Las fechas deben aparecer formateadas en las tarjetas
      expect(wrapper.text()).toContain('Creado:')
      
      // Verificar que hay fechas formateadas (formato DD MMM YYYY)
      const datePattern = /\d{1,2}\s+(ene|feb|mar|abr|may|jun|jul|ago|sep|oct|nov|dic)/i
      expect(datePattern.test(wrapper.text())).toBe(true)
    })
  })
})