<template>
  <div class="bg-white shadow-lg rounded-lg overflow-hidden">
    <div class="bg-indigo-50 px-6 py-4 border-b border-indigo-100">
      <h2 class="text-xl font-semibold text-indigo-900">Paso 1: Datos Iniciales</h2>
      <p class="text-sm text-indigo-600 mt-1">Sube la imagen de etiqueta y especifica la cantidad de cajas</p>
    </div>
    
    <div class="p-6 space-y-6">
      <!-- File Upload -->
      <OrderImageUpload 
        v-model:file="localData.labelImage"
        v-model:preview="localData.labelImagePreview"
        @ocr-complete="handleOCRComplete"
      />
      
      <!-- Quantity Input -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          📦 Cantidad de unidades embalajes a analizar (cajas, bolsas, etc) *
        </label>
        <input 
          v-model.number="localData.boxQuantity"
          type="number" 
          min="1" 
          max="1000"
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Ej: 10"
          required
        >
        <p class="text-xs text-gray-500 mt-1">Cantidad de embalajes que se van a inspeccionar</p>
      </div>

      <!-- Navigation -->
      <div class="flex justify-end pt-6">
        <button 
          type="button"
          class="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="!canProceed"
          @click="handleNext"
        >
          Siguiente
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface StepData {
  labelImage: File | null
  labelImagePreview: string
  boxQuantity: number
}

interface Props {
  modelValue: any
}

interface Emits {
  (e: 'update:modelValue', value: any): void
  (e: 'next'): void
  (e: 'ocr-complete', data: any): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Local reactive copy
const localData = ref<StepData>({
  labelImage: props.modelValue.labelImage,
  labelImagePreview: props.modelValue.labelImagePreview,
  boxQuantity: props.modelValue.boxQuantity || 1
})

// Watch for changes and emit updates
watch(localData, (newValue) => {
  emit('update:modelValue', {
    ...props.modelValue,
    ...newValue
  })
}, { deep: true })

// Computed
const canProceed = computed(() => {
  return localData.value.labelImage && localData.value.boxQuantity > 0
})

// Methods
const handleNext = () => {
  if (canProceed.value) {
    emit('next')
  }
}

const handleOCRComplete = (ocrData: any) => {
  emit('ocr-complete', ocrData)
}
</script>