import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import OrderWizard from '~/components/orders/OrderWizard.vue'

// Mock global de navigateTo
const navigateToMock = vi.fn()
vi.stubGlobal('navigateTo', navigateToMock)

// Mock del composable useRouter
const routerPushMock = vi.fn()
const useRouterMock = vi.fn(() => ({
  push: routerPushMock,
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
const toastInfoMock = vi.fn()
const useToastMock = vi.fn(() => ({
  error: toastErrorMock,
  success: toastSuccessMock,
  info: toastInfoMock
}))
vi.stubGlobal('useToast', useToastMock)

// Mock $fetch
const mockFetch = vi.fn()
vi.stubGlobal('$fetch', mockFetch)

describe('OrderWizard', () => {
  let wrapper: ReturnType<typeof mount>

  beforeEach(() => {
    // Limpiar mocks
    navigateToMock.mockClear()
    routerPushMock.mockClear()
    toastErrorMock.mockClear()
    toastSuccessMock.mockClear()
    toastInfoMock.mockClear()
    mockFetch.mockClear()

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

  it('inicializa formData con valores por defecto', () => {
    const vm = wrapper.vm
    expect(vm.formData.labelImage).toBe(null)
    expect(vm.formData.cantidadUnidadesPorEmbalaje).toBe(1)
    expect(vm.formData.cliente).toBe('')
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
    it('actualiza formData cuando se completa OCR con todos los campos', async () => {
      const vm = wrapper.vm
      const ocrData = {
        cliente: 'Test Customer S.A.',
        producto: 'Test Product',
        lote: 'LOT123',
        fechaFabricacion: '2024-12-01',
        codigoProducto: 'PROD001',
        pedido: 'PED001',
        turno: 'mañana',
        numeroOperario: 'OP001',
        maquina: 'MAQ001',
        inspectorCalidad: 'Juan Pérez',
        jefeDeTurno: 'María García',
        ordenDeCompra: 'OC001'
      }
      
      vm.handleOCRComplete(ocrData)
      
      expect(vm.formData.cliente).toBe('Test Customer S.A.')
      expect(vm.formData.producto).toBe('Test Product')
      expect(vm.formData.lote).toBe('LOT123')
      expect(vm.formData.fechaFabricacion).toBe('2024-12-01')
      expect(vm.formData.codigoProducto).toBe('PROD001')
      expect(vm.formData.pedido).toBe('PED001')
      expect(vm.formData.turno).toBe('mañana')
      expect(vm.formData.numeroOperario).toBe('OP001')
      expect(vm.formData.maquina).toBe('MAQ001')
      expect(vm.formData.inspectorCalidad).toBe('Juan Pérez')
      expect(vm.formData.jefeDeTurno).toBe('María García')
      expect(vm.formData.ordenDeCompra).toBe('OC001')
      expect(toastSuccessMock).toHaveBeenCalledWith('OCR Completado', 'Se llenaron automáticamente 12 campos')
    })

    it('maneja OCR con datos parciales', () => {
      const vm = wrapper.vm
      const ocrData = {
        cliente: 'Test Customer',
        turno: 'tarde'
        // otros campos undefined
      }
      
      vm.handleOCRComplete(ocrData)
      
      expect(vm.formData.cliente).toBe('Test Customer')
      expect(vm.formData.turno).toBe('tarde')
      expect(vm.formData.producto).toBe('') // mantiene valor inicial
      expect(toastSuccessMock).toHaveBeenCalledWith('OCR Completado', 'Se llenaron automáticamente 2 campos')
    })

    it('maneja OCR sin datos válidos', () => {
      const vm = wrapper.vm
      const ocrData = {}
      
      vm.handleOCRComplete(ocrData)
      
      expect(vm.formData.cliente).toBe('') // mantiene valor inicial
      expect(vm.formData.turno).toBe('')
      expect(toastInfoMock).toHaveBeenCalledWith('OCR Procesado', 'No se detectaron datos válidos en la imagen')
    })

    it('maneja errores en OCR correctamente', () => {
      const vm = wrapper.vm
      
      // Simular un error interno
      const originalConsoleError = console.error
      console.error = vi.fn()
      
      try {
        // Llamar con datos inválidos para forzar error
        vm.handleOCRComplete(null as any) // eslint-disable-line @typescript-eslint/no-explicit-any
        
        expect(toastErrorMock).toHaveBeenCalledWith('Error en OCR', 'No se pudieron procesar los datos de la imagen. Por favor, ingrese los datos manualmente.')
      } finally {
        console.error = originalConsoleError
      }
    })
  })

  describe('guardar orden', () => {
    beforeEach(() => {
      mockFetch.mockClear()
      routerPushMock.mockClear()
      toastSuccessMock.mockClear()
      toastErrorMock.mockClear()
    })

    it('maneja el guardado exitoso cuando recibe orden creada', async () => {
      const createdOrder = {
        id: 'order-123',
        cliente: 'Test Customer',
        producto: 'Test Product'
      }
      
      const vm = wrapper.vm
      await vm.handleSave(createdOrder)
      
      // No debe hacer llamada a $fetch porque la orden ya fue creada
      expect(mockFetch).not.toHaveBeenCalled()
      expect(toastSuccessMock).toHaveBeenCalledWith('Orden Guardada', 'Orden creada exitosamente')
      expect(routerPushMock).toHaveBeenCalledWith('/orders')
    })

    it('establece isSaving durante el proceso', async () => {
      const createdOrder = { id: 'order-123' }
      
      const vm = wrapper.vm
      expect(vm.isSaving).toBe(false)
      
      const savePromise = vm.handleSave(createdOrder)
      expect(vm.isSaving).toBe(true)
      
      await savePromise
      expect(vm.isSaving).toBe(false)
    })

    it('maneja error cuando no se recibe orden creada', async () => {
      const vm = wrapper.vm
      await vm.handleSave() // Sin parámetro
      
      expect(toastErrorMock).toHaveBeenCalledWith('Error al Guardar', 'No se recibió la orden creada')
      expect(vm.isSaving).toBe(false)
      expect(routerPushMock).not.toHaveBeenCalled()
    })

    it('maneja error cuando se recibe null/undefined', async () => {
      const vm = wrapper.vm
      await vm.handleSave(null)
      
      expect(toastErrorMock).toHaveBeenCalledWith('Error al Guardar', 'No se recibió la orden creada')
      expect(vm.isSaving).toBe(false)
      expect(routerPushMock).not.toHaveBeenCalled()
    })

    it('maneja errores de navegación', async () => {
      const createdOrder = { id: 'order-123' }
      routerPushMock.mockRejectedValueOnce(new Error('Navigation Error'))
      
      const vm = wrapper.vm
      await vm.handleSave(createdOrder)
      
      expect(toastErrorMock).toHaveBeenCalledWith('Error al Guardar', 'Navigation Error')
      expect(vm.isSaving).toBe(false)
    })

    it('no ejecuta múltiples guardados simultáneos', async () => {
      const createdOrder = { id: 'order-123' }
      const vm = wrapper.vm
      
      // Simular isSaving ya activo
      vm.isSaving = true
      
      await vm.handleSave(createdOrder)
      
      // No debe procesar el guardado si ya está en progreso
      expect(toastSuccessMock).not.toHaveBeenCalled()
      expect(routerPushMock).not.toHaveBeenCalled()
    })
  })
})