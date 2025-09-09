import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useOCRConfig } from '~/composables/tools/useOCRConfig'

// Mock global $fetch
const mockFetch = vi.fn()
vi.stubGlobal('$fetch', mockFetch)

// Mock FileReader
const mockFileReader = {
  onload: null as any,
  onerror: null as any,
  result: null as any,
  readAsDataURL: vi.fn()
}
vi.stubGlobal('FileReader', vi.fn(() => mockFileReader))

describe('OCR Server Compatibility - Nomenclature Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Server Response Mapping', () => {
    it('mapea correctamente respuesta del servidor con nomenclatura camelCase', async () => {
      const { processOCR } = useOCRConfig()
      
      // Simular respuesta del servidor OCR con nomenclatura camelCase
      const serverResponse = {
        success: true,
        text: 'Texto extraído por OCR',
        productionData: {
          cliente: 'Empresa Industrial S.A.',
          producto: 'Bolsa Industrial 50kg',
          codigoProducto: 'BI-50-001',
          lote: 'LOT2024001',
          fechaFabricacion: '2024-01-15',
          pedido: 'PED-2024-001',
          turno: 'mañana',
          numeroOperario: 'OP-001',
          maquina: 'EXTRUSORA-01',
          inspectorCalidad: 'Juan Pérez',
          jefeDeTurno: 'María González',
          ordenDeCompra: 'OC-2024-001'
        },
        metadata: {
          filename: 'etiqueta.jpg',
          processedAt: '2024-01-15T10:30:00Z',
          model: 'gemini-2.0-flash-exp'
        }
      }

      mockFetch.mockResolvedValueOnce(serverResponse)
      
      mockFileReader.readAsDataURL.mockImplementation(() => {
        mockFileReader.result = 'data:image/jpeg;base64,testdata'
        if (mockFileReader.onload) {
          mockFileReader.onload()
        }
      })

      const testFile = new File(['test'], 'etiqueta.jpg', { type: 'image/jpeg' })
      const result = await processOCR(testFile)

      // Verificar que el mapeo mantiene la nomenclatura camelCase
      expect(result.fechaFabricacion).toBe('2024-01-15')
      expect(result.numeroOperario).toBe('OP-001')
      expect(result.inspectorCalidad).toBe('Juan Pérez')
      expect(result.jefeDeTurno).toBe('María González')
      expect(result.ordenDeCompra).toBe('OC-2024-001')
      expect(result.codigoProducto).toBe('BI-50-001')

      // Verificar que NO existen campos con nomenclatura snake_case
      expect(result).not.toHaveProperty('fecha_fabricacion')
      expect(result).not.toHaveProperty('numero_operario')
      expect(result).not.toHaveProperty('inspector_calidad')
      expect(result).not.toHaveProperty('jefe_de_turno')
      expect(result).not.toHaveProperty('orden_de_compra')
      expect(result).not.toHaveProperty('codigo_producto')
    })

    it('maneja respuesta parcial del servidor correctamente', async () => {
      const { processOCR } = useOCRConfig()
      
      // Simular respuesta parcial (solo algunos campos)
      const partialServerResponse = {
        success: true,
        productionData: {
          cliente: 'Cliente Parcial',
          fechaFabricacion: '2024-01-15',
          numeroOperario: 'OP-123'
          // Otros campos ausentes
        }
      }

      mockFetch.mockResolvedValueOnce(partialServerResponse)
      
      mockFileReader.readAsDataURL.mockImplementation(() => {
        mockFileReader.result = 'data:image/jpeg;base64,testdata'
        if (mockFileReader.onload) {
          mockFileReader.onload()
        }
      })

      const testFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
      const result = await processOCR(testFile)

      // Verificar campos presentes
      expect(result.cliente).toBe('Cliente Parcial')
      expect(result.fechaFabricacion).toBe('2024-01-15')
      expect(result.numeroOperario).toBe('OP-123')

      // Verificar campos ausentes como undefined
      expect(result.producto).toBeUndefined()
      expect(result.inspectorCalidad).toBeUndefined()
      expect(result.jefeDeTurno).toBeUndefined()
      expect(result.ordenDeCompra).toBeUndefined()
      expect(result.codigoProducto).toBeUndefined()
    })

    it('normaliza el campo turno correctamente independiente de la nomenclatura', async () => {
      const { processOCR } = useOCRConfig()
      
      const testCases = [
        { input: 'MAÑANA', expected: 'mañana' },
        { input: 'Tarde', expected: 'tarde' },
        { input: 'NOCHE', expected: 'noche' },
        { input: 'Morning', expected: 'mañana' },
        { input: 'Night', expected: 'noche' }
      ]

      for (const testCase of testCases) {
        const serverResponse = {
          success: true,
          productionData: {
            turno: testCase.input,
            cliente: 'Test Client',
            fechaFabricacion: '2024-01-01'
          }
        }

        mockFetch.mockResolvedValueOnce(serverResponse)
        
        mockFileReader.readAsDataURL.mockImplementation(() => {
          mockFileReader.result = 'data:image/jpeg;base64,testdata'
          if (mockFileReader.onload) {
            mockFileReader.onload()
          }
        })

        const testFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
        const result = await processOCR(testFile)
        
        expect(result.turno).toBe(testCase.expected)
        expect(result.fechaFabricacion).toBe('2024-01-01')
      }
    })
  })

  describe('Error Handling with New Nomenclature', () => {
    it('maneja errores del servidor manteniendo la consistencia de nomenclatura', async () => {
      const { processOCR } = useOCRConfig()
      
      mockFetch.mockResolvedValueOnce({
        success: false,
        error: 'Error procesando imagen con nomenclatura actualizada'
      })
      
      mockFileReader.readAsDataURL.mockImplementation(() => {
        mockFileReader.result = 'data:image/jpeg;base64,testdata'
        if (mockFileReader.onload) {
          mockFileReader.onload()
        }
      })

      const testFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
      
      await expect(processOCR(testFile)).rejects.toThrow(
        'Error procesando OCR: Error procesando imagen con nomenclatura actualizada'
      )
    })
  })

  describe('Backward Compatibility Verification', () => {
    it('verifica que no se aceptan campos con nomenclatura legacy', async () => {
      const { processOCR } = useOCRConfig()
      
      // Simular respuesta con nomenclatura legacy mezclada (esto NO debería pasar en el servidor real)
      const legacyMixedResponse = {
        success: true,
        productionData: {
          cliente: 'Cliente Test',
          fecha_fabricacion: '2024-01-15', // Legacy field
          fechaFabricacion: '2024-01-15',   // New field
          numero_operario: 'OP-001',        // Legacy field  
          numeroOperario: 'OP-002'          // New field (should win)
        }
      }

      mockFetch.mockResolvedValueOnce(legacyMixedResponse)
      
      mockFileReader.readAsDataURL.mockImplementation(() => {
        mockFileReader.result = 'data:image/jpeg;base64,testdata'
        if (mockFileReader.onload) {
          mockFileReader.onload()
        }
      })

      const testFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
      const result = await processOCR(testFile)

      // El mapeo debería usar solo la nomenclatura camelCase
      expect(result.fechaFabricacion).toBe('2024-01-15')
      expect(result.numeroOperario).toBe('OP-002') // El valor camelCase debería ganar
      
      // Los campos legacy no deberían existir en el resultado
      expect(result).not.toHaveProperty('fecha_fabricacion')
      expect(result).not.toHaveProperty('numero_operario')
    })
  })

  describe('API Call Structure', () => {
    it('verifica que las llamadas API siguen la estructura correcta', async () => {
      const { processOCR } = useOCRConfig()
      
      const serverResponse = {
        success: true,
        productionData: {
          cliente: 'Test Client',
          fechaFabricacion: '2024-01-01'
        }
      }

      mockFetch.mockResolvedValueOnce(serverResponse)
      
      mockFileReader.readAsDataURL.mockImplementation(() => {
        mockFileReader.result = 'data:image/jpeg;base64,testdata123'
        if (mockFileReader.onload) {
          mockFileReader.onload()
        }
      })

      const testFile = new File(['test'], 'etiqueta.jpg', { type: 'image/jpeg' })
      await processOCR(testFile)

      // Verificar que la llamada API tiene la estructura correcta
      expect(mockFetch).toHaveBeenCalledWith('/api/ocr/extract', {
        method: 'POST',
        body: {
          imageData: 'testdata123',
          mimeType: 'image/jpeg',
          filename: 'etiqueta.jpg'
        }
      })
    })
  })

  describe('Data Flow Integration', () => {
    it('verifica el flujo completo de datos desde servidor hasta esquema', async () => {
      const { processOCR } = useOCRConfig()
      
      // Datos completos del servidor
      const fullServerResponse = {
        success: true,
        text: 'Texto completo extraído',
        productionData: {
          lote: 'LOT-2024-001',
          cliente: 'Industrias Ejemplo S.A.',
          producto: 'Producto Industrial Premium',
          pedido: 'PED-2024-001',
          fechaFabricacion: '2024-01-15',
          codigoProducto: 'PI-PREM-001',
          turno: 'Tarde',
          unidades: '1000',
          jefeDeTurno: 'Ana García',
          ordenDeCompra: 'OC-2024-001',
          numeroOperario: 'OP-15',
          maquina: 'LINEA-PROD-01',
          inspectorCalidad: 'Carlos Martínez'
        },
        metadata: {
          filename: 'etiqueta_completa.jpg',
          processedAt: '2024-01-15T14:30:00Z',
          model: 'gemini-2.0-flash-exp',
          processingTimeMs: 2500,
          originalSizeKB: 450,
          finalSizeKB: 120
        }
      }

      mockFetch.mockResolvedValueOnce(fullServerResponse)
      
      mockFileReader.readAsDataURL.mockImplementation(() => {
        mockFileReader.result = 'data:image/jpeg;base64,fulldata'
        if (mockFileReader.onload) {
          mockFileReader.onload()
        }
      })

      const testFile = new File(['test'], 'etiqueta_completa.jpg', { type: 'image/jpeg' })
      const result = await processOCR(testFile)

      // Verificar que todos los campos mapeados mantienen nomenclatura camelCase
      expect(result).toEqual({
        cliente: 'Industrias Ejemplo S.A.',
        producto: 'Producto Industrial Premium',
        codigoProducto: 'PI-PREM-001',
        lote: 'LOT-2024-001',
        fechaFabricacion: '2024-01-15',
        pedido: 'PED-2024-001',
        turno: 'tarde', // Normalizado
        numeroOperario: 'OP-15',
        maquina: 'LINEA-PROD-01',
        inspectorCalidad: 'Carlos Martínez',
        jefeDeTurno: 'Ana García',
        ordenDeCompra: 'OC-2024-001'
      })

      // Verificar que el resultado puede validarse con el schema OCR
      const { ocrDataSchema } = await import('~/schemas/orders/ocr')
      const schemaResult = ocrDataSchema.safeParse(result)
      expect(schemaResult.success).toBe(true)
    })
  })
})