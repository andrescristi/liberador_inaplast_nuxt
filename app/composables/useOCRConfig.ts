import type { OCRData } from '~/schemas/order'

/**
 * Composable para gestionar configuración de OCR
 * Permite alternar entre servicio real y mock usando feature flags
 */
export function useOCRConfig() {
  const config = useRuntimeConfig()
  
  // Feature flag para usar mock OCR (desarrollo vs producción)
  const useMockOCR = computed(() => {
    // En desarrollo siempre usar mock
    if (import.meta.dev) return true
    
    // En producción, verificar env variable
    return config.public.enableMockOCR === 'true'
  })

  // Datos mock para desarrollo y testing
  const mockOCRData: OCRData = {
    customerName: 'Industrias Alimentarias S.A.',
    customerCode: 'CLI001',
    productName: 'Bolsa de Polietileno 25kg',
    productCode: 'BOL25KG',
    lotNumber: 'LOT20241215001',
    expirationDate: '2025-06-15',
    productionDate: '2024-12-15'
  }

  // Configuración de reintentos
  const retryConfig = {
    maxAttempts: 3,
    baseDelay: 1000, // 1 segundo
    maxDelay: 5000   // 5 segundos
  }

  /**
   * Procesa OCR con mock o servicio real según configuración
   */
  const processOCR = async (imageFile: File): Promise<OCRData> => {
    if (useMockOCR.value) {
      return processOCRMock(imageFile)
    }
    return processOCRReal(imageFile)
  }

  /**
   * Procesa OCR con datos mock
   */
  const processOCRMock = async (imageFile: File): Promise<OCRData> => {
    // Simular tiempo de procesamiento
    const processingTime = Math.random() * 2000 + 1000 // 1-3 segundos
    await new Promise(resolve => setTimeout(resolve, processingTime))
    
    // Simular ocasional fallo (5% de probabilidad)
    if (Math.random() < 0.05) {
      throw new Error('Error simulado de OCR')
    }
    
    // Agregar variación a los datos mock basada en el nombre del archivo
    const fileName = imageFile.name
    const hash = fileName.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0)
      return a & a
    }, 0)
    
    const variations = [
      { customerCode: 'CLI002', lotNumber: 'LOT20241215002' },
      { customerCode: 'CLI003', lotNumber: 'LOT20241215003' },
      { customerCode: 'CLI004', lotNumber: 'LOT20241215004' },
    ]
    
    const variation = variations[Math.abs(hash) % variations.length]
    
    return {
      ...mockOCRData,
      ...variation
    }
  }

  /**
   * Procesa OCR con servicio real (implementar cuando esté disponible)
   */
  const processOCRReal = async (_imageFile: File): Promise<OCRData> => {
    // TODO: Implementar integración con servicio real de OCR
    // Por ejemplo: Google Cloud Vision, AWS Textract, Azure Cognitive Services
    
    throw new Error('Servicio real de OCR no implementado aún')
  }

  /**
   * Procesa OCR con mecanismo de reintentos
   */
  const processOCRWithRetry = async (
    imageFile: File,
    onRetry?: (attempt: number, error: Error) => void
  ): Promise<OCRData> => {
    let lastError: Error
    
    for (let attempt = 1; attempt <= retryConfig.maxAttempts; attempt++) {
      try {
        return await processOCR(imageFile)
      } catch (error) {
        lastError = error as Error
        
        // Si es el último intento, lanzar el error
        if (attempt === retryConfig.maxAttempts) {
          throw lastError
        }
        
        // Notificar del reintento
        if (onRetry) {
          onRetry(attempt, lastError)
        }
        
        // Calcular delay exponencial con jitter
        const delay = Math.min(
          retryConfig.baseDelay * Math.pow(2, attempt - 1) + Math.random() * 1000,
          retryConfig.maxDelay
        )
        
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
    
    throw lastError!
  }

  /**
   * Valida si un archivo es adecuado para OCR
   */
  const validateImageForOCR = (file: File): { valid: boolean; error?: string } => {
    // Verificar tipo de archivo
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'Tipo de archivo no soportado. Use JPEG, PNG o WebP'
      }
    }

    // Verificar tamaño (máximo 10MB)
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      return {
        valid: false,
        error: 'El archivo es demasiado grande. Máximo 10MB'
      }
    }

    // Verificar tamaño mínimo (1KB)
    if (file.size < 1024) {
      return {
        valid: false,
        error: 'El archivo es demasiado pequeño'
      }
    }

    return { valid: true }
  }

  return {
    useMockOCR: readonly(useMockOCR),
    mockOCRData: readonly(ref(mockOCRData)),
    retryConfig: readonly(ref(retryConfig)),
    processOCR,
    processOCRMock,
    processOCRReal,
    processOCRWithRetry,
    validateImageForOCR
  }
}