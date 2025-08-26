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
          v-model.number="boxQuantity"
          type="number" 
          min="1" 
          max="1000"
          class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          :class="{
            'border-red-300 focus:ring-red-500 focus:border-red-500': boxQuantityError,
            'border-gray-300': !boxQuantityError
          }"
          placeholder="Ej: 10"
          required
        >
        <p v-if="boxQuantityError" class="text-xs text-red-600 mt-1">{{ boxQuantityError }}</p>
        <p v-else class="text-xs text-gray-500 mt-1">Cantidad de embalajes que se van a inspeccionar</p>
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
          {{ isProcessingOCR ? `Procesando OCR${ocrAttempts > 0 ? ` (${ocrAttempts}/3)` : '...'}` : 'Siguiente' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { stepDataSchema, type StepData, type OrderData, type OCRData } from '~/schemas/order'
import { useField, useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'

interface Props {
  modelValue: OrderData
}

interface Emits {
  (e: 'update:modelValue', value: OrderData): void
  (e: 'next'): void
  (e: 'ocr-complete', data: OCRData): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Configuración de OCR
const { processOCRWithRetry, validateImageForOCR, useMockOCR } = useOCRConfig()
const toast = useToast()
const logger = useLogger('OrderWizardStep1')

// Configuración de validación con vee-validate y Zod
const validationSchema = toTypedSchema(stepDataSchema.pick({ boxQuantity: true }))

const { handleSubmit, errors, values } = useForm({
  validationSchema,
  initialValues: {
    boxQuantity: props.modelValue.boxQuantity || 1
  }
})

// Campos individuales para mejor control
const { value: boxQuantity, errorMessage: boxQuantityError } = useField('boxQuantity')

// Local reactive copy para datos no validados por el esquema
const localData = ref<Omit<StepData, 'boxQuantity'>>({
  labelImage: props.modelValue.labelImage,
  labelImagePreview: props.modelValue.labelImagePreview
})

// Watch para sincronizar cambios
watch([localData, values], ([localValue, formValues]) => {
  emit('update:modelValue', {
    ...props.modelValue,
    ...localValue,
    boxQuantity: formValues.boxQuantity || 1
  })
}, { deep: true })

// Computed
const canProceed = computed(() => {
  return localData.value.labelImage && 
         (values.boxQuantity || 0) > 0 && 
         Object.keys(errors.value).length === 0
})

// Estado para seguimiento de procesamiento OCR
const isProcessingOCR = ref(false)
const ocrData = ref<OCRData | null>(null)
const ocrAttempts = ref(0)
const ocrError = ref<string | null>(null)

// Métodos
const handleNext = handleSubmit(async () => {
  if (!canProceed.value) {
    logger.warn('Intento de proceder con datos inválidos')
    return
  }
  
  // Si tenemos imagen pero no datos OCR, procesar OCR primero
  if (localData.value.labelImage && !ocrData.value) {
    isProcessingOCR.value = true
    ocrError.value = null
    
    try {
      logger.info('Iniciando procesamiento OCR', {
        fileName: localData.value.labelImage.name,
        fileSize: localData.value.labelImage.size,
        useMock: useMockOCR.value
      })
      
      // Procesar OCR con reintentos
      await processImageOCR()
      
      logger.info('OCR completado exitosamente')
      emit('next')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido en OCR'
      logger.error('Error en procesamiento OCR', { error: errorMessage, attempts: ocrAttempts.value })
      ocrError.value = errorMessage
      
      // Mostrar opción de continuar sin OCR
      const shouldContinue = confirm(
        'El procesamiento OCR falló después de varios intentos. \n\n' +
        'Puedes continuar y completar los datos manualmente, o puedes cancelar para intentar con otra imagen. \n\n' +
        '¿Deseas continuar sin OCR?'
      )
      
      if (shouldContinue) {
        toast.warning('OCR no completado', 'Completa los datos manualmente en el siguiente paso')
        emit('next')
      } else {
        toast.info('Operación cancelada', 'Puedes intentar con otra imagen')
      }
    } finally {
      isProcessingOCR.value = false
    }
  } else {
    // Si no hay imagen o OCR ya procesado, proceder normalmente
    logger.info('Procediendo al siguiente paso sin OCR')
    emit('next')
  }
})

const processImageOCR = async () => {
  if (!localData.value.labelImage) {
    throw new Error('No hay imagen para procesar')
  }
  
  // Validar imagen antes de procesamiento
  const validation = validateImageForOCR(localData.value.labelImage)
  if (!validation.valid) {
    throw new Error(validation.error || 'Imagen no válida para OCR')
  }
  
  try {
    ocrAttempts.value = 0
    
    const extractedData = await processOCRWithRetry(
      localData.value.labelImage,
      (attempt, error) => {
        ocrAttempts.value = attempt
        logger.warn(`Reintento de OCR #${attempt}`, { error: error.message })
        toast.info(
          `Reintento ${attempt}/3`, 
          `OCR falló: ${error.message}. Reintentando...`
        )
      }
    )
    
    ocrData.value = extractedData
    emit('ocr-complete', extractedData)
    
    logger.info('Datos OCR extraídos', {
      customerName: extractedData.customerName,
      productCode: extractedData.productCode,
      lotNumber: extractedData.lotNumber
    })
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido en OCR'
    logger.error('Fallo definitivo de OCR', {
      error: errorMessage,
      attempts: ocrAttempts.value,
      fileName: localData.value.labelImage.name
    })
    
    toast.error(
      'Error de OCR', 
      `No se pudieron extraer los datos después de ${ocrAttempts.value} intentos: ${errorMessage}`
    )
    
    throw error
  }
}

const handleOCRComplete = (extractedData: OCRData) => {
  ocrData.value = extractedData
  emit('ocr-complete', extractedData)
}
</script>