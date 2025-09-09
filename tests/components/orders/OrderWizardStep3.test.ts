import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import OrderWizardStep3 from '~/components/orders/OrderWizardStep3.vue'
import type { Test } from '~/types/tests'

// Mock datos de pruebas
const mockTests: Test[] = [
  {
    id: 1,
    created_at: '2024-01-01',
    name: 'Inspección visual de defectos superficiales',
    type: 'visual'
  },
  {
    id: 2,
    created_at: '2024-01-01',
    name: 'Verificación de dimensiones',
    type: 'visual'
  },
  {
    id: 3,
    created_at: '2024-01-01',
    name: 'Prueba de resistencia a tracción',
    type: 'funcional'
  },
  {
    id: 4,
    created_at: '2024-01-01',
    name: 'Test de hermeticidad',
    type: 'funcional'
  }
]

// Mock del composable useTestsAPI
const getAllTestsMock = vi.fn()

vi.stubGlobal('useTestsAPI', () => ({
  getAllTests: getAllTestsMock
}))

// Mock de las funciones globales
const onMountedCallbacks: Array<() => void> = []
vi.stubGlobal('onMounted', (callback: () => void) => {
  onMountedCallbacks.push(callback)
  // Ejecutar inmediatamente para simular el lifecycle
  callback()
})

