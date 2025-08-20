<template>
  <div class="bg-white shadow-lg rounded-lg overflow-hidden">
    <div class="bg-indigo-50 px-6 py-4 border-b border-indigo-100">
      <h2 class="text-xl font-semibold text-indigo-900">Paso 3: Pruebas de Calidad</h2>
      <p class="text-sm text-indigo-600 mt-1">Registra los resultados de las pruebas realizadas</p>
    </div>
    
    <div class="p-6 space-y-6">
      <!-- Quality Tests Checklist -->
      <div>
        <h3 class="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <Icon name="bx:check-circle" class="w-5 h-5 mr-2 text-indigo-500" />
          Lista de Verificación de Calidad
        </h3>
        
        <div class="space-y-4">
          <div class="flex items-center">
            <input 
              id="packaging-test"
              v-model="localData.packagingTest"
              type="checkbox"
              class="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            >
            <label for="packaging-test" class="ml-3 text-sm font-medium text-gray-700">
              ✅ Prueba de Embalaje - Integridad del empaque
            </label>
          </div>
          
          <div class="flex items-center">
            <input 
              id="labeling-test"
              v-model="localData.labelingTest"
              type="checkbox"
              class="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            >
            <label for="labeling-test" class="ml-3 text-sm font-medium text-gray-700">
              🏷️ Prueba de Etiquetado - Correcta identificación del producto
            </label>
          </div>
          
          <div class="flex items-center">
            <input 
              id="sealing-test"
              v-model="localData.sealingTest"
              type="checkbox"
              class="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            >
            <label for="sealing-test" class="ml-3 text-sm font-medium text-gray-700">
              🔒 Prueba de Sellado - Hermeticidad del cierre
            </label>
          </div>
          
          <div class="flex items-center">
            <input 
              id="weight-test"
              v-model="localData.weightTest"
              type="checkbox"
              class="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            >
            <label for="weight-test" class="ml-3 text-sm font-medium text-gray-700">
              ⚖️ Prueba de Peso - Conformidad con especificaciones
            </label>
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
            <span class="font-medium">{{ completedTests }}/4</span>
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
interface StepData {
  packagingTest: boolean
  labelingTest: boolean
  sealingTest: boolean
  weightTest: boolean
  qualityNotes: string
}

interface Props {
  modelValue: any
}

interface Emits {
  (e: 'update:modelValue', value: any): void
  (e: 'next'): void
  (e: 'previous'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Local reactive copy
const localData = ref<StepData>({
  packagingTest: props.modelValue.packagingTest || false,
  labelingTest: props.modelValue.labelingTest || false,
  sealingTest: props.modelValue.sealingTest || false,
  weightTest: props.modelValue.weightTest || false,
  qualityNotes: props.modelValue.qualityNotes || ''
})

// Watch for changes and emit updates
watch(localData, (newValue) => {
  emit('update:modelValue', {
    ...props.modelValue,
    ...newValue
  })
}, { deep: true })

// Computed
const completedTests = computed(() => {
  const tests = [localData.value.packagingTest, localData.value.labelingTest, localData.value.sealingTest, localData.value.weightTest]
  return tests.filter(Boolean).length
})

const successRate = computed(() => {
  return Math.round((completedTests.value / 4) * 100)
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