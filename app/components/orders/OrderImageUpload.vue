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
      
      <!-- Loading State -->
      <div v-if="isProcessing || isCompressing" class="space-y-3">
        <div class="mx-auto w-16 h-16 bg-indigo-100 rounded-lg flex items-center justify-center animate-pulse">
          <Icon name="bx:loader-alt" class="w-8 h-8 text-indigo-600 animate-spin" />
        </div>
        <div>
          <span class="text-indigo-600 font-medium">
            {{ isProcessing ? 'Procesando imagen...' : 'Optimizando imagen...' }}
          </span>
          <p class="text-gray-500 text-sm mt-1">Por favor espere</p>
        </div>
      </div>
      
      <!-- Empty State -->
      <div v-else-if="!file" class="space-y-3">
        <div class="mx-auto w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
          <Icon name="bx:camera" class="w-8 h-8 text-gray-400" />
        </div>
        <div>
          <span class="text-indigo-600 hover:text-indigo-800 font-medium">
            Haz clic para subir imagen
          </span>
          <p class="text-gray-500 text-sm mt-1">o arrastra y suelta aquí</p>
        </div>
        <p class="text-xs text-gray-400">PNG, JPG hasta 50MB (se optimizará automáticamente)</p>
      </div>
      
      <!-- Image Uploaded -->
      <div v-else class="space-y-3">
        <img
          :src="preview"
          alt="Label preview"
          class="mx-auto max-w-32 max-h-32 object-cover rounded-lg"
        >
        <p class="text-sm font-medium text-green-600">{{ file.name }}</p>
        <div class="flex justify-center">
          <button 
            type="button" 
            class="text-indigo-600 hover:text-indigo-800 text-sm"
            @click.stop="removeImage"
          >
            Cambiar imagen
          </button>
        </div>
        <p class="text-xs text-gray-500 mt-2 text-center">
          Los datos se extraerán automáticamente al presionar "Siguiente"
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { OCRData } from '~/schemas/orders/ocr'

interface Props {
  file: File | null
  preview: string
}

interface Emits {
  (e: 'update:file', file: File | null): void
  (e: 'update:preview', preview: string): void
  (e: 'ocr-complete', data: OCRData): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

// Composables
const { compressImage, needsCompression, formatFileSize, isCompressing } = useImageCompression()
const toast = useToast()

// Refs
const fileInput = ref<HTMLInputElement>()
const isProcessing = ref(false)

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

const processFile = async (file: File) => {
  // Validate file type
  if (!file.type.startsWith('image/')) {
    toast.error('Error', 'Por favor selecciona un archivo de imagen válido')
    return
  }
  
  if (file.size > 50 * 1024 * 1024) { // 50MB limit
    toast.error('Error', 'El archivo es demasiado grande. Máximo 50MB.')
    return
  }

  isProcessing.value = true
  
  try {
    let processedFile = file
    
    // Comprimir imagen si es necesaria (mayor a 200KB para OCR óptimo)
    if (needsCompression(file, 200)) {
      console.log(`📸 Imagen original: ${formatFileSize(file.size)} - Comprimiendo para OCR...`)
      
      const compressionResult = await compressImage(file, {
        targetSizeKB: 200, // Target 200KB para balance OCR/velocidad
        maxWidth: 1920,
        maxHeight: 1080,
        quality: 0.85,
        mimeType: 'image/jpeg'
      })
      
      processedFile = compressionResult.compressedFile
      
      console.log(`✅ Imagen comprimida: ${formatFileSize(processedFile.size)} (${compressionResult.compressionRatio}% reducción)`)
      
      // Mostrar notificación de compresión exitosa
      if (compressionResult.compressionRatio > 50) {
        toast.success(
          'Imagen optimizada',
          `Tamaño reducido ${compressionResult.compressionRatio}% para mejor rendimiento`
        )
      }
    }

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      emit('update:file', processedFile)
      emit('update:preview', result)
    }
    reader.readAsDataURL(processedFile)
    
  } catch (error) {
    console.error('Error procesando imagen:', error)
    toast.error(
      'Error de procesamiento',
      error instanceof Error ? error.message : 'Error desconocido al procesar la imagen'
    )
  } finally {
    isProcessing.value = false
  }
}

const removeImage = () => {
  emit('update:file', null)
  emit('update:preview', '')
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

</script>