<template>
  <div class="bg-white shadow-lg rounded-lg overflow-hidden">
    <div class="bg-indigo-50 px-6 py-4 border-b border-indigo-100">
      <h2 class="text-xl font-semibold text-indigo-900">Paso 2: Detalles del Producto</h2>
      <p class="text-sm text-indigo-600 mt-1">Completa la información del producto y cliente</p>
    </div>
    
    <div class="p-6 space-y-8">
      <!-- Customer Section -->
      <div>
        <h3 class="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <Icon name="bx:user" class="w-5 h-5 mr-2 text-indigo-500" />
          Información del Cliente
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Código del Cliente *
            </label>
            <input 
              v-model="localData.customerCode"
              type="text" 
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Ej: CLI001"
              required
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Nombre del Cliente *
            </label>
            <input 
              v-model="localData.customerName"
              type="text" 
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Ej: Empresa ABC S.A."
              required
            >
          </div>
        </div>
      </div>

      <!-- Product Section -->
      <div>
        <h3 class="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <Icon name="bx:package" class="w-5 h-5 mr-2 text-indigo-500" />
          Información del Producto
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Código del Producto *
            </label>
            <input 
              v-model="localData.productCode"
              type="text" 
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Ej: PROD001"
              required
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Nombre del Producto *
            </label>
            <input 
              v-model="localData.productName"
              type="text" 
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Ej: Bolsa de plástico 25kg"
              required
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Categoría
            </label>
            <select 
              v-model="localData.productCategory"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Seleccionar categoría</option>
              <option value="bolsas">Bolsas</option>
              <option value="films">Films</option>
              <option value="contenedores">Contenedores</option>
              <option value="otros">Otros</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Número de Lote *
            </label>
            <input 
              v-model="localData.lotNumber"
              type="text" 
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Ej: LOT20241201"
              required
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Fecha de Producción *
            </label>
            <input 
              v-model="localData.productionDate"
              type="date" 
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Fecha de Vencimiento
            </label>
            <input 
              v-model="localData.expirationDate"
              type="date" 
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
          </div>
        </div>
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
          class="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="!canProceed"
          @click="handleNext"
        >
          Siguiente
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface StepData {
  customerCode: string
  customerName: string
  productCode: string
  productName: string
  productCategory: string
  expirationDate: string
  lotNumber: string
  productionDate: string
}

interface Props {
  modelValue: any
}

interface Emits {
  (e: 'update:modelValue', value: any): void
  (e: 'next'): void
  (e: 'previous'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Local reactive copy
const localData = ref<StepData>({
  customerCode: props.modelValue.customerCode || '',
  customerName: props.modelValue.customerName || '',
  productCode: props.modelValue.productCode || '',
  productName: props.modelValue.productName || '',
  productCategory: props.modelValue.productCategory || '',
  expirationDate: props.modelValue.expirationDate || '',
  lotNumber: props.modelValue.lotNumber || '',
  productionDate: props.modelValue.productionDate || ''
})

// Watch for changes and emit updates
watch(localData, (newValue) => {
  emit('update:modelValue', {
    ...props.modelValue,
    ...newValue
  })
}, { deep: true })

// Computed
const canProceed = computed(() => {
  return localData.value.customerCode && 
         localData.value.customerName && 
         localData.value.productCode && 
         localData.value.productName &&
         localData.value.lotNumber &&
         localData.value.productionDate
})

// Methods
const handleNext = () => {
  if (canProceed.value) {
    emit('next')
  }
}
</script>