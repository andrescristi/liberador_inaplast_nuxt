<template>
  <div class="max-w-4xl mx-auto">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Nuevo Liberador de Producto</h1>
    
    <!-- Progress Bar -->
    <OrderWizardProgress 
      :current-step="currentStep" 
      :total-steps="totalSteps" 
      :steps="stepLabels"
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
// Types
interface OrderFormData {
  // Step 1
  labelImage: File | null
  labelImagePreview: string
  boxQuantity: number
  
  // Step 2
  customerCode: string
  customerName: string
  productCode: string
  productName: string
  productCategory: string
  expirationDate: string
  lotNumber: string
  productionDate: string
  
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

// Composables y utilidades
const { $logger } = useNuxtApp()
const toast = useToast()
const router = useRouter()

// Logger estandarizado para el componente
const logger = {
  info: (message: string, context?: Record<string, unknown>) => {
    if ($logger && typeof ($logger as { info?: (...args: unknown[]) => void }).info === 'function') {
      ($logger as { info: (...args: unknown[]) => void }).info({ context: 'OrderWizard', ...context }, message)
    } else if (import.meta.dev) {
      // En desarrollo, fallback a console para debug local
      console.info('[OrderWizard]', message, context)
    }
  },
  error: (message: string, error: unknown, context?: Record<string, unknown>) => {
    const errorDetails = {
      context: 'OrderWizard',
      error: error instanceof Error ? {
        message: error.message,
        stack: error.stack,
        name: error.name
      } : String(error),
      ...context
    }
    
    if ($logger && typeof ($logger as { error?: (...args: unknown[]) => void }).error === 'function') {
      ($logger as { error: (...args: unknown[]) => void }).error(errorDetails, message)
    } else if (import.meta.dev) {
      // En desarrollo, fallback a console para debug local
      console.error('[OrderWizard]', message, errorDetails)
    }
  },
  warn: (message: string, context?: Record<string, unknown>) => {
    if ($logger && typeof ($logger as { warn?: (...args: unknown[]) => void }).warn === 'function') {
      ($logger as { warn: (...args: unknown[]) => void }).warn({ context: 'OrderWizard', ...context }, message)
    } else if (import.meta.dev) {
      // En desarrollo, fallback a console para debug local
      console.warn('[OrderWizard]', message, context)
    }
  }
}

// State
const currentStep = ref(1)
const totalSteps = 4
const isSaving = ref(false)

const stepLabels = [
  'Paso 1: Datos Iniciales',
  'Paso 2: Detalles del Producto', 
  'Paso 3: Pruebas de Calidad',
  'Paso 4: Resumen y Resultados'
]

const formData = ref<OrderFormData>({
  // Step 1
  labelImage: null,
  labelImagePreview: '',
  boxQuantity: 1,
  
  // Step 2  
  customerCode: '',
  customerName: '',
  productCode: '',
  productName: '',
  productCategory: '',
  expirationDate: '',
  lotNumber: '',
  productionDate: '',
  
  // Step 3
  packagingTest: false,
  labelingTest: false,  
  sealingTest: false,
  weightTest: false,
  qualityNotes: '',
  
  // Step 4
  finalResult: 'approved',
  rejectionReason: '',
  recommendations: ''
})

// Methods con logging mejorado
const nextStep = () => {
  if (currentStep.value < totalSteps) {
    const previousStepValue = currentStep.value
    currentStep.value++
    logger.info('Navegando al siguiente paso', { 
      from: previousStepValue, 
      to: currentStep.value 
    })
  } else {
    logger.warn('Intento de avanzar más allá del último paso', { 
      currentStep: currentStep.value, 
      totalSteps 
    })
  }
}

const previousStep = () => {
  if (currentStep.value > 1) {
    const previousStepValue = currentStep.value
    currentStep.value--
    logger.info('Navegando al paso anterior', { 
      from: previousStepValue, 
      to: currentStep.value 
    })
  } else {
    logger.warn('Intento de retroceder más allá del primer paso', { 
      currentStep: currentStep.value 
    })
  }
}

interface OCRData {
  customerName?: string
  customerCode?: string
  productName?: string
  productCode?: string
  lotNumber?: string
  expirationDate?: string
  productionDate?: string
}

const handleOCRComplete = (ocrData: OCRData) => {
  try {
    logger.info('Procesando datos de OCR', { ocrData })
    
    // Update form data with OCR results immediately
    let updatedFields = 0
    
    if (ocrData.customerName) {
      formData.value.customerName = ocrData.customerName
      updatedFields++
    }
    if (ocrData.productName) {
      formData.value.productName = ocrData.productName
      updatedFields++
    }
    if (ocrData.lotNumber) {
      formData.value.lotNumber = ocrData.lotNumber
      updatedFields++
    }
    if (ocrData.expirationDate) {
      formData.value.expirationDate = ocrData.expirationDate
      updatedFields++
    }
    if (ocrData.customerCode) {
      formData.value.customerCode = ocrData.customerCode
      updatedFields++
    }
    if (ocrData.productCode) {
      formData.value.productCode = ocrData.productCode
      updatedFields++
    }
    if (ocrData.productionDate) {
      formData.value.productionDate = ocrData.productionDate
      updatedFields++
    }
    
    // Mostrar feedback positivo al usuario
    if (updatedFields > 0) {
      toast.success('OCR Completado', `Se llenaron automáticamente ${updatedFields} campo${updatedFields > 1 ? 's' : ''}`)
      logger.info('OCR completado exitosamente', { updatedFields })
    } else {
      toast.info('OCR Procesado', 'No se detectaron datos válidos en la imagen')
      logger.warn('OCR no detectó campos válidos', { ocrData })
    }
    
  } catch (error) {
    logger.error('Error procesando datos de OCR', error, { ocrData })
    toast.error('Error en OCR', 'No se pudieron procesar los datos de la imagen. Por favor, ingrese los datos manualmente.')
  }
}

const handleSave = async () => {
  if (isSaving.value) {
    logger.warn('Intento de guardado mientras ya se está guardando')
    return
  }
  
  isSaving.value = true
  
  try {
    logger.info('Iniciando guardado de orden', { 
      currentStep: currentStep.value, 
      hasLabelImage: !!formData.value.labelImage 
    })
    
    // Validar datos básicos antes del guardado
    if (!formData.value.customerName || !formData.value.productName) {
      throw new Error('Faltan datos obligatorios: nombre del cliente y producto')
    }
    
    // Preparar datos para guardar
    const orderData = {
      ...formData.value,
      createdAt: new Date().toISOString(),
      status: formData.value.finalResult,
      // Convertir File a string si existe (para logging)
      labelImageInfo: formData.value.labelImage ? {
        name: formData.value.labelImage.name,
        size: formData.value.labelImage.size,
        type: formData.value.labelImage.type
      } : null
    }
    
    logger.info('Datos de orden preparados', { orderData })
    
    // TODO: Implementar guardado real
    // const savedOrder = await $fetch('/api/orders', {
    //   method: 'POST',
    //   body: orderData
    // })
    
    // Simular guardado por ahora
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mostrar éxito al usuario
    toast.success('Orden Guardada', 'El liberador de producto se creó exitosamente')
    logger.info('Orden guardada exitosamente', { orderId: 'mock-id' })
    
    // Navegación segura con manejo de errores
    try {
      await router.push('/orders')
    } catch (navError) {
      logger.error('Error en navegación después del guardado', navError)
      // No mostrar error al usuario, la orden sí se guardó
      // Solo loggeamos para debug
    }
    
  } catch (error) {
    logger.error('Error guardando orden', error, {
      formData: {
        customerName: formData.value.customerName,
        productName: formData.value.productName,
        finalResult: formData.value.finalResult
      }
    })
    
    // Mostrar error específico basado en el tipo de error
    if (error instanceof Error) {
      if (error.message.includes('obligatorios')) {
        toast.error('Datos Incompletos', error.message)
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        toast.error('Error de Conexión', 'Verifique su conexión a internet y reintente')
      } else {
        toast.error('Error al Guardar', `${error.message}. Por favor, intente nuevamente.`)
      }
    } else {
      toast.error('Error Inesperado', 'Ocurrió un error desconocido. Por favor, intente nuevamente.')
    }
    
  } finally {
    isSaving.value = false
    logger.info('Proceso de guardado finalizado', { isSaving: isSaving.value })
  }
}
</script>