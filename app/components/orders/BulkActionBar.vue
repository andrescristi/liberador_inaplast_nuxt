<template>
  <Transition
    enter-active-class="transition ease-out duration-300"
    enter-from-class="opacity-0 translate-y-4"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 translate-y-4"
  >
    <div
      v-if="selectedCount > 0"
      class="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50"
    >
      <div class="bg-white rounded-lg shadow-xl border border-gray-200 px-6 py-4 flex items-center space-x-6">
        <!-- Contador de selección -->
        <div class="flex items-center space-x-2">
          <div class="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100">
            <Icon name="bx:check" class="w-5 h-5 text-blue-600" />
          </div>
          <span class="text-sm font-medium text-gray-700">
            {{ selectedCount }} {{ selectedCount === 1 ? 'orden seleccionada' : 'órdenes seleccionadas' }}
          </span>
        </div>

        <!-- Divisor -->
        <div class="h-8 w-px bg-gray-300" />

        <!-- Botón de descarga -->
        <button
          :disabled="isDownloading"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          @click="handleDownload"
        >
          <Icon
            :name="isDownloading ? 'bx:loader-alt' : 'bx:download'"
            class="w-4 h-4 mr-2"
            :class="{ 'animate-spin': isDownloading }"
          />
          {{ isDownloading ? 'Descargando...' : 'Descargar QRs' }}
        </button>

        <!-- Botón de limpiar selección -->
        <button
          :disabled="isDownloading"
          class="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          @click="handleClear"
        >
          <Icon name="bx:x" class="w-4 h-4 mr-1" />
          Limpiar
        </button>
      </div>

      <!-- Barra de progreso -->
      <Transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="isDownloading && downloadProgress > 0" class="mt-2 px-6">
          <div class="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              class="bg-blue-600 h-2 transition-all duration-300 ease-out"
              :style="{ width: `${downloadProgress}%` }"
            />
          </div>
          <p class="text-xs text-gray-600 mt-1 text-center">
            {{ downloadProgress }}% completado
          </p>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup lang="ts">
interface Props {
  selectedCount: number
  isDownloading: boolean
  downloadProgress: number
}

interface Emits {
  (event: 'download' | 'clear'): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const handleDownload = () => {
  emit('download')
}

const handleClear = () => {
  emit('clear')
}
</script>
