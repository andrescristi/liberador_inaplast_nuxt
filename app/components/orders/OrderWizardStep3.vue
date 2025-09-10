<template>
  <div class="bg-white shadow-lg rounded-lg overflow-hidden">
    <div class="bg-indigo-50 px-6 py-4 border-b border-indigo-100">
      <h2 class="text-xl font-semibold text-indigo-900">Paso 3: Pruebas de Calidad</h2>
      <p class="text-sm text-indigo-600 mt-1">Registra los resultados de las pruebas realizadas</p>
    </div>
    
    <div v-if="loading" class="p-6 flex justify-center">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
    </div>
    
    <div v-else class="p-6 space-y-6">
      <!-- Recomendación de Muestreo -->
      <div v-if="recomendacionMuestreo || muestreoError || loadingMuestreo" class="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 class="text-lg font-medium text-blue-900 mb-3 flex items-center">
          <Icon name="bx:calculator" class="w-5 h-5 mr-2" />
          Recomendación de Muestreo AQL
        </h3>
        
        <!-- Loading -->
        <div v-if="loadingMuestreo" class="flex items-center space-x-3">
          <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600" />
          <span class="text-blue-700">Calculando recomendación...</span>
        </div>
        
        <!-- Error -->
        <div v-else-if="muestreoError" class="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <div class="flex items-center space-x-2">
            <Icon name="bx:error" class="w-5 h-5 text-yellow-600" />
            <span class="text-yellow-800 text-sm">{{ muestreoError }}</span>
          </div>
        </div>
        
        <!-- Recomendación exitosa -->
        <div v-else-if="recomendacionMuestreo" class="space-y-3">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div class="bg-white rounded-lg p-3 border border-blue-200">
              <div class="text-blue-600 font-medium">Tamaño del Lote</div>
              <div class="text-lg font-bold text-blue-900">
                {{ (modelValue.cantidadEmbalajes || 0) * (modelValue.unidadesPorEmbalaje || 0) }} unidades
              </div>
              <div class="text-xs text-blue-600">
                {{ modelValue.cantidadEmbalajes }} embalajes × {{ modelValue.unidadesPorEmbalaje }} unidades
              </div>
            </div>
            
            <div class="bg-white rounded-lg p-3 border border-green-200">
              <div class="text-green-600 font-medium">Muestra Recomendada</div>
              <div class="text-lg font-bold text-green-900">
                {{ recomendacionMuestreo.plan.tamano_muestra }} unidades
              </div>
              <div class="text-xs text-green-600">
                Nivel {{ recomendacionMuestreo.grupo.nivel_inspeccion }} - AQL {{ recomendacionMuestreo.plan.aql }}
              </div>
            </div>
            
            <div class="bg-white rounded-lg p-3 border border-red-200">
              <div class="text-red-600 font-medium">Máx. Rechazos</div>
              <div class="text-lg font-bold text-red-900">
                {{ recomendacionMuestreo.plan.numero_maximo_fallas }}
              </div>
              <div class="text-xs text-red-600">
                Rechazar si supera este límite
              </div>
            </div>
          </div>
          
          <div class="text-xs text-blue-700 bg-blue-100 rounded p-2">
            <strong>Plan:</strong> {{ recomendacionMuestreo.plan.codigo }} | 
            <strong>Tipo:</strong> {{ recomendacionMuestreo.grupo.tipo_de_inspeccion }}
          </div>
        </div>
      </div>
      
      <!-- Sample Units Input -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          📊 Cantidad de Unidades a Muestrear
          <span v-if="recomendacionMuestreo" class="text-green-600 text-xs ml-2">
            (Recomendado: {{ recomendacionMuestreo.plan.tamano_muestra }})
          </span>
        </label>
        <div class="relative">
          <input 
            v-model.number="localData.cantidadMuestra"
            type="number"
            min="1"
            class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 pl-10"
            :class="{
              'border-green-300 bg-green-50': recomendacionMuestreo && localData.cantidadMuestra === recomendacionMuestreo.plan.tamano_muestra,
              'border-gray-300': !recomendacionMuestreo || localData.cantidadMuestra !== recomendacionMuestreo.plan.tamano_muestra
            }"
            placeholder="Ingresa la cantidad de unidades para el muestreo..."
          >
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon name="bx:package" class="h-5 w-5 text-gray-400" />
          </div>
          <div v-if="recomendacionMuestreo" class="absolute inset-y-0 right-0 pr-3 flex items-center">
            <button
              type="button"
              class="text-green-600 hover:text-green-800 text-xs font-medium"
              @click="localData.cantidadMuestra = recomendacionMuestreo.plan.tamano_muestra"
            >
              Usar recomendado
            </button>
          </div>
        </div>
        <p class="text-xs text-gray-500 mt-1">
          Especifica cuántas unidades del lote serán sometidas a las pruebas de calidad.
          <span v-if="recomendacionMuestreo">
            <br><strong>Muestreo recomendado:</strong> {{ recomendacionMuestreo.plan.tamano_muestra }} unidades
            <span v-if="localData.cantidadMuestra !== recomendacionMuestreo.plan.tamano_muestra" class="text-blue-600">
              • <strong>Muestreo a realizar:</strong> {{ localData.cantidadMuestra }} unidades
            </span>
          </span>
        </p>
      </div>

      <!-- Quality Tests Checklist -->
      <div>
        <h3 class="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <Icon name="bx:check-circle" class="w-5 h-5 mr-2 text-indigo-500" />
          Lista de Verificación de Calidad
        </h3>
        
        <!-- Pruebas Visuales -->
        <div v-if="visualTests.length > 0" class="mb-6">
          <h4 class="text-base font-semibold text-gray-900 mb-3 flex items-center">
            <Icon name="bx:show" class="w-5 h-5 mr-2 text-blue-500" />
            Pruebas Visuales
          </h4>
          <div class="space-y-3">
            <div 
              v-for="test in visualTests" 
              :key="test.id" 
              class="p-3 bg-blue-50 rounded-lg border border-blue-200"
            >
              <!-- Fila principal: nombre del test + switch -->
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div class="text-blue-600 text-lg">👁️</div>
                  <label :for="`test-${test.id}`" class="text-sm font-medium text-gray-700">
                    {{ test.name }}
                  </label>
                </div>
                
                <!-- Switch -->
                <div class="relative inline-block">
                  <input 
                    :id="`test-${test.id}`"
                    v-model="localData.testResults[test.id]"
                    type="checkbox"
                    class="sr-only"
                  >
                  <label 
                    :for="`test-${test.id}`" 
                    class="flex items-center cursor-pointer"
                  >
                    <div 
                      class="relative w-11 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out"
                      :class="localData.testResults[test.id] ? 'bg-blue-600' : 'bg-red-400'"
                    >
                      <div 
                        class="bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out"
                        :class="localData.testResults[test.id] ? 'translate-x-5' : 'translate-x-0'"
                      />
                    </div>
                    <span class="ml-2 text-xs" :class="localData.testResults[test.id] ? 'text-green-600' : 'text-red-600'">
                      {{ localData.testResults[test.id] ? 'Aprobado' : 'Rechazado' }}
                    </span>
                  </label>
                </div>
              </div>
              
              <!-- Campo de cantidad de rechazos (solo si está rechazado) -->
              <div v-if="!localData.testResults[test.id]" class="mt-3 flex items-center justify-between bg-red-50 p-2 rounded border border-red-200">
                <label :for="`rejection-${test.id}`" class="text-sm text-red-700 font-medium">
                  Cantidad de unidades con falla:
                </label>
                <input 
                  :id="`rejection-${test.id}`"
                  v-model.number="localData.testRejections[test.id]"
                  type="number"
                  min="1"
                  :max="localData.cantidadMuestra"
                  class="w-20 px-2 py-1 text-sm border border-red-300 rounded focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="1"
                  required
                >
              </div>
            </div>
          </div>
        </div>

        <!-- Pruebas Funcionales -->
        <div v-if="functionalTests.length > 0" class="mb-6">
          <h4 class="text-base font-semibold text-gray-900 mb-3 flex items-center">
            <Icon name="bx:cog" class="w-5 h-5 mr-2 text-green-500" />
            Pruebas Funcionales
          </h4>
          <div class="space-y-3">
            <div 
              v-for="test in functionalTests" 
              :key="test.id" 
              class="p-3 bg-green-50 rounded-lg border border-green-200"
            >
              <!-- Fila principal: nombre del test + switch -->
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div class="text-green-600 text-lg">🔧</div>
                  <label :for="`test-${test.id}`" class="text-sm font-medium text-gray-700">
                    {{ test.name }}
                  </label>
                </div>
                
                <!-- Switch -->
                <div class="relative inline-block">
                  <input 
                    :id="`test-${test.id}`"
                    v-model="localData.testResults[test.id]"
                    type="checkbox"
                    class="sr-only"
                  >
                  <label 
                    :for="`test-${test.id}`" 
                    class="flex items-center cursor-pointer"
                  >
                    <div 
                      class="relative w-11 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out"
                      :class="localData.testResults[test.id] ? 'bg-green-600' : 'bg-red-400'"
                    >
                      <div 
                        class="bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out"
                        :class="localData.testResults[test.id] ? 'translate-x-5' : 'translate-x-0'"
                      />
                    </div>
                    <span class="ml-2 text-xs" :class="localData.testResults[test.id] ? 'text-green-600' : 'text-red-600'">
                      {{ localData.testResults[test.id] ? 'Aprobado' : 'Rechazado' }}
                    </span>
                  </label>
                </div>
              </div>
              
              <!-- Campo de cantidad de rechazos (solo si está rechazado) -->
              <div v-if="!localData.testResults[test.id]" class="mt-3 flex items-center justify-between bg-red-50 p-2 rounded border border-red-200">
                <label :for="`rejection-${test.id}`" class="text-sm text-red-700 font-medium">
                  Cantidad de unidades con falla:
                </label>
                <input 
                  :id="`rejection-${test.id}`"
                  v-model.number="localData.testRejections[test.id]"
                  type="number"
                  min="1"
                  :max="localData.cantidadMuestra"
                  class="w-20 px-2 py-1 text-sm border border-red-300 rounded focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="1"
                  required
                >
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quality Notes -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          📝 Observaciones de Calidad
        </label>
        <textarea 
          v-model="localData.qualityNotes"
          rows="4"
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Describe cualquier observación importante sobre la calidad del producto..."
        />
        <p class="text-xs text-gray-500 mt-1">Incluye detalles sobre defectos encontrados, mediciones específicas o recomendaciones</p>
      </div>

      <!-- Test Results Summary -->
      <div class="bg-gray-50 rounded-lg p-4">
        <h4 class="font-medium text-gray-900 mb-2">Resumen de Pruebas</h4>
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div class="flex justify-between">
            <span class="text-gray-600">Pruebas aprobadas:</span>
            <span class="font-medium">{{ completedTests }}/{{ totalTests }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Porcentaje de éxito:</span>
            <span class="font-medium" :class="successRate >= 75 ? 'text-green-600' : 'text-yellow-600'">
              {{ successRate }}%
            </span>
          </div>
          <div class="flex justify-between col-span-2">
            <span class="text-gray-600">Total unidades rechazadas:</span>
            <span class="font-medium" :class="totalRejections === 0 ? 'text-green-600' : 'text-red-600'">
              {{ totalRejections }} unidades
            </span>
          </div>
          <div v-if="recomendacionMuestreo" class="flex justify-between col-span-2 pt-2 border-t border-gray-200">
            <span class="text-gray-600">Estado del lote:</span>
            <span class="font-medium" :class="totalRejections <= recomendacionMuestreo.plan.numero_maximo_fallas ? 'text-green-600' : 'text-red-600'">
              {{ totalRejections <= recomendacionMuestreo.plan.numero_maximo_fallas ? '✓ Aprobado' : '✗ Rechazado' }}
            </span>
          </div>
          <div v-if="recomendacionMuestreo" class="flex justify-between col-span-2">
            <span class="text-gray-600">Rechazos: {{ totalRejections }} / {{ recomendacionMuestreo.plan.numero_maximo_fallas }} máx.</span>
            <div class="w-24 bg-gray-200 rounded-full h-2 mt-1">
              <div 
                class="h-2 rounded-full transition-all"
                :class="totalRejections <= recomendacionMuestreo.plan.numero_maximo_fallas ? 'bg-green-500' : 'bg-red-500'"
                :style="{ width: Math.min(100, (totalRejections / Math.max(1, recomendacionMuestreo.plan.numero_maximo_fallas)) * 100) + '%' }"
              />
            </div>
          </div>
        </div>
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
          class="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="!canProceed"
          @click="handleNext"
        >
          Continuar al Resumen
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Test } from '~/types/tests'
import type { NewOrderData } from '~/schemas/orders/new_order'
import { useTestsAPI } from '~/composables/tests/useTestsAPI'
import { useMuestreoAPI } from '~/composables/muestreo/useMuestreoAPI'

