import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useOCRConfig } from '~/composables/tools/useOCRConfig'
import type { OCRData } from '~/schemas/orders/ocr'

// Mock $fetch
const mockFetch = vi.fn()
vi.stubGlobal('$fetch', mockFetch)

// Mock FileReader
const mockFileReader = {
  onload: null as any, // eslint-disable-line @typescript-eslint/no-explicit-any
  onerror: null as any, // eslint-disable-line @typescript-eslint/no-explicit-any
  result: null as any, // eslint-disable-line @typescript-eslint/no-explicit-any
  readAsDataURL: vi.fn()
}

vi.stubGlobal('FileReader', vi.fn(() => mockFileReader))

describe('useOCRConfig', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('validateImageForOCR', () => {
    it('valida correctamente archivos de imagen válidos', () => {
      const { validateImageForOCR } = useOCRConfig()
      
      // Crear buffer con contenido para tener un tamaño real
      const buffer = new Array(5 * 1024 * 1024).fill('a').join('') // 5MB de contenido
      const validFile = new File([buffer], 'test.jpg', {
        type: 'image/jpeg'
      })

      const result = validateImageForOCR(validFile)
      expect(result.valid).toBe(true)
      expect(result.error).toBeUndefined()
    })

    it('rechaza archivos con tipo no soportado', () => {
      const { validateImageForOCR } = useOCRConfig()
      
      const invalidFile = new File([''], 'test.txt', {
        type: 'text/plain'
      })

      const result = validateImageForOCR(invalidFile)
      expect(result.valid).toBe(false)
      expect(result.error).toBe('Tipo de archivo no soportado. Use JPEG, PNG o WebP')
    })

    it('rechaza archivos demasiado grandes', () => {
      const { validateImageForOCR } = useOCRConfig()
      
      // Crear buffer grande con contenido real
      const buffer = new Array(15 * 1024 * 1024).fill('a').join('') // 15MB de contenido
      const largeFile = new File([buffer], 'test.jpg', {
        type: 'image/jpeg'
      })

      const result = validateImageForOCR(largeFile)
      expect(result.valid).toBe(false)
      expect(result.error).toBe('El archivo es demasiado grande. Máximo 10MB')
    })

    it('rechaza archivos demasiado pequeños', () => {
      const { validateImageForOCR } = useOCRConfig()
      
      const smallFile = new File([''], 'test.jpg', {
        type: 'image/jpeg',
        size: 500 // menos de 1KB
      })

      const result = validateImageForOCR(smallFile)
      expect(result.valid).toBe(false)
      expect(result.error).toBe('El archivo es demasiado pequeño')
    })
  })

  describe('processOCR', () => {
    it('procesa OCR exitosamente con datos válidos', async () => {
      const { processOCR } = useOCRConfig()
      
      // Mock successful API response
      const mockResponse = {
        success: true,
        text: 'Texto extraído',
        productionData: {
          cliente: 'Empresa Test S.A.',
          producto: 'Bolsa Test 25kg',
          codigoProducto: 'BOLTEST001',
          lote: 'LOT20241201001',
          fechaFabricacion: '2024-12-01',
          pedido: 'PED001',
          turno: 'Mañana',
          numeroOperario: 'OP001',
          maquina: 'MAQ001',
          inspectorCalidad: 'Juan Pérez',
          jefe_de_turno: 'María García',
          orden_de_compra: 'OC001'
        },
        metadata: {
          filename: 'test.jpg',
          processedAt: '2024-12-01T10:00:00Z',
          model: 'gemini-2.0-flash-exp'
        }
      }
      
      mockFetch.mockResolvedValueOnce(mockResponse)
      
      // Mock FileReader
      mockFileReader.readAsDataURL.mockImplementation(() => {
        mockFileReader.result = 'data:image/jpeg;base64,dGVzdGRhdGE='
        if (mockFileReader.onload) {
          mockFileReader.onload()
        }
      })

      const testFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
      const result = await processOCR(testFile)

      const expectedResult: OCRData = {
        cliente: 'Empresa Test S.A.',
        producto: 'Bolsa Test 25kg',
        codigo_producto: 'BOLTEST001',
        lote: 'LOT20241201001',
        fecha_fabricacion: '2024-12-01',
        pedido: 'PED001',
        turno: 'mañana', // Normalizado a minúsculas
        numero_operario: 'OP001',
        maquina: 'MAQ001',
        inspector_calidad: 'Juan Pérez',
        jefe_de_turno: 'María García',
        orden_de_compra: 'OC001'
      }

      expect(result).toEqual(expectedResult)
      expect(mockFetch).toHaveBeenCalledWith('/api/ocr/extract', {
        method: 'POST',
        body: {
          imageData: 'dGVzdGRhdGE=',
          mimeType: 'image/jpeg',
          filename: 'test.jpg'
        }
      })
    })

    it('normaliza correctamente diferentes valores de turno', async () => {
      const { processOCR } = useOCRConfig()
      
      const testCases = [
        { input: 'Mañana', expected: 'mañana' },
        { input: 'TARDE', expected: 'tarde' },
        { input: 'noche', expected: 'noche' },
        { input: 'Morning', expected: 'mañana' },
        { input: 'afternoon', expected: 'tarde' },
        { input: 'Nocturno', expected: 'noche' },
        { input: 'Night', expected: 'noche' },
        { input: '  Mañana  ', expected: 'mañana' },
        { input: 'valor_desconocido', expected: 'valor_desconocido' }
      ]

      for (const testCase of testCases) {
        const mockResponse = {
          success: true,
          productionData: {
            turno: testCase.input
          }
        }
        
        mockFetch.mockResolvedValueOnce(mockResponse)
        mockFileReader.readAsDataURL.mockImplementation(() => {
          mockFileReader.result = 'data:image/jpeg;base64,dGVzdA=='
          if (mockFileReader.onload) {
            mockFileReader.onload()
          }
        })

        const testFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
        const result = await processOCR(testFile)
        
        expect(result.turno).toBe(testCase.expected)
      }
    })

    it('maneja errores de API correctamente', async () => {
      const { processOCR } = useOCRConfig()
      
      mockFetch.mockResolvedValueOnce({
        success: false,
        error: 'Error de procesamiento OCR'
      })
      
      mockFileReader.readAsDataURL.mockImplementation(() => {
        mockFileReader.result = 'data:image/jpeg;base64,dGVzdGRhdGE='
        if (mockFileReader.onload) {
          mockFileReader.onload()
        }
      })

      const testFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
      
      await expect(processOCR(testFile)).rejects.toThrow('Error procesando OCR: Error de procesamiento OCR')
    })

    it('maneja errores de conversión de archivo correctamente', async () => {
      const { processOCR } = useOCRConfig()
      
      // Mock FileReader error
      mockFileReader.readAsDataURL.mockImplementation(() => {
        if (mockFileReader.onerror) {
          mockFileReader.onerror(new Error('Error leyendo archivo'))
        }
      })

      const testFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
      
      await expect(processOCR(testFile)).rejects.toThrow('Error procesando OCR')
    })
  })

  describe('processOCRWithRetry', () => {
    it('reintenta OCR en caso de fallo y eventualmente tiene éxito', async () => {
      const { processOCRWithRetry } = useOCRConfig()
      
      // Mock que falla dos veces y luego tiene éxito
      mockFetch
        .mockRejectedValueOnce(new Error('Error temporal 1'))
        .mockRejectedValueOnce(new Error('Error temporal 2'))
        .mockResolvedValueOnce({
          success: true,
          productionData: {
            cliente: 'Empresa Test S.A.',
            producto: 'Producto Test',
            turno: 'tarde'
          }
        })
      
      mockFileReader.readAsDataURL.mockImplementation(() => {
        mockFileReader.result = 'data:image/jpeg;base64,dGVzdGRhdGE='
        if (mockFileReader.onload) {
          mockFileReader.onload()
        }
      })

      const onRetryMock = vi.fn()
      const testFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
      
      const result = await processOCRWithRetry(testFile, onRetryMock)

      expect(result.cliente).toBe('Empresa Test S.A.')
      expect(result.producto).toBe('Producto Test')
      expect(result.turno).toBe('tarde')
      expect(onRetryMock).toHaveBeenCalledTimes(2)
      expect(mockFetch).toHaveBeenCalledTimes(3)
    })

    it('falla después de agotar todos los reintentos', async () => {
      const { processOCRWithRetry } = useOCRConfig()
      
      // Mock que siempre falla
      mockFetch.mockRejectedValue(new Error('Error persistente'))
      
      mockFileReader.readAsDataURL.mockImplementation(() => {
        mockFileReader.result = 'data:image/jpeg;base64,dGVzdGRhdGE='
        if (mockFileReader.onload) {
          mockFileReader.onload()
        }
      })

      const onRetryMock = vi.fn()
      const testFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
      
      await expect(processOCRWithRetry(testFile, onRetryMock)).rejects.toThrow('Error persistente')
      expect(onRetryMock).toHaveBeenCalledTimes(2) // 3 intentos = 2 reintentos
      expect(mockFetch).toHaveBeenCalledTimes(3)
    })
  })

  describe('normalizeTurno functionality', () => {
    it('mapea correctamente datos completos del endpoint incluyendo normalización', async () => {
      const { processOCR } = useOCRConfig()
      
      const mockResponse = {
        success: true,
        productionData: {
          cliente: 'Empresa Complete S.A.',
          producto: 'Producto Complete',
          codigoProducto: 'PROD001',
          lote: 'LOT001',
          fechaFabricacion: '2024-12-01',
          turno: 'TARDE', // En mayúsculas para probar normalización
          numeroOperario: 'OP001',
          maquina: 'MAQ001',
          inspectorCalidad: 'Inspector Test',
          jefe_de_turno: 'Jefe Test',
          orden_de_compra: 'OC001'
        }
      }
      
      mockFetch.mockResolvedValueOnce(mockResponse)
      mockFileReader.readAsDataURL.mockImplementation(() => {
        mockFileReader.result = 'data:image/jpeg;base64,dGVzdA=='
        if (mockFileReader.onload) {
          mockFileReader.onload()
        }
      })

      const testFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
      const result = await processOCR(testFile)
      
      expect(result.cliente).toBe('Empresa Complete S.A.')
      expect(result.producto).toBe('Producto Complete')
      expect(result.codigo_producto).toBe('PROD001')
      expect(result.lote).toBe('LOT001')
      expect(result.fecha_fabricacion).toBe('2024-12-01')
      expect(result.turno).toBe('tarde') // Normalizado
      expect(result.numero_operario).toBe('OP001')
      expect(result.maquina).toBe('MAQ001')
      expect(result.inspector_calidad).toBe('Inspector Test')
      expect(result.jefe_de_turno).toBe('Jefe Test')
      expect(result.orden_de_compra).toBe('OC001')
    })

    it('maneja correctamente datos parciales del endpoint', async () => {
      const { processOCR } = useOCRConfig()
      
      const mockResponse = {
        success: true,
        productionData: {
          cliente: 'Solo Cliente',
          lote: 'LOT002',
          turno: 'mañana'
        }
      }
      
      mockFetch.mockResolvedValueOnce(mockResponse)
      mockFileReader.readAsDataURL.mockImplementation(() => {
        mockFileReader.result = 'data:image/jpeg;base64,dGVzdA=='
        if (mockFileReader.onload) {
          mockFileReader.onload()
        }
      })

      const testFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
      const result = await processOCR(testFile)
      
      expect(result.cliente).toBe('Solo Cliente')
      expect(result.producto).toBeUndefined()
      expect(result.codigo_producto).toBeUndefined()
      expect(result.lote).toBe('LOT002')
      expect(result.fecha_fabricacion).toBeUndefined()
      expect(result.turno).toBe('mañana')
      expect(result.numero_operario).toBeUndefined()
      expect(result.maquina).toBeUndefined()
      expect(result.inspector_calidad).toBeUndefined()
      expect(result.jefe_de_turno).toBeUndefined()
      expect(result.orden_de_compra).toBeUndefined()
    })
  })
})