<template>
  <ClientOnly>
    <!-- OCR Button -->
    <div v-if="imageFile && !processing && !isCompressing" class="mt-4">
      <button
        type="button"
        :disabled="processing || isCompressing"
        :class="[
          'w-full px-6 py-3 text-sm font-medium border border-transparent rounded-lg transition-all duration-200 flex items-center justify-center space-x-2',
          processing || isCompressing
            ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
            : 'text-white bg-indigo-600 hover:bg-indigo-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
        ]"
        @click="extractDataFromImage"
      >
        <Icon name="bx:scan" :class="['w-5 h-5', processing ? 'animate-spin' : '']" />
        <span>{{ processing ? 'Extrayendo datos...' : '🔍 Extraer datos con OCR' }}</span>
      </button>
    </div>

    <!-- Processing Progress -->
    <div v-if="processing || isCompressing" class="mt-4">
      <div class="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"/>
          </div>
          <div class="ml-3 flex-1">
            <h4 class="text-sm font-medium text-indigo-800">
              {{ isCompressing ? 'Comprimiendo imagen...' : 'Procesando con OCR...' }}
            </h4>
            <p class="text-sm text-indigo-600 mt-1">
              {{ isCompressing ? 'Optimizando para mejor reconocimiento' : 'Extrayendo datos de producción de la imagen' }}
            </p>
            <!-- Progress Bar -->
            <div v-if="isCompressing" class="mt-2">
              <div class="w-full bg-indigo-200 rounded-full h-2">
                <div 
                  class="bg-indigo-600 h-2 rounded-full transition-all duration-300" 
                  :style="`width: ${compressionProgress}%`" 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Message -->
    <div v-if="ocrSuccess && !processing" class="mt-4">
      <div class="bg-green-50 border border-green-200 rounded-lg p-4">
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <Icon name="bx:check-circle" class="w-6 h-6 text-green-500" />
          </div>
          <div class="ml-3">
            <h4 class="text-sm font-medium text-green-800">
              ¡Datos extraídos exitosamente!
            </h4>
            <p class="text-sm text-green-600 mt-1">
              Los campos del formulario han sido completados automáticamente. Puedes revisarlos y editarlos si es necesario.
            </p>
            <div class="mt-3">
              <button
                type="button"
                class="text-sm px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                @click="proceedToNextStep"
              >
                Continuar al siguiente paso →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error Display -->
    <div v-if="error && !processing" class="mt-4">
      <div class="bg-red-50 border border-red-200 rounded-lg p-4">
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <Icon name="bx:error-circle" class="w-6 h-6 text-red-500" />
          </div>
          <div class="ml-3">
            <h4 class="text-sm font-medium text-red-800">
              Error al procesar la imagen
            </h4>
            <p class="text-sm text-red-600 mt-1">
              {{ error }}
            </p>
            <div class="mt-3">
              <button
                type="button"
                class="text-sm px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                @click="clearError"
              >
                Intentar nuevamente
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Extracted Data Preview -->
    <div v-if="extractedData && !processing" class="mt-4">
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div class="flex items-center justify-between mb-3">
          <h4 class="text-sm font-medium text-blue-800 flex items-center">
            <Icon name="bx:data" class="w-4 h-4 mr-2" />
            Datos encontrados en la imagen
          </h4>
          <button
            class="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
            @click="showDataPreview = !showDataPreview"
          >
            {{ showDataPreview ? 'Ocultar' : 'Ver detalles' }}
          </button>
        </div>
        
        <div v-if="showDataPreview" class="space-y-2 text-sm">
          <div
v-for="(value, key) in filteredExtractedData"
:key="key"
class="flex justify-between">
            <span class="text-blue-600 font-medium">{{ getFieldLabel(key) }}:</span>
            <span class="text-blue-800">{{ value || 'No encontrado' }}</span>
          </div>
        </div>
      </div>
    </div>

    <template #fallback>
      <!-- Fallback durante SSR -->
      <div class="mt-4">
        <div class="w-full px-6 py-3 text-sm text-gray-500 bg-gray-50 border border-gray-300 rounded-lg text-center">
          Cargando funcionalidad OCR...
        </div>
      </div>
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
import { useToast } from '#app'

interface ProductionData {
  lote?: string
  cliente?: string
  producto?: string
  pedido?: string
  fechaFabricacion?: Date | string
  codigoProducto?: string
  turno?: string
  unidades?: string
  jefeTurno?: string
  ordenCompra?: string
  numeroOperario?: string
  maquina?: string
  inspectorCalidad?: string
}

interface OCRResponse {
  text: string
  productionData?: ProductionData
  success: boolean
  error?: string
  metadata?: {
    filename?: string
    processedAt: string
    model: string
  }
}

