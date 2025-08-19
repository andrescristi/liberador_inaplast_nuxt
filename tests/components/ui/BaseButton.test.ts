import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createApp as _createApp } from 'vue'
import BaseButton from '~/components/ui/BaseButton.vue'

// Mock de navegación de Nuxt
const mockNavigateTo = vi.fn()
vi.stubGlobal('navigateTo', mockNavigateTo)

describe('BaseButton', () => {
  
  const createWrapper = (props = {}, slots = {}) => {
    return mount(BaseButton, {
      props,
      slots,
      global: {
        stubs: {
          Icon: true,
          NuxtLink: true
        }
      }
    })
  }

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('Renderizado Básico', () => {
    it('debe renderizar botón con texto', () => {
      const wrapper = createWrapper({}, { default: 'Click me' })
      expect(wrapper.text()).toContain('Click me')
      expect(wrapper.find('button').exists()).toBe(true)
    })

    it('debe aplicar classes por defecto', () => {
      const wrapper = createWrapper()
      const button = wrapper.find('button')
      expect(button.classes()).toContain('inline-flex')
      expect(button.classes()).toContain('items-center')
    })
  })

  describe('Props de Variante', () => {
    it('debe aplicar variante solid por defecto', () => {
      const wrapper = createWrapper()
      const button = wrapper.find('button')
      expect(button.classes().some(cls => cls.includes('bg-'))).toBe(true)
    })

    it('debe aplicar variante outline', () => {
      const wrapper = createWrapper({ variant: 'outline' })
      const button = wrapper.find('button')
      expect(button.classes().some(cls => cls.includes('border-'))).toBe(true)
    })

    it('debe aplicar variante ghost', () => {
      const wrapper = createWrapper({ variant: 'ghost' })
      const button = wrapper.find('button')
      expect(button.classes().some(cls => cls.includes('hover:bg-'))).toBe(true)
    })
  })

  describe('Props de Color', () => {
    const colors = ['primary', 'secondary', 'danger', 'success', 'warning']
    
    colors.forEach(color => {
      it(`debe aplicar color ${color}`, () => {
        const wrapper = createWrapper({ color })
        const button = wrapper.find('button')
        expect(button.attributes('class')).toBeDefined()
      })
    })
  })

  describe('Props de Tamaño', () => {
    it('debe aplicar tamaño small', () => {
      const wrapper = createWrapper({ size: 'sm' })
      const button = wrapper.find('button')
      expect(button.classes().some(cls => cls.includes('px-2') || cls.includes('py-1'))).toBe(true)
    })

    it('debe aplicar tamaño large', () => {
      const wrapper = createWrapper({ size: 'lg' })
      const button = wrapper.find('button')
      expect(button.classes().some(cls => cls.includes('px-6') || cls.includes('py-3'))).toBe(true)
    })
  })

  describe('Estado Disabled', () => {
    it('debe deshabilitar botón cuando disabled=true', () => {
      const wrapper = createWrapper({ disabled: true })
      const button = wrapper.find('button')
      expect(button.attributes('disabled')).toBeDefined()
    })

    it('debe aplicar clases de disabled', () => {
      const wrapper = createWrapper({ disabled: true })
      const button = wrapper.find('button')
      expect(button.classes()).toContain('opacity-50')
      expect(button.classes()).toContain('cursor-not-allowed')
    })

    it('no debe emitir click cuando está disabled', async () => {
      const wrapper = createWrapper({ disabled: true })
      const button = wrapper.find('button')
      
      await button.trigger('click')
      expect(wrapper.emitted('click')).toBeFalsy()
    })
  })

  describe('Estado Loading', () => {
    it('debe mostrar estado de loading', () => {
      const wrapper = createWrapper({ loading: true })
      expect(wrapper.find('[data-testid="loading-spinner"]').exists() || 
             wrapper.text().includes('Cargando')).toBe(true)
    })

    it('debe deshabilitar botón durante loading', () => {
      const wrapper = createWrapper({ loading: true })
      const button = wrapper.find('button')
      expect(button.attributes('disabled')).toBeDefined()
    })
  })

  describe('Iconos', () => {
    it('debe renderizar icono leading', () => {
      const wrapper = createWrapper({ leadingIcon: 'bx:plus' })
      expect(wrapper.html()).toContain('Icon')
    })

    it('debe renderizar icono trailing', () => {
      const wrapper = createWrapper({ trailingIcon: 'bx:arrow-right' })
      expect(wrapper.html()).toContain('Icon')
    })
  })

  describe('Navegación', () => {
    it('debe navegar cuando se especifica prop "to"', async () => {
      const wrapper = createWrapper({ to: '/orders' })
      const button = wrapper.find('button')
      
      await button.trigger('click')
      expect(mockNavigateTo).toHaveBeenCalledWith('/orders')
    })

    it('debe renderizar como NuxtLink cuando se especifica "to"', () => {
      const wrapper = createWrapper({ to: '/orders' })
      expect(wrapper.find('nuxtlink-stub').exists()).toBe(true)
    })
  })

  describe('Eventos', () => {
    it('debe emitir evento click', async () => {
      const wrapper = createWrapper()
      const button = wrapper.find('button')
      
      await button.trigger('click')
      expect(wrapper.emitted('click')).toBeTruthy()
    })

    it('debe pasar argumentos del evento', async () => {
      const wrapper = createWrapper()
      const button = wrapper.find('button')
      
      await button.trigger('click')
      const clickEvents = wrapper.emitted('click')
      expect(clickEvents![0]).toHaveLength(1) // Event object
    })
  })

  describe('Accesibilidad', () => {
    it('debe tener atributos ARIA apropiados', () => {
      const wrapper = createWrapper({ disabled: true })
      const button = wrapper.find('button')
      expect(button.attributes('aria-disabled')).toBe('true')
    })

    it('debe ser focuseable cuando no está disabled', () => {
      const wrapper = createWrapper()
      const button = wrapper.find('button')
      expect(button.attributes('tabindex')).not.toBe('-1')
    })

    it('debe manejar navegación por teclado', async () => {
      const wrapper = createWrapper()
      const button = wrapper.find('button')
      
      await button.trigger('keydown.enter')
      expect(wrapper.emitted('click')).toBeTruthy()
    })
  })

  describe('Casos Edge', () => {
    it('debe manejar texto muy largo', () => {
      const longText = 'Este es un texto muy largo que podría causar problemas de layout en el botón'
      const wrapper = createWrapper({}, { default: longText })
      expect(wrapper.text()).toContain(longText)
    })

    it('debe manejar cambios de props reactivamente', async () => {
      const wrapper = createWrapper({ disabled: false })
      expect(wrapper.find('button').attributes('disabled')).toBeUndefined()
      
      await wrapper.setProps({ disabled: true })
      expect(wrapper.find('button').attributes('disabled')).toBeDefined()
    })
  })
})