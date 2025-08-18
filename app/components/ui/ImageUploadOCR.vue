<template>
  <ClientOnly>
    <BaseCard :padding="'md'">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-medium text-gray-900">
            Extractor de Texto desde Imágenes
          </h3>
          <Icon 
            name="bx:scan" 
            class="w-6 h-6 text-indigo-500" 
          />
        </div>
      </template>

    <!-- Zona de Arrastrar y Soltar -->
    <div 
      ref="dropZone"
      :class="dropZoneClasses"
      @dragover.prevent="handleDragOver"
      @dragleave.prevent="handleDragLeave"
      @drop.prevent="handleDrop"
      @click="triggerFileInput"
    >
      <!-- Icono y Texto Principal -->
      <div class="flex flex-col items-center justify-center py-8">
        <div v-if="!processing" class="mb-4">
          <Icon 
            :name="isDragOver ? 'bx:cloud-upload' : 'bx:image-add'" 
            :class="[
              'w-12 h-12 transition-all duration-300',
              isDragOver ? 'text-indigo-500 scale-110' : 'text-gray-400'
            ]"
          />
        </div>
        
        <!-- Loading Animation -->
        <div v-if="processing" class="mb-4">
          <div class="flex items-center justify-center">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"/>
          </div>
        </div>

        <!-- Text Content -->
        <div class="text-center">
          <p v-if="!processing" class="text-lg font-medium text-gray-900 mb-2">
            {{ isDragOver ? 'Suelta la imagen aquí' : 'Selecciona una imagen para extraer texto' }}
          </p>
          
          <p v-if="processing" class="text-lg font-medium text-indigo-600 mb-2">
            Procesando imagen...
          </p>
          
          <p v-if="!processing" class="text-sm text-gray-500 mb-4">
            Arrastra y suelta una imagen o haz clic para seleccionar
          </p>
          
          <div v-if="processing && progressData" class="mb-4">
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div 
                class="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                :style="{ width: `${progressData.progress * 100}%` }"
              />
            </div>
            <p class="text-sm text-gray-600 mt-2">
              {{ progressData.status }}
            </p>
          </div>

          <!-- Supported formats -->
          <p v-if="!processing" class="text-xs text-gray-400">
            Formatos soportados: JPG, PNG, WEBP, BMP, GIF
          </p>
        </div>
      </div>

      <!-- File Input -->
      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        class="hidden"
        @change="handleFileSelect"
      >
    </div>

    <!-- Preview Section -->
    <div v-if="selectedFile" class="mt-6">
      <h4 class="text-md font-medium text-gray-900 mb-3">
        Imagen Seleccionada
      </h4>
      
      <div class="relative">
        <img 
          ref="previewImage"
          :src="previewUrl" 
          :alt="selectedFile.name"
          class="max-w-full h-auto max-h-64 mx-auto rounded-lg border border-gray-200 shadow-sm"
        >
        
        <!-- Remove Button -->
        <BaseButton
          v-if="!processing"
          variant="solid"
          color="secondary"
          size="sm"
          class="absolute top-2 right-2"
          @click="clearSelection"
        >
          <Icon name="bx:x" class="w-4 h-4" />
        </BaseButton>
      </div>

      <!-- File Info -->
      <div class="mt-3 text-sm text-gray-600">
        <p><strong>Nombre:</strong> {{ selectedFile.name }}</p>
        <p><strong>Tamaño:</strong> {{ formatFileSize(selectedFile.size) }}</p>
        <p><strong>Tipo:</strong> {{ selectedFile.type }}</p>
      </div>
    </div>

    <!-- Action Button -->
    <div v-if="selectedFile && !processing" class="mt-6">
      <BaseButton
        variant="solid"
        color="primary"
        size="lg"
        block
        :loading="processing"
        @click="processImage"
      >
        <Icon name="bx:scan" class="w-5 h-5 mr-2" />
        Extraer Texto de la Imagen
      </BaseButton>
    </div>

    <!-- Error Display -->
    <div v-if="error" class="mt-6">
      <BaseAlert variant="error">
        <template #title>Error de Procesamiento</template>
        <p>{{ error }}</p>
      </BaseAlert>
    </div>

    <!-- Success Display -->
    <div v-if="extractedText && !processing" class="mt-6">
      <BaseAlert 
        variant="success"
        title="Texto Extraído Exitosamente"
        :description="`Se encontraron ${extractedText.length} caracteres de texto.`"
      />
      
      <!-- Display extracted text -->
      <div class="mt-4 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
        <div class="flex items-center justify-between mb-3">
          <h4 class="text-sm font-medium text-gray-900 flex items-center">
            <Icon name="bx:text" class="w-4 h-4 mr-2" />
            Texto Extraído
          </h4>
          <button
            @click="copyToClipboard"
            class="text-xs px-2 py-1 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 transition-colors flex items-center"
          >
            <Icon name="bx:copy" class="w-3 h-3 mr-1" />
            Copiar
          </button>
        </div>
        <div class="max-h-40 overflow-y-auto bg-gray-50 p-3 rounded border text-sm text-gray-700 font-mono whitespace-pre-wrap">{{ extractedText }}</div>
      </div>
      
      <!-- Console info -->
      <div class="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <p class="text-xs text-blue-600">
          <Icon name="bx:info-circle" class="w-3 h-3 inline mr-1" />
          El texto también está disponible en la consola del navegador (F12).
        </p>
      </div>
    </div>
    </BaseCard>
    <template #fallback>
      <!-- Fallback durante SSR -->
      <BaseCard :padding="'md'">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium text-gray-900">
              Extractor de Texto desde Imágenes
            </h3>
            <Icon 
              name="bx:scan" 
              class="w-6 h-6 text-indigo-500" 
            />
          </div>
        </template>
        
        <div class="text-center py-8">
          <div class="mb-4">
            <Icon 
              name="bx:image-add" 
              class="w-12 h-12 text-gray-400 mx-auto"
            />
          </div>
          <p class="text-lg font-medium text-gray-900 mb-2">
            Cargando extractor de texto...
          </p>
          <p class="text-sm text-gray-500">
            El componente se está iniciando
          </p>
        </div>
      </BaseCard>
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
import { createWorker, PSM, type Worker } from 'tesseract.js'
import BaseCard from '~/components/ui/BaseCard.vue'
import BaseButton from '~/components/ui/BaseButton.vue'
import BaseAlert from '~/components/ui/BaseAlert.vue'

