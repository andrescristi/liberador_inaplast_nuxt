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
              v-model="lote"
              type="text" 
              class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              :class="{
                'border-red-300 focus:ring-red-500 focus:border-red-500': false,
                'border-gray-300': true
              }"
              placeholder="Ej: LOT20241201"
            >
        </div>
        <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Unidades por Embalaje
            </label>
            <div class="relative">
              <input 
                v-model.number="unidadesPorEmbalaje"
                type="number" 
                min="1"
                step="1"
                class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 pl-10"
                :class="{
                  'border-gray-300': true
                }"
                placeholder="Ej: 45"
              >
              <Icon name="bx:package" class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-indigo-500" />
              <Icon 
                v-if="hasOCRData && unidadesPorEmbalaje" 
                name="bx:check-circle" 
                class="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-500" 
                title="Dato extraído automáticamente"
              />
            </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Nombre del Cliente *
            </label>
            <input 
              v-model="cliente"
              type="text" 
              class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              :class="{
                'border-red-300 focus:ring-red-500 focus:border-red-500': clienteError,
                'border-gray-300': !clienteError
              }"
              placeholder="Ej: Empresa ABC S.A."
              required
            >
            <p v-if="clienteError" class="text-xs text-red-600 mt-1">{{ clienteError }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Número de Pedido *
            </label>
            <input 
              v-model="pedido"
              type="text" 
              class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              :class="{
                'border-red-300 focus:ring-red-500 focus:border-red-500': pedidoError,
                'border-gray-300': !pedidoError
              }"
              placeholder="Ej: PED-2024-001"
              required
            >
            <p v-if="pedidoError" class="text-xs text-red-600 mt-1">{{ pedidoError }}</p>
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
              v-model="codigoProducto"
              type="text" 
              class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              :class="{
                'border-red-300 focus:ring-red-500 focus:border-red-500': codigoError,
                'border-gray-300': !codigoError
              }"
              placeholder="Ej: PROD001"
              required
            >
            <p v-if="codigoError" class="text-xs text-red-600 mt-1">{{ codigoError }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Nombre del Producto *
            </label>
            <input 
              v-model="producto"
              type="text" 
              class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              :class="{
                'border-red-300 focus:ring-red-500 focus:border-red-500': productoError,
                'border-gray-300': !productoError
              }"
              placeholder="Ej: Bolsa de plástico 25kg"
              required
            >
            <p v-if="productoError" class="text-xs text-red-600 mt-1">{{ productoError }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Turno *
            </label>
            <select 
              v-model="turno"
              class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              :class="{
                'border-red-300 focus:ring-red-500 focus:border-red-500': turnoError,
                'border-gray-300': !turnoError
              }"
              required
            >
              <option value="">Seleccionar turno</option>
              <option value="mañana">Mañana</option>
              <option value="tarde">Tarde</option>
              <option value="noche">Noche</option>
            </select>
            <p v-if="turnoError" class="text-xs text-red-600 mt-1">{{ turnoError }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Fecha de Fabricación *
            </label>
            <input 
              v-model="fechaFabricacion"
              type="date" 
              class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              :class="{
                'border-red-300 focus:ring-red-500 focus:border-red-500': fechaError,
                'border-gray-300': !fechaError
              }"
              required
            >
            <p v-if="fechaError" class="text-xs text-red-600 mt-1">{{ fechaError }}</p>
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
              v-model="numeroOperario"
              type="text" 
              class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              :class="{
                'border-red-300 focus:ring-red-500 focus:border-red-500': operarioError,
                'border-gray-300': !operarioError
              }"
              placeholder="Ej: OP001"
              required
            >
            <p v-if="operarioError" class="text-xs text-red-600 mt-1">{{ operarioError }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Máquina *
            </label>
            <input 
              v-model="maquina"
              type="text" 
              class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              :class="{
                'border-red-300 focus:ring-red-500 focus:border-red-500': maquinaError,
                'border-gray-300': !maquinaError
              }"
              placeholder="Ej: MAQ001"
              required
            >
            <p v-if="maquinaError" class="text-xs text-red-600 mt-1">{{ maquinaError }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Inspector de Calidad *
            </label>
            <input 
              v-model="inspectorCalidad"
              type="text" 
              class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              :class="{
                'border-red-300 focus:ring-red-500 focus:border-red-500': inspectorError,
                'border-gray-300': !inspectorError
              }"
              placeholder="Ej: Juan Pérez"
              required
            >
            <p v-if="inspectorError" class="text-xs text-red-600 mt-1">{{ inspectorError }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Jefe de Turno
            </label>
            <input 
              v-model="jefeDeTurno"
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
              v-model="ordenDeCompra"
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
import { orderStep2Schema, type NewOrderData } from '~/schemas/orders/new_order'
import { useField, useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'

interface Props {
  modelValue: NewOrderData
}

interface Emits {
  (e: 'update:modelValue', value: NewOrderData): void
  (e: 'next' | 'previous'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Configuración de validación form-level con vee-validate y Zod
const validationSchema = toTypedSchema(orderStep2Schema)

const { handleSubmit, errors, setFieldValue, values } = useForm({
  validationSchema,
  initialValues: {
    lote: props.modelValue.lote || '',
    cliente: props.modelValue.cliente || '',
    producto: props.modelValue.producto || '',
    pedido: props.modelValue.pedido || '',
    fechaFabricacion: props.modelValue.fechaFabricacion || '',
    codigoProducto: props.modelValue.codigoProducto || '',
    turno: props.modelValue.turno || '',
    jefeDeTurno: props.modelValue.jefeDeTurno || '',
    ordenDeCompra: props.modelValue.ordenDeCompra || '',
    numeroOperario: props.modelValue.numeroOperario || '',
    maquina: props.modelValue.maquina || '',
    inspectorCalidad: props.modelValue.inspectorCalidad || '',
    unidadesPorEmbalaje: props.modelValue.unidadesPorEmbalaje
  }
})

// Campos individuales con mejor control de errores
const { value: lote } = useField('lote')
const { value: cliente, errorMessage: clienteError } = useField('cliente')
const { value: producto, errorMessage: productoError } = useField('producto')
const { value: pedido, errorMessage: pedidoError } = useField('pedido')
const { value: fechaFabricacion, errorMessage: fechaError } = useField('fechaFabricacion')
const { value: codigoProducto, errorMessage: codigoError } = useField('codigoProducto')
const { value: turno, errorMessage: turnoError } = useField('turno')
const { value: jefeDeTurno } = useField('jefeDeTurno')
const { value: ordenDeCompra } = useField('ordenDeCompra')
const { value: numeroOperario, errorMessage: operarioError } = useField('numeroOperario')
const { value: maquina, errorMessage: maquinaError } = useField('maquina')
const { value: inspectorCalidad, errorMessage: inspectorError } = useField('inspectorCalidad')
const { value: unidadesPorEmbalaje } = useField('unidadesPorEmbalaje')

// State for tracking OCR pre-filled data
const hasOCRData = ref(false)
const toast = useToast()

// Check if we have OCR data when component mounts
onMounted(() => {
  console.log('Step2 - props.modelValue.unidadesPorEmbalaje:', props.modelValue.unidadesPorEmbalaje)
  const hasData = props.modelValue.cliente || props.modelValue.producto || props.modelValue.lote || props.modelValue.unidadesPorEmbalaje
  if (hasData) {
    hasOCRData.value = true
    const toast = useToast()
    toast.success('Datos precargados', 'Los campos se han completado automáticamente con los datos extraídos de la imagen')
  }
})

// Watch for form values changes and emit updates
watch(values, (formValues) => {
  emit('update:modelValue', {
    ...props.modelValue,
    ...formValues,
    // Asegurar que unidadesPorEmbalaje sea number | undefined, no null
    unidadesPorEmbalaje: formValues.unidadesPorEmbalaje ?? undefined
  })
}, { deep: true })

// Watch for incoming OCR data from parent
watch(() => props.modelValue, (newValue, oldValue) => {
  console.log('Step2 - Watch triggered, newValue.unidadesPorEmbalaje:', newValue.unidadesPorEmbalaje, 'oldValue?.unidadesPorEmbalaje:', oldValue?.unidadesPorEmbalaje)
  // Update form fields with new values from OCR
  setFieldValue('lote', newValue.lote || '')
  setFieldValue('cliente', newValue.cliente || '')
  setFieldValue('producto', newValue.producto || '')
  setFieldValue('pedido', newValue.pedido || '')
  setFieldValue('fechaFabricacion', newValue.fechaFabricacion || '')
  setFieldValue('codigoProducto', newValue.codigoProducto || '')
  setFieldValue('turno', newValue.turno || '')
  setFieldValue('jefeDeTurno', newValue.jefeDeTurno || '')
  setFieldValue('ordenDeCompra', newValue.ordenDeCompra || '')
  setFieldValue('numeroOperario', newValue.numeroOperario || '')
  setFieldValue('maquina', newValue.maquina || '')
  setFieldValue('inspectorCalidad', newValue.inspectorCalidad || '')
  setFieldValue('unidadesPorEmbalaje', newValue.unidadesPorEmbalaje)
  console.log('Step2 - After setFieldValue, unidadesPorEmbalaje.value:', unidadesPorEmbalaje.value)
  
  // Show toast notification if new OCR data arrives
  const hasNewData = (newValue.cliente && !oldValue?.cliente) || 
                     (newValue.producto && !oldValue?.producto) ||
                     (newValue.lote && !oldValue?.lote) ||
                     (newValue.unidadesPorEmbalaje && !oldValue?.unidadesPorEmbalaje)
  
  if (hasNewData && !hasOCRData.value) {
    hasOCRData.value = true
    toast.success('Datos precargados', 'Los campos se han completado automáticamente con los datos extraídos de la imagen')
  }
}, { deep: true })

// Computed - Usar validación del formulario
const canProceed = computed(() => {
  return Object.keys(errors.value).length === 0 &&
         cliente.value && 
         producto.value && 
         pedido.value && 
         codigoProducto.value &&
         fechaFabricacion.value &&
         turno.value &&
         numeroOperario.value &&
         maquina.value &&
         inspectorCalidad.value
})

// Methods - Usar handleSubmit para validación
const handleNext = handleSubmit(() => {
  if (canProceed.value) {
    emit('next')
  }
})
</script>