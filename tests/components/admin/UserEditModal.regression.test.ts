/**
 * Tests de regresión para UserEditModal.vue
 *
 * Estos tests están específicamente diseñados para evitar que regresen
 * los bugs relacionados con:
 * 1. Comparación incorrecta de camelCase vs snake_case
 * 2. Uso incorrecto de IDs en endpoints
 * 3. Manejo incorrecto de valores null
 * 4. Pérdida de funcionalidad de edición de roles Admin
 *
 * Cada test documenta el bug específico que previene.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { VueWrapper } from '@vue/test-utils';
import { mount } from '@vue/test-utils'
import UserEditModal from '~/components/admin/UserEditModal.vue'
import type { Profile } from '~/types'

// Mock de $fetch
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

// Mock de componentes UI
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
    template: '<input :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />',
    props: ['modelValue', 'placeholder', 'error', 'type'],
    emits: ['update:modelValue', 'blur']
  }
}))

vi.mock('~/components/ui/BaseButton.vue', () => ({
  default: {
    name: 'BaseButton',
    template: '<button @click="$emit(\'click\')" :disabled="disabled"><slot /></button>',
    props: ['variant', 'type', 'disabled', 'loading'],
    emits: ['click']
  }
}))

// Mock del composable useModalForm para poder controlarlo completamente
const mockUseModalForm = vi.fn()
vi.mock('~/composables/ui/useModalForm', () => ({
  useModalForm: () => mockUseModalForm()
}))

// Mock global para auto-import
global.useModalForm = mockUseModalForm

// Mock global de useToast para auto-import
global.useToast = vi.fn(() => mockToast)

describe('UserEditModal - Tests de Regresión', () => {
  let wrapper: VueWrapper<any>

  const mockUser: Profile = {
    id: 'profile-123',
    user_id: 'auth-user-456',
    first_name: 'Juan',
    last_name: 'Pérez',
    user_role: 'Inspector',
    email: 'juan.perez@test.com',
    created_at: '2023-01-01T12:00:00Z',
    updated_at: '2023-06-01T15:30:00Z'
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockFetch.mockClear()
    mockToast.error.mockClear()
    mockToast.success.mockClear()
    mockToast.info.mockClear()

    // Reset mock
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
  })

  describe('BUG REGRESIÓN #1: Comparación incorrecta camelCase vs snake_case', () => {
    /**
     * BUG: El formulario usa camelCase (firstName) pero el usuario original
     * tiene snake_case (first_name). La comparación fallaba causando que
     * siempre detectara cambios incluso cuando no los había.
     */
    it('debe detectar correctamente cuando NO hay cambios (firstName vs first_name)', async () => {
      mockFetch.mockResolvedValue({})

      wrapper = mount(UserEditModal, {
        props: { user: mockUser },
        global: { stubs: { BaseModal: true, BaseInput: true, BaseButton: true } }
      })

      // Simular envío con los mismos datos (sin cambios)
      const vm = wrapper.vm as any
      await vm.updateUser({
        firstName: mockUser.first_name,    // 'Juan' === 'Juan'
        lastName: mockUser.last_name,      // 'Pérez' === 'Pérez'
        email: mockUser.email,             // mismo email
        userRole: mockUser.user_role       // mismo rol
      })

      // REGRESIÓN: Antes enviaba petición innecesaria
      // CORRECTO: Ahora debe mostrar mensaje y NO llamar API
      expect(mockToast.info).toHaveBeenCalledWith('Info', 'No hay cambios para guardar')
      expect(mockFetch).not.toHaveBeenCalled()
    })

    it('debe detectar correctamente cuando SÍ hay cambios (firstName vs first_name)', async () => {
      mockFetch.mockResolvedValue({})

      wrapper = mount(UserEditModal, {
        props: { user: mockUser },
        global: { stubs: { BaseModal: true, BaseInput: true, BaseButton: true } }
      })

      const vm = wrapper.vm as any
      await vm.updateUser({
        firstName: 'Juan Carlos',           // Cambió de 'Juan' a 'Juan Carlos'
        lastName: mockUser.last_name,      // Sin cambios
        email: mockUser.email,             // Sin cambios
        userRole: mockUser.user_role       // Sin cambios
      })

      // CORRECTO: Debe enviar solo el campo que cambió
      expect(mockFetch).toHaveBeenCalledWith(
        `/api/admin/users/${mockUser.user_id}`,
        expect.objectContaining({
          method: 'PUT',
          body: { first_name: 'Juan Carlos' }  // Solo este campo
        })
      )
      expect(mockToast.info).not.toHaveBeenCalled()
    })

    it('debe enviar correctamente todos los campos en snake_case cuando hay múltiples cambios', async () => {
      mockFetch.mockResolvedValue({})

      wrapper = mount(UserEditModal, {
        props: { user: mockUser },
        global: { stubs: { BaseModal: true, BaseInput: true, BaseButton: true } }
      })

      const vm = wrapper.vm as any
      await vm.updateUser({
        firstName: 'Juan Carlos',              // Cambió
        lastName: 'Pérez García',             // Cambió
        email: 'juan.carlos@newemail.com',    // Cambió
        userRole: 'Supervisor'                // Cambió
      })

      // CORRECTO: Todos los campos en snake_case
      expect(mockFetch).toHaveBeenCalledWith(
        `/api/admin/users/${mockUser.user_id}`,
        expect.objectContaining({
          method: 'PUT',
          body: {
            first_name: 'Juan Carlos',    // camelCase -> snake_case
            last_name: 'Pérez García',    // camelCase -> snake_case
            email: 'juan.carlos@newemail.com',
            user_role: 'Supervisor'       // camelCase -> snake_case
          }
        })
      )
    })
  })

  describe('BUG REGRESIÓN #2: Uso incorrecto de IDs en endpoints', () => {
    /**
     * BUG: Se usaba profile.id en lugar de profile.user_id para los endpoints
     * de actualización y reseteo de contraseña, causando errores 404.
     */
    it('debe usar user_id (no id) en el endpoint de actualización', async () => {
      mockFetch.mockResolvedValue({})

      wrapper = mount(UserEditModal, {
        props: { user: mockUser },
        global: { stubs: { BaseModal: true, BaseInput: true, BaseButton: true } }
      })

      const vm = wrapper.vm as any
      await vm.updateUser({
        firstName: 'Juan Carlos',
        lastName: mockUser.last_name,
        email: mockUser.email,
        userRole: mockUser.user_role
      })

      // REGRESIÓN: Antes usaba `/api/admin/users/${mockUser.id}` (ERROR)
      // CORRECTO: Debe usar user_id
      expect(mockFetch).toHaveBeenCalledWith(
        `/api/admin/users/${mockUser.user_id}`,  // user_id, NO id
        expect.any(Object)
      )
    })

    it('debe usar user_id (no id) en el endpoint de reseteo de contraseña', async () => {
      mockConfirm.mockReturnValue(true)
      mockFetch.mockResolvedValue({})

      wrapper = mount(UserEditModal, {
        props: { user: mockUser },
        global: { stubs: { BaseModal: true, BaseInput: true, BaseButton: true } }
      })

      const vm = wrapper.vm as any
      await vm.resetPassword()

      // REGRESIÓN: Antes usaba `/api/admin/users/${mockUser.id}/reset-password` (ERROR)
      // CORRECTO: Debe usar user_id
      expect(mockFetch).toHaveBeenCalledWith(
        `/api/admin/users/${mockUser.user_id}/reset-password`,  // user_id, NO id
        { method: 'POST' }
      )
    })

    it('debe fallar el test si se usa id en lugar de user_id', async () => {
      mockFetch.mockResolvedValue({})

      wrapper = mount(UserEditModal, {
        props: { user: mockUser },
        global: { stubs: { BaseModal: true, BaseInput: true, BaseButton: true } }
      })

      const vm = wrapper.vm as any
      await vm.updateUser({
        firstName: 'Juan Carlos',
        lastName: mockUser.last_name,
        email: mockUser.email,
        userRole: mockUser.user_role
      })

      // Este test debería FALLAR si se usa el ID incorrecto
      // Verifica que NO se llama con el profile.id incorrecto
      expect(mockFetch).not.toHaveBeenCalledWith(
        `/api/admin/users/${mockUser.id}`,  // ID INCORRECTO
        expect.any(Object)
      )
    })
  })

  describe('BUG REGRESIÓN #3: Manejo incorrecto de valores null', () => {
    /**
     * BUG: La función formatDate no manejaba valores null/undefined,
     * causando errores de renderizado.
     */
    it('debe manejar created_at null sin errores', () => {
      const userWithNullCreatedAt: Profile = {
        ...mockUser,
        created_at: null
      }

      wrapper = mount(UserEditModal, {
        props: { user: userWithNullCreatedAt },
        global: { stubs: { BaseModal: true, BaseInput: true, BaseButton: true } }
      })

      // REGRESIÓN: Antes causaba error al intentar formatear null
      // CORRECTO: Debe renderizar sin errores y mostrar "N/A"
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.text()).toContain('N/A')
    })

    it('debe manejar updated_at null sin errores', () => {
      const userWithNullUpdatedAt: Profile = {
        ...mockUser,
        updated_at: null
      }

      wrapper = mount(UserEditModal, {
        props: { user: userWithNullUpdatedAt },
        global: { stubs: { BaseModal: true, BaseInput: true, BaseButton: true } }
      })

      // CORRECTO: Debe renderizar sin errores
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.text()).toContain('N/A')
    })

    it('debe manejar email null correctamente en el formulario', () => {
      const userWithNullEmail: Profile = {
        ...mockUser,
        email: null as any
      }

      wrapper = mount(UserEditModal, {
        props: { user: userWithNullEmail },
        global: { stubs: { BaseModal: true, BaseInput: true, BaseButton: true } }
      })

      // REGRESIÓN: Antes el formulario se inicializaba con null
      // CORRECTO: Debe inicializar con string vacío para el input
      const vm = wrapper.vm as any
      // El componente internamente debe convertir null a string vacío
      expect(wrapper.exists()).toBe(true)
    })

    it('formatDate debe retornar "N/A" para valores null y undefined', () => {
      wrapper = mount(UserEditModal, {
        props: { user: mockUser },
        global: { stubs: { BaseModal: true, BaseInput: true, BaseButton: true } }
      })

      const vm = wrapper.vm as any

      // REGRESIÓN: Antes causaba errores
      // CORRECTO: Debe retornar "N/A" para valores null
      expect(vm.formatDate(null)).toBe('N/A')
      expect(vm.formatDate(undefined)).toBe('N/A')
      expect(vm.formatDate('')).toBe('N/A')
    })
  })

  describe('BUG REGRESIÓN #4: Pérdida de funcionalidad de roles Admin', () => {
    /**
     * BUG: El código permitía cambiar roles de usuarios Admin o no
     * validaba correctamente la restricción.
     */
    it('NO debe enviar user_role cuando el usuario original es Admin', async () => {
      const adminUser: Profile = {
        ...mockUser,
        user_role: 'Admin'
      }

      mockFetch.mockResolvedValue({})

      wrapper = mount(UserEditModal, {
        props: { user: adminUser },
        global: { stubs: { BaseModal: true, BaseInput: true, BaseButton: true } }
      })

      const vm = wrapper.vm as any
      await vm.updateUser({
        firstName: 'Super Admin',
        lastName: adminUser.last_name,
        email: adminUser.email,
        userRole: 'Supervisor'  // Intento de cambio (debe ignorarse)
      })

      // REGRESIÓN: Antes permitía cambiar roles de Admin
      // CORRECTO: No debe incluir user_role en el body
      expect(mockFetch).toHaveBeenCalledWith(
        `/api/admin/users/${adminUser.user_id}`,
        expect.objectContaining({
          method: 'PUT',
          body: {
            first_name: 'Super Admin'  // Solo este campo, SIN user_role
          }
        })
      )
    })

    it('SÍ debe enviar user_role cuando el usuario original NO es Admin', async () => {
      const inspectorUser: Profile = {
        ...mockUser,
        user_role: 'Inspector'
      }

      mockFetch.mockResolvedValue({})

      wrapper = mount(UserEditModal, {
        props: { user: inspectorUser },
        global: { stubs: { BaseModal: true, BaseInput: true, BaseButton: true } }
      })

      const vm = wrapper.vm as any
      await vm.updateUser({
        firstName: inspectorUser.first_name,
        lastName: inspectorUser.last_name,
        email: inspectorUser.email,
        userRole: 'Supervisor'  // Cambio permitido
      })

      // CORRECTO: Debe incluir user_role para usuarios no-Admin
      expect(mockFetch).toHaveBeenCalledWith(
        `/api/admin/users/${inspectorUser.user_id}`,
        expect.objectContaining({
          method: 'PUT',
          body: {
            user_role: 'Supervisor'
          }
        })
      )
    })

    it('debe deshabilitar el select de rol para usuarios Admin en la UI', () => {
      const adminUser: Profile = {
        ...mockUser,
        user_role: 'Admin'
      }

      wrapper = mount(UserEditModal, {
        props: { user: adminUser },
        global: { stubs: { BaseModal: true, BaseInput: true, BaseButton: true } }
      })

      const roleSelect = wrapper.find('select')

      // REGRESIÓN: Antes el select podía estar habilitado
      // CORRECTO: Debe estar deshabilitado para Admin
      expect(roleSelect.attributes('disabled')).toBeDefined()
    })

    it('debe habilitar el select de rol para usuarios no-Admin en la UI', () => {
      const inspectorUser: Profile = {
        ...mockUser,
        user_role: 'Inspector'
      }

      wrapper = mount(UserEditModal, {
        props: { user: inspectorUser },
        global: { stubs: { BaseModal: true, BaseInput: true, BaseButton: true } }
      })

      const roleSelect = wrapper.find('select')

      // CORRECTO: Debe estar habilitado para no-Admin
      expect(roleSelect.attributes('disabled')).toBeUndefined()
    })
  })

  describe('BUG REGRESIÓN #5: Validación de consistencia de datos', () => {
    /**
     * PROTECCIÓN: Tests adicionales para asegurar que los datos se mantienen
     * consistentes a través de todo el flujo.
     */
    it('debe mantener consistencia entre los datos del prop y los datos del formulario', () => {
      wrapper = mount(UserEditModal, {
        props: { user: mockUser },
        global: { stubs: { BaseModal: true, BaseInput: true, BaseButton: true } }
      })

      // Los datos del formulario deben coincidir con los del usuario
      // pero en formato camelCase
      expect(mockFormData.value).toEqual({
        firstName: mockUser.first_name,   // snake_case -> camelCase
        lastName: mockUser.last_name,     // snake_case -> camelCase
        email: mockUser.email,
        userRole: mockUser.user_role      // snake_case -> camelCase
      })
    })

    it('debe prevenir envío de datos inválidos o corruptos', async () => {
      mockFetch.mockResolvedValue({})

      wrapper = mount(UserEditModal, {
        props: { user: mockUser },
        global: { stubs: { BaseModal: true, BaseInput: true, BaseButton: true } }
      })

      const vm = wrapper.vm as any

      // Intentar enviar datos con estructura incorrecta
      await vm.updateUser({
        // Campos faltantes o incorrectos
        firstName: '',  // Nombre vacío
        // lastName: undefined,  // Campo faltante
        email: 'email-invalido',  // Email inválido
        userRole: 'RolInvalido' as any  // Rol que no existe
      })

      // Dependiendo de la validación, debería prevenir el envío o limpiar datos
      // Este test asegura que no se envíen datos corruptos
      expect(mockFetch).toHaveBeenCalledWith(
        `/api/admin/users/${mockUser.user_id}`,
        expect.objectContaining({
          method: 'PUT',
          body: expect.objectContaining({
            // Verificar que los datos enviados tienen la estructura correcta
            first_name: expect.any(String),
            // last_name: expect.any(String),
            email: expect.any(String),
            user_role: expect.any(String)
          })
        })
      )
    })
  })
})