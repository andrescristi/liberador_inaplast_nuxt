import type { OCRData } from '~/schemas/orders/ocr'

interface OCRResponse {
  text: string
  productionData?: {
    lote?: string
    cliente?: string
    producto?: string
    pedido?: string
    fechaFabricacion?: string
    codigoProducto?: string
    unidadesPorEmbalaje?: number
    turno?: string
    unidades?: string
    jefeDeTurno?: string
    ordenDeCompra?: string
    numeroOperario?: string
    maquina?: string
    inspectorCalidad?: string
    
  }
  success: boolean
  error?: string
  metadata?: {
    filename?: string
    processedAt: string
    model: string
  }
}

/**
 * Composable para gestionar configuración de OCR
 * Conecta con el endpoint api/ocr/extract para procesamiento de imágenes
 */
export function useOCRConfig() {

  // Configuración de reintentos
  const retryConfig = {
    maxAttempts: 3,
    baseDelay: 1000, // 1 segundo
    maxDelay: 5000   // 5 segundos
  }

  /**
   * Convierte archivo de imagen a base64 sin compresión (se hace en el servidor)
   */
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const result = reader.result as string
        // Remover el prefijo data URL para obtener solo el base64
        const base64 = result.split(',')[1]
        if (base64) {
          resolve(base64)
        } else {
          reject(new Error('Error convirtiendo archivo a base64'))
        }
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  /**
   * Normaliza el valor del turno para que coincida con las opciones del select
   */
  const normalizeTurno = (turno: string | undefined): string | undefined => {
    if (!turno) return undefined
    
    const turnoLower = turno.toLowerCase().trim()
    
    // Mapear variaciones comunes a los valores esperados
    if (turnoLower.includes('mañana') || turnoLower.includes('manana') || turnoLower.includes('morning')) {
      return 'mañana'
    }
    if (turnoLower.includes('tarde') || turnoLower.includes('afternoon')) {
      return 'tarde'
    }
    if (turnoLower.includes('noche') || turnoLower.includes('night') || turnoLower.includes('nocturno')) {
      return 'noche'
    }
    
    // Si no coincide con ningún patrón, devolver el valor original en minúsculas
    return turnoLower
  }

  /**
   * Mapea datos del endpoint a formato OCRData
   */
  const mapToOCRData = (response: OCRResponse): OCRData => {
    const production = response.productionData
    
    // Processing OCR production data
    
    const mappedData = {
      // Campos básicos
      cliente: production?.cliente || undefined,
      producto: production?.producto || undefined,
      codigoProducto: production?.codigoProducto || undefined,
      lote: production?.lote || undefined,
      fechaFabricacion: production?.fechaFabricacion || undefined,
      pedido: production?.pedido || undefined,
      unidadesPorEmbalaje: production?.unidadesPorEmbalaje || undefined,
      // Campos adicionales con normalización especial para turno
      turno: normalizeTurno(production?.turno),
      numeroOperario: production?.numeroOperario || undefined,
      maquina: production?.maquina || undefined,
      inspectorCalidad: production?.inspectorCalidad || undefined,
      jefeDeTurno: production?.jefeDeTurno || undefined,
      ordenDeCompra: production?.ordenDeCompra || undefined
    }
    
    // OCR data mapped successfully
    
    return mappedData
  }

  /**
   * Procesa OCR usando el endpoint api/ocr/extract
   */
  const processOCR = async (imageFile: File): Promise<OCRData> => {
    try {
      // Convertir imagen a base64
      const imageData = await fileToBase64(imageFile)
      
      // Llamar al endpoint
      const response = await $fetch<OCRResponse>('/api/ocr/extract', {
        method: 'POST',
        body: {
          imageData,
          mimeType: imageFile.type,
          filename: imageFile.name
        }
      })

      // OCR response received
      
      if (!response.success) {
        throw new Error(response.error || 'Error procesando OCR')
      }
      
      return mapToOCRData(response)
    } catch (error) {
      throw new Error(`Error procesando OCR: ${error instanceof Error ? error.message : 'Error desconocido'}`)
    }
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
    retryConfig: readonly(ref(retryConfig)),
    processOCR,
    processOCRWithRetry,
    validateImageForOCR
  }
}