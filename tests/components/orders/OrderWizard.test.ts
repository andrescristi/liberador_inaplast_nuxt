import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import OrderWizard from '~/components/orders/OrderWizard.vue'

// Mock global de navigateTo
const navigateToMock = vi.fn()
vi.stubGlobal('navigateTo', navigateToMock)

// Mock del composable useRouter
const useRouterMock = vi.fn(() => ({
  push: vi.fn(),
  back: vi.fn(),
  currentRoute: {
    value: {
      path: '/orders/new',
      params: {}
    }
  }
}))
vi.stubGlobal('useRouter', useRouterMock)

// Mock del composable useNuxtApp
const useNuxtAppMock = vi.fn(() => ({
  $logger: {
    error: vi.fn()
  }
}))
vi.stubGlobal('useNuxtApp', useNuxtAppMock)

// Mock del composable useToast
const toastErrorMock = vi.fn()
const toastSuccessMock = vi.fn()
const useToastMock = vi.fn(() => ({
  error: toastErrorMock,
  success: toastSuccessMock
}))
vi.stubGlobal('useToast', useToastMock)

describe('OrderWizard', () => {
  let wrapper: ReturnType<typeof mount>

  beforeEach(() => {
    // Limpiar mocks
    navigateToMock.mockClear()
    toastErrorMock.mockClear()
    toastSuccessMock.mockClear()

    wrapper = mount(OrderWizard, {
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })],
        stubs: {
          // Stub todos los componentes hijos para evitar warnings
          OrderWizardProgress: {
            template: '<div data-testid="wizard-progress">Progress Mock</div>',
            props: ['currentStep', 'totalSteps', 'steps']
          },
          OrderWizardStep1: {
            template: '<div data-testid="wizard-step1">Step 1 Mock</div>',
            props: ['modelValue'],
            emits: ['update:modelValue', 'next', 'ocr-complete']
          },
          OrderWizardStep2: {
            template: '<div data-testid="wizard-step2">Step 2 Mock</div>',
            props: ['modelValue'],
            emits: ['update:modelValue', 'next', 'previous']
          },
          OrderWizardStep3: {
            template: '<div data-testid="wizard-step3">Step 3 Mock</div>',
            props: ['modelValue'],
            emits: ['update:modelValue', 'next', 'previous']
          },
          OrderWizardStep4: {
            template: '<div data-testid="wizard-step4">Step 4 Mock</div>',
            props: ['modelValue', 'isSaving'],
            emits: ['update:modelValue', 'previous', 'save']
          }
        }
      }
    })
  })

  it('renderiza correctamente', () => {
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('h1').text()).toBe('Nuevo Liberador de Producto')
  })

  it('inicia en el paso 1', () => {
    expect(wrapper.find('[data-testid="wizard-step1"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="wizard-step2"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="wizard-step3"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="wizard-step4"]').exists()).toBe(false)
  })

  it('muestra el componente de progreso', () => {
    expect(wrapper.find('[data-testid="wizard-progress"]').exists()).toBe(true)
  })

  it('tiene los labels correctos de pasos', () => {
    const vm = wrapper.vm
    expect(vm.stepLabels).toEqual([
      'Paso 1: Datos Iniciales',
      'Paso 2: Detalles del Producto', 
      'Paso 3: Pruebas de Calidad',
      'Paso 4: Resumen y Resultados'
    ])
  })

  it('inicializa formData con valores por defecto', () => {
    const vm = wrapper.vm
    expect(vm.formData.labelImage).toBe(null)
    expect(vm.formData.boxQuantity).toBe(1)
    expect(vm.formData.customerCode).toBe('')
    expect(vm.formData.finalResult).toBe('approved')
  })

  describe('navegación entre pasos', () => {
    it('avanza al siguiente paso', async () => {
      const vm = wrapper.vm
      expect(vm.currentStep).toBe(1)
      
      vm.nextStep()
      await wrapper.vm.$nextTick()
      
      expect(vm.currentStep).toBe(2)
      expect(wrapper.find('[data-testid="wizard-step2"]').exists()).toBe(true)
    })

    it('retrocede al paso anterior', async () => {
      const vm = wrapper.vm
      vm.currentStep = 2
      await wrapper.vm.$nextTick()
      
      vm.previousStep()
      await wrapper.vm.$nextTick()
      
      expect(vm.currentStep).toBe(1)
      expect(wrapper.find('[data-testid="wizard-step1"]').exists()).toBe(true)
    })

    it('no retrocede desde el primer paso', () => {
      const vm = wrapper.vm
      expect(vm.currentStep).toBe(1)
      
      vm.previousStep()
      
      expect(vm.currentStep).toBe(1)
    })

    it('no avanza más allá del último paso', () => {
      const vm = wrapper.vm
      vm.currentStep = 4
      
      vm.nextStep()
      
      expect(vm.currentStep).toBe(4)
    })
  })

  describe('manejo de OCR', () => {
    it('actualiza formData cuando se completa OCR', async () => {
      const vm = wrapper.vm
      const ocrData = {
        customerName: 'Test Customer',
        productName: 'Test Product',
        lotNumber: 'LOT123',
        expirationDate: '2025-12-31'
      }
      
      vm.handleOCRComplete(ocrData)
      
      expect(vm.formData.customerName).toBe('Test Customer')
      expect(vm.formData.productName).toBe('Test Product')
      expect(vm.formData.lotNumber).toBe('LOT123')
      expect(vm.formData.expirationDate).toBe('2025-12-31')
    })

    it('maneja OCR con datos parciales', () => {
      const vm = wrapper.vm
      const ocrData = {
        customerName: 'Test Customer'
        // otros campos undefined
      }
      
      vm.handleOCRComplete(ocrData)
      
      expect(vm.formData.customerName).toBe('Test Customer')
      expect(vm.formData.productName).toBe('') // mantiene valor inicial
    })
  })

  describe('guardar orden', () => {
    it('maneja el guardado exitoso', async () => {
      const vm = wrapper.vm
      
      await vm.handleSave()
      
      expect(navigateToMock).toHaveBeenCalledWith('/orders')
    })

    it('establece isSaving durante el proceso', async () => {
      const vm = wrapper.vm
      expect(vm.isSaving).toBe(false)
      
      const savePromise = vm.handleSave()
      expect(vm.isSaving).toBe(true)
      
      await savePromise
      expect(vm.isSaving).toBe(false)
    })

    it('maneja errores de guardado', async () => {
      // Simular error en navigateTo
      navigateToMock.mockRejectedValueOnce(new Error('Navigation error'))
      
      const vm = wrapper.vm
      await vm.handleSave()
      
      expect(toastErrorMock).toHaveBeenCalledWith(
        'Error al guardar',
        'Por favor, intente nuevamente.'
      )
    })
  })
})