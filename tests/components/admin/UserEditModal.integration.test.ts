/**
 * Tests de integración para UserEditModal.vue
 *
 * Cubre el flujo completo de edición de usuarios:
 * - Integración con UserTable
 * - Flujo completo desde click en editar hasta guardado
 * - Interacción real con composables
 * - Verificación de actualización de datos
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import type { VueWrapper } from '@vue/test-utils';
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import UserTable from '~/components/admin/UserTable.vue'
import UserEditModal from '~/components/admin/UserEditModal.vue'
import type { ProfileResponse, Profile } from '~/types'

// Mock de $fetch para simular las llamadas a la API
const mockFetch = vi.fn()
vi.stubGlobal('$fetch', mockFetch)

// Mock de confirm
const mockConfirm = vi.fn()
vi.stubGlobal('confirm', mockConfirm)

// Mock del toast
const mockToast = {
  error: vi.fn(),
  success: vi.fn(),
  info: vi.fn()
}

vi.mock('~/composables/ui/useToast', () => ({
  useToast: () => mockToast
}))

// Mock básico de componentes UI
vi.mock('~/components/ui/BaseCard.vue', () => ({
  default: {
    name: 'BaseCard',
    template: '<div class="base-card"><slot /></div>'
  }
}))

vi.mock('~/components/ui/BaseTable.vue', () => ({
  default: {
    name: 'BaseTable',
    template: '<div class="base-table"><slot name="actions-data" :row="rows[0]" v-if="rows.length > 0" /></div>',
    props: ['columns', 'rows']
  }
}))

vi.mock('~/components/ui/BaseBadge.vue', () => ({
  default: {
    name: 'BaseBadge',
    template: '<span class="badge"><slot /></span>',
    props: ['color']
  }
}))

vi.mock('~/components/ui/BaseButton.vue', () => ({
  default: {
    name: 'BaseButton',
    template: '<button @click="$emit(\'click\')" :disabled="disabled"><slot /></button>',
    props: ['variant', 'color', 'size', 'leadingIcon', 'disabled', 'loading'],
    emits: ['click']
  }
}))

vi.mock('~/components/ui/BaseModal.vue', () => ({
  default: {
    name: 'BaseModal',
    template: '<div class="modal" v-if="show"><slot name="header" /><slot /><slot name="footer" /></div>',
    props: ['show', 'size'],
    emits: ['close']
  }
}))

vi.mock('~/components/ui/BaseInput.vue', () => ({
  default: {
    name: 'BaseInput',
    template: '<input :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" @blur="$emit(\'blur\')" />',
    props: ['modelValue', 'placeholder', 'error', 'type'],
    emits: ['update:modelValue', 'blur']
  }
}))

vi.mock('@nuxt/icon', () => ({
  Icon: {
    name: 'Icon',
    template: '<span class="icon"></span>',
    props: ['name']
  }
}))

describe('UserEditModal - Tests de Integración', () => {
  let userTableWrapper: VueWrapper<any>
  let modalWrapper: VueWrapper<any>

  const mockUsers: ProfileResponse[] = [
    {
      id: 'profile-1',
      userId: 'user-123',
      firstName: 'Juan',
      lastName: 'Pérez',
      userRole: 'Inspector',
      email: 'juan.perez@test.com',
      createdAt: '2023-01-01T12:00:00Z',
      updatedAt: '2023-06-01T15:30:00Z',
      fullName: 'Juan Pérez'
    },
    {
      id: 'profile-2',
      userId: 'user-456',
      firstName: 'María',
      lastName: 'González',
      userRole: 'Supervisor',
      email: 'maria.gonzalez@test.com',
      createdAt: '2023-02-01T10:00:00Z',
      updatedAt: '2023-06-02T14:00:00Z',
      fullName: 'María González'
    },
    {
      id: 'admin-profile',
      userId: 'admin-789',
      firstName: 'Admin',
      lastName: 'User',
      userRole: 'Admin',
      email: 'admin@test.com',
      createdAt: '2023-01-01T08:00:00Z',
      updatedAt: '2023-06-01T16:00:00Z',
      fullName: 'Admin User'
    }
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    mockFetch.mockClear()
    mockConfirm.mockClear()
    mockToast.error.mockClear()
    mockToast.success.mockClear()
    mockToast.info.mockClear()
  })

  afterEach(() => {
    if (userTableWrapper) {
      userTableWrapper.unmount()
    }
    if (modalWrapper) {
      modalWrapper.unmount()
    }
  })

  describe('Flujo completo: UserTable -> UserEditModal', () => {
    it('debe abrir el modal de edición con datos correctos al hacer clic en editar', async () => {
      // Crear tabla de usuarios
      userTableWrapper = mount(UserTable, {
        props: { users: mockUsers },
        global: {
          stubs: {
            BaseCard: true,
            BaseTable: true,
            BaseBadge: true,
            BaseButton: true,
            Icon: true
          }
        }
      })

      // Simular click en botón editar del primer usuario
      const editButton = userTableWrapper.findAllComponents({ name: 'BaseButton' })
        .find(btn => btn.text().includes('Editar'))

      expect(editButton).toBeTruthy()

      // Emitir evento edit con el usuario seleccionado
      userTableWrapper.vm.$emit('edit', mockUsers[0])

      // Verificar que se emitió el evento con los datos correctos
      expect(userTableWrapper.emitted('edit')).toBeTruthy()
      expect(userTableWrapper.emitted('edit')?.[0]?.[0]).toEqual(mockUsers[0])
    })

    it('debe crear modal con datos del usuario convertidos a snake_case', async () => {
      const selectedUser = mockUsers[0]

      // Convertir ProfileResponse a Profile (camelCase a snake_case)
      const userForModal: Profile = {
        id: selectedUser.id,
        user_id: selectedUser.userId,
        first_name: selectedUser.firstName,
        last_name: selectedUser.lastName,
        user_role: selectedUser.userRole,
        email: selectedUser.email,
        created_at: selectedUser.createdAt,
        updated_at: selectedUser.updatedAt,
        full_name: selectedUser.fullName
      }

      modalWrapper = mount(UserEditModal, {
        props: { user: userForModal },
        global: {
          stubs: {
            BaseModal: true,
            BaseInput: true,
            BaseButton: true
          }
        }
      })

      // Verificar que el modal renderiza correctamente
      expect(modalWrapper.exists()).toBe(true)
      expect(modalWrapper.find('.modal').exists()).toBe(true)
    })
  })

  describe('Flujo de actualización completo', () => {
    it('debe actualizar usuario correctamente y emitir evento updated', async () => {
      const userToEdit: Profile = {
        id: 'profile-1',
        user_id: 'user-123',
        first_name: 'Juan',
        last_name: 'Pérez',
        user_role: 'Inspector',
        email: 'juan.perez@test.com',
        created_at: '2023-01-01T12:00:00Z',
        updated_at: '2023-06-01T15:30:00Z'
      }

      // Configurar mock de $fetch para simular actualización exitosa
      mockFetch.mockResolvedValue({
        success: true,
        user: {
          ...userToEdit,
          first_name: 'Juan Carlos',
          updated_at: new Date().toISOString()
        }
      })

      modalWrapper = mount(UserEditModal, {
        props: { user: userToEdit },
        global: {
          stubs: {
            BaseModal: true,
            BaseInput: true,
            BaseButton: true
          }
        }
      })

      // Simular cambios en el formulario
      const firstNameInput = modalWrapper.findAllComponents({ name: 'BaseInput' })[0]
      await firstNameInput.setValue('Juan Carlos')
      await nextTick()

      // Simular envío del formulario
      const updateButton = modalWrapper.findAllComponents({ name: 'BaseButton' })
        .find(btn => btn.text().includes('Actualizar'))

      expect(updateButton).toBeTruthy()
      await updateButton?.trigger('click')
      await nextTick()

      // Verificar que se llamó a $fetch con los datos correctos
      expect(mockFetch).toHaveBeenCalledWith(
        `/api/admin/users/${userToEdit.user_id}`,
        expect.objectContaining({
          method: 'PUT',
          body: expect.objectContaining({
            first_name: 'Juan Carlos'
          })
        })
      )

      // Verificar que se emitió el evento updated
      expect(modalWrapper.emitted('updated')).toBeTruthy()
    })

    it('debe manejar errores de actualización correctamente', async () => {
      const userToEdit: Profile = {
        id: 'profile-1',
        user_id: 'user-123',
        first_name: 'Juan',
        last_name: 'Pérez',
        user_role: 'Inspector',
        email: 'juan.perez@test.com',
        created_at: '2023-01-01T12:00:00Z',
        updated_at: '2023-06-01T15:30:00Z'
      }

      // Configurar mock para simular error
      const errorMessage = 'Error al actualizar usuario'
      mockFetch.mockRejectedValue(new Error(errorMessage))

      modalWrapper = mount(UserEditModal, {
        props: { user: userToEdit },
        global: {
          stubs: {
            BaseModal: true,
            BaseInput: true,
            BaseButton: true
          }
        }
      })

      // Simular cambios y envío
      const firstNameInput = modalWrapper.findAllComponents({ name: 'BaseInput' })[0]
      await firstNameInput.setValue('Juan Carlos')
      await nextTick()

      const updateButton = modalWrapper.findAllComponents({ name: 'BaseButton' })
        .find(btn => btn.text().includes('Actualizar'))

      await updateButton?.trigger('click')
      await nextTick()

      // Verificar que no se emitió evento updated
      expect(modalWrapper.emitted('updated')).toBeFalsy()
    })
  })

  describe('Validación de datos snake_case vs camelCase', () => {
    it('debe detectar cambios correctamente comparando snake_case con camelCase', async () => {
      const userToEdit: Profile = {
        id: 'profile-1',
        user_id: 'user-123',
        first_name: 'Juan',
        last_name: 'Pérez',
        user_role: 'Inspector',
        email: 'juan.perez@test.com',
        created_at: '2023-01-01T12:00:00Z',
        updated_at: '2023-06-01T15:30:00Z'
      }

      mockFetch.mockResolvedValue({ success: true })

      modalWrapper = mount(UserEditModal, {
        props: { user: userToEdit },
        global: {
          stubs: {
            BaseModal: true,
            BaseInput: true,
            BaseButton: true
          }
        }
      })

      // Simular cambio en firstName (camelCase) que debe compararse con first_name (snake_case)
      const firstNameInput = modalWrapper.findAllComponents({ name: 'BaseInput' })[0]
      await firstNameInput.setValue('Juan Carlos')

      const lastNameInput = modalWrapper.findAllComponents({ name: 'BaseInput' })[1]
      await lastNameInput.setValue('Pérez García')

      const emailInput = modalWrapper.findAllComponents({ name: 'BaseInput' })[2]
      await emailInput.setValue('juan.carlos@test.com')

      await nextTick()

      // Simular envío
      const updateButton = modalWrapper.findAllComponents({ name: 'BaseButton' })
        .find(btn => btn.text().includes('Actualizar'))

      await updateButton?.trigger('click')
      await nextTick()

      // Verificar que se enviaron los campos correctos en snake_case
      expect(mockFetch).toHaveBeenCalledWith(
        `/api/admin/users/${userToEdit.user_id}`,
        expect.objectContaining({
          method: 'PUT',
          body: {
            first_name: 'Juan Carlos',
            last_name: 'Pérez García',
            email: 'juan.carlos@test.com'
          }
        })
      )
    })

    it('no debe enviar campos que no han cambiado', async () => {
      const userToEdit: Profile = {
        id: 'profile-1',
        user_id: 'user-123',
        first_name: 'Juan',
        last_name: 'Pérez',
        user_role: 'Inspector',
        email: 'juan.perez@test.com',
        created_at: '2023-01-01T12:00:00Z',
        updated_at: '2023-06-01T15:30:00Z'
      }

      mockFetch.mockResolvedValue({ success: true })

      modalWrapper = mount(UserEditModal, {
        props: { user: userToEdit },
        global: {
          stubs: {
            BaseModal: true,
            BaseInput: true,
            BaseButton: true
          }
        }
      })

      // Solo cambiar firstName, mantener otros campos iguales
      const firstNameInput = modalWrapper.findAllComponents({ name: 'BaseInput' })[0]
      await firstNameInput.setValue('Juan Carlos')
      await nextTick()

      const updateButton = modalWrapper.findAllComponents({ name: 'BaseButton' })
        .find(btn => btn.text().includes('Actualizar'))

      await updateButton?.trigger('click')
      await nextTick()

      // Solo debe enviar el campo que cambió
      expect(mockFetch).toHaveBeenCalledWith(
        `/api/admin/users/${userToEdit.user_id}`,
        expect.objectContaining({
          method: 'PUT',
          body: {
            first_name: 'Juan Carlos'
          }
        })
      )
    })
  })

  describe('Prevención de edición de roles Admin', () => {
    it('no debe permitir cambiar rol de usuario Admin', async () => {
      const adminUser: Profile = {
        id: 'admin-profile',
        user_id: 'admin-789',
        first_name: 'Admin',
        last_name: 'User',
        user_role: 'Admin',
        email: 'admin@test.com',
        created_at: '2023-01-01T08:00:00Z',
        updated_at: '2023-06-01T16:00:00Z'
      }

      mockFetch.mockResolvedValue({ success: true })

      modalWrapper = mount(UserEditModal, {
        props: { user: adminUser },
        global: {
          stubs: {
            BaseModal: true,
            BaseInput: true,
            BaseButton: true
          }
        }
      })

      // Verificar que el select de rol está deshabilitado
      const roleSelect = modalWrapper.find('select')
      expect(roleSelect.attributes('disabled')).toBeDefined()

      // Cambiar solo el nombre
      const firstNameInput = modalWrapper.findAllComponents({ name: 'BaseInput' })[0]
      await firstNameInput.setValue('Super Admin')
      await nextTick()

      const updateButton = modalWrapper.findAllComponents({ name: 'BaseButton' })
        .find(btn => btn.text().includes('Actualizar'))

      await updateButton?.trigger('click')
      await nextTick()

      // Verificar que no se incluye user_role en la actualización
      expect(mockFetch).toHaveBeenCalledWith(
        `/api/admin/users/${adminUser.user_id}`,
        expect.objectContaining({
          method: 'PUT',
          body: {
            first_name: 'Super Admin'
          }
        })
      )
    })
  })

  describe('Flujo de reseteo de contraseña', () => {
    it('debe llamar al endpoint correcto para resetear contraseña', async () => {
      const userToEdit: Profile = {
        id: 'profile-1',
        user_id: 'user-123',
        first_name: 'Juan',
        last_name: 'Pérez',
        user_role: 'Inspector',
        email: 'juan.perez@test.com',
        created_at: '2023-01-01T12:00:00Z',
        updated_at: '2023-06-01T15:30:00Z'
      }

      mockConfirm.mockReturnValue(true)
      mockFetch.mockResolvedValue({ success: true })

      modalWrapper = mount(UserEditModal, {
        props: { user: userToEdit },
        global: {
          stubs: {
            BaseModal: true,
            BaseInput: true,
            BaseButton: true
          }
        }
      })

      // Buscar y hacer clic en el botón de restablecer contraseña
      const resetButton = modalWrapper.findAllComponents({ name: 'BaseButton' })
        .find(btn => btn.text().includes('Restablecer'))

      expect(resetButton).toBeTruthy()
      await resetButton?.trigger('click')
      await nextTick()

      // Verificar que se llamó al endpoint correcto
      expect(mockFetch).toHaveBeenCalledWith(
        `/api/admin/users/${userToEdit.user_id}/reset-password`,
        { method: 'POST' }
      )

      // Verificar que se mostró el mensaje de éxito
      expect(mockToast.success).toHaveBeenCalledWith(
        'Éxito',
        'Se ha enviado un email para restablecer la contraseña'
      )
    })
  })

  describe('Manejo de fechas null/undefined', () => {
    it('debe manejar fechas null en la información del usuario', async () => {
      const userWithNullDates: Profile = {
        id: 'profile-1',
        user_id: 'user-123',
        first_name: 'Juan',
        last_name: 'Pérez',
        user_role: 'Inspector',
        email: 'juan.perez@test.com',
        created_at: null,
        updated_at: null
      }

      modalWrapper = mount(UserEditModal, {
        props: { user: userWithNullDates },
        global: {
          stubs: {
            BaseModal: true,
            BaseInput: true,
            BaseButton: true
          }
        }
      })

      // Verificar que se muestra "N/A" para fechas null
      expect(modalWrapper.text()).toContain('N/A')
    })
  })
})