interface ProgressData {
  progress: number
  status: string
}

// Reactive state - Inicializar con valores consistentes para SSR
const dropZone = ref<HTMLElement>()
const fileInput = ref<HTMLInputElement>()
const previewImage = ref<HTMLImageElement>()

// Estados que deben ser consistentes entre servidor y cliente
const isDragOver = ref(false)
const selectedFile = ref<File | null>(null)
const previewUrl = ref<string>('')
const processing = ref(false)
const progressData = ref<ProgressData | null>(null)
const error = ref<string>('')
const extractedText = ref<string>('')

// Estado para indicar si estamos en el cliente
const isClient = import.meta.client

// Tesseract worker
const tesseractWorker = ref<Worker | null>(null)

// Computed
const dropZoneClasses = computed(() => {
  const base = 'relative border-2 border-dashed rounded-lg cursor-pointer transition-all duration-300 hover:border-indigo-400 hover:bg-indigo-50'
  
  if (processing.value) {
    return `${base} border-indigo-300 bg-indigo-50 cursor-not-allowed`
  }
  
  if (isDragOver.value) {
    return `${base} border-indigo-500 bg-indigo-100`
  }
  
  if (selectedFile.value) {
    return `${base} border-green-300 bg-green-50`
  }
  
  return `${base} border-gray-300 bg-gray-50`
})

// Methods
const triggerFileInput = () => {
  if (!processing.value) {
    fileInput.value?.click()
  }
}

const handleDragOver = (event: DragEvent) => {
  if (processing.value) return
  event.preventDefault()
  isDragOver.value = true
}

const handleDragLeave = (event: DragEvent) => {
  if (processing.value) return
  event.preventDefault()
  isDragOver.value = false
}

const handleDrop = (event: DragEvent) => {
  if (processing.value) return
  event.preventDefault()
  isDragOver.value = false
  
  const files = event.dataTransfer?.files
  if (files && files.length > 0) {
    const file = files[0]
    if (file) {
      selectFile(file)
    }
  }
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files
  
  if (files && files.length > 0) {
    const file = files[0]
    if (file) {
      selectFile(file)
    }
  }
}

const selectFile = (file: File) => {
  // Solo ejecutar en el cliente
  if (!isClient) return
  
  // Validate file type
  if (!file.type.startsWith('image/')) {
    error.value = 'Por favor selecciona un archivo de imagen válido'
    return
  }
  
  // Validate file size (max 10MB)
  const maxSize = 10 * 1024 * 1024 // 10MB
  if (file.size > maxSize) {
    error.value = 'El archivo es demasiado grande. El tamaño máximo permitido es 10MB'
    return
  }
  
  // Clear previous errors
  error.value = ''
  extractedText.value = ''
  
  selectedFile.value = file
  
  // Create preview URL - solo en cliente
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
  }
  previewUrl.value = URL.createObjectURL(file)
}

