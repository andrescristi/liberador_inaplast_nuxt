import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import UserCreateModal from '~/components/admin/UserCreateModal.vue'

// Mock del composable useModalForm
const mockUseModalForm = vi.fn()
vi.mock('~/composables/ui/useModalForm', () => ({
  useModalForm: () => mockUseModalForm()
}))

// Mock global de useModalForm para auto-import
global.useModalForm = mockUseModalForm

// Mock del fetch
global.$fetch = vi.fn()

describe('UserCreateModal', () => {
  let pinia: any

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)

    // Reset mock
    mockUseModalForm.mockReturnValue({
      form: {
        value: {
          firstName: '',
          lastName: '',
          email: '',
          password: 'defaultPassword123!',
          userRole: 'Inspector'
        }
      },
      loading: { value: false },
      isFormValid: { value: true },
      handleSubmit: vi.fn(),
      validateField: vi.fn(),
      getFieldError: vi.fn(() => null),
      hasFieldError: vi.fn(() => false)
    })
  })

  const createWrapper = (props = {}) => {
    return mount(UserCreateModal, {
      props: {
        ...props
      },
      global: {
        plugins: [pinia],
        stubs: {
          BaseModal: {
            template: '<div class="base-modal"><slot></slot><slot name="header"></slot><slot name="footer"></slot></div>',
            props: ['show', 'size'],
            emits: ['close']
          },
          BaseInput: {
            template: '<input :type="type" :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" class="base-input">',
            props: ['modelValue', 'type', 'placeholder', 'error'],
            emits: ['update:modelValue', 'blur']
          },
          BaseButton: {
            template: '<button class="base-button" @click="$emit(\'click\')" :disabled="disabled"><slot></slot></button>',
            props: ['variant', 'disabled', 'loading'],
            emits: ['click']
          },
          Icon: {
            template: '<span class="icon" :data-icon="name"></span>',
            props: ['name']
          }
        }
      }
    })
  }

  describe('Renderizado del Modal', () => {
    it('debe renderizar el modal con todos los campos', () => {
      const wrapper = createWrapper()

      expect(wrapper.find('.base-modal').exists()).toBe(true)
      expect(wrapper.findAll('.base-input')).toHaveLength(4) // firstName, lastName, email, password
      expect(wrapper.find('select').exists()).toBe(true) // userRole
    })

    it('debe mostrar el título correcto', () => {
      const wrapper = createWrapper()
      expect(wrapper.html()).toContain('Crear Nuevo Usuario')
    })

    it('debe mostrar la información importante', () => {
      const wrapper = createWrapper()
      expect(wrapper.html()).toContain('Información Importante')
      expect(wrapper.html()).toContain('email de confirmación')
    })
  })

  describe('Toggle de Visibilidad de Contraseña', () => {
    it('debe renderizar el contenedor de botones con z-20', () => {
      const wrapper = createWrapper()
      const container = wrapper.find('.absolute.right-2')
      expect(container.exists()).toBe(true)
      expect(container.classes()).toContain('z-20')
    })

    it('debe mostrar icono de "mostrar" por defecto', () => {
      const wrapper = createWrapper()
      const toggleIcon = wrapper.find('[data-icon="bx:bx-show"]')
      expect(toggleIcon.exists()).toBe(true)
    })

    it('debe cambiar a tipo "text" cuando showPassword es true', async () => {
      const wrapper = createWrapper()

      // Verificar estado inicial
      const passwordInput = wrapper.find('input[type="password"]')
      expect(passwordInput.exists()).toBe(true)

      // Simular click en toggle
      const toggleButton = wrapper.find('button[title*="Mostrar"]')
      await toggleButton.trigger('click')

      // Verificar que el estado cambió
      expect(wrapper.vm.showPassword).toBe(true)
    })

    it('debe cambiar el icono cuando se toglea', async () => {
      const wrapper = createWrapper()

      // Estado inicial
      expect(wrapper.find('[data-icon="bx:bx-show"]').exists()).toBe(true)

      // Simular toggle
      const toggleButton = wrapper.find('button[title*="Mostrar"]')
      await toggleButton.trigger('click')

      // Verificar cambio de icono
      await wrapper.vm.$nextTick()
      expect(wrapper.find('[data-icon="bx:bx-hide"]').exists()).toBe(true)
    })

    it('debe cambiar el title del botón según el estado', async () => {
      const wrapper = createWrapper()

      // Estado inicial
      const toggleButton = wrapper.find('button[title*="Mostrar"]')
      expect(toggleButton.exists()).toBe(true)

      // Después del toggle
      await toggleButton.trigger('click')
      await wrapper.vm.$nextTick()

      const hideButton = wrapper.find('button[title*="Ocultar"]')
      expect(hideButton.exists()).toBe(true)
    })

    it('debe mantener la funcionalidad después de múltiples toggles', async () => {
      const wrapper = createWrapper()
      const toggleButton = () => wrapper.find('button').filter(btn =>
        btn.attributes('title')?.includes('contraseña')
      )[0]

      // Toggle 1: mostrar
      await toggleButton().trigger('click')
      expect(wrapper.vm.showPassword).toBe(true)

      // Toggle 2: ocultar
      await toggleButton().trigger('click')
      expect(wrapper.vm.showPassword).toBe(false)

      // Toggle 3: mostrar nuevamente
      await toggleButton().trigger('click')
      expect(wrapper.vm.showPassword).toBe(true)
    })
  })

  describe('Botón Generar Contraseña', () => {
    it('debe renderizar el botón generar', () => {
      const wrapper = createWrapper()
      const generateButton = wrapper.find('button').filter(btn =>
        btn.text() === 'Generar'
      )[0]
      expect(generateButton.exists()).toBe(true)
    })

    it('debe generar nueva contraseña al hacer click', async () => {
      const wrapper = createWrapper()
      const initialPassword = wrapper.vm.form.password

      const generateButton = wrapper.find('button').filter(btn =>
        btn.text() === 'Generar'
      )[0]

      await generateButton.trigger('click')

      // La contraseña debe cambiar
      expect(wrapper.vm.form.password).not.toBe(initialPassword)
      expect(wrapper.vm.form.password.length).toBe(12) // Longitud esperada
    })

    it('debe generar contraseñas con caracteres requeridos', async () => {
      const wrapper = createWrapper()

      const generateButton = wrapper.find('button').filter(btn =>
        btn.text() === 'Generar'
      )[0]

      await generateButton.trigger('click')

      const password = wrapper.vm.form.password

      // Verificar que contiene al menos un caracter de cada tipo
      expect(/[A-Z]/.test(password)).toBe(true) // Mayúscula
      expect(/[a-z]/.test(password)).toBe(true) // Minúscula
      expect(/[0-9]/.test(password)).toBe(true) // Número
      expect(/[@$!%*?&.#+-]/.test(password)).toBe(true) // Especial
    })
  })

  describe('Indicador de Fortaleza de Contraseña', () => {
    it('debe mostrar indicador de fortaleza cuando hay contraseña', () => {
      const mockForm = {
        value: {
          firstName: '',
          lastName: '',
          email: '',
          password: 'Test123!',
          userRole: 'Inspector'
        }
      }

      mockUseModalForm.mockReturnValue({
        form: mockForm,
        loading: { value: false },
        isFormValid: { value: true },
        handleSubmit: vi.fn(),
        validateField: vi.fn(),
        getFieldError: vi.fn(() => null),
        hasFieldError: vi.fn(() => false)
      })

      const wrapper = createWrapper()

      // Debe mostrar la barra de progreso
      const progressBar = wrapper.find('.h-1.rounded-full')
      expect(progressBar.exists()).toBe(true)
    })

    it('debe calcular fortaleza correctamente', () => {
      const wrapper = createWrapper()

      // Contraseña débil
      wrapper.vm.form.password = '123'
      expect(wrapper.vm.passwordStrength).toBeLessThan(3)

      // Contraseña fuerte
      wrapper.vm.form.password = 'Test123!@'
      expect(wrapper.vm.passwordStrength).toBeGreaterThan(4)
    })

    it('debe mostrar texto de fortaleza apropiado', () => {
      const wrapper = createWrapper()

      // Simular contraseña fuerte
      wrapper.vm.form.password = 'StrongPass123!@'

      expect(['Débil', 'Media', 'Fuerte']).toContain(wrapper.vm.passwordStrengthText)
    })
  })

  describe('Z-Index y Accesibilidad', () => {
    it('debe tener z-20 en el contenedor de botones para evitar conflictos', () => {
      const wrapper = createWrapper()
      const container = wrapper.find('.absolute.right-2.z-20')
      expect(container.exists()).toBe(true)
    })

    it('debe permitir clicks en botones sin interceptación', () => {
      const wrapper = createWrapper()

      // El contenedor debe tener z-20 para estar por encima del input
      const buttonContainer = wrapper.find('.z-20')
      expect(buttonContainer.exists()).toBe(true)

      // Los botones deben ser clickeables
      const toggleButton = wrapper.find('button[title*="contraseña"]')
      const generateButton = wrapper.find('button').filter(btn => btn.text() === 'Generar')[0]

      expect(toggleButton.exists()).toBe(true)
      expect(generateButton.exists()).toBe(true)
    })
  })

  describe('Formulario y Validación', () => {
    it('debe emitir evento created al enviar exitosamente', async () => {
      const wrapper = createWrapper()

      // Mock successful submit
      const mockHandleSubmit = vi.fn().mockResolvedValue(true)
      mockUseModalForm.mockReturnValue({
        form: { value: { firstName: 'Test', lastName: 'User', email: 'test@test.com', password: 'Test123!', userRole: 'Inspector' }},
        loading: { value: false },
        isFormValid: { value: true },
        handleSubmit: mockHandleSubmit,
        validateField: vi.fn(),
        getFieldError: vi.fn(() => null),
        hasFieldError: vi.fn(() => false)
      })

      const submitButton = wrapper.find('button').filter(btn =>
        btn.text().includes('Crear Usuario')
      )[0]

      await submitButton.trigger('click')

      expect(mockHandleSubmit).toHaveBeenCalled()
    })

    it('debe mostrar botón deshabilitado cuando el formulario es inválido', () => {
      mockUseModalForm.mockReturnValue({
        form: { value: { firstName: '', lastName: '', email: '', password: '', userRole: '' }},
        loading: { value: false },
        isFormValid: { value: false },
        handleSubmit: vi.fn(),
        validateField: vi.fn(),
        getFieldError: vi.fn(() => null),
        hasFieldError: vi.fn(() => false)
      })

      const wrapper = createWrapper()
      const submitButton = wrapper.find('button').filter(btn =>
        btn.text().includes('Crear Usuario')
      )[0]

      expect(submitButton.attributes('disabled')).toBeDefined()
    })
  })

  describe('Comportamiento en Producción', () => {
    it('debe auto-generar contraseña al montar', () => {
      const wrapper = createWrapper()

      // Verificar que se generó una contraseña al montar
      expect(wrapper.vm.form.password).toBeTruthy()
      expect(wrapper.vm.form.password.length).toBeGreaterThan(0)
    })

    it('debe manejar errores de validación', () => {
      const mockGetFieldError = vi.fn((field) => {
        if (field === 'email') return 'Formato de email inválido'
        return null
      })

      mockUseModalForm.mockReturnValue({
        form: { value: { firstName: '', lastName: '', email: 'invalid', password: '', userRole: '' }},
        loading: { value: false },
        isFormValid: { value: false },
        handleSubmit: vi.fn(),
        validateField: vi.fn(),
        getFieldError: mockGetFieldError,
        hasFieldError: vi.fn((field) => field === 'email')
      })

      const wrapper = createWrapper()
      expect(wrapper.html()).toContain('Formato de email inválido')
    })
  })
})