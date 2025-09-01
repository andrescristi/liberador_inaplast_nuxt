/**
 * Tests para la navegación móvil en AppNavigation.vue
 * 
 * Cubre las mejoras implementadas para móvil:
 * - Ícono hamburger visible y funcional
 * - Texto optimizado en bottom navigation
 * - Menú desplegable con selector de perfil
 * - Diseño responsivo
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import AppNavigation from '~/components/core/AppNavigation.vue'

// Mock de composables
const mockUser = {
  id: 'test-id',
  email: 'test@example.com'
}

const mockUserProfile = {
  id: 'test-profile-id',
  user_role: 'Admin' as const,
  full_name: 'Test User',
  email: 'test@example.com'
}

vi.mock('~/composables/auth/useAuthState', () => ({
  useAuthState: vi.fn(() => ({
    user: ref(mockUser),
    isAuthenticated: ref(true)
  }))
}))

vi.mock('~/composables/auth/useAuth', () => ({
  useAuth: vi.fn(() => ({
    signOut: vi.fn(),
    getCurrentUserProfile: vi.fn().mockResolvedValue(mockUserProfile)
  }))
}))

vi.mock('~/composables/ui/useToast', () => ({
  useToast: vi.fn(() => ({
    success: vi.fn(),
    error: vi.fn()
  }))
}))

// Mock de Nuxt router
vi.mock('#app', () => ({
  useRoute: vi.fn(() => ({
    path: '/'
  })),
  nextTick: vi.fn()
}))

// Mock de componentes UI
vi.mock('~/components/ui/BaseButton.vue', () => ({
  default: {
    name: 'BaseButton',
    props: ['variant', 'color', 'size', 'leadingIcon', 'trailingIcon', 'to', 'special', 'layout'],
    template: '<button><slot /></button>'
  }
}))

vi.mock('~/components/ui/BaseDropdown.vue', () => ({
  default: {
    name: 'BaseDropdown',
    props: ['items'],
    template: '<div><slot name="button" /><slot name="account" /></div>'
  }
}))

describe('AppNavigation - Navegación Móvil', () => {
  let wrapper: any

  beforeEach(() => {
    wrapper = mount(AppNavigation, {
      global: {
        stubs: {
          'Icon': {
            name: 'Icon',
            props: ['name'],
            template: '<span>{{ name }}</span>'
          },
          'NuxtLink': {
            name: 'NuxtLink',
            props: ['to'],
            template: '<a><slot /></a>'
          }
        }
      }
    })
  })

  describe('Ícono Hamburger', () => {
    it('debería mostrar el ícono hamburger en móvil', () => {
      const hamburgerButton = wrapper.find('button[aria-label*="menú de navegación"]')
      expect(hamburgerButton.exists()).toBe(true)
    })

    it('debería cambiar el ícono cuando se abre el menú', async () => {
      const hamburgerButton = wrapper.find('button[aria-label*="menú de navegación"]')
      
      // Inicialmente debe mostrar el ícono de menú
      const menuIcon = wrapper.find('span').filter((node: any) => node.text() === 'bx:menu')
      expect(menuIcon.exists()).toBe(true)
      
      // Abrir el menú
      await hamburgerButton.trigger('click')
      await wrapper.vm.$nextTick()
      
      // Ahora debe mostrar el ícono de cerrar
      const closeIcon = wrapper.find('span').filter((node: any) => node.text() === 'bx:x')
      expect(closeIcon.exists()).toBe(true)
    })

    it('debería tener el tamaño correcto del ícono (w-8 h-8)', () => {
      const icon = wrapper.find('span[class*="w-8 h-8"]')
      expect(icon.exists()).toBe(true)
    })
  })

  describe('Bottom Navigation', () => {
    it('debería mostrar texto optimizado "Nueva" en lugar de "Nueva Liberación"', () => {
      const bottomNav = wrapper.find('.mobile-bottom-nav')
      expect(bottomNav.exists()).toBe(true)
      
      // Verificar que existe el texto "Nueva"
      const nuevaButton = wrapper.find('button').filter((node: any) => 
        node.text().includes('Nueva') && !node.text().includes('Nueva Liberación')
      )
      expect(nuevaButton.exists()).toBe(true)
    })

    it('debería mostrar "Usuarios" en lugar de "Admin" para administradores', () => {
      // El componente debe mostrar "Usuarios" para usuarios Admin
      const usuariosButton = wrapper.find('button').filter((node: any) => 
        node.text().includes('Usuarios')
      )
      expect(usuariosButton.exists()).toBe(true)
    })

    it('debería tener navegación bottom fija en móvil', () => {
      const bottomNav = wrapper.find('.mobile-bottom-nav')
      expect(bottomNav.classes()).toContain('fixed')
      expect(bottomNav.classes()).toContain('bottom-0')
    })
  })

  describe('Menú Desplegable', () => {
    it('debería mostrar/ocultar el menú móvil al hacer clic en hamburger', async () => {
      const hamburgerButton = wrapper.find('button[aria-label*="menú de navegación"]')
      
      // Inicialmente el menú debe estar cerrado
      expect(wrapper.find('#mobile-menu').exists()).toBe(false)
      
      // Abrir menú
      await hamburgerButton.trigger('click')
      await wrapper.vm.$nextTick()
      
      // El menú debe estar visible
      expect(wrapper.find('#mobile-menu').exists()).toBe(true)
    })

    it('debería mostrar información del usuario en el menú', async () => {
      const hamburgerButton = wrapper.find('button[aria-label*="menú de navegación"]')
      
      // Abrir menú
      await hamburgerButton.trigger('click')
      await wrapper.vm.$nextTick()
      
      // Verificar que se muestra el email del usuario
      const userInfo = wrapper.text()
      expect(userInfo).toContain('test@example.com')
    })

    it('debería incluir opciones de perfil y logout', async () => {
      const hamburgerButton = wrapper.find('button[aria-label*="menú de navegación"]')
      
      // Abrir menú
      await hamburgerButton.trigger('click')
      await wrapper.vm.$nextTick()
      
      const menuText = wrapper.text()
      expect(menuText).toContain('Perfil')
      expect(menuText).toContain('Sign Out')
    })
  })

  describe('Diseño Responsivo', () => {
    it('debería ocultar navegación desktop en móvil', () => {
      const desktopNav = wrapper.find('.hidden.md\\:flex')
      expect(desktopNav.exists()).toBe(true)
    })

    it('debería mostrar navegación móvil solo en móvil', () => {
      const mobileNav = wrapper.find('.md\\:hidden')
      expect(mobileNav.exists()).toBe(true)
    })

    it('debería tener breakpoints correctos', () => {
      // Top navigation debe estar oculta en desktop
      const hamburgerContainer = wrapper.find('.md\\:hidden')
      expect(hamburgerContainer.exists()).toBe(true)
      
      // Desktop navigation debe estar oculta en móvil  
      const desktopContainer = wrapper.find('.hidden.md\\:flex')
      expect(desktopContainer.exists()).toBe(true)
    })
  })

  describe('Accesibilidad', () => {
    it('debería tener etiquetas ARIA correctas', () => {
      const hamburgerButton = wrapper.find('button[aria-label*="menú de navegación"]')
      expect(hamburgerButton.attributes('aria-label')).toBeDefined()
      expect(hamburgerButton.attributes('aria-controls')).toBe('mobile-menu')
      expect(hamburgerButton.attributes('aria-expanded')).toBeDefined()
    })

    it('debería tener texto para screen readers', () => {
      const srText = wrapper.find('.sr-only')
      expect(srText.exists()).toBe(true)
      expect(srText.text()).toMatch(/menú de navegación/)
    })

    it('debería cambiar aria-expanded al abrir/cerrar menú', async () => {
      const hamburgerButton = wrapper.find('button[aria-label*="menú de navegación"]')
      
      // Inicialmente cerrado
      expect(hamburgerButton.attributes('aria-expanded')).toBe('false')
      
      // Abrir menú
      await hamburgerButton.trigger('click')
      await wrapper.vm.$nextTick()
      
      // Debe estar expandido
      expect(hamburgerButton.attributes('aria-expanded')).toBe('true')
    })
  })
})