// Interface para datos de test del API
interface OrderTestData {
  testId: number
  aprobado: boolean
  cantidadUnidadesConFalla?: number
}

interface Props {
  modelValue: NewOrderData
}

interface Emits {
  (e: 'update:modelValue', value: NewOrderData): void
  (e: 'next' | 'previous'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Composables
const { getAllTests } = useTestsAPI()
const { getRecomendacionMuestreo } = useMuestreoAPI()
const toast = useToast()

// State
const tests = ref<Test[]>([])
const loading = ref(true)
const loadingMuestreo = ref(false)
const recomendacionMuestreo = ref<{ tamanioLote: number; tamanioMuestra: number; aceptacion: number; rechazo: number } | null>(null)
const muestreoError = ref<string | null>(null)

// Local reactive copy - mantener structure híbrida para switches + cantidad
const localData = ref<{
  testResults: Record<number, boolean> // Para switches
  testRejections: Record<number, number> // Para cantidad de rechazos
  qualityNotes: string
  cantidadMuestra: number
}>({
  testResults: props.modelValue?.testResults || {},
  testRejections: {}, // Inicializar vacío
  qualityNotes: props.modelValue?.qualityNotes || '',
  cantidadMuestra: props.modelValue?.cantidadMuestra || 0
})

// Inicializar testResults y testRejections para cada test
watch(() => tests.value, (newTests) => {
  if (newTests.length > 0) {
    newTests.forEach(test => {
      if (!(test.id in localData.value.testResults)) {
        localData.value.testResults[test.id] = true // Default aprobado
      }
      if (!(test.id in localData.value.testRejections)) {
        localData.value.testRejections[test.id] = 0 // Default 0 rechazos
      }
    })
  }
}, { immediate: true })

// Watch para limpiar rechazos cuando un test se aprueba
watch(() => localData.value.testResults, (newResults, oldResults) => {
  Object.entries(newResults).forEach(([testId, aprobado]) => {
    if (aprobado && oldResults && !oldResults[parseInt(testId)]) {
      // Si el test cambió de rechazado a aprobado, limpiar rechazos
      localData.value.testRejections[parseInt(testId)] = 0
    }
  })
}, { deep: true })

// Load tests and muestreo on component mount
onMounted(async () => {
  try {
    tests.value = await getAllTests()
    await calcularRecomendacionMuestreo()
  } catch {
    // Error loading tests
  } finally {
    loading.value = false
  }
})

// Watch for changes and emit updates
watch(localData, (newValue) => {
  // Convertir testResults a formato API ordersTests
  const ordersTests: OrderTestData[] = Object.entries(newValue.testResults || {}).map(([testId, aprobado]) => {
    const cantidadRechazos = aprobado ? 0 : (newValue.testRejections[parseInt(testId)] || 0)
    return {
      testId: parseInt(testId),
      aprobado,
      cantidadUnidadesConFalla: cantidadRechazos
    }
  })
  
  emit('update:modelValue', {
    ...(props.modelValue || {}),
    ordersTests,
    qualityNotes: newValue.qualityNotes,
    cantidadMuestra: newValue.cantidadMuestra,
    // Mantener compatibilidad con formato anterior
    testResults: newValue.testResults
  })
}, { deep: true })

// Constantes para tipos de pruebas
const TEST_TYPE_VISUAL = 'visual' as const
const TEST_TYPE_FUNCTIONAL = 'funcional' as const

// Computed
const visualTests = computed(() => tests.value?.filter(test => test.type === TEST_TYPE_VISUAL) || [])

const functionalTests = computed(() => tests.value?.filter(test => test.type === TEST_TYPE_FUNCTIONAL) || [])

const totalTests = computed(() => tests.value?.length || 0)

const completedTests = computed(() => {
  // Tests aprobados (switch en true)
  return Object.values(localData.value.testResults || {}).filter(result => result === true).length
})

const _rejectedTests = computed(() => {
  // Tests rechazados (switch en false) 
  return Object.values(localData.value.testResults || {}).filter(result => result === false).length
})

const totalRejections = computed(() => {
  // Suma total de unidades rechazadas de todos los tests
  return Object.entries(localData.value.testResults || {}).reduce((total, [testId, aprobado]) => {
    if (!aprobado) {
      const rechazos = localData.value.testRejections[parseInt(testId)] || 0
      return total + rechazos
    }
    return total
  }, 0)
})

const successRate = computed(() => {
  if (totalTests.value === 0) return 0
  return Math.round((completedTests.value / totalTests.value) * 100)
})

const canProceed = computed(() => {
  // At least one test should be completed
  return completedTests.value > 0
})

// Methods
const calcularRecomendacionMuestreo = async () => {
  if (!props.modelValue.cantidadEmbalajes || !props.modelValue.unidadesPorEmbalaje) {
    muestreoError.value = 'Faltan datos para calcular la recomendación de muestreo'
    return
  }

  loadingMuestreo.value = true
  muestreoError.value = null
  
  try {
    const tamanoLote = props.modelValue.cantidadEmbalajes * props.modelValue.unidadesPorEmbalaje
    const recomendacion = await getRecomendacionMuestreo(tamanoLote)
    
    if (recomendacion) {
      recomendacionMuestreo.value = recomendacion
      // Auto-llenar con la cantidad recomendada (usuario puede modificar)
      if (recomendacion.plan.tamano_muestra && localData.value.cantidadMuestra === 0) {
        localData.value.cantidadMuestra = recomendacion.plan.tamano_muestra
      }
      toast.success('Recomendación calculada', `Tamaño de lote: ${tamanoLote} unidades`)
    } else {
      muestreoError.value = 'No se encontró un plan de muestreo para este tamaño de lote'
      toast.warning('Sin recomendación', 'No hay plan de muestreo disponible para este lote')
    }
  } catch {
    muestreoError.value = 'Error al calcular la recomendación de muestreo'
    toast.error('Error de muestreo', 'No se pudo obtener la recomendación')
  } finally {
    loadingMuestreo.value = false
  }
}

const handleNext = () => {
  if (canProceed.value) {
    emit('next')
  }
}
</script>