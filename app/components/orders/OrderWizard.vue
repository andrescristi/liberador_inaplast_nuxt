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
        @previous="previousStep"
        @save="handleSave"
        :is-saving="isSaving"
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

// Composables
const { $logger } = useNuxtApp()

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

// Methods
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

const handleOCRComplete = (ocrData: any) => {
  // Update form data with OCR results
  if (ocrData.customerName) formData.value.customerName = ocrData.customerName
  if (ocrData.productName) formData.value.productName = ocrData.productName
  if (ocrData.lotNumber) formData.value.lotNumber = ocrData.lotNumber
  if (ocrData.expirationDate) formData.value.expirationDate = ocrData.expirationDate
}

const handleSave = async () => {
  isSaving.value = true
  
  try {
    // Save order logic here
    const orderData = {
      ...formData.value,
      createdAt: new Date().toISOString(),
      status: formData.value.finalResult
    }
    
    // Call API to save order
    // await saveOrder(orderData)
    
    // Navigate to orders list
    await navigateTo('/orders')
    
  } catch (error) {
    if (import.meta.server) {
      if ($logger && typeof ($logger as any).error === 'function') {
        ($logger as any).error({
          error: error instanceof Error ? error.message : String(error),
          context: 'OrderWizard.handleSave'
        }, 'Error saving order')
      }
    }
    
    // Show error toast
    const toast = useToast()
    toast.error('Error al guardar', 'Por favor, intente nuevamente.')
  } finally {
    isSaving.value = false
  }
}
</script>