// Props
interface Props {
  imageFile: File | null
  disabled?: boolean
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  dataExtracted: [data: ProductionData]
  error: [error: string]
  success: []
}>()

// Composables
const toast = useToast()
const { isCompressing, compressionProgress, compressImage, needsCompression } = useImageCompression()

// State
const processing = ref(false)
const error = ref('')
const extractedData = ref<ProductionData | null>(null)
const ocrSuccess = ref(false)
const showDataPreview = ref(false)

// Estado para indicar si estamos en el cliente
const isClient = import.meta.client

// Computed
const filteredExtractedData = computed(() => {
  if (!extractedData.value) return {}
  
  // Filtrar solo los campos que tienen valor
  const filtered: Record<string, unknown> = {}
  Object.entries(extractedData.value).forEach(([key, value]) => {
    if (value && value !== null && value !== '') {
      filtered[key] = value
    }
  })
  return filtered
})

// Methods
const getFieldLabel = (key: string): string => {
  const labels: Record<string, string> = {
    lote: 'Lote',
    cliente: 'Cliente',
    producto: 'Producto',
    pedido: 'Pedido',
    fechaFabricacion: 'Fecha de Fabricación',
    codigoProducto: 'Código de Producto',
    turno: 'Turno',
    unidades: 'Unidades',
    jefeTurno: 'Jefe de Turno',
    ordenCompra: 'Orden de Compra',
    numeroOperario: 'N° Operario',
    maquina: 'Máquina',
    inspectorCalidad: 'Inspector de Calidad'
  }
  return labels[key] || key
}

const convertImageToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      // Extraer solo la parte base64 sin el prefijo data:image/...;base64,
      const splitResult = result.split(',')
      if (splitResult.length > 1 && splitResult[1]) {
        const base64Data = splitResult[1]
        resolve(base64Data)
      } else {
        reject(new Error('Formato de imagen inválido'))
      }
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

const extractDataFromImage = async () => {
  if (!props.imageFile || !isClient || processing.value || props.disabled) return
  
  processing.value = true
  error.value = ''
  extractedData.value = null
  ocrSuccess.value = false
  
  try {
    let fileToProcess = props.imageFile
    
    // Comprimir imagen si es necesario (mayor a 50KB)
    if (needsCompression(props.imageFile, 50)) {
      const compressionResult = await compressImage(props.imageFile, {
        targetSizeKB: 50,
        maxWidth: 1920,
        maxHeight: 1080,
        quality: 0.8
      })
      fileToProcess = compressionResult.compressedFile
    }
    
    // Convertir imagen a base64
    const imageData = await convertImageToBase64(fileToProcess)
    
    // Hacer llamada al endpoint de backend
    const response = await $fetch<OCRResponse>('/api/ocr/extract', {
      method: 'POST',
      body: {
        imageData,
        mimeType: fileToProcess.type,
        filename: fileToProcess.name
      }
    })
    
    if (response.success && response.productionData) {
      extractedData.value = response.productionData
      ocrSuccess.value = true
      
      // Emitir los datos extraídos
      emit('dataExtracted', response.productionData)
      emit('success')
      
      // Mostrar toast de éxito
      toast.success(
        'Datos extraídos correctamente', 
        'La información ha sido completada automáticamente en el formulario'
      )
      
    } else if (response.success && response.text) {
      // Si no hay datos estructurados pero sí texto, mostrar mensaje informativo
      error.value = 'Se extrajo texto pero no se encontraron datos de producción estructurados. Completa el formulario manualmente.'
      emit('error', error.value)
      
    } else {
      error.value = response.error || 'No se pudo extraer información de la imagen'
      emit('error', error.value)
    }
    
  } catch (err: unknown) {
    const errorObj = err as { statusCode?: number; statusMessage?: string }
    // eslint-disable-next-line no-console
    console.error('Error extracting data:', errorObj)
    
    // Manejar errores específicos del servidor
    if (errorObj.statusCode) {
      error.value = errorObj.statusMessage || `Error del servidor (${errorObj.statusCode})`
    } else {
      error.value = 'Error al procesar la imagen. Por favor intenta nuevamente.'
    }
    
    emit('error', error.value)
    
  } finally {
    processing.value = false
  }
}

const clearError = () => {
  error.value = ''
  extractedData.value = null
  ocrSuccess.value = false
}

const proceedToNextStep = () => {
  // Este método será llamado desde el componente padre
  emit('success')
}

// Watch para resetear estado cuando cambie la imagen
watch(() => props.imageFile, () => {
  clearError()
})
</script>

<style scoped>
/* Animaciones suaves para los componentes */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}
</style>