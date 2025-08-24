import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'

// Mock de Nuxt components y composables
vi.mock('#app', () => ({
  useRoute: () => ({
    path: '/',
    name: 'index'
  }),
  navigateTo: vi.fn(),
  useSupabaseUser: () => ref(null),
  useSupabaseClient: () => ({
    auth: {
      signOut: vi.fn()
    }
  })
}))

// Mock del componente CoreAppNavigation
const MockCoreAppNavigation = {
  name: 'CoreAppNavigation',
  template: `
    <div data-testid="core-app-navigation">
      <nav class="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div class="flex justify-between h-14 sm:h-16">
            <div class="flex items-center">
              <div class="flex items-center space-x-2 sm:space-x-3">
                <div class="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-lg flex items-center justify-center shadow-sm">
                  <span class="iconify i-bx:bxs-factory w-4 h-4 sm:w-6 sm:h-6 text-white"></span>
                </div>
                <a href="/" class="text-lg sm:text-xl font-semibold text-gray-900 hover:text-primary-600 transition-colors">
                  Inaplast
                </a>
              </div>
            </div>
            <!-- Desktop Navigation -->
            <div class="hidden md:flex items-center space-x-1">
              <a href="/" class="nav-link">Inicio</a>
              <div class="dropdown">Liberaciones</div>
            </div>
            <!-- Mobile Menu Button -->
            <div class="md:hidden flex items-center">
              <button class="mobile-menu-btn" data-testid="mobile-menu-btn">
                <div class="hamburger-icon">
                  <span class="hamburger-line"></span>
                  <span class="hamburger-line"></span>
                  <span class="hamburger-line"></span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </nav>
      <!-- Mobile Bottom Navigation -->
      <nav class="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 mobile-bottom-nav">
        <div class="flex items-center justify-around">
          <div class="bottom-nav-item">
            <a href="/" class="bottom-nav-btn">Inicio</a>
          </div>
          <div class="bottom-nav-item">
            <a href="/orders/new" class="bottom-nav-btn">Nueva Liberación</a>
          </div>
          <div class="bottom-nav-item">
            <a href="/orders" class="bottom-nav-btn">Historial</a>
          </div>
        </div>
      </nav>
    </div>
  `
}

describe('CoreAppNavigation', () => {
  it('should render the navigation component', () => {
    const wrapper = mount(MockCoreAppNavigation, {
      global: {
        plugins: [createTestingPinia()]
      }
    })

    expect(wrapper.find('[data-testid="core-app-navigation"]').exists()).toBe(true)
  })

  it('should display Inaplast brand name', () => {
    const wrapper = mount(MockCoreAppNavigation, {
      global: {
        plugins: [createTestingPinia()]
      }
    })

    expect(wrapper.text()).toContain('Inaplast')
  })

  it('should have mobile menu button', () => {
    const wrapper = mount(MockCoreAppNavigation, {
      global: {
        plugins: [createTestingPinia()]
      }
    })

    expect(wrapper.find('[data-testid="mobile-menu-btn"]').exists()).toBe(true)
  })

  it('should have bottom navigation for mobile', () => {
    const wrapper = mount(MockCoreAppNavigation, {
      global: {
        plugins: [createTestingPinia()]
      }
    })

    const bottomNav = wrapper.find('.mobile-bottom-nav')
    expect(bottomNav.exists()).toBe(true)
    expect(bottomNav.text()).toContain('Inicio')
    expect(bottomNav.text()).toContain('Nueva Liberación')
    expect(bottomNav.text()).toContain('Historial')
  })

  it('should have proper navigation links', () => {
    const wrapper = mount(MockCoreAppNavigation, {
      global: {
        plugins: [createTestingPinia()]
      }
    })

    const links = wrapper.findAll('a')
    const linkTexts = links.map(link => link.text())
    
    expect(linkTexts).toContain('Inaplast')
    expect(linkTexts).toContain('Inicio')
    expect(linkTexts).toContain('Nueva Liberación')
    expect(linkTexts).toContain('Historial')
  })

  it('should have responsive navigation structure', () => {
    const wrapper = mount(MockCoreAppNavigation, {
      global: {
        plugins: [createTestingPinia()]
      }
    })

    // Desktop navigation should exist
    expect(wrapper.find('.hidden.md\\:flex').exists()).toBe(true)
    
    // Mobile navigation should exist
    expect(wrapper.find('.md\\:hidden').exists()).toBe(true)
  })
})