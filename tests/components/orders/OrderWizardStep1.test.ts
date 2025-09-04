import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import OrderWizardStep1 from '~/components/orders/OrderWizardStep1.vue'
import type { NewOrderData } from '~/schemas/orders/new_order'
import type { OCRData } from '~/schemas/orders/ocr'

// Mock global functions
const processOCRWithRetryMock = vi.fn()
const validateImageForOCRMock = vi.fn()
const toastMock = {
  error: vi.fn(),
  warning: vi.fn(),
  info: vi.fn(),
  success: vi.fn()
}
const loggerMock = {
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn()
}

// Mock global functions that are auto-imported by Nuxt
vi.stubGlobal('useOCRConfig', () => ({
  processOCRWithRetry: processOCRWithRetryMock,
  validateImageForOCR: validateImageForOCRMock
}))

vi.stubGlobal('useToast', () => toastMock)
vi.stubGlobal('useLogger', () => loggerMock)

// Mock window.confirm
vi.stubGlobal('confirm', vi.fn())

// Mock del componente OrderImageUpload
const OrderImageUploadStub = {
  template: '<div data-testid="order-image-upload"></div>',
  props: ['modelValue', 'preview'],
  emits: ['update:file', 'update:preview', 'ocr-complete']
}

describe('OrderWizardStep1', () => {
  let wrapper: VueWrapper<any>
  let defaultProps: { modelValue: NewOrderData }

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks()
    processOCRWithRetryMock.mockClear()
    validateImageForOCRMock.mockClear()
    Object.values(toastMock).forEach(mock => mock.mockClear())
    Object.values(loggerMock).forEach(mock => mock.mockClear())

    // Default props
    defaultProps = {
      modelValue: {
        cliente: '',
        producto: '',
        codigo_producto: '',
        pedido: '',
        fecha_fabricacion: '',
        turno: '',
        numero_operario: '',
        maquina: '',
        inspector_calidad: '',
        cantidad_unidades: 1,
        labelImage: null,
        labelImagePreview: '',
        packageImage: null,
        packageImagePreview: '',
        observaciones: '',
        finalResult: 'approved',
        orden_de_compra: ''
      }
    }

    wrapper = mount(OrderWizardStep1, {
      props: defaultProps,
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })],
        stubs: {
          OrderImageUpload: OrderImageUploadStub,
          Icon: { template: '<span data-testid="icon"></span>' }
        }
      }
    })
  })

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount()
    }
  })

  it('renderiza correctamente', () => {
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('h2').text()).toBe('Paso 1: Datos Iniciales')
    expect(wrapper.find('p').text()).toContain('Sube la imagen de etiqueta y especifica la cantidad de cajas')
  })

  it('muestra el componente de subida de imagen', () => {
    expect(wrapper.find('[data-testid="order-image-upload"]').exists()).toBe(true)
  })

  it('muestra el input de cantidad de unidades', () => {
    const quantityInput = wrapper.find('input[type="number"]')
    expect(quantityInput.exists()).toBe(true)
    expect(quantityInput.attributes('min')).toBe('1')
    expect(quantityInput.attributes('max')).toBe('1000')
    expect(quantityInput.attributes('placeholder')).toBe('Ej: 10')
  })

  it('inicializa con valores por defecto correctos', () => {
    expect(wrapper.vm.localData.cantidad_unidades).toBe(1)
    expect(wrapper.vm.localData.labelImage).toBeNull()
    expect(wrapper.vm.localData.labelImagePreview).toBe('')
  })

  it('actualiza cantidad_unidades cuando cambia el input', async () => {
    const quantityInput = wrapper.find('input[type="number"]')
    await quantityInput.setValue(5)
    
    expect(wrapper.vm.localData.cantidad_unidades).toBe(5)
  })

  it('emite update:modelValue cuando cambian los datos locales', async () => {
    const quantityInput = wrapper.find('input[type="number"]')
    await quantityInput.setValue(10)
    
    await wrapper.vm.$nextTick()
    
    const emittedEvents = wrapper.emitted('update:modelValue')
    expect(emittedEvents).toBeTruthy()
    expect(emittedEvents![emittedEvents!.length - 1][0]).toEqual({
      ...defaultProps.modelValue,
      cantidad_unidades: 10
    })
  })

  it('deshabilita el botón cuando no se puede proceder', () => {
    // Sin imagen y sin cantidad válida
    wrapper.vm.localData.labelImage = null
    wrapper.vm.localData.cantidad_unidades = 0
    
    const nextButton = wrapper.find('button')
    expect(nextButton.attributes('disabled')).toBeDefined()
  })

  it('habilita el botón cuando se puede proceder', async () => {
    // Simular imagen y cantidad válida
    const mockFile = new File(['test'], 'test.png', { type: 'image/png' })
    wrapper.vm.localData.labelImage = mockFile
    wrapper.vm.localData.cantidad_unidades = 5
    
    await wrapper.vm.$nextTick()
    
    const nextButton = wrapper.find('button')
    expect(nextButton.attributes('disabled')).toBeUndefined()
  })

  describe('validación de cantidad', () => {
    it('acepta cantidad válida', async () => {
      const quantityInput = wrapper.find('input[type="number"]')
      await quantityInput.setValue(10)
      
      await wrapper.vm.$nextTick()
      
      expect(wrapper.vm.localData.cantidad_unidades).toBe(10)
    })

    it('puede detectar cuando no se puede proceder', async () => {
      wrapper.vm.localData.labelImage = null
      wrapper.vm.localData.cantidad_unidades = 0
      
      await wrapper.vm.$nextTick()
      
      // Como canProceed es un computed, puede que no esté inicializado inmediatamente
      expect(wrapper.vm.canProceed).toBeFalsy()
    })
  })

  describe('procesamiento OCR', () => {
    beforeEach(() => {
      validateImageForOCRMock.mockReturnValue({ valid: true })
    })

    it('procesa OCR cuando hay imagen y se hace clic en siguiente', async () => {
      const mockFile = new File(['test'], 'test.png', { type: 'image/png' })
      wrapper.vm.localData.labelImage = mockFile
      wrapper.vm.localData.cantidad_unidades = 5

      const mockOCRData: OCRData = {
        cliente: 'Cliente Test',
        producto: 'Producto Test',
        codigo_producto: 'COD123',
        lote: 'LOTE123'
      }

      processOCRWithRetryMock.mockResolvedValue(mockOCRData)
      
      await wrapper.vm.handleNext()
      
      expect(processOCRWithRetryMock).toHaveBeenCalledWith(
        mockFile,
        expect.any(Function)
      )
      expect(wrapper.emitted('ocr-complete')).toBeTruthy()
      expect(wrapper.emitted('next')).toBeTruthy()
    })

    it('maneja errores de OCR mostrando opción de continuar', async () => {
      const mockFile = new File(['test'], 'test.png', { type: 'image/png' })
      wrapper.vm.localData.labelImage = mockFile
      wrapper.vm.localData.cantidad_unidades = 5

      processOCRWithRetryMock.mockRejectedValue(new Error('OCR Error'))
      
      // Mock window.confirm para simular que el usuario acepta continuar
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true)
      
      await wrapper.vm.handleNext()
      
      expect(confirmSpy).toHaveBeenCalledWith(
        expect.stringContaining('El procesamiento OCR falló')
      )
      expect(toastMock.warning).toHaveBeenCalledWith(
        'OCR no completado',
        'Completa los datos manualmente en el siguiente paso'
      )
      expect(wrapper.emitted('next')).toBeTruthy()
      
      confirmSpy.mockRestore()
    })

    it('cancela cuando el usuario no acepta continuar sin OCR', async () => {
      const mockFile = new File(['test'], 'test.png', { type: 'image/png' })
      wrapper.vm.localData.labelImage = mockFile
      wrapper.vm.localData.cantidad_unidades = 5

      processOCRWithRetryMock.mockRejectedValue(new Error('OCR Error'))
      
      // Mock window.confirm para simular que el usuario cancela
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false)
      
      await wrapper.vm.handleNext()
      
      expect(toastMock.info).toHaveBeenCalledWith(
        'Operación cancelada',
        'Puedes intentar con otra imagen'
      )
      expect(wrapper.emitted('next')).toBeUndefined()
      
      confirmSpy.mockRestore()
    })

    it('maneja el estado isProcessingOCR', async () => {
      const mockFile = new File(['test'], 'test.png', { type: 'image/png' })
      wrapper.vm.localData.labelImage = mockFile
      wrapper.vm.localData.cantidad_unidades = 5

      processOCRWithRetryMock.mockResolvedValue({
        cliente: 'Cliente Test',
        codigo_producto: 'COD123',
        lote: 'LOTE123'
      })
      
      await wrapper.vm.handleNext()
      
      // El procesamiento ya terminó
      expect(wrapper.vm.isProcessingOCR).toBe(false)
    })
  })

  describe('manejo de eventos de OCR', () => {
    it('maneja evento ocr-complete del componente de imagen', () => {
      const mockOCRData: OCRData = {
        cliente: 'Cliente Test',
        producto: 'Producto Test',
        codigo_producto: 'COD123',
        lote: 'LOTE123'
      }

      wrapper.vm.handleOCRComplete(mockOCRData)

      expect(wrapper.vm.ocrData).toEqual(mockOCRData)
      expect(wrapper.emitted('ocr-complete')).toBeTruthy()
      expect(wrapper.emitted('ocr-complete')![0][0]).toEqual(mockOCRData)
    })
  })

  describe('validación de imagen', () => {
    it('valida imagen antes de procesar OCR', async () => {
      const mockFile = new File(['test'], 'test.png', { type: 'image/png' })
      wrapper.vm.localData.labelImage = mockFile
      wrapper.vm.localData.cantidad_unidades = 5

      validateImageForOCRMock.mockReturnValue({ 
        valid: false, 
        error: 'Imagen no válida' 
      })
      
      // Mock window.confirm para evitar error
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false)
      
      await wrapper.vm.handleNext()
      
      expect(validateImageForOCRMock).toHaveBeenCalledWith(mockFile)
      confirmSpy.mockRestore()
    })
  })

  describe('logging', () => {
    it('registra información durante el procesamiento OCR', async () => {
      const mockFile = new File(['test'], 'test.png', { type: 'image/png' })
      wrapper.vm.localData.labelImage = mockFile
      wrapper.vm.localData.cantidad_unidades = 5

      validateImageForOCRMock.mockReturnValue({ valid: true })
      processOCRWithRetryMock.mockResolvedValue({
        cliente: 'Cliente Test',
        codigo_producto: 'COD123',
        lote: 'LOTE123'
      })
      
      await wrapper.vm.handleNext()
      
      expect(loggerMock.info).toHaveBeenCalledWith(
        'Iniciando procesamiento OCR',
        expect.objectContaining({
          fileName: 'test.png',
          fileSize: expect.any(Number)
        })
      )
      
      expect(loggerMock.info).toHaveBeenCalledWith('OCR completado exitosamente')
      
      expect(loggerMock.info).toHaveBeenCalledWith(
        'Datos OCR extraídos',
        expect.objectContaining({
          cliente: 'Cliente Test',
          codigo_producto: 'COD123',
          lote: 'LOTE123'
        })
      )
    })
  })
})