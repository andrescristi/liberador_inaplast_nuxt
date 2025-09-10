<template>
  <div class="max-w-4xl mx-auto">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Nuevo Liberador de Producto</h1>
    
    <!-- Progress Bar -->
    <OrderWizardProgress 
      :current-step="currentStep" 
      :total-steps="4" 
      :steps="['Paso 1: Datos Iniciales', 'Paso 2: Detalles del Producto', 'Paso 3: Pruebas de Calidad', 'Paso 4: Resumen y Resultados']"
    />

    <!-- Wizard Content -->
    <div class="mt-8">
      <!-- Step 1: Initial Data -->
      <OrderWizardStep1
        v-if="currentStep === 1"
        v-model="formData"
        @next="nextStep"
        @ocr-complete="handleOCRComplete"
      />

      <!-- Step 2: Product Details -->
      <OrderWizardStep2
        v-if="currentStep === 2"
        v-model="formData"
        @next="nextStep"
        @previous="previousStep"
      />

      <!-- Step 3: Quality Tests -->
      <OrderWizardStep3
        v-if="currentStep === 3"
        v-model="formData"
        @next="nextStep"
        @previous="previousStep"
      />

      <!-- Step 4: Summary & Results -->
      <OrderWizardStep4
        v-if="currentStep === 4"
        v-model="formData"
        :is-saving="isSaving"
        @previous="previousStep"
        @save="handleSave"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
// Types - Usar el tipo correcto del schema
import type { NewOrderData } from '~/schemas/orders/new_order'

interface OCRData {
  cliente?: string
  producto?: string
  codigoProducto?: string
  lote?: string
  fechaFabricacion?: string
  pedido?: string
  turno?: string
  numeroOperario?: string
  maquina?: string
  inspectorCalidad?: string
  jefeDeTurno?: string
  ordenDeCompra?: string
  unidadesPorEmbalaje?: number
}

// Composables
const toast = useToast()
const router = useRouter()

// State
const currentStep = ref(1)
const isSaving = ref(false)

const formData = ref<NewOrderData>({
  // Step 1
  labelImage: null,
  labelImagePreview: '',
  cantidadEmbalajes: 1,
  unidadesPorEmbalaje: undefined,
  
  // Step 2 - Campos requeridos por la API
  lote: '',
  cliente: '',
  producto: '',
  pedido: '',
  fechaFabricacion: '',
  codigoProducto: '',
  turno: 'mañana',
  jefeDeTurno: '',
  ordenDeCompra: '',
  numeroOperario: '',
  maquina: '',
  inspectorCalidad: '',
  
  // Step 3
  cantidadMuestra: 1,
  qualityNotes: '',
  testResults: {},
  ordersTests: [],
  
  // Step 4
  finalResult: 'approved',
  rejectionReason: '',
  recommendations: ''
})

// Methods
const nextStep = () => {
  if (currentStep.value < 4) {
    currentStep.value++
  }
}

const previousStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const handleOCRComplete = (ocrData: OCRData) => {
  try {
    let updatedFields = 0
    
    if (ocrData.cliente) {
      formData.value.cliente = ocrData.cliente
      updatedFields++
    }
    if (ocrData.producto) {
      formData.value.producto = ocrData.producto
      updatedFields++
    }
    if (ocrData.lote) {
      formData.value.lote = ocrData.lote
      updatedFields++
    }
    if (ocrData.fechaFabricacion) {
      formData.value.fechaFabricacion = ocrData.fechaFabricacion
      updatedFields++
    }
    if (ocrData.codigoProducto) {
      formData.value.codigoProducto = ocrData.codigoProducto
      updatedFields++
    }
    if (ocrData.pedido) {
      formData.value.pedido = ocrData.pedido
      updatedFields++
    }
    if (ocrData.turno) {
      formData.value.turno = ocrData.turno
      updatedFields++
    }
    if (ocrData.numeroOperario) {
      formData.value.numeroOperario = ocrData.numeroOperario
      updatedFields++
    }
    if (ocrData.maquina) {
      formData.value.maquina = ocrData.maquina
      updatedFields++
    }
    if (ocrData.inspectorCalidad) {
      formData.value.inspectorCalidad = ocrData.inspectorCalidad
      updatedFields++
    }
    if (ocrData.jefeDeTurno) {
      formData.value.jefeDeTurno = ocrData.jefeDeTurno
      updatedFields++
    }
    if (ocrData.ordenDeCompra) {
      formData.value.ordenDeCompra = ocrData.ordenDeCompra
      updatedFields++
    }
    if (ocrData.unidadesPorEmbalaje) {
      formData.value.unidadesPorEmbalaje = ocrData.unidadesPorEmbalaje
      updatedFields++
    }
    
    if (updatedFields > 0) {
      toast.success('OCR Completado', `Se llenaron automáticamente ${updatedFields} campo${updatedFields > 1 ? 's' : ''}`)
    } else {
      toast.info('OCR Procesado', 'No se detectaron datos válidos en la imagen')
    }
    
  } catch {
    toast.error('Error en OCR', 'No se pudieron procesar los datos de la imagen. Por favor, ingrese los datos manualmente.')
  }
}

const handleSave = async (createdOrder?: { orderId: number }) => {
  if (isSaving.value) return
  
  isSaving.value = true
  
  try {
    // La orden ya fue creada en OrderWizardStep4
    // Solo manejar la navegación y notificación de éxito
    if (createdOrder) {
      toast.success('Orden Guardada', 'Orden creada exitosamente')
      await router.push('/orders')
    } else {
      throw new Error('No se recibió la orden creada')
    }
    
  } catch (error: unknown) {
    let errorMessage = 'Ocurrió un error inesperado'
    
    if (error && typeof error === 'object' && 'data' in error && 
        error.data && typeof error.data === 'object' && 'message' in error.data) {
      errorMessage = String(error.data.message)
    } else if (error instanceof Error) {
      errorMessage = error.message
    } else if (typeof error === 'string') {
      errorMessage = error
    }
    
    toast.error('Error al Guardar', errorMessage)
  } finally {
    isSaving.value = false
  }
}
</script>