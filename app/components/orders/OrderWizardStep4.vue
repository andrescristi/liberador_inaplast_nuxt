<template>
  <div class="bg-white shadow-lg rounded-lg overflow-hidden">
    <div class="bg-indigo-50 px-6 py-4 border-b border-indigo-100">
      <h2 class="text-xl font-semibold text-indigo-900">Paso 4: Resumen y Resultados</h2>
      <p class="text-sm text-indigo-600 mt-1">Revisa la información y emite la decisión final</p>
    </div>
    
    <div class="p-6 space-y-8">
      <!-- Order Summary -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Customer & Product Info -->
        <div>
          <h3 class="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <Icon name="bx:info-circle" class="w-5 h-5 mr-2 text-indigo-500" />
            Información General
          </h3>
          <div class="bg-gray-50 rounded-lg p-4 space-y-3 text-sm">
            <div class="grid grid-cols-2 gap-2">
              <span class="text-gray-600">Cliente:</span>
              <span class="font-medium">{{ modelValue.customerName || 'No especificado' }}</span>
            </div>
            <div class="grid grid-cols-2 gap-2">
              <span class="text-gray-600">Producto:</span>
              <span class="font-medium">{{ modelValue.productName || 'No especificado' }}</span>
            </div>
            <div class="grid grid-cols-2 gap-2">
              <span class="text-gray-600">Lote:</span>
              <span class="font-medium">{{ modelValue.lotNumber || 'No especificado' }}</span>
            </div>
            <div class="grid grid-cols-2 gap-2">
              <span class="text-gray-600">Cantidad:</span>
              <span class="font-medium">{{ modelValue.boxQuantity || 0 }} unidades</span>
            </div>
          </div>
        </div>

        <!-- Test Results -->
        <div>
          <h3 class="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <Icon name="bx:check-circle" class="w-5 h-5 mr-2 text-indigo-500" />
            Resultados de Pruebas
          </h3>
          <div class="bg-gray-50 rounded-lg p-4 space-y-3 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-600">Embalaje:</span>
              <span :class="modelValue.packagingTest ? 'text-green-600' : 'text-red-600'">
                {{ modelValue.packagingTest ? '✅ Aprobado' : '❌ Rechazado' }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Etiquetado:</span>
              <span :class="modelValue.labelingTest ? 'text-green-600' : 'text-red-600'">
                {{ modelValue.labelingTest ? '✅ Aprobado' : '❌ Rechazado' }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Sellado:</span>
              <span :class="modelValue.sealingTest ? 'text-green-600' : 'text-red-600'">
                {{ modelValue.sealingTest ? '✅ Aprobado' : '❌ Rechazado' }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Peso:</span>
              <span :class="modelValue.weightTest ? 'text-green-600' : 'text-red-600'">
                {{ modelValue.weightTest ? '✅ Aprobado' : '❌ Rechazado' }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Final Decision -->
      <div>
        <h3 class="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <Icon name="bx:shield-check" class="w-5 h-5 mr-2 text-indigo-500" />
          Decisión Final
        </h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Estado del Liberador *
            </label>
            <select 
              v-model="localData.finalResult"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            >
              <option value="approved">✅ Aprobado - El producto cumple con todos los criterios</option>
              <option value="conditional">⚠️ Condicional - Aprobado con observaciones</option>
              <option value="rejected">❌ Rechazado - El producto no cumple los criterios</option>
            </select>
          </div>

          <!-- Conditional fields based on decision -->
          <div v-if="localData.finalResult === 'rejected'" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Razón del Rechazo *
              </label>
              <textarea 
                v-model="localData.rejectionReason"
                rows="3"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Describe las razones específicas del rechazo..."
                required
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              {{ localData.finalResult === 'approved' ? 'Comentarios Adicionales' : 'Recomendaciones' }}
            </label>
            <textarea 
              v-model="localData.recommendations"
              rows="3"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              :placeholder="localData.finalResult === 'approved' ? 'Comentarios opcionales...' : 'Recomendaciones para el cliente...'"
            />
          </div>
        </div>
      </div>

      <!-- Quality Notes Summary -->
      <div v-if="modelValue.qualityNotes" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 class="font-medium text-yellow-900 mb-2">Observaciones de Calidad</h4>
        <p class="text-sm text-yellow-800">{{ modelValue.qualityNotes }}</p>
      </div>

      <!-- Navigation -->
      <div class="flex justify-between pt-6">
        <button 
          type="button"
          class="bg-gray-500 hover:bg-gray-600 text-white px-8 py-3 rounded-lg font-medium transition-colors"
          @click="$emit('previous')"
        >
          Anterior
        </button>
        <button 
          type="button"
          class="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          :disabled="!canSave || isSaving"
          @click="handleSave"
        >
          <Icon 
            v-if="isSaving" 
            name="bx:loader-alt" 
            class="animate-spin w-4 h-4 mr-2" 
          />
          {{ isSaving ? 'Guardando...' : 'Guardar Liberador' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Define la estructura completa de datos de la orden
interface OrderData {
  // Step 1 - Informacion General
  boxQuantity: number
  requester: string
  requestDate: string
  priority: 'low' | 'medium' | 'high'
  
  // Step 2 - Customer & Product Info
  customerCode: string
  customerName: string
  productCode: string
  productName: string
  productCategory: string
  expirationDate: string
  lotNumber: string
  productionDate: string
  
  // Step 3 - Quality Tests
  packagingTest?: boolean
  labelingTest?: boolean
  sealingTest?: boolean
  weightTest?: boolean
  qualityNotes?: string
  
  // Step 4 - Final Results
  finalResult?: 'approved' | 'rejected' | 'conditional'
  rejectionReason?: string
  recommendations?: string
}

interface StepData {
  finalResult: 'approved' | 'rejected' | 'conditional'
  rejectionReason: string
  recommendations: string
}

interface Props {
  modelValue: OrderData
  isSaving: boolean
}

interface Emits {
  (e: 'update:modelValue', value: OrderData): void
  (e: 'previous' | 'save'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Local reactive copy
const localData = ref<StepData>({
  finalResult: props.modelValue.finalResult || 'approved',
  rejectionReason: props.modelValue.rejectionReason || '',
  recommendations: props.modelValue.recommendations || ''
})

// Watch for changes and emit updates
watch(localData, (newValue) => {
  emit('update:modelValue', {
    ...props.modelValue,
    ...newValue
  })
}, { deep: true })

// Computed
const canSave = computed(() => {
  if (localData.value.finalResult === 'rejected') {
    return localData.value.rejectionReason.trim().length > 0
  }
  return true
})

// Methods
const handleSave = () => {
  if (canSave.value && !props.isSaving) {
    emit('save')
  }
}
</script>