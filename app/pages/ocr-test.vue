<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">
          Extractor de Texto OCR - Prueba
        </h1>
        <p class="mt-2 text-lg text-gray-600">
          Prueba el componente de extracción de texto desde imágenes usando Tesseract.js
        </p>
      </div>
      
      <!-- OCR Component -->
      <ImageUploadOCR />
      
      <!-- Instructions -->
      <BaseCard class="mt-8">
        <template #header>
          <h2 class="text-lg font-medium text-gray-900">
            Instrucciones de Uso
          </h2>
        </template>
        
        <div class="space-y-4">
          <div class="flex items-start">
            <Icon name="bx:info-circle" class="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 class="font-medium text-gray-900">Cómo usar</h3>
              <p class="text-gray-600">
                Selecciona una imagen con texto o arrastra y suelta un archivo en la zona de carga.
                El componente procesará la imagen y extraerá el texto usando OCR.
              </p>
            </div>
          </div>
          
          <div class="flex items-start">
            <Icon name="bx:check-circle" class="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 class="font-medium text-gray-900">Formatos soportados</h3>
              <p class="text-gray-600">
                JPG, PNG, WEBP, BMP, GIF. Tamaño máximo: 10MB.
              </p>
            </div>
          </div>
          
          <div class="flex items-start">
            <Icon name="bx:bulb" class="w-5 h-5 text-yellow-500 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 class="font-medium text-gray-900">Mejores resultados</h3>
              <p class="text-gray-600">
                Para obtener mejores resultados, usa imágenes con texto claro, buen contraste y resolución alta.
                El sistema detecta texto en español e inglés.
              </p>
            </div>
          </div>
          
          <div class="flex items-start">
            <Icon name="bx:terminal" class="w-5 h-5 text-purple-500 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 class="font-medium text-gray-900">Resultado</h3>
              <p class="text-gray-600">
                El texto extraído se mostrará en la consola del navegador. 
                Abre las herramientas de desarrollador (F12) para ver el resultado completo.
              </p>
            </div>
          </div>
        </div>
      </BaseCard>
    </div>
  </div>
</template>

<script setup lang="ts">
// Import components explicitly
import ImageUploadOCR from '~/components/ui/ImageUploadOCR.vue'
import BaseCard from '~/components/ui/BaseCard.vue'

// Set page metadata
useSeoMeta({
  title: 'Extractor OCR - Prueba',
  description: 'Página de prueba para el componente de extracción de texto OCR'
})

// Define layout
definePageMeta({
  layout: 'default',
  auth: false // Deshabilitar autenticación para pruebas
})
</script>