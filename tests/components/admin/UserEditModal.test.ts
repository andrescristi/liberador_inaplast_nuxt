/**
 * Tests unitarios para UserEditModal.vue
 *
 * Cubre las correcciones relacionadas con:
 * - Mapeo correcto de datos snake_case a camelCase
 * - Comparación correcta de propiedades snake_case
 * - Uso de endpoints correctos con user_id
 * - Manejo correcto de valores null en formatDate
 * - Prevención de edición de rol de administradores
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { nextTick } from 'vue'
import UserEditModal from '~/components/admin/UserEditModal.vue'
import type { Profile } from '~/types'

// Mock del composable useModalForm
const mockUseModalForm = vi.fn()
vi.mock('~/composables/ui/useModalForm', () => ({
  useModalForm: () => mockUseModalForm()
}))

// Mock global de useModalForm para auto-import
global.useModalForm = mockUseModalForm

// Mock useToast
const mockToast = {
  error: vi.fn(),
  success: vi.fn(),
  info: vi.fn()
}

vi.mock('~/composables/ui/useToast', () => ({
  useToast: () => mockToast
}))

// Mock del fetch
global.$fetch = vi.fn()
const mockFetch = global.$fetch as any

// Mock de confirm
global.confirm = vi.fn()
const mockConfirm = global.confirm as any

// Mock de componentes
vi.mock('~/components/ui/BaseModal.vue', () => ({
  default: {
    name: 'BaseModal',
    template: '<div><slot name="header" /><slot /><slot name="footer" /></div>',
    props: ['show', 'size'],
    emits: ['close']
  }
}))

vi.mock('~/components/ui/BaseInput.vue', () => ({
  default: {
    name: 'BaseInput',
    template: '<input />',
    props: ['modelValue', 'placeholder', 'error', 'type'],
    emits: ['update:modelValue', 'blur']
  }
}))

vi.mock('~/components/ui/BaseButton.vue', () => ({
  default: {
    name: 'BaseButton',
    template: '<button><slot /></button>',
    props: ['variant', 'type', 'disabled', 'loading'],
    emits: ['click']
  }
}))

describe('UserEditModal', () => {
  let wrapper: VueWrapper<any>

  const mockUser: Profile = {
    id: 'profile-1',
    user_id: 'user-123',
    first_name: 'Juan',
    last_name: 'Pérez',
    user_role: 'Inspector',
    email: 'juan.perez@test.com',
    created_at: '2023-01-01T12:00:00Z',
    updated_at: '2023-06-01T15:30:00Z'
  }

  const mockAdminUser: Profile = {
    ...mockUser,
    id: 'admin-profile-1',
    user_id: 'admin-123',
    first_name: 'Admin',
    last_name: 'User',
    user_role: 'Admin',
    email: 'admin@test.com'
  }

  beforeEach(() => {
    vi.clearAllMocks()

    // Reset mock
    mockUseModalForm.mockReturnValue({
      form: { value: {} },
      loading: { value: false },
      isFormValid: { value: true },
      hasChanges: { value: false },
      handleSubmit: vi.fn(),
      validateField: vi.fn(),
      getFieldError: vi.fn(() => ''),
      hasFieldError: vi.fn(() => false)
    })

    mockFetch.mockClear()
    mockConfirm.mockClear()
    mockToast.error.mockClear()
    mockToast.success.mockClear()
    mockToast.info.mockClear()
  })

  const createWrapper = (user: Profile = mockUser) => {
    return mount(UserEditModal, {
      props: { user },
      global: {
        stubs: {
          BaseModal: true,
          BaseInput: true,
          BaseButton: true
        }
      }
    })
  }

  describe('Inicialización y mapeo de datos', () => {
    it('debe mapear correctamente los datos iniciales de snake_case a camelCase', () => {
      wrapper = createWrapper(mockUser)

      // Verificar que useModalForm se llama con los datos correctamente mapeados
      expect(mockUseModalForm).toHaveBeenCalledWith(
        expect.objectContaining({
          initialData: {
            firstName: mockUser.first_name,
            lastName: mockUser.last_name,
            email: mockUser.email,
            userRole: mockUser.user_role
          }
        })
      )
    })

    it('debe manejar email null correctamente', () => {
      const userWithNullEmail = { ...mockUser, email: null }
      wrapper = createWrapper(userWithNullEmail as any)

      expect(mockUseModalForm.form.value.email).toBe('')
    })

    it('debe renderizar el modal correctamente', () => {
      wrapper = createWrapper()
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.find('h3').text()).toBe('Editar Usuario')
    })
  })

  describe('Formulario y validación', () => {
    it('debe mostrar los campos del formulario correctamente', () => {
      wrapper = createWrapper()

      const inputs = wrapper.findAllComponents({ name: 'BaseInput' })
      expect(inputs).toHaveLength(3) // nombre, apellido, email

      const select = wrapper.find('select')
      expect(select.exists()).toBe(true)
    })

    it('debe deshabilitar el campo de rol para usuarios Admin', () => {
      wrapper = createWrapper(mockAdminUser)

      const select = wrapper.find('select')
      expect(select.attributes('disabled')).toBeDefined()
    })

    it('debe habilitar el campo de rol para usuarios no Admin', () => {
      wrapper = createWrapper(mockUser)

      const select = wrapper.find('select')
      expect(select.attributes('disabled')).toBeUndefined()
    })

    it('debe mostrar mensaje de advertencia para usuarios Admin', () => {
      wrapper = createWrapper(mockAdminUser)

      expect(wrapper.text()).toContain('No se puede cambiar el rol de otros administradores')
    })

    it('debe validar campos cuando se dispara blur', async () => {
      wrapper = createWrapper()

      const input = wrapper.findComponent({ name: 'BaseInput' })
      await input.trigger('blur')

      expect(mockUseModalForm.validateField).toHaveBeenCalled()
    })
  })

  describe('Función updateUser - Comparación snake_case', () => {
    beforeEach(() => {
      // Mock de updateUser para poder llamarla directamente
      mockUseModalForm.handleSubmit.mockImplementation(async () => {
        const vm = wrapper.vm as any
        await vm.updateUser({
          firstName: 'Juan Carlos',
          lastName: 'Pérez García',
          email: 'juan.carlos@test.com',
          userRole: 'Supervisor'
        })
      })
    })

    it('debe comparar correctamente firstName con first_name del usuario original', async () => {
      wrapper = createWrapper(mockUser)

      await mockUseModalForm.handleSubmit()

      expect(mockFetch).toHaveBeenCalledWith(
        `/api/admin/users/${mockUser.user_id}`,
        expect.objectContaining({
          method: 'PUT',
          body: expect.objectContaining({
            first_name: 'Juan Carlos',
            last_name: 'Pérez García',
            email: 'juan.carlos@test.com',
            user_role: 'Supervisor'
          })
        })
      )
    })

    it('debe usar user_id en el endpoint de actualización', async () => {
      wrapper = createWrapper(mockUser)

      await mockUseModalForm.handleSubmit()

      expect(mockFetch).toHaveBeenCalledWith(
        `/api/admin/users/${mockUser.user_id}`,
        expect.any(Object)
      )
    })

    it('no debe incluir campos que no han cambiado', async () => {
      // Mock para que solo cambie el firstName
      mockUseModalForm.handleSubmit.mockImplementation(async () => {
        const vm = wrapper.vm as any
        await vm.updateUser({
          firstName: 'Juan Carlos',
          lastName: mockUser.last_name, // Sin cambios
          email: mockUser.email, // Sin cambios
          userRole: mockUser.user_role // Sin cambios
        })
      })

      wrapper = createWrapper(mockUser)

      await mockUseModalForm.handleSubmit()

      expect(mockFetch).toHaveBeenCalledWith(
        `/api/admin/users/${mockUser.user_id}`,
        expect.objectContaining({
          method: 'PUT',
          body: {
            first_name: 'Juan Carlos'
          }
        })
      )
    })

    it('no debe cambiar rol de usuarios Admin', async () => {
      mockUseModalForm.handleSubmit.mockImplementation(async () => {
        const vm = wrapper.vm as any
        await vm.updateUser({
          firstName: mockAdminUser.first_name,
          lastName: mockAdminUser.last_name,
          email: mockAdminUser.email,
          userRole: 'Supervisor' // Intento de cambio
        })
      })

      wrapper = createWrapper(mockAdminUser)

      await mockUseModalForm.handleSubmit()

      // No debería incluir user_role en el body
      expect(mockFetch).toHaveBeenCalledWith(
        `/api/admin/users/${mockAdminUser.user_id}`,
        expect.objectContaining({
          method: 'PUT',
          body: {} // Sin cambios porque no se puede cambiar rol de Admin
        })
      )
    })

    it('debe mostrar mensaje info cuando no hay cambios', async () => {
      mockUseModalForm.handleSubmit.mockImplementation(async () => {
        const vm = wrapper.vm as any
        await vm.updateUser({
          firstName: mockUser.first_name,
          lastName: mockUser.last_name,
          email: mockUser.email,
          userRole: mockUser.user_role
        })
      })

      wrapper = createWrapper(mockUser)

      await mockUseModalForm.handleSubmit()

      expect(mockToast.info).toHaveBeenCalledWith('Info', 'No hay cambios para guardar')
      expect(mockFetch).not.toHaveBeenCalled()
    })
  })

  describe('Función formatDate - Manejo de valores null', () => {
    it('debe formatear fechas válidas correctamente', () => {
      wrapper = createWrapper(mockUser)
      const vm = wrapper.vm as any

      const formatted = vm.formatDate('2023-01-01T12:00:00Z')

      expect(formatted).toContain('2023')
      expect(formatted).toContain('enero')
      expect(formatted).toContain('1')
      expect(formatted).toContain('12:00')
    })

    it('debe manejar valores null devolviendo "N/A"', () => {
      wrapper = createWrapper(mockUser)
      const vm = wrapper.vm as any

      const formatted = vm.formatDate(null)

      expect(formatted).toBe('N/A')
    })

    it('debe manejar valores undefined devolviendo "N/A"', () => {
      wrapper = createWrapper(mockUser)
      const vm = wrapper.vm as any

      const formatted = vm.formatDate(undefined)

      expect(formatted).toBe('N/A')
    })

    it('debe mostrar fechas formateadas en la interfaz', () => {
      wrapper = createWrapper(mockUser)

      expect(wrapper.text()).toContain('Creado:')
      expect(wrapper.text()).toContain('Última actualización:')
    })
  })

  describe('Reseteo de contraseña', () => {
    it('debe llamar al endpoint correcto para resetear contraseña', async () => {
      mockConfirm.mockReturnValue(true)
      mockFetch.mockResolvedValue({})

      wrapper = createWrapper(mockUser)

      const resetButton = wrapper.findAllComponents({ name: 'BaseButton' })
        .find(btn => btn.text().includes('Restablecer'))

      await resetButton?.trigger('click')

      expect(mockFetch).toHaveBeenCalledWith(
        `/api/admin/users/${mockUser.user_id}/reset-password`,
        { method: 'POST' }
      )
      expect(mockToast.success).toHaveBeenCalledWith(
        'Éxito',
        'Se ha enviado un email para restablecer la contraseña'
      )
    })

    it('no debe resetear contraseña si el usuario cancela', async () => {
      mockConfirm.mockReturnValue(false)

      wrapper = createWrapper(mockUser)

      const resetButton = wrapper.findAllComponents({ name: 'BaseButton' })
        .find(btn => btn.text().includes('Restablecer'))

      await resetButton?.trigger('click')

      expect(mockFetch).not.toHaveBeenCalled()
    })

    it('debe manejar errores en el reseteo de contraseña', async () => {
      const error = new Error('Error de red')
      mockConfirm.mockReturnValue(true)
      mockFetch.mockRejectedValue(error)

      wrapper = createWrapper(mockUser)

      const resetButton = wrapper.findAllComponents({ name: 'BaseButton' })
        .find(btn => btn.text().includes('Restablecer'))

      await resetButton?.trigger('click')

      expect(mockToast.error).toHaveBeenCalledWith('Error', 'Error de red')
    })
  })

  describe('Eventos y emisiones', () => {
    it('debe emitir evento close al cancelar', async () => {
      wrapper = createWrapper()

      const cancelButton = wrapper.findAllComponents({ name: 'BaseButton' })
        .find(btn => btn.text().includes('Cancelar'))

      await cancelButton?.trigger('click')

      expect(wrapper.emitted('close')).toBeTruthy()
    })

    it('debe emitir evento updated al completar actualización exitosa', () => {
      wrapper = createWrapper()

      // Simular éxito en actualización
      const vm = wrapper.vm as any
      if (vm.onSuccess) {
        vm.onSuccess()
      }

      expect(wrapper.emitted('updated')).toBeTruthy()
    })
  })

  describe('Estados del botón de actualizar', () => {
    it('debe deshabilitar botón cuando loading es true', () => {
      mockUseModalForm.loading.value = true
      wrapper = createWrapper()

      const updateButton = wrapper.findAllComponents({ name: 'BaseButton' })
        .find(btn => btn.text().includes('Actualizar'))

      expect(updateButton?.props('disabled')).toBe(true)
    })

    it('debe deshabilitar botón cuando formulario no es válido', () => {
      mockUseModalForm.isFormValid.value = false
      wrapper = createWrapper()

      const updateButton = wrapper.findAllComponents({ name: 'BaseButton' })
        .find(btn => btn.text().includes('Actualizar'))

      expect(updateButton?.props('disabled')).toBe(true)
    })

    it('debe deshabilitar botón cuando no hay cambios', () => {
      mockUseModalForm.hasChanges.value = false
      wrapper = createWrapper()

      const updateButton = wrapper.findAllComponents({ name: 'BaseButton' })
        .find(btn => btn.text().includes('Actualizar'))

      expect(updateButton?.props('disabled')).toBe(true)
    })

    it('debe habilitar botón cuando todas las condiciones son correctas', () => {
      mockUseModalForm.loading.value = false
      mockUseModalForm.isFormValid.value = true
      mockUseModalForm.hasChanges.value = true

      wrapper = createWrapper()

      const updateButton = wrapper.findAllComponents({ name: 'BaseButton' })
        .find(btn => btn.text().includes('Actualizar'))

      expect(updateButton?.props('disabled')).toBe(false)
    })
  })

  describe('Indicador de cambios pendientes', () => {
    it('debe mostrar mensaje de cambios pendientes cuando hasChanges es true', () => {
      mockUseModalForm.hasChanges.value = true
      wrapper = createWrapper()

      expect(wrapper.text()).toContain('Hay cambios pendientes por guardar')
    })

    it('no debe mostrar mensaje de cambios pendientes cuando hasChanges es false', () => {
      mockUseModalForm.hasChanges.value = false
      wrapper = createWrapper()

      expect(wrapper.text()).not.toContain('Hay cambios pendientes por guardar')
    })
  })
})