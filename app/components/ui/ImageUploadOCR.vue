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
        <div v-if="processing || isCompressing" class="mb-4">
          <div class="flex items-center justify-center">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"/>
          </div>
        </div>

        <!-- Text Content -->
        <div class="text-center">
          <p v-if="!processing && !isCompressing" class="text-lg font-medium text-gray-900 mb-2">
            {{ isDragOver ? 'Suelta la imagen aquí' : 'Selecciona una imagen para extraer texto' }}
          </p>
          
          <p v-if="isCompressing" class="text-lg font-medium text-indigo-600 mb-2">
            Comprimiendo imagen...
          </p>
          
          <p v-if="processing" class="text-lg font-medium text-indigo-600 mb-2">
            Procesando imagen...
          </p>
          
          <p v-if="!processing && !isCompressing" class="text-sm text-gray-500 mb-4">
            Arrastra y suelta una imagen o haz clic para seleccionar
          </p>
          
          <!-- Compression Progress -->
          <div v-if="isCompressing" class="mb-4">
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div 
                class="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                :style="`width: ${compressionProgress}%`" 
              />
            </div>
            <p class="text-sm text-gray-600 mt-2">
              Reduciendo tamaño a 50 KB...
            </p>
          </div>
          
          <!-- Processing Progress -->
          <div v-if="processing && !isCompressing" class="mb-4">
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div class="bg-indigo-600 h-2 rounded-full transition-all duration-300 animate-pulse" style="width: 100%" />
            </div>
            <p class="text-sm text-gray-600 mt-2">
              Analizando imagen con Gemini AI...
            </p>
          </div>

          <!-- Supported formats -->
          <p v-if="!processing && !isCompressing" class="text-xs text-gray-400">
            Formatos soportados: JPG, PNG, WEBP, BMP, GIF (se comprimirán automáticamente a 50 KB)
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
          v-if="!processing && !isCompressing"
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
        
        <!-- Compression Info -->
        <div v-if="compressionInfo" class="mt-2 p-2 bg-green-50 border border-green-200 rounded text-green-700">
          <p class="flex items-center">
            <Icon name="bx:compress" class="w-4 h-4 mr-1" />
            <strong>Compresión aplicada:</strong>
          </p>
          <p class="text-xs ml-5 mt-1">
            Tamaño original: {{ formatFileSize(compressionInfo.originalSize) }} →
            Comprimido: {{ formatFileSize(compressionInfo.compressedSize) }}
            ({{ compressionInfo.compressionRatio }}% reducido)
          </p>
        </div>
      </div>
    </div>

    <!-- Action Button -->
    <div v-if="selectedFile && !processing && !isCompressing" class="mt-6">
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
      
      <!-- Display production data table if available -->
      <div v-if="productionData" class="mt-4">
        <div class="flex items-center justify-between mb-3">
          <h4 class="text-sm font-medium text-gray-900 flex items-center">
            <Icon name="bx:table" class="w-4 h-4 mr-2" />
            Datos de Producción
          </h4>
          <button
            class="text-xs px-2 py-1 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 transition-colors flex items-center"
            @click="copyToClipboard"
          >
            <Icon name="bx:copy" class="w-3 h-3 mr-1" />
            Copiar Datos
          </button>
        </div>
        
        <div class="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Campo
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-if="productionData.lote" class="hover:bg-gray-50">
                  <td class="px-4 py-3 text-sm font-medium text-gray-900">Lote</td>
                  <td class="px-4 py-3 text-sm text-gray-700">{{ productionData.lote }}</td>
                </tr>
                <tr v-if="productionData.cliente" class="hover:bg-gray-50">
                  <td class="px-4 py-3 text-sm font-medium text-gray-900">Cliente</td>
                  <td class="px-4 py-3 text-sm text-gray-700">{{ productionData.cliente }}</td>
                </tr>
                <tr v-if="productionData.producto" class="hover:bg-gray-50">
                  <td class="px-4 py-3 text-sm font-medium text-gray-900">Producto</td>
                  <td class="px-4 py-3 text-sm text-gray-700">{{ productionData.producto }}</td>
                </tr>
                <tr v-if="productionData.pedido" class="hover:bg-gray-50">
                  <td class="px-4 py-3 text-sm font-medium text-gray-900">Pedido</td>
                  <td class="px-4 py-3 text-sm text-gray-700">{{ productionData.pedido }}</td>
                </tr>
                <tr v-if="productionData.fechaFabricacion" class="hover:bg-gray-50">
                  <td class="px-4 py-3 text-sm font-medium text-gray-900">Fecha de Fabricación</td>
                  <td class="px-4 py-3 text-sm text-gray-700">{{ productionData.fechaFabricacion }}</td>
                </tr>
                <tr v-if="productionData.codigoProducto" class="hover:bg-gray-50">
                  <td class="px-4 py-3 text-sm font-medium text-gray-900">Código de Producto</td>
                  <td class="px-4 py-3 text-sm text-gray-700">{{ productionData.codigoProducto }}</td>
                </tr>
                <tr v-if="productionData.turno" class="hover:bg-gray-50">
                  <td class="px-4 py-3 text-sm font-medium text-gray-900">Turno</td>
                  <td class="px-4 py-3 text-sm text-gray-700">{{ productionData.turno }}</td>
                </tr>
                <tr v-if="productionData.unidades" class="hover:bg-gray-50">
                  <td class="px-4 py-3 text-sm font-medium text-gray-900">Unidades</td>
                  <td class="px-4 py-3 text-sm text-gray-700">{{ productionData.unidades }}</td>
                </tr>
                <tr v-if="productionData.jefeTurno" class="hover:bg-gray-50">
                  <td class="px-4 py-3 text-sm font-medium text-gray-900">Jefe de Turno</td>
                  <td class="px-4 py-3 text-sm text-gray-700">{{ productionData.jefeTurno }}</td>
                </tr>
                <tr v-if="productionData.ordenCompra" class="hover:bg-gray-50">
                  <td class="px-4 py-3 text-sm font-medium text-gray-900">Orden de Compra</td>
                  <td class="px-4 py-3 text-sm text-gray-700">{{ productionData.ordenCompra }}</td>
                </tr>
                <tr v-if="productionData.numeroOperario" class="hover:bg-gray-50">
                  <td class="px-4 py-3 text-sm font-medium text-gray-900">Nº Operario</td>
                  <td class="px-4 py-3 text-sm text-gray-700">{{ productionData.numeroOperario }}</td>
                </tr>
                <tr v-if="productionData.maquina" class="hover:bg-gray-50">
                  <td class="px-4 py-3 text-sm font-medium text-gray-900">Máquina</td>
                  <td class="px-4 py-3 text-sm text-gray-700">{{ productionData.maquina }}</td>
                </tr>
                <tr v-if="productionData.inspectorCalidad" class="hover:bg-gray-50">
                  <td class="px-4 py-3 text-sm font-medium text-gray-900">Inspector de Calidad</td>
                  <td class="px-4 py-3 text-sm text-gray-700">{{ productionData.inspectorCalidad }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <!-- Display raw text if no production data -->
      <div v-else class="mt-4 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
        <div class="flex items-center justify-between mb-3">
          <h4 class="text-sm font-medium text-gray-900 flex items-center">
            <Icon name="bx:text" class="w-4 h-4 mr-2" />
            Texto Extraído
          </h4>
          <button
            class="text-xs px-2 py-1 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 transition-colors flex items-center"
            @click="copyToClipboard"
          >
            <Icon name="bx:copy" class="w-3 h-3 mr-1" />
            Copiar
          </button>
        </div>
        <div class="max-h-40 overflow-y-auto bg-gray-50 p-3 rounded border text-sm text-gray-700 font-mono whitespace-pre-wrap">{{ extractedText }}</div>
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
import BaseCard from '~/components/ui/BaseCard.vue'
import BaseButton from '~/components/ui/BaseButton.vue'
import BaseAlert from '~/components/ui/BaseAlert.vue'

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

// Reactive state - Inicializar con valores consistentes para SSR
const dropZone = ref<HTMLElement>()
const fileInput = ref<HTMLInputElement>()
const previewImage = ref<HTMLImageElement>()

// Estados que deben ser consistentes entre servidor y cliente
const isDragOver = ref(false)
const selectedFile = ref<File | null>(null)
const previewUrl = ref<string>('')
const processing = ref(false)
const error = ref<string>('')
const extractedText = ref<string>('')
const productionData = ref<ProductionData | null>(null)
const compressionInfo = ref<{ originalSize: number; compressedSize: number; compressionRatio: number } | null>(null)

// Estado para indicar si estamos en el cliente
const isClient = import.meta.client

// Composable de compresión de imágenes
const { isCompressing, compressionProgress, compressImage, needsCompression, formatFileSize } = useImageCompression()

// Computed
const dropZoneClasses = computed(() => {
  const base = 'relative border-2 border-dashed rounded-lg cursor-pointer transition-all duration-300 hover:border-indigo-400 hover:bg-indigo-50'
  
  if (processing.value || isCompressing.value) {
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
  if (!processing.value && !isCompressing.value) {
    fileInput.value?.click()
  }
}

const handleDragOver = (event: DragEvent) => {
  if (processing.value || isCompressing.value) return
  event.preventDefault()
  isDragOver.value = true
}

const handleDragLeave = (event: DragEvent) => {
  if (processing.value || isCompressing.value) return
  event.preventDefault()
  isDragOver.value = false
}

const handleDrop = (event: DragEvent) => {
  if (processing.value || isCompressing.value) return
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

const selectFile = async (file: File) => {
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
  
  // Clear previous errors and data
  error.value = ''
  extractedText.value = ''
  compressionInfo.value = null
  
  try {
    let fileToUse = file
    
    // Comprimir imagen si es necesario (mayor a 50KB)
    if (needsCompression(file, 50)) {
      const compressionResult = await compressImage(file, {
        targetSizeKB: 50,
        maxWidth: 1920,
        maxHeight: 1080,
        quality: 0.8
      })
      
      fileToUse = compressionResult.compressedFile
      compressionInfo.value = {
        originalSize: compressionResult.originalSize,
        compressedSize: compressionResult.compressedSize,
        compressionRatio: compressionResult.compressionRatio
      }
    }
    
    selectedFile.value = fileToUse
    
    // Create preview URL - solo en cliente
    if (previewUrl.value) {
      URL.revokeObjectURL(previewUrl.value)
    }
    previewUrl.value = URL.createObjectURL(fileToUse)
    
  } catch (compressionError: any) {
    error.value = `Error al comprimir la imagen: ${compressionError.message}`
    selectedFile.value = null
  }
}

const clearSelection = () => {
  selectedFile.value = null
  extractedText.value = ''
  productionData.value = null
  error.value = ''
  compressionInfo.value = null
  
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


const copyToClipboard = async () => {
  if (!extractedText.value) return
  
  try {
    await navigator.clipboard.writeText(extractedText.value)
    // Texto copiado exitosamente
  } catch (err) {
    // Fallback para navegadores que no soportan clipboard API
    const textArea = document.createElement('textarea')
    textArea.value = extractedText.value
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    // Texto copiado exitosamente (fallback)
  }
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

const processImage = async () => {
  if (!selectedFile.value || !isClient) return
  
  processing.value = true
  error.value = ''
  extractedText.value = ''
  productionData.value = null
  
  try {
    
    // Convertir imagen a base64
    const imageData = await convertImageToBase64(selectedFile.value)
    
    // Hacer llamada al endpoint de backend
    const response = await $fetch<OCRResponse>('/api/ocr/extract', {
      method: 'POST',
      body: {
        imageData,
        mimeType: selectedFile.value.type,
        filename: selectedFile.value.name
      }
    })
    
    if (response.success && response.text) {
      extractedText.value = response.text.trim()
      productionData.value = response.productionData || null
      
    } else {
        error.value = response.error || 'No se pudo extraer texto de la imagen. Verifica que la imagen contenga texto legible.'
    }
    
  } catch (err: any) {
    
    // Manejar errores específicos del servidor
    if (err.statusCode) {
      error.value = err.statusMessage || `Error del servidor (${err.statusCode})`
    } else {
      error.value = 'Error al procesar la imagen. Por favor intenta nuevamente.'
    }
  } finally {
    processing.value = false
  }
}

// Cleanup on unmount - solo en cliente
onUnmounted(() => {
  if (isClient) {
    if (previewUrl.value) {
      URL.revokeObjectURL(previewUrl.value)
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