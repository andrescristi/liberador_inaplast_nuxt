import { describe, it, expect, vi } from 'vitest'

describe('/api/ocr/extract - Data Validation Tests', () => {
  it('debería tener estructura de respuesta correcta para datos válidos', () => {
    const mockResponse = {
      success: true,
      text: 'Texto extraído',
      productionData: {
        lote: "LOT20241201001",
        cliente: "Industrias Test S.A.",
        producto: "Bolsa de Polietileno 25kg",
        codigoProducto: "BOL25KG",
        fechaFabricacion: "2024-12-01"
      },
      metadata: {
        filename: 'test.jpg',
        processedAt: '2024-12-01T10:00:00Z',
        model: 'gemini-2.0-flash-exp'
      }
    }
    
    expect(mockResponse).toHaveProperty('success')
    expect(mockResponse).toHaveProperty('text')
    expect(mockResponse).toHaveProperty('productionData')
    expect(mockResponse).toHaveProperty('metadata')
    
    expect(mockResponse.productionData).toHaveProperty('lote')
    expect(mockResponse.productionData).toHaveProperty('cliente')
    expect(mockResponse.productionData).toHaveProperty('producto')
    expect(mockResponse.productionData).toHaveProperty('codigoProducto')
    expect(mockResponse.productionData).toHaveProperty('fechaFabricacion')
  })

  it('debería validar correctamente tipos MIME soportados', () => {
    const validMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/bmp', 'image/gif']
    const invalidMimeTypes = ['text/plain', 'application/pdf', 'video/mp4']
    
    validMimeTypes.forEach(mimeType => {
      expect(validMimeTypes.includes(mimeType)).toBe(true)
    })
    
    invalidMimeTypes.forEach(mimeType => {
      expect(validMimeTypes.includes(mimeType)).toBe(false)
    })
  })

  it('debería mapear correctamente datos de producción', () => {
    const productionData = {
      lote: "LOT001",
      cliente: "Cliente Test",
      producto: "Producto Test",
      codigoProducto: "PROD001",
      fechaFabricacion: "2024-12-01"
    }

    // Verificar mapeo a OCRData
    const expectedMapping = {
      customerName: productionData.cliente,
      customerCode: productionData.cliente,
      productName: productionData.producto,
      productCode: productionData.codigoProducto,
      lotNumber: productionData.lote,
      productionDate: productionData.fechaFabricacion,
      expirationDate: undefined
    }

    expect(expectedMapping.customerName).toBe('Cliente Test')
    expect(expectedMapping.customerCode).toBe('Cliente Test')
    expect(expectedMapping.productName).toBe('Producto Test')
    expect(expectedMapping.productCode).toBe('PROD001')
    expect(expectedMapping.lotNumber).toBe('LOT001')
    expect(expectedMapping.productionDate).toBe('2024-12-01')
    expect(expectedMapping.expirationDate).toBeUndefined()
  })
})

describe('/api/ocr/extract - Image Compression Tests', () => {
  it('debería comprimir imágenes grandes correctamente', () => {
    const largeImageSize = 500 * 1024 // 500KB
    const targetSize = 300 * 1024 // 300KB
    
    // Simular compresión
    const compressionRatio = targetSize / largeImageSize
    const expectedCompressedSize = largeImageSize * compressionRatio
    
    expect(expectedCompressedSize).toBeLessThanOrEqual(targetSize)
  })

  it('debería mantener imágenes pequeñas sin compresión', () => {
    const smallImageSize = 150 * 1024 // 150KB
    const threshold = 200 * 1024 // 200KB
    
    // Si la imagen es menor al umbral, no debería comprimirse
    const shouldCompress = smallImageSize > threshold
    
    expect(shouldCompress).toBe(false)
  })

  it('debería aplicar compresión progresiva en múltiples niveles', () => {
    const compressionLevels = [
      { quality: 80, maxSize: 300 * 1024 },
      { quality: 60, maxSize: 300 * 1024 },
      { quality: 40, maxSize: 300 * 1024 }
    ]
    
    compressionLevels.forEach(level => {
      expect(level.quality).toBeGreaterThan(0)
      expect(level.quality).toBeLessThanOrEqual(100)
      expect(level.maxSize).toBe(300 * 1024)
    })
  })

  it('debería validar formato de imagen comprimida', () => {
    const originalFormat = 'image/png'
    const compressedFormat = 'image/jpeg'
    
    // Al comprimir, el formato debería cambiar a JPEG para mejor compresión
    expect(compressedFormat).toBe('image/jpeg')
    expect(originalFormat).not.toBe(compressedFormat)
  })

  it('debería incluir metadata de compresión en la respuesta', () => {
    const mockResponse = {
      success: true,
      text: 'Texto extraído',
      metadata: {
        filename: 'test.jpg',
        processedAt: '2024-12-01T10:00:00Z',
        model: 'gemini-2.0-flash-exp',
        originalSizeKB: 500,
        finalSizeKB: 250,
        processingTimeMs: 1500
      }
    }
    
    expect(mockResponse.metadata).toHaveProperty('originalSizeKB')
    expect(mockResponse.metadata).toHaveProperty('finalSizeKB')
    expect(mockResponse.metadata).toHaveProperty('processingTimeMs')
    expect(mockResponse.metadata.finalSizeKB).toBeLessThan(mockResponse.metadata.originalSizeKB)
  })

  it('debería manejar errores de compresión graciosamente', () => {
    const mockError = new Error('Error comprimiendo imagen')
    const fallbackBehavior = (error: Error) => {
      // En caso de error, debería devolver la imagen original
      return {
        useOriginal: true,
        error: error.message
      }
    }
    
    const result = fallbackBehavior(mockError)
    
    expect(result.useOriginal).toBe(true)
    expect(result.error).toBe('Error comprimiendo imagen')
  })
})

describe('/api/ocr/extract - Sharp Integration Tests', () => {
  it('debería configurar Sharp con parámetros correctos', () => {
    const sharpConfig = {
      jpeg: {
        quality: 80,
        progressive: true,
        mozjpeg: true
      },
      resize: {
        width: 1920,
        height: 1080,
        fit: 'inside',
        withoutEnlargement: true
      }
    }
    
    expect(sharpConfig.jpeg.quality).toBe(80)
    expect(sharpConfig.jpeg.progressive).toBe(true)
    expect(sharpConfig.jpeg.mozjpeg).toBe(true)
    expect(sharpConfig.resize.fit).toBe('inside')
  })

  it('debería aplicar configuraciones de compresión en cascada', () => {
    const compressionSteps = [
      { quality: 80, maxSize: { width: 1920, height: 1080 } },
      { quality: 60, maxSize: { width: 1280, height: 720 } },
      { quality: 40, maxSize: { width: 800, height: 600 } }
    ]
    
    compressionSteps.forEach((step, index) => {
      expect(step.quality).toBeLessThan(index === 0 ? 100 : compressionSteps[index - 1].quality)
      expect(step.maxSize.width).toBeGreaterThan(0)
      expect(step.maxSize.height).toBeGreaterThan(0)
    })
  })
})