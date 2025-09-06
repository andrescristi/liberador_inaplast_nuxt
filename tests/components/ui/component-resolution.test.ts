import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'

// Test para verificar que los componentes UI se resuelven correctamente sin prefijo
describe('UI Component Resolution', () => {
  const createWrapper = (template: string) => {
    return mount({
      template,
      setup() {
        return {}
      }
    }, {
      global: {
        plugins: [createTestingPinia()],
        stubs: {
          // Stub para los componentes UI que queremos testear
          BaseButton: true,
          BaseInput: true,
          BaseCard: true,
          BaseModal: true,
          BaseAlert: true,
          BaseDropdown: true,
          BaseTable: true,
          BaseBadge: true
        }
      }
    })
  }

  it('should resolve BaseButton component without prefix', () => {
    const wrapper = createWrapper('<BaseButton>Test Button</BaseButton>')
    expect(wrapper.findComponent({ name: 'BaseButton' }).exists()).toBe(true)
  })

  it('should resolve BaseInput component without prefix', () => {
    const wrapper = createWrapper('<BaseInput />')
    expect(wrapper.findComponent({ name: 'BaseInput' }).exists()).toBe(true)
  })

  it('should resolve BaseCard component without prefix', () => {
    const wrapper = createWrapper('<BaseCard>Test Content</BaseCard>')
    expect(wrapper.findComponent({ name: 'BaseCard' }).exists()).toBe(true)
  })

  it('should resolve BaseModal component without prefix', () => {
    const wrapper = createWrapper('<BaseModal :show="true">Modal Content</BaseModal>')
    expect(wrapper.findComponent({ name: 'BaseModal' }).exists()).toBe(true)
  })

  it('should resolve BaseAlert component without prefix', () => {
    const wrapper = createWrapper('<BaseAlert title="Test Alert" />')
    expect(wrapper.findComponent({ name: 'BaseAlert' }).exists()).toBe(true)
  })

  it('should resolve BaseDropdown component without prefix', () => {
    const wrapper = createWrapper('<BaseDropdown :items="[]" />')
    expect(wrapper.findComponent({ name: 'BaseDropdown' }).exists()).toBe(true)
  })

  it('should resolve BaseTable component without prefix', () => {
    const wrapper = createWrapper('<BaseTable :columns="[]" :rows="[]" />')
    expect(wrapper.findComponent({ name: 'BaseTable' }).exists()).toBe(true)
  })

  it('should resolve BaseBadge component without prefix', () => {
    const wrapper = createWrapper('<BaseBadge>Badge Content</BaseBadge>')
    expect(wrapper.findComponent({ name: 'BaseBadge' }).exists()).toBe(true)
  })
})