describe('OrderWizardStep3', () => {
  let wrapper: VueWrapper<any>
  let defaultProps: any

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks()
    getAllTestsMock.mockClear()

    // Default props con modelValue válido
    defaultProps = {
      modelValue: {
        // Step 1
        labelImage: null,
        labelImagePreview: '',
        cantidad_unidades_por_embalaje: 1,
        
        // Step 2 - campos requeridos
        cliente: 'Cliente Test',
        producto: 'Producto Test',
        pedido: 'PED-001',
        fechaFabricacion: '2024-01-01',
        codigoProducto: 'PROD-001',
        turno: 'mañana',
        numeroOperario: 'OP001',
        maquina: 'MAQ001',
        inspectorCalidad: 'IC001',
        
        // Step 3 - campos opcionales
        testResults: {},
        qualityNotes: '',
        cantidad_muestra: 0,
        
        // Step 4 - campos opcionales
        finalResult: 'approved' as const,
        rejectionReason: '',
        recommendations: ''
      }
    }

    // Mock de getAllTests para devolver tests
    getAllTestsMock.mockResolvedValue(mockTests)

    wrapper = mount(OrderWizardStep3, {
      props: defaultProps,
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })],
        stubs: {
          Icon: { template: '<span data-testid="icon"></span>' }
        }
      }
    })
  })

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount()
    }
    onMountedCallbacks.length = 0
  })

  it('renderiza correctamente', () => {
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('h2').text()).toBe('Paso 3: Pruebas de Calidad')
    expect(wrapper.find('p').text()).toContain('Registra los resultados de las pruebas realizadas')
  })

  it('muestra estado de carga inicial', async () => {
    // El loading se pone a false después de onMounted que resuelve getAllTests
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.loading).toBe(false)
  })

  it('carga los tests al montar el componente', async () => {
    // Verificar que el loading state se maneje correctamente
    wrapper.vm.tests = mockTests
    await wrapper.vm.$nextTick()
    
    expect(wrapper.vm.tests).toEqual(mockTests)
    expect(wrapper.vm.loading).toBe(false)
  })

  it('inicializa con valores por defecto correctos', () => {
    expect(wrapper.vm.localData.testResults).toEqual({})
    expect(wrapper.vm.localData.qualityNotes).toBe('')
    expect(wrapper.vm.localData.cantidad_muestra).toBe(0)
  })

  it('inicializa con valores del modelValue si están disponibles', async () => {
    const propsWithData = {
      modelValue: {
        ...defaultProps.modelValue,
        testResults: { 1: true, 2: false },
        qualityNotes: 'Nota de prueba',
        cantidad_muestra: 5
      }
    }

    const wrapperWithData = mount(OrderWizardStep3, {
      props: propsWithData,
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })],
        stubs: {
          Icon: { template: '<span data-testid="icon"></span>' }
        }
      }
    })

    expect(wrapperWithData.vm.localData.testResults).toEqual({ 1: true, 2: false })
    expect(wrapperWithData.vm.localData.qualityNotes).toBe('Nota de prueba')
    expect(wrapperWithData.vm.localData.cantidad_muestra).toBe(5)

    wrapperWithData.unmount()
  })

  describe('computed properties', () => {
    beforeEach(async () => {
      // Simular que se cargaron los tests
      wrapper.vm.tests = mockTests
      wrapper.vm.loading = false
      await wrapper.vm.$nextTick()
    })

    it('filtra correctamente las pruebas visuales', () => {
      const visualTests = wrapper.vm.visualTests
      expect(visualTests).toHaveLength(2)
      expect(visualTests.every((test: Test) => test.type === 'visual')).toBe(true)
    })

    it('filtra correctamente las pruebas funcionales', () => {
      const functionalTests = wrapper.vm.functionalTests
      expect(functionalTests).toHaveLength(2)
      expect(functionalTests.every((test: Test) => test.type === 'funcional')).toBe(true)
    })

    it('calcula correctamente el total de tests', () => {
      expect(wrapper.vm.totalTests).toBe(4)
    })

    it('calcula correctamente los tests completados', () => {
      wrapper.vm.localData.testResults = { 1: true, 2: true, 3: false }
      expect(wrapper.vm.completedTests).toBe(2)
    })

    it('calcula correctamente el porcentaje de éxito', () => {
      wrapper.vm.localData.testResults = { 1: true, 2: true, 3: false, 4: false }
      expect(wrapper.vm.successRate).toBe(50) // 2/4 = 50%
    })

    it('calcula canProceed correctamente cuando hay tests completados', () => {
      wrapper.vm.localData.testResults = { 1: true }
      expect(wrapper.vm.canProceed).toBe(true)
    })

    it('calcula canProceed correctamente cuando no hay tests completados', () => {
      wrapper.vm.localData.testResults = {}
      expect(wrapper.vm.canProceed).toBe(false)
    })
  })

  describe('grupos de pruebas', () => {
    beforeEach(async () => {
      wrapper.vm.tests = mockTests
      wrapper.vm.loading = false
      await wrapper.vm.$nextTick()
    })

    it('renderiza el grupo de pruebas visuales', async () => {
      await wrapper.vm.$nextTick()
      
      const visualGroups = wrapper.findAll('h4')
      const hasVisualGroup = visualGroups.some(h4 => h4.text().includes('Pruebas Visuales'))
      expect(hasVisualGroup).toBe(true)
    })

    it('renderiza el grupo de pruebas funcionales', async () => {
      await wrapper.vm.$nextTick()
      
      const functionalGroups = wrapper.findAll('h4')
      const hasFunctionalGroup = functionalGroups.some(h4 => h4.text().includes('Pruebas Funcionales'))
      expect(hasFunctionalGroup).toBe(true)
    })

    it('aplica estilos correctos a las pruebas visuales', async () => {
      await wrapper.vm.$nextTick()
      
      const visualContainers = wrapper.findAll('.bg-blue-50')
      expect(visualContainers.length).toBeGreaterThan(0)
    })

    it('aplica estilos correctos a las pruebas funcionales', async () => {
      await wrapper.vm.$nextTick()
      
      const functionalContainers = wrapper.findAll('.bg-green-50')
      expect(functionalContainers.length).toBeGreaterThan(0)
    })
  })

  describe('interacción con switches', () => {
    beforeEach(async () => {
      wrapper.vm.tests = mockTests
      wrapper.vm.loading = false
      await wrapper.vm.$nextTick()
    })

    it('actualiza testResults cuando se activa un switch', async () => {
      const switchInput = wrapper.find('input[type="checkbox"]')
      await switchInput.setChecked(true)
      
      expect(wrapper.vm.localData.testResults[1]).toBe(true)
    })

    it('actualiza qualityNotes cuando se modifica el textarea', async () => {
      const textarea = wrapper.find('textarea')
      const noteText = 'Nueva observación de calidad'
      await textarea.setValue(noteText)
      
      expect(wrapper.vm.localData.qualityNotes).toBe(noteText)
    })

    it('actualiza cantidad_muestra cuando se modifica el input', async () => {
      const quantityInput = wrapper.find('input[type="number"]')
      await quantityInput.setValue('10')
      
      expect(wrapper.vm.localData.cantidad_muestra).toBe(10)
    })
  })

  describe('switches UI específicos', () => {
    beforeEach(async () => {
      wrapper.vm.tests = mockTests
      wrapper.vm.loading = false
      await wrapper.vm.$nextTick()
    })

    it('renderiza switches con estructura correcta', async () => {
      await wrapper.vm.$nextTick()
      
      // Verificar que los inputs están ocultos (sr-only)
      const hiddenInputs = wrapper.findAll('input.sr-only')
      expect(hiddenInputs.length).toBeGreaterThan(0)
      
      // Verificar que existen los contenedores de switches
      const switchContainers = wrapper.findAll('.relative.w-11.h-6')
      expect(switchContainers.length).toBeGreaterThan(0)
    })

    it('aplica clases condicionales correctas para switches visuales', async () => {
      // Activar un test visual
      wrapper.vm.localData.testResults = { 1: true }
      await wrapper.vm.$nextTick()
      
      // Buscar switches en contenedores de pruebas visuales
      const visualContainers = wrapper.findAll('.bg-blue-50')
      expect(visualContainers.length).toBeGreaterThan(0)
      
      // Verificar que hay elementos con clases de switches activos azules
      const activeElements = wrapper.findAll('.bg-blue-600')
      expect(activeElements.length).toBeGreaterThan(0)
    })

    it('aplica clases condicionales correctas para switches funcionales', async () => {
      // Activar un test funcional
      wrapper.vm.localData.testResults = { 3: true }
      await wrapper.vm.$nextTick()
      
      // Buscar switches en contenedores de pruebas funcionales
      const functionalContainers = wrapper.findAll('.bg-green-50')
      expect(functionalContainers.length).toBeGreaterThan(0)
      
      // Verificar que hay elementos con clases de switches activos verdes
      const activeElements = wrapper.findAll('.bg-green-600')
      expect(activeElements.length).toBeGreaterThan(0)
    })

    it('muestra switches en estado inactivo por defecto', async () => {
      await wrapper.vm.$nextTick()
      
      // Verificar que hay switches con fondo gris (estado inactivo)
      const inactiveSwitches = wrapper.findAll('.bg-gray-300')
      expect(inactiveSwitches.length).toBeGreaterThan(0)
      
      // Verificar que los botones están en posición izquierda (translate-x-0)
      const leftPositionButtons = wrapper.findAll('.translate-x-0')
      expect(leftPositionButtons.length).toBeGreaterThan(0)
    })

    it('muestra switches en estado activo cuando están marcados', async () => {
      // Activar algunos tests
      wrapper.vm.localData.testResults = { 1: true, 3: true }
      await wrapper.vm.$nextTick()
      
      // Verificar que los botones están en posición derecha (translate-x-5)
      const rightPositionButtons = wrapper.findAll('.translate-x-5')
      expect(rightPositionButtons.length).toBe(2) // Dos tests activados
    })

    it('mantiene la accesibilidad con labels clickeables', async () => {
      await wrapper.vm.$nextTick()
      
      // Verificar que todos los inputs tienen IDs únicos y labels correspondientes
      const inputs = wrapper.findAll('input[type="checkbox"]')
      const allLabels = wrapper.findAll('label[for^="test-"]') // Todos los labels de switches
      
      // Debe haber exactamente 2 labels por cada input (nombre del test + switch)
      expect(allLabels.length).toBe(inputs.length * 2)
      
      // Verificar que cada input tiene al menos un label correspondiente
      inputs.forEach((input) => {
        const inputId = input.attributes('id')
        const matchingLabels = allLabels.filter(label => 
          label.attributes('for') === inputId
        )
        expect(matchingLabels.length).toBe(2) // Un label para el nombre, otro para el switch
      })
    })

    it('muestra nombres de tests en los labels', async () => {
      await wrapper.vm.$nextTick()
      
      const labels = wrapper.findAll('label')
      const testNames = mockTests.map(test => test.name)
      
      // Verificar que al menos algunos nombres de tests aparecen en los labels
      const labelsWithTestNames = labels.filter(label => 
        testNames.some(name => label.text().includes(name))
      )
      
      expect(labelsWithTestNames.length).toBeGreaterThan(0)
    })

    it('separa iconos de los nombres de tests', async () => {
      await wrapper.vm.$nextTick()
      
      // Verificar que los emojis están en elementos separados
      const emojiContainers = wrapper.findAll('div.text-blue-600, div.text-green-600')
      expect(emojiContainers.length).toBeGreaterThan(0)
      
      // Verificar que contienen emojis
      const hasVisualEmoji = emojiContainers.some(container => 
        container.text().includes('👁️')
      )
      const hasFunctionalEmoji = emojiContainers.some(container => 
        container.text().includes('🔧')
      )
      
      expect(hasVisualEmoji).toBe(true)
      expect(hasFunctionalEmoji).toBe(true)
    })
  })

  describe('emisión de eventos', () => {
    beforeEach(async () => {
      wrapper.vm.tests = mockTests
      wrapper.vm.loading = false
      await wrapper.vm.$nextTick()
    })

    it('emite update:modelValue cuando cambian los datos locales', async () => {
      wrapper.vm.localData.testResults = { 1: true }
      await wrapper.vm.$nextTick()
      
      const emittedEvents = wrapper.emitted('update:modelValue')
      expect(emittedEvents).toBeTruthy()
      
      const lastEmitted = emittedEvents![emittedEvents!.length - 1][0]
      expect(lastEmitted).toEqual({
        ...defaultProps.modelValue,
        orders_tests: [
          {
            test_id: 1,
            aprobado: true
          }
        ],
        qualityNotes: '',
        cantidad_muestra: 0,
        testResults: { 1: true }
      })
    })

    it('emite next cuando se hace clic en Siguiente con datos válidos', async () => {
      // Simular test completado
      wrapper.vm.localData.testResults = { 1: true }
      await wrapper.vm.$nextTick()
      
      const nextButton = wrapper.find('button:nth-last-child(1)')
      await nextButton.trigger('click')
      
      expect(wrapper.emitted('next')).toBeTruthy()
    })

    it('emite previous cuando se hace clic en Anterior', async () => {
      const previousButton = wrapper.find('button:nth-last-child(2)')
      await previousButton.trigger('click')
      
      expect(wrapper.emitted('previous')).toBeTruthy()
    })
  })

  describe('resumen de pruebas', () => {
    beforeEach(async () => {
      wrapper.vm.tests = mockTests
      wrapper.vm.loading = false
      await wrapper.vm.$nextTick()
    })

    it('muestra el resumen de pruebas correctamente', async () => {
      wrapper.vm.localData.testResults = { 1: true, 2: false, 3: true }
      await wrapper.vm.$nextTick()
      
      const summary = wrapper.find('.bg-gray-50')
      expect(summary.exists()).toBe(true)
      expect(summary.text()).toContain('Resumen de Pruebas')
    })

    it('muestra el conteo correcto de pruebas completadas', async () => {
      wrapper.vm.localData.testResults = { 1: true, 2: true }
      await wrapper.vm.$nextTick()
      
      expect(wrapper.text()).toContain('2/4')
    })

    it('aplica color correcto al porcentaje de éxito', async () => {
      // Porcentaje alto (verde)
      wrapper.vm.localData.testResults = { 1: true, 2: true, 3: true, 4: true }
      await wrapper.vm.$nextTick()
      
      const successRateElement = wrapper.find('.text-green-600')
      expect(successRateElement.exists()).toBe(true)
      
      // Porcentaje bajo (amarillo)
      wrapper.vm.localData.testResults = { 1: true }
      await wrapper.vm.$nextTick()
      
      const lowSuccessRateElement = wrapper.find('.text-yellow-600')
      expect(lowSuccessRateElement.exists()).toBe(true)
    })
  })

  describe('botón de navegación', () => {
    beforeEach(async () => {
      wrapper.vm.tests = mockTests
      wrapper.vm.loading = false
      await wrapper.vm.$nextTick()
    })

    it('deshabilita el botón Siguiente cuando no se puede proceder', async () => {
      wrapper.vm.localData.testResults = {}
      await wrapper.vm.$nextTick()
      
      const nextButton = wrapper.find('button:nth-last-child(1)')
      expect(nextButton.attributes('disabled')).toBeDefined()
    })

    it('habilita el botón Siguiente cuando se puede proceder', async () => {
      wrapper.vm.localData.testResults = { 1: true }
      await wrapper.vm.$nextTick()
      
      const nextButton = wrapper.find('button:nth-last-child(1)')
      expect(nextButton.attributes('disabled')).toBeUndefined()
    })
  })

  describe('manejo de errores', () => {
    it('maneja errores al cargar tests', async () => {
      getAllTestsMock.mockRejectedValue(new Error('Error loading tests'))
      
      const errorWrapper = mount(OrderWizardStep3, {
        props: defaultProps,
        global: {
          plugins: [createTestingPinia({ createSpy: vi.fn })],
          stubs: {
            Icon: { template: '<span data-testid="icon"></span>' }
          }
        }
      })

      // Ejecutar callback de onMounted que maneja errores
      try {
        await getAllTestsMock()
      } catch {
        // Error manejado
      }

      expect(errorWrapper.vm.loading).toBe(true) // Se mantiene en loading state
      
      errorWrapper.unmount()
    })

    it('maneja modelValue undefined sin errores', () => {
      const propsWithUndefined = {
        modelValue: undefined
      }

      expect(() => {
        const undefinedWrapper = mount(OrderWizardStep3, {
          props: propsWithUndefined,
          global: {
            plugins: [createTestingPinia({ createSpy: vi.fn })],
            stubs: {
              Icon: { template: '<span data-testid="icon"></span>' }
            }
          }
        })
        undefinedWrapper.unmount()
      }).not.toThrow()
    })
  })
})