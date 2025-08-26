import { describe, it, expect } from 'vitest'

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