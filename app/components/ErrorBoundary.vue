<template>
  <div v-if="hasError" class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <Icon name="bx:error-circle" class="mx-auto h-12 w-12 text-red-500" />
        <h2 class="mt-6 text-3xl font-extrabold text-gray-900">
          ¡Oops! Algo salió mal
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          Ha ocurrido un error inesperado en la aplicación.
        </p>
      </div>
      
      <div class="bg-white shadow rounded-lg p-6">
        <div class="space-y-4">
          <div v-if="showDetails">
            <h3 class="text-lg font-medium text-gray-900 mb-2">Detalles del Error</h3>
            <div class="bg-red-50 border border-red-200 rounded-md p-3">
              <p class="text-sm text-red-800 font-mono">{{ errorInfo.message }}</p>
              <details v-if="errorInfo.stack" class="mt-2">
                <summary class="text-xs text-red-600 cursor-pointer">Stack trace</summary>
                <pre class="text-xs text-red-600 mt-1 overflow-auto">{{ errorInfo.stack }}</pre>
              </details>
            </div>
          </div>
          
          <div class="flex flex-col space-y-3">
            <button
              @click="retry"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Icon name="bx:refresh" class="w-4 h-4 mr-2" />
              Intentar de Nuevo
            </button>
            
            <button
              @click="goHome"
              class="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Icon name="bx:home" class="w-4 h-4 mr-2" />
              Ir al Inicio
            </button>
            
            <button
              @click="toggleDetails"
              class="w-full flex justify-center py-2 px-4 text-sm text-gray-500 hover:text-gray-700"
            >
              {{ showDetails ? 'Ocultar' : 'Mostrar' }} Detalles Técnicos
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <slot v-else />
</template>

<script setup lang="ts">
interface ErrorInfo {
  message: string
  stack?: string
  timestamp: Date
}

const hasError = ref(false)
const errorInfo = ref<ErrorInfo>({
  message: '',
  timestamp: new Date()
})
const showDetails = ref(false)

const handleError = (error: Error) => {
  hasError.value = true
  errorInfo.value = {
    message: error.message || 'Error desconocido',
    stack: error.stack,
    timestamp: new Date()
  }
  
  // Log error to server if available
  if (import.meta.server) {
    const { $logger } = useNuxtApp()
    if ($logger && typeof ($logger as { error?: (...args: unknown[]) => void }).error === 'function') {
      ($logger as { error: (...args: unknown[]) => void }).error({
        error: error.message,
        stack: error.stack,
        timestamp: errorInfo.value.timestamp.toISOString(),
        context: 'ErrorBoundary'
      }, 'Global error boundary caught error')
    }
  }
}

const retry = () => {
  hasError.value = false
  errorInfo.value = {
    message: '',
    timestamp: new Date()
  }
  showDetails.value = false
  
  // Force reactivity update
  nextTick(() => {
    // Component will re-render
  })
}

const goHome = async () => {
  try {
    await navigateTo('/')
    retry()
  } catch {
    // If navigation fails, just retry
    retry()
  }
}

const toggleDetails = () => {
  showDetails.value = !showDetails.value
}

// Global error handler
onMounted(() => {
  window.addEventListener('error', (event) => {
    handleError(new Error(event.message))
  })
  
  window.addEventListener('unhandledrejection', (event) => {
    handleError(new Error(event.reason?.message || 'Unhandled promise rejection'))
  })
})

// Vue error handler
onErrorCaptured((error) => {
  handleError(error)
  return false // Prevent error from propagating
})
</script>