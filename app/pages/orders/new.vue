<template>
  <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Nuevo Liberador de Producto</h1>
      
      <!-- Progress Bar -->
      <div class="mb-8">
        <div class="bg-gray-200 rounded-full h-3">
          <div 
            class="bg-indigo-600 h-3 rounded-full transition-all duration-300" 
            :style="`width: ${(currentStep / totalSteps) * 100}%`"
          />
        </div>
        <div class="flex justify-between text-sm text-gray-600 mt-2">
          <span :class="currentStep >= 1 ? 'font-medium text-indigo-600' : ''">Paso 1: Datos Iniciales</span>
          <span :class="currentStep >= 2 ? 'font-medium text-indigo-600' : ''">Paso 2: Detalles del Producto</span>
          <span :class="currentStep >= 3 ? 'font-medium text-indigo-600' : ''">Paso 3: Pruebas de Calidad</span>
          <span :class="currentStep >= 4 ? 'font-medium text-indigo-600' : ''">Paso 4: Resumen y Resultados</span>
        </div>
      </div>

      <!-- Step 1: Initial Data -->
      <div v-show="currentStep === 1" class="bg-white shadow-lg rounded-lg overflow-hidden">
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
              <div v-if="!formData.labelImage" class="space-y-3">
                <div class="mx-auto w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span class="text-2xl">📷</span>
                </div>
                <div>
                  <span class="text-indigo-600 hover:text-indigo-800 font-medium">
                    Haz clic para subir imagen
                  </span>
                  <p class="text-gray-500 text-sm mt-1">o arrastra y suelta aquí</p>
                </div>
                <p class="text-xs text-gray-400">PNG, JPG hasta 5MB</p>
              </div>
              <div v-else class="space-y-3">
                <img
                :src="formData.labelImagePreview"
                alt="Label preview"
                class="mx-auto max-w-32 max-h-32 object-cover rounded-lg">
                <p class="text-sm font-medium text-green-600">{{ formData.labelImage.name }}</p>
                <button 
                  type="button" 
                  class="text-indigo-600 hover:text-indigo-800 text-sm"
                  @click.stop="removeImage"
                >
                  Cambiar imagen
                </button>
              </div>
            </div>
          </div>
          
          <!-- Quantity Input -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              📦 Cantidad de Cajas *
            </label>
            <input 
              v-model.number="formData.boxQuantity"
              type="number" 
              min="1" 
              placeholder="Ingrese la cantidad de cajas" 
              class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-lg py-3 px-4"
              required
            >
            <p class="text-sm text-gray-500 mt-1">Solo números enteros positivos</p>
          </div>
        </div>

        <!-- Navigation -->
        <div class="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div class="flex justify-between">
            <button 
              disabled 
              class="px-6 py-2 text-sm font-medium text-gray-400 bg-gray-100 border border-gray-300 rounded-lg cursor-not-allowed"
            >
              ← Anterior
            </button>
            <button 
              :disabled="!canProceedFromStep1"
              :class="[
                'px-6 py-2 text-sm font-medium border border-transparent rounded-lg transition-colors',
                canProceedFromStep1
                  ? 'text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                  : 'text-gray-400 bg-gray-100 cursor-not-allowed'
              ]"
              @click="nextStep"
            >
              Siguiente →
            </button>
          </div>
        </div>
      </div>

      <!-- Step 2: Product Details -->
      <div v-show="currentStep === 2" class="bg-white shadow-lg rounded-lg overflow-hidden">
        <div class="bg-indigo-50 px-6 py-4 border-b border-indigo-100">
          <h2 class="text-xl font-semibold text-indigo-900">Paso 2: Detalles del Producto</h2>
          <p class="text-sm text-indigo-600 mt-1">Complete la información del producto y proceso de fabricación</p>
        </div>
        
        <div class="p-6 space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Client -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Cliente *</label>
              <input 
                v-model="formData.client"
                type="text" 
                placeholder="Nombre del cliente" 
                class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3"
                required
              >
            </div>
            
            <!-- Batch -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Lote *</label>
              <input 
                v-model="formData.batch"
                type="text" 
                placeholder="Número de lote" 
                class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3"
                required
              >
            </div>
            
            <!-- Order -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Pedido *</label>
              <input 
                v-model="formData.order"
                type="text" 
                placeholder="Número de pedido" 
                class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3"
                required
              >
            </div>
            
            <!-- Product -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Producto *</label>
              <input 
                v-model="formData.product"
                type="text" 
                placeholder="Nombre del producto" 
                class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3"
                required
              >
            </div>
            
            <!-- Units -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Unidades *</label>
              <input 
                v-model.number="formData.units"
                type="number" 
                min="1" 
                placeholder="Cantidad de unidades" 
                class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3"
                required
              >
            </div>
            
            <!-- Purchase Order -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Orden de Compra</label>
              <input 
                v-model="formData.purchaseOrder"
                type="text" 
                placeholder="Número de orden de compra" 
                class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3"
              >
            </div>
            
            <!-- Machine -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Máquina *</label>
              <input 
                v-model="formData.machine"
                type="text" 
                placeholder="Identificación de máquina" 
                class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3"
                required
              >
            </div>
            
            <!-- Manufacturing Date -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Fecha de Fabricación *</label>
              <input 
                v-model="formData.manufacturingDate"
                type="date" 
                class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3"
                required
              >
            </div>
            
            <!-- Shift -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Turno *</label>
              <select 
                v-model="formData.shift"
                class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3"
                required
              >
                <option value="">Seleccionar turno</option>
                <option value="mañana">Mañana</option>
                <option value="tarde">Tarde</option>
                <option value="noche">Noche</option>
              </select>
            </div>
            
            <!-- Shift Manager -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Jefe de Turno *</label>
              <input 
                v-model="formData.shiftManager"
                type="text" 
                placeholder="Nombre del jefe de turno" 
                class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3"
                required
              >
            </div>
            
            <!-- Operator -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Operador *</label>
              <input 
                v-model="formData.operator"
                type="text" 
                placeholder="Nombre del operador" 
                class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3"
                required
              >
            </div>
            
            <!-- Quality Inspector -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Inspector de Calidad *</label>
              <input 
                v-model="formData.qualityInspector"
                type="text" 
                placeholder="Nombre del inspector" 
                class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3"
                required
              >
            </div>
          </div>
          
          <!-- Sampling Level -->
          <div class="border-t pt-6">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">Nivel de Muestreo *</label>
              <select 
                v-model="formData.samplingLevel"
                class="block w-full max-w-xs rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3"
                required
                @change="updateRecommendedSampling"
              >
                <option value="">Seleccionar nivel</option>
                <option value="S1">S1</option>
                <option value="S2">S2</option>
                <option value="S3">S3</option>
                <option value="S4">S4</option>
              </select>
            </div>
            
            <!-- Recommended Sampling Disclosure -->
            <div v-if="formData.samplingLevel" class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div class="flex items-start">
                <div class="flex-shrink-0">
                  <span class="text-blue-400 text-lg">ℹ️</span>
                </div>
                <div class="ml-3">
                  <h4 class="text-sm font-medium text-blue-800">Cantidad de Muestreo Recomendada</h4>
                  <p class="text-sm text-blue-700 mt-1">
                    Para el nivel {{ formData.samplingLevel }} con {{ formData.boxQuantity || 0 }} cajas, 
                    se recomienda un muestreo de <strong>{{ recommendedSampling }}</strong> unidades.
                  </p>
                </div>
              </div>
            </div>
            
            <!-- Actual Sampling Quantity -->
            <div v-if="formData.samplingLevel">
              <label class="block text-sm font-medium text-gray-700 mb-2">Cantidad Real de Muestreo *</label>
              <select 
                v-model.number="formData.actualSampling"
                class="block w-full max-w-xs rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3"
                required
              >
                <option :value="null">Seleccionar cantidad</option>
                <option
                  v-for="quantity in samplingOptions"
                  :key="quantity"
                  :value="quantity">
                  {{ quantity }} unidades
                </option>
              </select>
            </div>
          </div>
        </div>

        <!-- Navigation -->
        <div class="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div class="flex justify-between">
            <button 
              class="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              @click="previousStep"
            >
              ← Anterior
            </button>
            <button 
              :disabled="!canProceedFromStep2"
              :class="[
                'px-6 py-2 text-sm font-medium border border-transparent rounded-lg transition-colors',
                canProceedFromStep2
                  ? 'text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                  : 'text-gray-400 bg-gray-100 cursor-not-allowed'
              ]"
              @click="nextStep"
            >
              Siguiente →
            </button>
          </div>
        </div>
      </div>

      <!-- Step 3: Quality Tests -->
      <div v-show="currentStep === 3" class="bg-white shadow-lg rounded-lg overflow-hidden">
        <div class="bg-indigo-50 px-6 py-4 border-b border-indigo-100">
          <h2 class="text-xl font-semibold text-indigo-900">Paso 3: Pruebas de Calidad</h2>
          <p class="text-sm text-indigo-600 mt-1">
            Realizando pruebas en {{ formData.actualSampling }} unidades seleccionadas
          </p>
        </div>
        
        <div class="p-6 space-y-6">
          <!-- Sampling Info -->
          <div class="bg-gray-50 rounded-lg p-4">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="font-medium text-gray-900">Información de Muestreo</h3>
                <p class="text-sm text-gray-600 mt-1">
                  Nivel: {{ formData.samplingLevel }} | 
                  Cantidad: {{ formData.actualSampling }} unidades
                </p>
              </div>
              <div class="text-right">
                <div class="text-2xl font-bold text-indigo-600">{{ formData.actualSampling }}</div>
                <div class="text-xs text-gray-500">unidades a probar</div>
              </div>
            </div>
          </div>
          
          <!-- Quality Tests -->
          <div class="space-y-4">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Pruebas de Control de Calidad</h3>
            
            <!-- Test 1 -->
            <div class="border border-gray-200 rounded-lg p-4">
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="font-medium text-gray-900">Prueba 1: Dimensiones y Tolerancias</h4>
                  <p class="text-sm text-gray-600 mt-1">Verificación de medidas según especificaciones</p>
                </div>
                <div class="flex items-center space-x-4">
                  <div class="flex items-center space-x-2">
                    <span class="text-sm font-medium" :class="formData.test1 ? 'text-green-600' : 'text-red-600'">
                      {{ formData.test1 ? 'APROBADO' : 'RECHAZADO' }}
                    </span>
                    <div 
                      class="relative inline-block w-12 h-6 cursor-pointer"
                      @click="formData.test1 = !formData.test1"
                    >
                      <div 
                        :class="[
                          'absolute inset-0 rounded-full transition-colors',
                          formData.test1 ? 'bg-green-500' : 'bg-red-500'
                        ]"
                      />
                      <div 
                        :class="[
                          'absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform',
                          formData.test1 ? 'translate-x-6' : 'translate-x-0'
                        ]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Test 2 -->
            <div class="border border-gray-200 rounded-lg p-4">
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="font-medium text-gray-900">Prueba 2: Resistencia y Durabilidad</h4>
                  <p class="text-sm text-gray-600 mt-1">Pruebas de esfuerzo y resistencia del material</p>
                </div>
                <div class="flex items-center space-x-4">
                  <div class="flex items-center space-x-2">
                    <span class="text-sm font-medium" :class="formData.test2 ? 'text-green-600' : 'text-red-600'">
                      {{ formData.test2 ? 'APROBADO' : 'RECHAZADO' }}
                    </span>
                    <div 
                      class="relative inline-block w-12 h-6 cursor-pointer"
                      @click="formData.test2 = !formData.test2"
                    >
                      <div 
                        :class="[
                          'absolute inset-0 rounded-full transition-colors',
                          formData.test2 ? 'bg-green-500' : 'bg-red-500'
                        ]"
                      />
                      <div 
                        :class="[
                          'absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform',
                          formData.test2 ? 'translate-x-6' : 'translate-x-0'
                        ]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Test 3 -->
            <div class="border border-gray-200 rounded-lg p-4">
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="font-medium text-gray-900">Prueba 3: Acabado y Apariencia</h4>
                  <p class="text-sm text-gray-600 mt-1">Inspección visual y de acabado superficial</p>
                </div>
                <div class="flex items-center space-x-4">
                  <div class="flex items-center space-x-2">
                    <span class="text-sm font-medium" :class="formData.test3 ? 'text-green-600' : 'text-red-600'">
                      {{ formData.test3 ? 'APROBADO' : 'RECHAZADO' }}
                    </span>
                    <div 
                      class="relative inline-block w-12 h-6 cursor-pointer"
                      @click="formData.test3 = !formData.test3"
                    >
                      <div 
                        :class="[
                          'absolute inset-0 rounded-full transition-colors',
                          formData.test3 ? 'bg-green-500' : 'bg-red-500'
                        ]"
                      />
                      <div 
                        :class="[
                          'absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform',
                          formData.test3 ? 'translate-x-6' : 'translate-x-0'
                        ]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Overall Status Preview -->
          <div class="border-t pt-6">
            <div class="flex items-center justify-center p-4 rounded-lg" :class="overallTestResult ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'">
              <div class="text-center">
                <div class="text-2xl mb-2">
                  {{ overallTestResult ? '✅' : '❌' }}
                </div>
                <div class="text-lg font-semibold" :class="overallTestResult ? 'text-green-800' : 'text-red-800'">
                  {{ overallTestResult ? 'TODAS LAS PRUEBAS APROBADAS' : 'HAY PRUEBAS RECHAZADAS' }}
                </div>
                <div class="text-sm mt-1" :class="overallTestResult ? 'text-green-600' : 'text-red-600'">
                  El producto {{ overallTestResult ? 'será APROBADO' : 'será RECHAZADO' }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Navigation -->
        <div class="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div class="flex justify-between">
            <button 
              class="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              @click="previousStep"
            >
              ← Anterior
            </button>
            <button 
              class="px-6 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              @click="nextStep"
            >
              Siguiente →
            </button>
          </div>
        </div>
      </div>

      <!-- Step 4: Summary & Results -->
      <div v-show="currentStep === 4" class="bg-white shadow-lg rounded-lg overflow-hidden">
        <div class="bg-indigo-50 px-6 py-4 border-b border-indigo-100">
          <h2 class="text-xl font-semibold text-indigo-900">Paso 4: Resumen y Resultados</h2>
          <p class="text-sm text-indigo-600 mt-1">Revise toda la información antes de guardar</p>
        </div>
        
        <div class="p-6 space-y-6">
          <!-- Overall Result -->
          <div class="text-center p-6 rounded-lg" :class="overallResult === 'APROBADO' ? 'bg-green-50 border-2 border-green-200' : 'bg-red-50 border-2 border-red-200'">
            <div class="text-6xl mb-4">
              {{ overallResult === 'APROBADO' ? '✅' : '❌' }}
            </div>
            <div class="text-3xl font-bold mb-2" :class="overallResult === 'APROBADO' ? 'text-green-800' : 'text-red-800'">
              PRODUCTO {{ overallResult }}
            </div>
            <div class="text-lg" :class="overallResult === 'APROBADO' ? 'text-green-600' : 'text-red-600'">
              {{ overallResult === 'APROBADO' ? 'Cumple con todos los estándares de calidad' : 'No cumple con los estándares requeridos' }}
            </div>
          </div>
          
          <!-- Test Results Summary -->
          <div class="border border-gray-200 rounded-lg">
            <div class="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <h3 class="font-medium text-gray-900">Resultados de Pruebas</h3>
            </div>
            <div class="p-4 space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-gray-700">Prueba 1: Dimensiones y Tolerancias</span>
                <span class="flex items-center" :class="formData.test1 ? 'text-green-600' : 'text-red-600'">
                  {{ formData.test1 ? '✓' : '✗' }} {{ formData.test1 ? 'APROBADO' : 'RECHAZADO' }}
                </span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-700">Prueba 2: Resistencia y Durabilidad</span>
                <span class="flex items-center" :class="formData.test2 ? 'text-green-600' : 'text-red-600'">
                  {{ formData.test2 ? '✓' : '✗' }} {{ formData.test2 ? 'APROBADO' : 'RECHAZADO' }}
                </span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-700">Prueba 3: Acabado y Apariencia</span>
                <span class="flex items-center" :class="formData.test3 ? 'text-green-600' : 'text-red-600'">
                  {{ formData.test3 ? '✓' : '✗' }} {{ formData.test3 ? 'APROBADO' : 'RECHAZADO' }}
                </span>
              </div>
            </div>
          </div>
          
          <!-- Form Data Summary -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Initial Data -->
            <div class="border border-gray-200 rounded-lg">
              <div class="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <h3 class="font-medium text-gray-900">Datos Iniciales</h3>
              </div>
              <div class="p-4 space-y-2">
                <div class="flex justify-between">
                  <span class="text-gray-600">Cantidad de Cajas:</span>
                  <span class="font-medium">{{ formData.boxQuantity }}</span>
                </div>
                <div v-if="formData.labelImage">
                  <span class="text-gray-600 block mb-2">Imagen de Etiqueta:</span>
                  <img
                    :src="formData.labelImagePreview"
                    alt="Label"
                    class="w-24 h-24 object-cover rounded border">
                </div>
              </div>
            </div>
            
            <!-- Product Details -->
            <div class="border border-gray-200 rounded-lg">
              <div class="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <h3 class="font-medium text-gray-900">Detalles del Producto</h3>
              </div>
              <div class="p-4 space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-600">Cliente:</span>
                  <span class="font-medium">{{ formData.client }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Lote:</span>
                  <span class="font-medium">{{ formData.batch }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Pedido:</span>
                  <span class="font-medium">{{ formData.order }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Producto:</span>
                  <span class="font-medium">{{ formData.product }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Unidades:</span>
                  <span class="font-medium">{{ formData.units }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Máquina:</span>
                  <span class="font-medium">{{ formData.machine }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Fecha:</span>
                  <span class="font-medium">{{ formatDate(formData.manufacturingDate) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Turno:</span>
                  <span class="font-medium">{{ formData.shift }}</span>
                </div>
              </div>
            </div>
            
            <!-- Personnel -->
            <div class="border border-gray-200 rounded-lg">
              <div class="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <h3 class="font-medium text-gray-900">Personal</h3>
              </div>
              <div class="p-4 space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-600">Jefe de Turno:</span>
                  <span class="font-medium">{{ formData.shiftManager }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Operador:</span>
                  <span class="font-medium">{{ formData.operator }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Inspector:</span>
                  <span class="font-medium">{{ formData.qualityInspector }}</span>
                </div>
              </div>
            </div>
            
            <!-- Sampling -->
            <div class="border border-gray-200 rounded-lg">
              <div class="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <h3 class="font-medium text-gray-900">Muestreo</h3>
              </div>
              <div class="p-4 space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-600">Nivel:</span>
                  <span class="font-medium">{{ formData.samplingLevel }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Recomendado:</span>
                  <span class="font-medium">{{ recommendedSampling }} unidades</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Real:</span>
                  <span class="font-medium">{{ formData.actualSampling }} unidades</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Navigation -->
        <div class="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div class="flex justify-between">
            <button 
              class="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              @click="previousStep"
            >
              ← Anterior
            </button>
            <button 
              :disabled="isSaving"
              :class="[
                'px-8 py-2 text-sm font-medium border border-transparent rounded-lg transition-colors',
                isSaving
                  ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                  : 'text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
              ]"
              @click="saveForm"
            >
              {{ isSaving ? 'Guardando...' : '💾 Guardar Liberador' }}
            </button>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
const toast = useToast()

// Reactive state
const currentStep = ref(1)
const totalSteps = 4
const isSaving = ref(false)

// Form data
const formData = reactive({
  // Step 1: Initial Data
  labelImage: null as File | null,
  labelImagePreview: '',
  boxQuantity: null as number | null,
  
  // Step 2: Product Details
  client: '',
  batch: '',
  order: '',
  product: '',
  units: null as number | null,
  purchaseOrder: '',
  machine: '',
  manufacturingDate: '',
  shift: '',
  shiftManager: '',
  operator: '',
  qualityInspector: '',
  samplingLevel: '',
  actualSampling: null as number | null,
  
  // Step 3: Quality Tests
  test1: false,
  test2: false,
  test3: false
})

// File input ref
const fileInput = ref<HTMLInputElement>()

// Computed properties
const canProceedFromStep1 = computed(() => {
  return formData.labelImage && formData.boxQuantity && formData.boxQuantity > 0
})

const canProceedFromStep2 = computed(() => {
  return (
    formData.client &&
    formData.batch &&
    formData.order &&
    formData.product &&
    formData.units &&
    formData.machine &&
    formData.manufacturingDate &&
    formData.shift &&
    formData.shiftManager &&
    formData.operator &&
    formData.qualityInspector &&
    formData.samplingLevel &&
    formData.actualSampling
  )
})

const recommendedSampling = computed(() => {
  if (!formData.samplingLevel || !formData.boxQuantity) return 0
  
  const baseQuantity = formData.boxQuantity
  const factors = {
    'S1': 0.1,
    'S2': 0.15,
    'S3': 0.2,
    'S4': 0.25
  }
  
  return Math.max(1, Math.ceil(baseQuantity * factors[formData.samplingLevel as keyof typeof factors]))
})

const samplingOptions = computed(() => {
  const recommended = recommendedSampling.value
  const options = []
  
  // Generate options around the recommended value
  for (let i = Math.max(1, recommended - 2); i <= recommended + 3; i++) {
    options.push(i)
  }
  
  return options.sort((a, b) => a - b)
})

const overallTestResult = computed(() => {
  return formData.test1 && formData.test2 && formData.test3
})

const overallResult = computed(() => {
  return overallTestResult.value ? 'APROBADO' : 'RECHAZADO'
})

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
  if (file && file.type.startsWith('image/')) {
    processFile(file)
  }
}

const processFile = (file: File) => {
  const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB limit
  if (file.size > MAX_FILE_SIZE) {
    const toast = useToast()
    toast.error('Archivo muy grande', 'El límite es de 5MB')
    return
  }
  
  formData.labelImage = file
  
  // Create preview
  const reader = new FileReader()
  reader.onload = (e) => {
    formData.labelImagePreview = e.target?.result as string
  }
  reader.readAsDataURL(file)
}

const removeImage = () => {
  formData.labelImage = null
  formData.labelImagePreview = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const updateRecommendedSampling = () => {
  // Reset actual sampling when level changes
  formData.actualSampling = null
}

const nextStep = () => {
  if (currentStep.value < totalSteps) {
    currentStep.value++
  }
}

const previousStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const saveForm = async () => {
  isSaving.value = true
  
  try {
    // Prepare form data for API submission
    const orderData = {
      // Basic information
      boxQuantity: formData.boxQuantity,
      labelImage: formData.labelImage,
      
      // Product details
      client: formData.client,
      batch: formData.batch,
      order: formData.order,
      product: formData.product,
      units: formData.units,
      purchaseOrder: formData.purchaseOrder,
      machine: formData.machine,
      manufacturingDate: formData.manufacturingDate,
      shift: formData.shift,
      
      // Personnel
      shiftManager: formData.shiftManager,
      operator: formData.operator,
      qualityInspector: formData.qualityInspector,
      
      // Quality control
      samplingLevel: formData.samplingLevel,
      actualSampling: formData.actualSampling,
      test1: formData.test1,
      test2: formData.test2,
      test3: formData.test3,
      
      // Results
      overallResult: overallResult.value,
      createdAt: new Date().toISOString()
    }
    
    // Prepare data for API submission
    // Note: API integration pending - currently logging for development
    console.log('Order data prepared for API:', orderData)
    
    // For now, simulate API call for development
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Show success notification
    toast.success('¡Liberador guardado exitosamente!', `Resultado: ${overallResult.value}`)
    
    // Navigate to orders list
    await navigateTo('/orders')
    
  } catch (error) {
    console.error('Error al guardar orden:', error)
    toast.error('Error al guardar', 'Por favor, intente nuevamente.')
  } finally {
    isSaving.value = false
  }
}

// SEO
useSeoMeta({
  title: 'Nuevo Liberador de Producto - Control de Calidad',
  description: 'Crear un nuevo liberador de producto para el sistema de control de calidad.'
})

// Middleware
definePageMeta({
  middleware: 'auth'
})
</script>