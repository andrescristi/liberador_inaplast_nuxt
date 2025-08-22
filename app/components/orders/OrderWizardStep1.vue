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
          class="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          :disabled="!canProceed || isProcessingOCR"
          @click="handleNext"
        >
          <Icon 
            v-if="isProcessingOCR" 
            name="bx:loader-alt" 
            class="w-4 h-4 mr-2 animate-spin" 
          />
          {{ isProcessingOCR ? 'Procesando OCR...' : 'Siguiente' }}
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

interface OCRData {
  customerName?: string
  customerCode?: string
  productName?: string
  productCode?: string
  lotNumber?: string
  expirationDate?: string
  productionDate?: string
}

interface Emits {
  (e: 'update:modelValue', value: any): void
  (e: 'next'): void
  (e: 'ocr-complete', data: OCRData): void
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

// State for tracking OCR processing
const isProcessingOCR = ref(false)
const ocrData = ref<OCRData | null>(null)

// Methods
const handleNext = async () => {
  if (!canProceed.value) return
  
  // If we have an image but no OCR data yet, process OCR first
  if (localData.value.labelImage && !ocrData.value) {
    isProcessingOCR.value = true
    
    try {
      // Trigger OCR processing automatically
      await processImageOCR()
      
      // After OCR completes, proceed to next step
      emit('next')
    } catch (_error) {
      // If OCR fails, still allow user to proceed
      const toast = useToast()
      toast.warning('OCR no completado', 'Puedes continuar y completar los datos manualmente')
      emit('next')
    } finally {
      isProcessingOCR.value = false
    }
  } else {
    // If no image or OCR already processed, proceed normally
    emit('next')
  }
}

const processImageOCR = async () => {
  if (!localData.value.labelImage) return
  
  try {
    // Mock OCR processing - replace with actual OCR service
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Mock OCR results
    const mockOcrData: OCRData = {
      customerName: 'Industrias Alimentarias S.A.',
      customerCode: 'CLI001',
      productName: 'Bolsa de Polietileno 25kg', 
      productCode: 'BOL25KG',
      lotNumber: 'LOT20241215001',
      expirationDate: '2025-06-15',
      productionDate: '2024-12-15'
    }
    
    ocrData.value = mockOcrData
    emit('ocr-complete', mockOcrData)
    
  } catch (error) {
    const toast = useToast()
    toast.error('Error OCR', 'No se pudieron extraer los datos de la imagen')
    throw error
  }
}

const handleOCRComplete = (extractedData: OCRData) => {
  ocrData.value = extractedData
  emit('ocr-complete', extractedData)
}
</script>