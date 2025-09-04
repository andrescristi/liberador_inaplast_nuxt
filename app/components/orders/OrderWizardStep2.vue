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
              Número de Lote
            </label>
            <input 
              v-model="localData.lote"
              type="text" 
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Ej: LOT20241201"
            >
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Nombre del Cliente *
            </label>
            <input 
              v-model="localData.cliente"
              type="text" 
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Ej: Empresa ABC S.A."
              required
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Número de Pedido *
            </label>
            <input 
              v-model="localData.pedido"
              type="text" 
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Ej: PED-2024-001"
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
              v-model="localData.codigo_producto"
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
              v-model="localData.producto"
              type="text" 
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Ej: Bolsa de plástico 25kg"
              required
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Turno *
            </label>
            <select 
              v-model="localData.turno"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            >
              <option value="">Seleccionar turno</option>
              <option value="mañana">Mañana</option>
              <option value="tarde">Tarde</option>
              <option value="noche">Noche</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Fecha de Fabricación *
            </label>
            <input 
              v-model="localData.fecha_fabricacion"
              type="date" 
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            >
          </div>
        </div>
      </div>

      <!-- Additional Fields Section -->
      <div>
        <h3 class="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <Icon name="bx:cog" class="w-5 h-5 mr-2 text-indigo-500" />
          Información Adicional
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Número de Operario *
            </label>
            <input 
              v-model="localData.numero_operario"
              type="text" 
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Ej: OP001"
              required
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Máquina *
            </label>
            <input 
              v-model="localData.maquina"
              type="text" 
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Ej: MAQ001"
              required
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Inspector de Calidad *
            </label>
            <input 
              v-model="localData.inspector_calidad"
              type="text" 
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Ej: Juan Pérez"
              required
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Jefe de Turno
            </label>
            <input 
              v-model="localData.jefe_de_turno"
              type="text" 
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Ej: María García"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Orden de Compra
            </label>
            <input 
              v-model="localData.orden_de_compra"
              type="text" 
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Ej: OC-2024-001"
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
  // Step 1
  labelImage: File | null
  labelImagePreview: string
  cantidad_unidades: number
  
  // Step 2 - Campos requeridos por la API
  lote?: string
  cliente: string
  producto: string
  pedido: string
  fecha_fabricacion: string
  codigo_producto: string
  turno: string
  jefe_de_turno?: string
  orden_de_compra?: string
  numero_operario: string
  maquina: string
  inspector_calidad: string
  
  // Step 3
  packagingTest: boolean
  labelingTest: boolean
  sealingTest: boolean
  weightTest: boolean
  qualityNotes: string
  
  // Step 4
  finalResult: 'approved' | 'rejected' | 'conditional'
  rejectionReason: string
  recommendations: string
}

interface StepData {
  lote?: string
  cliente: string
  producto: string
  pedido: string
  fecha_fabricacion: string
  codigo_producto: string
  turno: string
  jefe_de_turno?: string
  orden_de_compra?: string
  numero_operario: string
  maquina: string
  inspector_calidad: string
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
  lote: props.modelValue.lote || '',
  cliente: props.modelValue.cliente || '',
  producto: props.modelValue.producto || '',
  pedido: props.modelValue.pedido || '',
  fecha_fabricacion: props.modelValue.fecha_fabricacion || '',
  codigo_producto: props.modelValue.codigo_producto || '',
  turno: props.modelValue.turno || '',
  jefe_de_turno: props.modelValue.jefe_de_turno || '',
  orden_de_compra: props.modelValue.orden_de_compra || '',
  numero_operario: props.modelValue.numero_operario || '',
  maquina: props.modelValue.maquina || '',
  inspector_calidad: props.modelValue.inspector_calidad || ''
})

// Check if we have OCR data when component mounts
onMounted(() => {
  const hasData = props.modelValue.cliente || props.modelValue.producto || props.modelValue.lote
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
    lote: newValue.lote || '',
    cliente: newValue.cliente || '',
    producto: newValue.producto || '',
    pedido: newValue.pedido || '',
    fecha_fabricacion: newValue.fecha_fabricacion || '',
    codigo_producto: newValue.codigo_producto || '',
    turno: newValue.turno || '',
    jefe_de_turno: newValue.jefe_de_turno || '',
    orden_de_compra: newValue.orden_de_compra || '',
    numero_operario: newValue.numero_operario || '',
    maquina: newValue.maquina || '',
    inspector_calidad: newValue.inspector_calidad || ''
  }
  
  // Show toast notification if new OCR data arrives
  const hasNewData = (newValue.cliente && !oldValue?.cliente) || 
                     (newValue.producto && !oldValue?.producto) ||
                     (newValue.lote && !oldValue?.lote)
  
  if (hasNewData && !hasOCRData.value) {
    hasOCRData.value = true
    const toast = useToast()
    toast.success('Datos precargados', 'Los campos se han completado automáticamente con los datos extraídos de la imagen')
  }
}, { deep: true })

// Computed
const canProceed = computed(() => {
  return localData.value.cliente && 
         localData.value.producto && 
         localData.value.pedido && 
         localData.value.codigo_producto &&
         localData.value.fecha_fabricacion &&
         localData.value.turno &&
         localData.value.numero_operario &&
         localData.value.maquina &&
         localData.value.inspector_calidad
})

// Methods
const handleNext = () => {
  if (canProceed.value) {
    emit('next')
  }
}
</script>