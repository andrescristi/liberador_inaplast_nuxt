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

interface OCRData {
  customerName?: string
  customerCode?: string
  productName?: string
  productCode?: string
  lotNumber?: string
  expirationDate?: string
  productionDate?: string
}

// Composables
const toast = useToast()
const router = useRouter()

// State
const currentStep = ref(1)
const isSaving = ref(false)

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
    
    if (updatedFields > 0) {
      toast.success('OCR Completado', `Se llenaron automáticamente ${updatedFields} campo${updatedFields > 1 ? 's' : ''}`)
    } else {
      toast.info('OCR Procesado', 'No se detectaron datos válidos en la imagen')
    }
    
  } catch {
    toast.error('Error en OCR', 'No se pudieron procesar los datos de la imagen. Por favor, ingrese los datos manualmente.')
  }
}

const handleSave = async () => {
  if (isSaving.value) return
  
  isSaving.value = true
  
  try {
    // TODO: Implementar guardado real con API
    // const orderData = {
    //   ...formData.value,
    //   createdAt: new Date().toISOString(),
    //   status: formData.value.finalResult
    // }
    // const savedOrder = await $fetch('/api/orders', {
    //   method: 'POST',
    //   body: orderData
    // })
    
    toast.success('Orden Guardada', 'El liberador de producto se creó exitosamente')
    await router.push('/orders')
    
  } catch (error) {
    if (error instanceof Error) {
      toast.error('Error al Guardar', error.message)
    } else {
      toast.error('Error Inesperado', 'Ocurrió un error. Por favor, intente nuevamente.')
    }
  } finally {
    isSaving.value = false
  }
}
</script>