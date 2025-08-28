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
          <Icon 
            v-if="hasOCRData" 
            name="bx:check-circle" 
            class="w-4 h-4 ml-2 text-green-500" 
            title="Datos precargados automáticamente"
          />
        </h3>
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
          <Icon 
            v-if="hasOCRData" 
            name="bx:check-circle" 
            class="w-4 h-4 ml-2 text-green-500" 
            title="Datos precargados automáticamente"
          />
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
              Cantidad unidades por embalaje*
            </label>
            <input 
              v-model="localData.units"
              type="number" 
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="0"
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
  lotNumber: string
  productionDate: string
  units: number
  
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
  customerCode: string
  customerName: string
  productCode: string
  productName: string
  lotNumber: string
  productionDate: string
  units: number
  
}

interface Props {
  modelValue: OrderData
}

interface Emits {
  (e: 'update:modelValue', value: OrderData): void
  (e: 'next' | 'previous'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// State for tracking OCR pre-filled data
const hasOCRData = ref(false)

// Local reactive copy
const localData = ref<StepData>({
  customerCode: props.modelValue.customerCode || '',
  customerName: props.modelValue.customerName || '',
  productCode: props.modelValue.productCode || '',
  productName: props.modelValue.productName || '',
  lotNumber: props.modelValue.lotNumber || '',
  productionDate: props.modelValue.productionDate || '',
  units: props.modelValue.units || 0
})

// Check if we have OCR data when component mounts
onMounted(() => {
  const hasData = props.modelValue.customerName || props.modelValue.productName || props.modelValue.lotNumber
  if (hasData) {
    hasOCRData.value = true
    const toast = useToast()
    toast.success('Datos precargados', 'Los campos se han completado automáticamente con los datos extraídos de la imagen')
  }
})

// Watch for changes and emit updates
watch(localData, (newValue) => {
  emit('update:modelValue', {
    ...props.modelValue,
    ...newValue
  })
}, { deep: true })

// Watch for incoming OCR data from parent
watch(() => props.modelValue, (newValue, oldValue) => {
  // Update local data with new values from OCR
  localData.value = {
    customerCode: newValue.customerCode || '',
    customerName: newValue.customerName || '',
    productCode: newValue.productCode || '',
    productName: newValue.productName || '',
    lotNumber: newValue.lotNumber || '',
    productionDate: newValue.productionDate || '',
    units: newValue.units || 0
  }
  
  // Show toast notification if new OCR data arrives
  const hasNewData = (newValue.customerName && !oldValue?.customerName) || 
                     (newValue.productName && !oldValue?.productName) ||
                     (newValue.lotNumber && !oldValue?.lotNumber)
  
  if (hasNewData && !hasOCRData.value) {
    hasOCRData.value = true
    const toast = useToast()
    toast.success('Datos precargados', 'Los campos se han completado automáticamente con los datos extraídos de la imagen')
  }
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