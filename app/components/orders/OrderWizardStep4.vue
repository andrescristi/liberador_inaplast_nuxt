<template>
  <div class="bg-white shadow-lg rounded-lg overflow-hidden">
    <div class="bg-indigo-50 px-6 py-4 border-b border-indigo-100">
      <h2 class="text-xl font-semibold text-indigo-900">Paso 4: Resumen y Resultados</h2>
      <p class="text-sm text-indigo-600 mt-1">Revisa la información y emite la decisión final</p>
    </div>
    
    <div class="p-6 space-y-8">
      <!-- Información General -->
      <div>
        <h3 class="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <Icon name="bx:info-circle" class="w-5 h-5 mr-2 text-indigo-500" />
          Información General
        </h3>
        <div class="bg-gray-50 rounded-lg p-6">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 text-sm">
            <div class="flex justify-between border-b border-gray-200 pb-2">
              <span class="text-gray-600">Cliente:</span>
              <span class="font-medium text-right">{{ modelValue.cliente || 'No especificado' }}</span>
            </div>
            <div class="flex justify-between border-b border-gray-200 pb-2">
              <span class="text-gray-600">Producto:</span>
              <span class="font-medium text-right">{{ modelValue.producto || 'No especificado' }}</span>
            </div>
            <div class="flex justify-between border-b border-gray-200 pb-2">
              <span class="text-gray-600">Código:</span>
              <span class="font-medium text-right">{{ modelValue.codigoProducto || 'No especificado' }}</span>
            </div>
            <div class="flex justify-between border-b border-gray-200 pb-2">
              <span class="text-gray-600">Lote:</span>
              <span class="font-medium text-right">{{ modelValue.lote || 'No especificado' }}</span>
            </div>
            <div class="flex justify-between border-b border-gray-200 pb-2">
              <span class="text-gray-600">Pedido:</span>
              <span class="font-medium text-right">{{ modelValue.pedido || 'No especificado' }}</span>
            </div>
            <div class="flex justify-between border-b border-gray-200 pb-2">
              <span class="text-gray-600">Cantidad Embalajes:</span>
              <span class="font-medium text-right">{{ modelValue.cantidadEmbalajes || 0 }} embalajes</span>
            </div>
            <div v-if="modelValue.unidadesPorEmbalaje" class="flex justify-between border-b border-gray-200 pb-2">
              <span class="text-gray-600">Unidades por Embalaje:</span>
              <span class="font-medium text-right">{{ modelValue.unidadesPorEmbalaje }} unidades</span>
            </div>
            <div class="flex justify-between border-b border-gray-200 pb-2">
              <span class="text-gray-600">Turno:</span>
              <span class="font-medium text-right">{{ modelValue.turno || 'No especificado' }}</span>
            </div>
            <div class="flex justify-between border-b border-gray-200 pb-2">
              <span class="text-gray-600">Fecha Fabricación:</span>
              <span class="font-medium text-right">{{ modelValue.fechaFabricacion || 'No especificado' }}</span>
            </div>
            <div class="flex justify-between border-b border-gray-200 pb-2">
              <span class="text-gray-600">Inspector:</span>
              <span class="font-medium text-right">{{ modelValue.inspectorCalidad || 'No especificado' }}</span>
            </div>
            <div class="flex justify-between border-b border-gray-200 pb-2">
              <span class="text-gray-600">Operario:</span>
              <span class="font-medium text-right">{{ modelValue.numeroOperario || 'No especificado' }}</span>
            </div>
            <div class="flex justify-between border-b border-gray-200 pb-2">
              <span class="text-gray-600">Máquina:</span>
              <span class="font-medium text-right">{{ modelValue.maquina || 'No especificado' }}</span>
            </div>
            <div v-if="modelValue.jefeDeTurno" class="flex justify-between border-b border-gray-200 pb-2">
              <span class="text-gray-600">Jefe de Turno:</span>
              <span class="font-medium text-right">{{ modelValue.jefeDeTurno }}</span>
            </div>
            <div v-if="modelValue.ordenDeCompra" class="flex justify-between border-b border-gray-200 pb-2">
              <span class="text-gray-600">Orden de Compra:</span>
              <span class="font-medium text-right">{{ modelValue.ordenDeCompra }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Resultados de Pruebas -->
      <div>
        <h3 class="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <Icon name="bx:check-circle" class="w-5 h-5 mr-2 text-indigo-500" />
          Resultados de Pruebas
        </h3>
        <div class="bg-gray-50 rounded-lg p-6">
          <div v-if="testsWithResults.length > 0" class="space-y-3">
            <div 
              v-for="test in testsWithResults" 
              :key="test.testId" 
              class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 py-3 border-b border-gray-200 last:border-b-0"
            >
              <span class="text-gray-700 font-medium text-sm sm:text-base">{{ test.name }}</span>
              <span 
                class="px-3 py-2 rounded-full text-sm font-semibold text-center flex-shrink-0"
                :class="test.aprobado 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'"
              >
                {{ test.aprobado ? '✅ Aprobado' : '❌ Rechazado' }}
              </span>
            </div>
          </div>
          <div v-else class="text-gray-500 italic text-center py-4">
            No hay resultados de pruebas disponibles
          </div>
          
          <!-- Estado General -->
          <div class="mt-6 p-4 rounded-lg border-2" :class="overallStatusClass">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <span class="text-base sm:text-lg font-semibold">Estado General de la Orden:</span>
              <span class="text-lg sm:text-xl font-bold text-center sm:text-right">{{ overallStatusText }}</span>
            </div>
          </div>
        </div>
      </div>


      <!-- Quality Notes Summary -->
      <div v-if="modelValue.qualityNotes" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 class="font-medium text-yellow-900 mb-2">Observaciones de Calidad</h4>
        <p class="text-sm text-yellow-800">{{ modelValue.qualityNotes }}</p>
      </div>

      <!-- Navigation -->
      <div class="flex justify-between pt-6">
        <button 
          type="button"
          class="bg-gray-500 hover:bg-gray-600 text-white px-8 py-3 rounded-lg font-medium transition-colors"
          @click="$emit('previous')"
        >
          Anterior
        </button>
        <button 
          type="button"
          class="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          :disabled="!canSave || isSaving"
          @click="handleSave"
        >
          <Icon 
            v-if="isSaving" 
            name="bx:loader-alt" 
            class="animate-spin w-4 h-4 mr-2" 
          />
          {{ isSaving ? 'Guardando...' : 'Guardar Inspección' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Test } from '~/types/tests'
import type { NewOrderData } from '~/schemas/orders/new_order'
import { useTestsAPI } from '~/composables/tests/useTestsAPI'
import { useOrderAPI } from '~/composables/orders/useOrderAPI'

// Interface para datos de test del API
interface OrderTestData {
  testId: number
  aprobado: boolean
}

interface Props {
  modelValue: NewOrderData
  isSaving: boolean
}

interface Emits {
  (e: 'update:modelValue', value: NewOrderData): void
  (e: 'previous'): void
  (e: 'save', order?: unknown): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Composables
const { getAllTests } = useTestsAPI()
const { createOrder } = useOrderAPI()

// State
const tests = ref<Test[]>([])

// Load tests on component mount
onMounted(async () => {
  try {
    tests.value = await getAllTests()
  } catch {
    // Error loading tests
  }
})


// Computed
const testsWithResults = computed(() => {
  if (!tests.value.length) return []
  
  // Combinar tests con sus resultados usando orders_tests o testResults
  return tests.value.map(test => {
    let aprobado = false
    
    // Buscar resultado en ordersTests primero
    if (props.modelValue.ordersTests) {
      const orderTest = props.modelValue.ordersTests.find((ot: { testId?: number; test_id?: number; aprobado: boolean }) => (ot.testId || ot.test_id) === test.id)
      if (orderTest) {
        aprobado = orderTest.aprobado
      }
    }
    // Fallback a testResults
    else if (props.modelValue.testResults && props.modelValue.testResults[test.id] !== undefined) {
      aprobado = props.modelValue.testResults[test.id] || false
    }
    
    return {
      testId: test.id,
      name: test.name,
      aprobado
    }
  })
})

const overallStatusClass = computed(() => {
  const hasFailedTest = testsWithResults.value.some(test => !test.aprobado)
  if (hasFailedTest) {
    return 'bg-red-50 border-red-300 text-red-800'
  }
  return 'bg-green-50 border-green-300 text-green-800'
})

const overallStatusText = computed(() => {
  const hasFailedTest = testsWithResults.value.some(test => !test.aprobado)
  return hasFailedTest ? '❌ Rechazado' : '✅ Aprobado'
})

const canSave = computed(() => {
  return true
})

// Methods
const handleSave = async () => {
  if (!canSave.value || props.isSaving) return
  
  try {
    // Preparar datos para la API
    const orderData = prepareOrderData()
    
    // Crear la orden usando la API
    const createdOrder = await createOrder(orderData)
    
    // Emitir evento de guardado exitoso con la orden creada
    emit('save', createdOrder)
    
  } catch (error) {
    // El error ya se maneja en el composable useOrderAPI con toast
    // Solo rethrow si es necesario para debuging en desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.error('Error al guardar la orden:', error)
    }
  }
}

// Función auxiliar para preparar los datos de la orden
const prepareOrderData = () => {
  const modelValue = props.modelValue
  
  // Asegurar que TODOS los tests estén incluidos
  let orders_tests: OrderTestData[] = []
  
  if (tests.value.length > 0) {
    // Crear un array con TODOS los tests disponibles
    orders_tests = tests.value.map(test => {
      let aprobado = false
      
      // Buscar el resultado en ordersTests
      if (modelValue.ordersTests) {
        const orderTest = modelValue.ordersTests.find((ot: { testId?: number; test_id?: number; aprobado: boolean }) => (ot.testId || ot.test_id) === test.id)
        if (orderTest) {
          aprobado = orderTest.aprobado
        }
      } 
      // Buscar en testResults como fallback
      else if (modelValue.testResults && modelValue.testResults[test.id] !== undefined) {
        aprobado = modelValue.testResults[test.id] || false
      }
      
      return {
        testId: test.id,
        aprobado
      }
    })
  }
  
  // Estructura de datos que espera la API
  return {
    lote: modelValue.lote,
    cliente: modelValue.cliente,
    producto: modelValue.producto,
    pedido: modelValue.pedido,
    fecha_fabricacion: modelValue.fechaFabricacion,
    codigo_producto: modelValue.codigoProducto,
    turno: modelValue.turno,
    cantidad_embalajes: modelValue.cantidadEmbalajes,
    cantidad_unidades_por_embalaje: modelValue.unidadesPorEmbalaje,
    jefe_de_turno: modelValue.jefeDeTurno,
    orden_de_compra: modelValue.ordenDeCompra,
    numero_operario: modelValue.numeroOperario,
    maquina: modelValue.maquina,
    inspector_calidad: modelValue.inspectorCalidad,
    orders_tests: orders_tests,
    cantidad_muestra: modelValue.cantidadMuestra,
  }
}
</script>