const clearSelection = () => {
  selectedFile.value = null
  extractedText.value = ''
  error.value = ''
  
  // Solo ejecutar operaciones de DOM en el cliente
  if (isClient) {
    if (previewUrl.value) {
      URL.revokeObjectURL(previewUrl.value)
      previewUrl.value = ''
    }
    
    if (fileInput.value) {
      fileInput.value.value = ''
    }
  }
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const copyToClipboard = async () => {
  if (!extractedText.value) return
  
  try {
    await navigator.clipboard.writeText(extractedText.value)
    // Aquí podrías agregar una notificación de éxito si tienes un sistema de toasts
    console.log('Texto copiado al portapapeles')
  } catch (err) {
    // Fallback para navegadores que no soportan clipboard API
    const textArea = document.createElement('textarea')
    textArea.value = extractedText.value
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    console.log('Texto copiado al portapapeles (fallback)')
  }
}

const initWorker = async (): Promise<Worker> => {
  if (!tesseractWorker.value) {
    console.log('Inicializando Tesseract.js worker...')
    
    // Crear worker con configuración optimizada para calidad
    tesseractWorker.value = await createWorker(['eng', 'spa'], 1, {
      logger: (m) => {
        console.log('Tesseract:', m)
        
        if (m.status && m.progress !== undefined) {
          progressData.value = {
            status: getSpanishStatus(m.status),
            progress: m.progress
          }
        }
      },
      // Usar datos de idioma optimizados para calidad (por defecto)
      langPath: 'https://tessdata.projectnaptha.com/4.0.0_best',
    })
    
    // Configurar parámetros para mejor calidad
    await tesseractWorker.value.setParameters({
      tessedit_pageseg_mode: PSM.AUTO_OSD, // Detección automática de orientación y script
      preserve_interword_spaces: '1', // Preservar espacios entre palabras
      user_defined_dpi: '300', // DPI alto para mejor calidad
    })
    
    console.log('Worker inicializado correctamente')
  }
  
  return tesseractWorker.value
}

const getSpanishStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    'initializing api': 'Inicializando API...',
    'initialized api': 'API inicializada',
    'loading language traineddata': 'Cargando datos de idioma...',
    'loaded language traineddata': 'Datos de idioma cargados',
    'initializing tesseract': 'Inicializando Tesseract...',
    'initialized tesseract': 'Tesseract inicializado',
    'recognizing text': 'Reconociendo texto...',
    'recognized text': 'Texto reconocido'
  }
  
  return statusMap[status] || status
}

const processImage = async () => {
  if (!selectedFile.value || !isClient) return
  
  processing.value = true
  error.value = ''
  progressData.value = null
  
  try {
    console.log('Iniciando procesamiento de imagen:', selectedFile.value.name)
    
    // Initialize worker
    const worker = await initWorker()
    
    // Process the image
    const { data: { text } } = await worker.recognize(selectedFile.value)
    
    extractedText.value = text.trim()
    
    // Log the extracted text to console
    console.log('=== TEXTO EXTRAÍDO ===')
    console.log('Archivo:', selectedFile.value.name)
    console.log('Texto encontrado:')
    console.log(text)
    console.log('====================')
    
    if (!extractedText.value) {
      console.warn('No se encontró texto en la imagen')
      error.value = 'No se pudo extraer texto de la imagen. Verifica que la imagen contenga texto legible.'
    } else {
      console.log(`Extracción exitosa: ${extractedText.value.length} caracteres encontrados`)
    }
    
  } catch (err) {
    console.error('Error durante el procesamiento:', err)
    error.value = 'Error al procesar la imagen. Por favor intenta nuevamente.'
  } finally {
    processing.value = false
    progressData.value = null
  }
}

// Cleanup on unmount - solo en cliente
onUnmounted(() => {
  if (isClient) {
    if (previewUrl.value) {
      URL.revokeObjectURL(previewUrl.value)
    }
    
    if (tesseractWorker.value) {
      tesseractWorker.value.terminate()
      tesseractWorker.value = null
    }
  }
})
</script>

<style scoped>
/* Custom styles for enhanced UX */
.drop-zone-active {
  transform: scale(1.02);
}
</style>