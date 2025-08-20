<template>
  <div>
    <label class="block text-sm font-medium text-gray-700 mb-3">
      📄 Imagen de Etiqueta *
    </label>
    <div 
      class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-400 transition-colors cursor-pointer"
      @click="triggerFileInput"
      @drop="handleFileDrop"
      @dragover.prevent
      @dragenter.prevent
    >
      <input 
        ref="fileInput" 
        type="file" 
        accept="image/*" 
        class="hidden" 
        @change="handleFileSelect"
      >
      
      <!-- Empty State -->
      <div v-if="!file" class="space-y-3">
        <div class="mx-auto w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
          <Icon name="bx:camera" class="w-8 h-8 text-gray-400" />
        </div>
        <div>
          <span class="text-indigo-600 hover:text-indigo-800 font-medium">
            Haz clic para subir imagen
          </span>
          <p class="text-gray-500 text-sm mt-1">o arrastra y suelta aquí</p>
        </div>
        <p class="text-xs text-gray-400">PNG, JPG hasta 5MB</p>
      </div>
      
      <!-- Image Uploaded -->
      <div v-else class="space-y-3">
        <img
          :src="preview"
          alt="Label preview"
          class="mx-auto max-w-32 max-h-32 object-cover rounded-lg"
        >
        <p class="text-sm font-medium text-green-600">{{ file.name }}</p>
        <div class="flex justify-center space-x-3">
          <button 
            type="button" 
            class="text-indigo-600 hover:text-indigo-800 text-sm"
            @click.stop="removeImage"
          >
            Cambiar imagen
          </button>
          <span class="text-gray-300">|</span>
          <button 
            type="button" 
            :disabled="isProcessingOCR"
            :class="[
              'text-sm font-medium transition-colors',
              isProcessingOCR 
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-blue-600 hover:text-blue-800'
            ]"
            @click.stop="processImageOCR"
          >
            <Icon 
              :name="isProcessingOCR ? 'bx:loader-alt' : 'bx:brain'" 
              :class="['w-4 h-4 mr-1', { 'animate-spin': isProcessingOCR }]" 
            />
            {{ isProcessingOCR ? 'Procesando...' : 'Extraer datos con OCR' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  file: File | null
  preview: string
}

interface Emits {
  (e: 'update:file', file: File | null): void
  (e: 'update:preview', preview: string): void
  (e: 'ocr-complete', data: any): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Refs
const fileInput = ref<HTMLInputElement>()
const isProcessingOCR = ref(false)

// Methods
const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    processFile(file)
  }
}

const handleFileDrop = (event: DragEvent) => {
  event.preventDefault()
  const file = event.dataTransfer?.files[0]
  if (file) {
    processFile(file)
  }
}

const processFile = (file: File) => {
  // Validate file
  if (!file.type.startsWith('image/')) {
    const toast = useToast()
    toast.error('Error', 'Por favor selecciona un archivo de imagen válido')
    return
  }
  
  if (file.size > 5 * 1024 * 1024) { // 5MB
    const toast = useToast()
    toast.error('Error', 'El archivo es demasiado grande. Máximo 5MB.')
    return
  }

  // Create preview
  const reader = new FileReader()
  reader.onload = (e) => {
    const result = e.target?.result as string
    emit('update:file', file)
    emit('update:preview', result)
  }
  reader.readAsDataURL(file)
}

const removeImage = () => {
  emit('update:file', null)
  emit('update:preview', '')
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const processImageOCR = async () => {
  if (!props.file) return
  
  isProcessingOCR.value = true
  const toast = useToast()
  
  try {
    // Mock OCR processing - replace with actual OCR service
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Mock OCR results
    const ocrData = {
      customerName: 'Cliente Ejemplo',
      productName: 'Producto Ejemplo', 
      lotNumber: 'LOT123456',
      expirationDate: '2024-12-31'
    }
    
    emit('ocr-complete', ocrData)
    toast.success('OCR Completado', 'Datos extraídos exitosamente de la imagen')
    
  } catch (error) {
    if (import.meta.server) {
      const { $logger } = useNuxtApp()
      if ($logger && typeof ($logger as any).error === 'function') {
        ($logger as any).error({
          error: error instanceof Error ? error.message : String(error),
          context: 'OrderImageUpload.processImageOCR'
        }, 'Error processing OCR')
      }
    }
    toast.error('Error OCR', 'No se pudieron extraer los datos de la imagen')
  } finally {
    isProcessingOCR.value = false
  }
}
</script>