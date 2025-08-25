import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AuthLayout from '~/layouts/auth.vue'

describe('AuthLayout', () => {
  it('renders correctly with slot content', () => {
    const wrapper = mount(AuthLayout, {
      slots: {
        default: '<div data-test="slot-content">Test Content</div>'
      }
    })

    expect(wrapper.html()).toContain('Test Content')
    expect(wrapper.find('[data-test="slot-content"]').exists()).toBe(true)
  })

  it('has correct background styling', () => {
    const wrapper = mount(AuthLayout)
    
    expect(wrapper.find('.min-h-screen').exists()).toBe(true)
    expect(wrapper.find('.bg-gradient-to-br').exists()).toBe(true)
    expect(wrapper.find('.from-indigo-50').exists()).toBe(true)
    expect(wrapper.find('.to-white').exists()).toBe(true)
  })

  it('provides a clean layout for authentication pages', () => {
    const wrapper = mount(AuthLayout, {
      slots: {
        default: '<form>Login Form</form>'
      }
    })

    // Verificar que no hay navegación u otros elementos que distraigan
    expect(wrapper.text()).toContain('Login Form')
    expect(wrapper.find('nav').exists()).toBe(false)
    expect(wrapper.find('header').exists()).toBe(false)
    expect(wrapper.find('footer').exists()).toBe(false)
  })
})