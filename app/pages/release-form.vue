<template>
  <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">🎉 ¡FORMULARIO FUNCIONANDO!</h1>
      
      <!-- Success indicator -->
      <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
        ✅ El formulario está funcionando correctamente en esta ruta. El problema está en la ruta /orders/new.
      </div>

      <!-- Quick Progress Test -->
      <div class="mb-6">
        <div class="bg-gray-200 rounded-full h-3">
          <div class="bg-indigo-600 h-3 rounded-full transition-all duration-300" style="width: 25%"/>
        </div>
        <div class="flex justify-between text-sm text-gray-600 mt-2">
          <span class="font-medium text-indigo-600">Paso 1: Datos Iniciales</span>
          <span>Paso 2: Detalles</span>
          <span>Paso 3: Pruebas</span>
          <span>Paso 4: Resumen</span>
        </div>
      </div>

      <!-- Sample Form -->
      <div class="bg-white shadow-lg rounded-lg overflow-hidden">
        <div class="bg-indigo-50 px-6 py-4 border-b border-indigo-100">
          <h2 class="text-xl font-semibold text-indigo-900">Paso 1: Datos Iniciales</h2>
          <p class="text-sm text-indigo-600 mt-1">Sube la imagen de etiqueta y especifica la cantidad de cajas</p>
        </div>
        
        <div class="p-6 space-y-6">
          <!-- File Upload -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-3">
              📄 Imagen de Etiqueta *
            </label>
            <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-400 transition-colors">
              <div class="space-y-3">
                <div class="mx-auto w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span class="text-2xl">📷</span>
                </div>
                <div>
                  <button class="text-indigo-600 hover:text-indigo-800 font-medium">
                    Haz clic para subir imagen
                  </button>
                  <p class="text-gray-500 text-sm mt-1">o arrastra y suelta aquí</p>
                </div>
                <p class="text-xs text-gray-400">PNG, JPG hasta 5MB</p>
              </div>
            </div>
          </div>
          
          <!-- Quantity Input -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              📦 Cantidad de Cajas *
            </label>
            <input 
              type="number" 
              min="1" 
              placeholder="Ingrese la cantidad de cajas" 
              class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-lg py-3 px-4"
            >
            <p class="text-sm text-gray-500 mt-1">Solo números enteros positivos</p>
          </div>
        </div>

        <!-- Navigation -->
        <div class="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div class="flex justify-between">
            <button disabled class="px-6 py-2 text-sm font-medium text-gray-400 bg-gray-100 border border-gray-300 rounded-lg cursor-not-allowed">
              ← Anterior
            </button>
            <button class="px-6 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
              Siguiente →
            </button>
          </div>
        </div>
      </div>

      <!-- Debug Info -->
      <div class="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 class="font-medium text-yellow-800 mb-2">🔧 Info de Debug:</h3>
        <ul class="text-sm text-yellow-700 space-y-1">
          <li>• Esta página funciona en /release-form</li>
          <li>• El problema está específicamente en /orders/new</li>
          <li>• Posible conflicto de routing o componentes</li>
          <li>• Los componentes Base* están disponibles</li>
        </ul>
      </div>
    </div>
</template>

<script setup lang="ts">
// SEO
useSeoMeta({
  title: 'Formulario de Liberación - Test',
  description: 'Formulario de prueba para debug del sistema de liberación.'
})

// Middleware
definePageMeta({
  middleware: 'auth'
})
</script>