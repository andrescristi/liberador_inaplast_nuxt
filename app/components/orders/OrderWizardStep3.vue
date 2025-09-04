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
              class="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200"
            >
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
                    :class="localData.testResults[test.id] ? 'bg-blue-600' : 'bg-gray-300'"
                  >
                    <div 
                      class="bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out"
                      :class="localData.testResults[test.id] ? 'translate-x-5' : 'translate-x-0'"
                    />
                  </div>
                </label>
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
              class="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200"
            >
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
                    :class="localData.testResults[test.id] ? 'bg-green-600' : 'bg-gray-300'"
                  >
                    <div 
                      class="bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out"
                      :class="localData.testResults[test.id] ? 'translate-x-5' : 'translate-x-0'"
                    />
                  </div>
                </label>
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
            <span class="text-gray-600">Pruebas completadas:</span>
            <span class="font-medium">{{ completedTests }}/{{ totalTests }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Porcentaje de éxito:</span>
            <span class="font-medium" :class="successRate >= 75 ? 'text-green-600' : 'text-yellow-600'">
              {{ successRate }}%
            </span>
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
import { useTestsAPI } from '~/composables/tests/useTestsAPI'

// Define la estructura completa de datos de la orden
interface OrderData {
  // Step 1
  labelImage: File | null
  labelImagePreview: string
  cantidad_unidades: number
  
  // Step 2 - Campos requeridos por la API
  lote?: string
  cliente: string
  producto: string
  pedido: string
  fecha_fabricacion: string
  codigo_producto: string
  turno: string
  jefe_de_turno?: string
  orden_de_compra?: string
  numero_operario: string
  maquina: string
  inspector_calidad: string
  
  // Step 3 - Quality Tests
  testResults?: Record<number, boolean>
  qualityNotes?: string
  
  // Step 4 - Final Results
  finalResult?: 'approved' | 'rejected' | 'conditional'
  rejectionReason?: string
  recommendations?: string
}

interface StepData {
  testResults: Record<number, boolean>
  qualityNotes: string
}

interface Props {
  modelValue: OrderData
}

interface Emits {
  (e: 'update:modelValue', value: OrderData): void
  (e: 'next' | 'previous'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Composables
const { getAllTests } = useTestsAPI()

// State
const tests = ref<Test[]>([])
const loading = ref(true)

// Local reactive copy
const localData = ref<StepData>({
  testResults: props.modelValue?.testResults || {},
  qualityNotes: props.modelValue?.qualityNotes || ''
})

// Load tests on component mount
onMounted(async () => {
  try {
    tests.value = await getAllTests()
  } catch {
    // Error loading tests
  } finally {
    loading.value = false
  }
})

// Watch for changes and emit updates
watch(localData, (newValue) => {
  emit('update:modelValue', {
    ...(props.modelValue || {}),
    ...newValue
  })
}, { deep: true })

// Computed
const visualTests = computed(() => tests.value?.filter(test => test.type === 'visual') || [])

const functionalTests = computed(() => tests.value?.filter(test => test.type === 'funcional') || [])

const totalTests = computed(() => tests.value?.length || 0)

const completedTests = computed(() => {
  return Object.values(localData.value.testResults).filter(Boolean).length
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
const handleNext = () => {
  if (canProceed.value) {
    emit('next')
  }
}
</script>