import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import LoginPage from '~/pages/auth/login.vue'

// Mock para navigateTo
const mockNavigateTo = vi.fn()
vi.mock('#app', () => ({
  navigateTo: mockNavigateTo
}))

// Mock para $fetch
const mockFetch = vi.fn()
global.$fetch = mockFetch

// Mock para composables
vi.mock('~/composables/useToast', () => ({
  useToast: () => ({
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn()
  })
}))

describe('Login Page UI Components', () => {
  const createWrapper = () => {
    return mount(LoginPage, {
      global: {
        plugins: [createTestingPinia()],
        stubs: {
          BaseCard: {
            template: '<div class="base-card"><slot /></div>'
          },
          BaseInput: {
            template: '<input class="base-input" />',
            props: ['modelValue', 'type', 'placeholder', 'leadingIcon', 'size', 'disabled', 'error']
          },
          BaseButton: {
            template: '<button class="base-button" :disabled="disabled || loading"><slot /></button>',
            props: ['variant', 'color', 'size', 'disabled', 'loading', 'leadingIcon', 'trailingIcon', 'block', 'type']
          },
          BaseAlert: {
            template: '<div class="base-alert" v-if="variant === \'error\'"><slot /></div>',
            props: ['variant', 'title', 'description', 'closable']
          },
          BaseModal: {
            template: '<div class="base-modal" v-if="show"><slot /></div>',
            props: ['show']
          },
          Icon: true,
          NuxtLink: true
        },
        mocks: {
          $fetch: mockFetch,
          navigateTo: mockNavigateTo
        }
      }
    })
  }

  it('should render login form with BaseCard component', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('.base-card').exists()).toBe(true)
  })

  it('should render email and password BaseInput components', () => {
    const wrapper = createWrapper()
    const inputs = wrapper.findAll('.base-input')
    expect(inputs).toHaveLength(2) // Email y password inputs
  })

  it('should render BaseButton components for actions', () => {
    const wrapper = createWrapper()
    const buttons = wrapper.findAll('.base-button')
    
    // Botones: "¿Olvidaste tu contraseña?" e "Iniciar Sesión"
    expect(buttons.length).toBeGreaterThanOrEqual(2)
  })

  it('should render forgot password BaseButton with correct props', () => {
    const wrapper = createWrapper()
    const forgotPasswordButton = wrapper.findAllComponents({ name: 'BaseButton' })
      .find(btn => btn.text().includes('¿Olvidaste tu contraseña?'))
    
    expect(forgotPasswordButton?.exists()).toBe(true)
    expect(forgotPasswordButton?.props('variant')).toBe('link')
    expect(forgotPasswordButton?.props('color')).toBe('primary')
  })

  it('should render submit BaseButton with correct props', () => {
    const wrapper = createWrapper()
    const submitButton = wrapper.findAllComponents({ name: 'BaseButton' })
      .find(btn => btn.props('type') === 'submit')
    
    expect(submitButton?.exists()).toBe(true)
    expect(submitButton?.props('block')).toBe(true)
    expect(submitButton?.props('size')).toBe('lg')
  })

  it('should render BaseModal for reset password when showResetPassword is true', async () => {
    const wrapper = createWrapper()
    
    // Simular clic en "¿Olvidaste tu contraseña?"
    const forgotPasswordButton = wrapper.findAllComponents({ name: 'BaseButton' })
      .find(btn => btn.text().includes('¿Olvidaste tu contraseña?'))
    
    if (forgotPasswordButton) {
      await forgotPasswordButton.trigger('click')
      await wrapper.vm.$nextTick()
      
      expect(wrapper.find('.base-modal').exists()).toBe(true)
    }
  })

  it('should render BaseAlert when there is an error', async () => {
    const wrapper = createWrapper()
    
    // Simular error
    await wrapper.setData({ error: 'Error de prueba' })
    
    expect(wrapper.findComponent({ name: 'BaseAlert' }).exists()).toBe(true)
  })
})