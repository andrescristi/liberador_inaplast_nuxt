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
          TransitionRoot: {
            template: '<div class="transition-root" v-if="show"><slot></slot></div>',
            props: ['show']
          },
          Dialog: {
            template: '<div class="dialog" role="dialog" :style="style"><slot></slot></div>',
            props: ['as', 'class', 'style'],
            emits: ['close']
          },
          TransitionChild: {
            template: '<div class="transition-child"><slot></slot></div>',
            props: ['as', 'enter', 'enterFrom', 'enterTo', 'leave', 'leaveFrom', 'leaveTo']
          },
          DialogPanel: {
            template: '<div class="dialog-panel" :class="class"><slot></slot></div>',
            props: ['class']
          },
          Teleport: false
        }
      },
      attachTo: document.body
    })
  }

  describe('Renderizado y Visibilidad', () => {
    it('debe renderizar cuando show=true', () => {
      const wrapper = createWrapper({ show: true })
      expect(wrapper.find('.dialog').exists()).toBe(true)
    })

    it('no debe renderizar cuando show=false', () => {
      const wrapper = createWrapper({ show: false })
      expect(wrapper.find('.dialog').exists()).toBe(false)
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
      const dialog = wrapper.find('.dialog')

      await dialog.trigger('click')
      expect(wrapper.emitted('close')).toBeTruthy()
    })

    it('debe renderizar con role dialog', () => {
      const wrapper = createWrapper({ show: true })
      const dialog = wrapper.find('[role="dialog"]')
      expect(dialog.exists()).toBe(true)
    })

    it('debe manejar props correctamente', async () => {
      const wrapper = createWrapper({ show: true, size: 'lg' })
      expect(wrapper.vm.size).toBe('lg')
    })
  })

  describe('Tamaños de Modal', () => {
    it('debe aplicar tamaño small', () => {
      const wrapper = createWrapper({ show: true, size: 'sm' })
      expect(wrapper.vm.panelClasses).toContain('max-w-sm')
    })

    it('debe aplicar tamaño large', () => {
      const wrapper = createWrapper({ show: true, size: 'lg' })
      expect(wrapper.vm.panelClasses).toContain('max-w-lg')
    })

    it('debe usar tamaño medium por defecto', () => {
      const wrapper = createWrapper({ show: true })
      expect(wrapper.vm.panelClasses).toContain('max-w-md')
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

  describe('Comportamiento de Props', () => {
    it('debe manejar cambios de show prop', async () => {
      const wrapper = createWrapper({ show: false })

      await wrapper.setProps({ show: true })
      expect(wrapper.find('.dialog').exists()).toBe(true)

      await wrapper.setProps({ show: false })
      expect(wrapper.find('.dialog').exists()).toBe(false)
    })

    it('debe limpiar correctamente al unmount', () => {
      const wrapper = createWrapper({ show: true })
      const spy = vi.spyOn(document, 'removeEventListener')

      wrapper.unmount()
      expect(spy).toHaveBeenCalled()
    })
  })

  describe('Z-Index y Layering', () => {
    it('debe aplicar style con z-index CSS variable', () => {
      const wrapper = createWrapper({ show: true })
      const dialog = wrapper.find('.dialog')
      expect(dialog.attributes('style')).toContain('z-index: var(--z-modal)')
    })

    it('debe verificar que el componente usa variables CSS correctas', () => {
      const wrapper = createWrapper({ show: true })
      // Verificar que el componente renderiza con las variables CSS apropiadas
      const html = wrapper.html()
      expect(html).toContain('z-index: var(--z-modal)')
    })

    it('debe manejar z-index en diferentes tamaños', () => {
      const wrapper = createWrapper({ show: true, size: 'xl' })
      const dialog = wrapper.find('.dialog')
      expect(dialog.exists()).toBe(true)
      expect(wrapper.vm.size).toBe('xl')
    })
  })

  describe('Integración con Sistema', () => {
    it('debe funcionar con contenido dinámico', () => {
      const wrapper = createWrapper(
        { show: true },
        {
          default: '<p>Contenido dinámico</p><button>Test</button>'
        }
      )

      expect(wrapper.html()).toContain('Contenido dinámico')
      expect(wrapper.find('button').exists()).toBe(true)
    })

    it('debe manejar props de tamaño correctamente', () => {
      const sizes = ['sm', 'md', 'lg', 'xl', 'full']

      sizes.forEach(size => {
        const wrapper = createWrapper({ show: true, size })
        expect(wrapper.vm.size).toBe(size)
        expect(wrapper.vm.panelClasses).toContain(`max-w-${size}`)
      })
    })

    it('debe renderizar correctamente sin errores', () => {
      const wrapper = createWrapper({ show: true })
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.find('.dialog').exists()).toBe(true)
    })
  })
})