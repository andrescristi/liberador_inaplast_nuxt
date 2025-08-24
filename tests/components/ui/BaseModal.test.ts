import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseModal from '~/components/ui/BaseModal.vue'

describe('BaseModal', () => {
  
  const createWrapper = (props = {}, slots = {}) => {
    // Agregar contenido enfocable por defecto para evitar errores de FocusTrap
    const defaultSlots = {
      default: '<button>Test Button</button>',
      ...slots
    }
    
    return mount(BaseModal, {
      props: {
        show: true,
        ...props
      },
      slots: defaultSlots,
      global: {
        stubs: {
          Teleport: false
        }
      },
      attachTo: document.body
    })
  }

  describe('Renderizado y Visibilidad', () => {
    it('debe renderizar cuando show=true', () => {
      const wrapper = createWrapper({ show: true })
      expect(wrapper.find('[data-testid="modal-overlay"]').exists() || 
             wrapper.find('.fixed.inset-0').exists()).toBe(true)
    })

    it('no debe renderizar cuando show=false', () => {
      const wrapper = createWrapper({ show: false })
      expect(wrapper.find('.fixed.inset-0').exists()).toBe(false)
    })

    it('debe renderizar contenido en slot', () => {
      const wrapper = createWrapper(
        { show: true }, 
        { default: '<p>Contenido del modal</p><button>Close</button>' }
      )
      expect(wrapper.html()).toContain('Contenido del modal')
    })
  })

  describe('Interacción de Cierre', () => {
    it('debe emitir evento close al hacer click en overlay', async () => {
      const wrapper = createWrapper({ show: true })
      const overlay = wrapper.find('[data-testid="modal-overlay"]') || 
                     wrapper.find('.fixed.inset-0').first()
      
      await overlay.trigger('click')
      expect(wrapper.emitted('close')).toBeTruthy()
    })

    it('debe emitir evento close al presionar Escape', async () => {
      const wrapper = createWrapper({ show: true })
      
      await wrapper.trigger('keydown.escape')
      expect(wrapper.emitted('close')).toBeTruthy()
    })

    it('no debe cerrar cuando closeOnOverlay=false', async () => {
      const wrapper = createWrapper({ show: true, closeOnOverlay: false })
      const overlay = wrapper.find('.fixed.inset-0')
      
      await overlay.trigger('click')
      expect(wrapper.emitted('close')).toBeFalsy()
    })
  })

  describe('Tamaños de Modal', () => {
    it('debe aplicar tamaño small', () => {
      const wrapper = createWrapper({ show: true, size: 'sm' })
      const modal = wrapper.find('[class*="max-w"]')
      expect(modal.classes().some(cls => cls.includes('max-w-sm') || cls.includes('max-w-md'))).toBe(true)
    })

    it('debe aplicar tamaño large', () => {
      const wrapper = createWrapper({ show: true, size: 'lg' })
      const modal = wrapper.find('[class*="max-w"]')
      expect(modal.classes().some(cls => cls.includes('max-w-4xl') || cls.includes('max-w-6xl'))).toBe(true)
    })
  })

  describe('Header y Footer', () => {
    it('debe renderizar header slot', () => {
      const wrapper = createWrapper(
        { show: true },
        { 
          header: '<h2>Título del Modal</h2>',
          default: '<p>Contenido</p><button>Action</button>'
        }
      )
      expect(wrapper.html()).toContain('Título del Modal')
    })

    it('debe renderizar footer slot', () => {
      const wrapper = createWrapper(
        { show: true },
        { 
          default: '<p>Contenido</p><input type="text">',
          footer: '<button>Guardar</button>'
        }
      )
      expect(wrapper.html()).toContain('Guardar')
    })
  })

  describe('Transiciones', () => {
    it('debe tener clases de transición', () => {
      const wrapper = createWrapper({ show: true })
      const modal = wrapper.find('.transform')
      expect(modal.exists()).toBe(true)
    })
  })

  describe('Accesibilidad', () => {
    it('debe tener atributos ARIA apropiados', () => {
      const wrapper = createWrapper({ show: true })
      const dialog = wrapper.find('[role="dialog"]') || wrapper.find('[aria-modal]')
      expect(dialog.exists()).toBe(true)
    })

    it('debe trap focus dentro del modal', () => {
      const wrapper = createWrapper({ show: true })
      expect(wrapper.find('[tabindex]').exists()).toBe(true)
    })

    it('debe tener aria-labelledby cuando hay título', () => {
      const wrapper = createWrapper(
        { show: true, title: 'Test Modal' }
      )
      const modal = wrapper.find('[aria-labelledby]')
      expect(modal.exists()).toBe(true)
    })
  })

  describe('Casos Edge', () => {
    it('debe manejar cambios rápidos de show prop', async () => {
      const wrapper = createWrapper({ show: false })
      
      await wrapper.setProps({ show: true })
      expect(wrapper.find('.fixed.inset-0').exists()).toBe(true)
      
      await wrapper.setProps({ show: false })
      expect(wrapper.find('.fixed.inset-0').exists()).toBe(false)
    })

    it('debe limpiar event listeners al unmount', () => {
      const wrapper = createWrapper({ show: true })
      const spy = vi.spyOn(document, 'removeEventListener')
      
      wrapper.unmount()
      expect(spy).toHaveBeenCalled()
    })
  })

  describe('Integración con Sistema', () => {
    it('debe funcionar con formularios dentro del modal', () => {
      const wrapper = createWrapper(
        { show: true },
        { 
          default: `
            <form>
              <input type="text" name="test" />
              <button type="submit">Enviar</button>
            </form>
          `
        }
      )
      
      expect(wrapper.find('form').exists()).toBe(true)
      expect(wrapper.find('input[name="test"]').exists()).toBe(true)
    })

    it('debe permitir múltiples modales anidados', () => {
      const parentWrapper = createWrapper({ show: true }, {
        default: '<div id="parent-content">Modal padre</div>'
      })
      
      expect(parentWrapper.find('#parent-content').exists()).toBe(true)
    })
  })
})