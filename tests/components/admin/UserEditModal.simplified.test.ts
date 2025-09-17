/**
 * Tests simplificados para UserEditModal.vue
 *
 * Enfoque en las funcionalidades críticas que se corrigieron:
 * - Mapeo de datos snake_case a camelCase
 * - Uso correcto de user_id en endpoints
 * - Manejo de valores null
 * - Prevención de edición de roles Admin
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import UserEditModal from '~/components/admin/UserEditModal.vue'
import type { Profile } from '~/types'

// Mock del composable useModalForm
const mockUseModalForm = vi.fn()
vi.mock('~/composables/ui/useModalForm', () => ({
  useModalForm: () => mockUseModalForm()
}))

// Mock global para auto-import
global.useModalForm = mockUseModalForm

// Mock del fetch
global.$fetch = vi.fn()
const mockFetch = global.$fetch as any

// Mock useToast
const mockToast = {
  error: vi.fn(),
  success: vi.fn(),
  info: vi.fn()
}

vi.mock('~/composables/ui/useToast', () => ({
  useToast: () => mockToast
}))

// Mock global de useToast para auto-import
global.useToast = vi.fn(() => mockToast)

describe('UserEditModal - Tests Simplificados', () => {
  let pinia: any

  const mockUser: Profile = {
    id: 'profile-123',
    user_id: 'user-456',
    first_name: 'Juan',
    last_name: 'Pérez',
    user_role: 'Inspector',
    email: 'juan.perez@test.com',
    created_at: '2023-01-01T12:00:00Z',
    updated_at: '2023-06-01T15:30:00Z'
  }

  const mockAdminUser: Profile = {
    ...mockUser,
    user_role: 'Admin'
  }

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    vi.clearAllMocks()

    // Configurar mock de useModalForm
    mockUseModalForm.mockReturnValue({
      form: {
        value: {
          firstName: mockUser.first_name,
          lastName: mockUser.last_name,
          email: mockUser.email,
          userRole: mockUser.user_role
        }
      },
      loading: { value: false },
      isFormValid: { value: true },
      hasChanges: { value: true },
      handleSubmit: vi.fn(),
      validateField: vi.fn(),
      getFieldError: vi.fn(() => ''),
      hasFieldError: vi.fn(() => false)
    })

    mockFetch.mockClear()
    mockToast.error.mockClear()
    mockToast.success.mockClear()
    mockToast.info.mockClear()
  })

  const createWrapper = (user: Profile = mockUser) => {
    return mount(UserEditModal, {
      props: { user },
      global: {
        plugins: [pinia],
        stubs: {
          BaseModal: {
            template: '<div class="modal"><slot name="header" /><slot /><slot name="footer" /></div>',
            props: ['show', 'size'],
            emits: ['close']
          },
          BaseInput: {
            template: '<input />',
            props: ['modelValue', 'placeholder', 'error', 'type'],
            emits: ['update:modelValue', 'blur']
          },
          BaseButton: {
            template: '<button @click="$emit(\'click\')" :disabled="disabled"><slot /></button>',
            props: ['variant', 'type', 'disabled', 'loading'],
            emits: ['click']
          }
        }
      }
    })
  }

  describe('REGRESIÓN: Mapeo de datos snake_case a camelCase', () => {
    it('debe llamar useModalForm con initialData en formato camelCase', () => {
      createWrapper(mockUser)

      expect(mockUseModalForm).toHaveBeenCalledWith(
        expect.objectContaining({
          initialData: {
            firstName: mockUser.first_name,    // snake_case -> camelCase
            lastName: mockUser.last_name,      // snake_case -> camelCase
            email: mockUser.email,
            userRole: mockUser.user_role       // snake_case -> camelCase
          }
        })
      )
    })

    it('debe manejar email null convirtiendo a string vacío', () => {
      const userWithNullEmail = { ...mockUser, email: null as any }
      createWrapper(userWithNullEmail)

      expect(mockUseModalForm).toHaveBeenCalledWith(
        expect.objectContaining({
          initialData: expect.objectContaining({
            email: ''  // null -> string vacío
          })
        })
      )
    })
  })

  describe('REGRESIÓN: Uso correcto de user_id en endpoints', () => {
    it('debe usar user_id (no id) en el método updateUser', async () => {
      mockFetch.mockResolvedValue({ success: true })

      const wrapper = createWrapper(mockUser)
      const vm = wrapper.vm as any

      // Simular llamada directa al método updateUser
      await vm.updateUser({
        firstName: 'Juan Carlos',
        lastName: mockUser.last_name,
        email: mockUser.email,
        userRole: mockUser.user_role
      })

      // Verificar que usa user_id, NO id
      expect(mockFetch).toHaveBeenCalledWith(
        `/api/admin/users/${mockUser.user_id}`,  // user_id correcto
        expect.any(Object)
      )

      // Verificar que NO usa el id incorrecto
      expect(mockFetch).not.toHaveBeenCalledWith(
        `/api/admin/users/${mockUser.id}`,  // id incorrecto
        expect.any(Object)
      )
    })

    it('debe usar user_id en el endpoint de reseteo de contraseña', async () => {
      global.confirm = vi.fn().mockReturnValue(true)
      mockFetch.mockResolvedValue({ success: true })

      const wrapper = createWrapper(mockUser)
      const vm = wrapper.vm as any

      await vm.resetPassword()

      expect(mockFetch).toHaveBeenCalledWith(
        `/api/admin/users/${mockUser.user_id}/reset-password`,  // user_id correcto
        { method: 'POST' }
      )
    })
  })

  describe('REGRESIÓN: Manejo de valores null', () => {
    it('formatDate debe retornar "N/A" para valores null', () => {
      const wrapper = createWrapper(mockUser)
      const vm = wrapper.vm as any

      expect(vm.formatDate(null)).toBe('N/A')
      expect(vm.formatDate(undefined)).toBe('N/A')
      expect(vm.formatDate('')).toBe('N/A')
    })

    it('formatDate debe formatear fechas válidas correctamente', () => {
      const wrapper = createWrapper(mockUser)
      const vm = wrapper.vm as any

      const formatted = vm.formatDate('2023-01-01T12:00:00Z')
      expect(formatted).toContain('2023')
      expect(formatted).toContain('enero')
    })

    it('debe renderizar sin errores con fechas null', () => {
      const userWithNullDates: Profile = {
        ...mockUser,
        created_at: null,
        updated_at: null
      }

      const wrapper = createWrapper(userWithNullDates)
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.text()).toContain('N/A')
    })
  })

  describe('REGRESIÓN: Prevención de edición de roles Admin', () => {
    it('debe deshabilitar select de rol para usuarios Admin', () => {
      const wrapper = createWrapper(mockAdminUser)
      const roleSelect = wrapper.find('select')

      expect(roleSelect.attributes('disabled')).toBeDefined()
    })

    it('debe habilitar select de rol para usuarios no-Admin', () => {
      const wrapper = createWrapper(mockUser)
      const roleSelect = wrapper.find('select')

      expect(roleSelect.attributes('disabled')).toBeUndefined()
    })

    it('debe mostrar mensaje de advertencia para usuarios Admin', () => {
      const wrapper = createWrapper(mockAdminUser)
      expect(wrapper.text()).toContain('No se puede cambiar el rol de otros administradores')
    })

    it('no debe enviar user_role cuando usuario original es Admin', async () => {
      mockFetch.mockResolvedValue({ success: true })

      const wrapper = createWrapper(mockAdminUser)
      const vm = wrapper.vm as any

      await vm.updateUser({
        firstName: 'Super Admin',
        lastName: mockAdminUser.last_name,
        email: mockAdminUser.email,
        userRole: 'Supervisor'  // Intento de cambio (debe ignorarse)
      })

      // No debe incluir user_role para usuarios Admin
      expect(mockFetch).toHaveBeenCalledWith(
        `/api/admin/users/${mockAdminUser.user_id}`,
        expect.objectContaining({
          method: 'PUT',
          body: {
            first_name: 'Super Admin'  // Solo este campo, sin user_role
          }
        })
      )
    })
  })

  describe('REGRESIÓN: Comparación correcta de campos', () => {
    it('debe detectar cuando NO hay cambios reales', async () => {
      mockFetch.mockResolvedValue({ success: true })

      const wrapper = createWrapper(mockUser)
      const vm = wrapper.vm as any

      // Enviar los mismos datos (sin cambios)
      await vm.updateUser({
        firstName: mockUser.first_name,    // Mismo valor
        lastName: mockUser.last_name,      // Mismo valor
        email: mockUser.email,             // Mismo valor
        userRole: mockUser.user_role       // Mismo valor
      })

      // Debe mostrar mensaje de info y NO llamar a la API
      expect(mockToast.info).toHaveBeenCalledWith('Info', 'No hay cambios para guardar')
      expect(mockFetch).not.toHaveBeenCalled()
    })

    it('debe enviar solo los campos que cambiaron', async () => {
      mockFetch.mockResolvedValue({ success: true })

      const wrapper = createWrapper(mockUser)
      const vm = wrapper.vm as any

      // Solo cambiar firstName
      await vm.updateUser({
        firstName: 'Juan Carlos',           // Cambió
        lastName: mockUser.last_name,      // Sin cambios
        email: mockUser.email,             // Sin cambios
        userRole: mockUser.user_role       // Sin cambios
      })

      // Solo debe enviar el campo que cambió
      expect(mockFetch).toHaveBeenCalledWith(
        `/api/admin/users/${mockUser.user_id}`,
        expect.objectContaining({
          method: 'PUT',
          body: {
            first_name: 'Juan Carlos'  // Solo este campo
          }
        })
      )
    })

    it('debe enviar campos en formato snake_case correcto', async () => {
      mockFetch.mockResolvedValue({ success: true })

      const wrapper = createWrapper(mockUser)
      const vm = wrapper.vm as any

      await vm.updateUser({
        firstName: 'Juan Carlos',      // camelCase
        lastName: 'Pérez García',     // camelCase
        email: 'nuevo@email.com',
        userRole: 'Supervisor'        // camelCase
      })

      // Debe convertir a snake_case en el API call
      expect(mockFetch).toHaveBeenCalledWith(
        `/api/admin/users/${mockUser.user_id}`,
        expect.objectContaining({
          method: 'PUT',
          body: {
            first_name: 'Juan Carlos',    // snake_case
            last_name: 'Pérez García',    // snake_case
            email: 'nuevo@email.com',
            user_role: 'Supervisor'       // snake_case
          }
        })
      )
    })
  })

  describe('Renderizado básico', () => {
    it('debe renderizar el modal correctamente', () => {
      const wrapper = createWrapper()
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.find('.modal').exists()).toBe(true)
    })

    it('debe mostrar el título correcto', () => {
      const wrapper = createWrapper()
      expect(wrapper.text()).toContain('Editar Usuario')
    })

    it('debe mostrar información de fechas', () => {
      const wrapper = createWrapper()
      expect(wrapper.text()).toContain('Creado:')
      expect(wrapper.text()).toContain('Última actualización:')
    })
  })
})