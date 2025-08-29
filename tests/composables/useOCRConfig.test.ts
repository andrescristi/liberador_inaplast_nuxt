import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useOCRConfig } from '~/composables/useOCRConfig'
import type { OCRData } from '~/schemas/order'

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
        type: 'text/plain',
        size: 1024
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
          fechaFabricacion: '2024-12-01'
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
        customerName: 'Empresa Test S.A.',
        productName: 'Bolsa Test 25kg',
        productCode: 'BOLTEST001',
        lotNumber: 'LOT20241201001',
        productionDate: '2024-12-01',
        orderNumber: undefined
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
            producto: 'Producto Test'
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

      expect(result.customerName).toBe('Empresa Test S.A.')
      expect(result.productName).toBe('Producto Test')
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

  describe('mapToOCRData', () => {
    it('mapea correctamente datos completos del endpoint', () => {
      // Accedemos a la función interna a través de processOCR
      // Este test verifica el mapeo indirectamente
      const mockResponse = {
        success: true,
        productionData: {
          cliente: 'Empresa Complete S.A.',
          producto: 'Producto Complete',
          codigoProducto: 'PROD001',
          lote: 'LOT001',
          fechaFabricacion: '2024-12-01'
        }
      }
      
      mockFetch.mockResolvedValueOnce(mockResponse)
      mockFileReader.readAsDataURL.mockImplementation(() => {
        mockFileReader.result = 'data:image/jpeg;base64,dGVzdA=='
        if (mockFileReader.onload) {
          mockFileReader.onload()
        }
      })

      const { processOCR } = useOCRConfig()
      const testFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
      
      return processOCR(testFile).then(result => {
        expect(result.customerName).toBe('Empresa Complete S.A.')
        expect(result.productName).toBe('Producto Complete')
        expect(result.productCode).toBe('PROD001')
        expect(result.lotNumber).toBe('LOT001')
        expect(result.productionDate).toBe('2024-12-01')
        expect(result.orderNumber).toBeUndefined()
      })
    })

    it('maneja correctamente datos parciales del endpoint', () => {
      const mockResponse = {
        success: true,
        productionData: {
          cliente: 'Solo Cliente',
          // producto no definido
          // codigoProducto no definido
          lote: 'LOT002'
          // fechaFabricacion no definida
        }
      }
      
      mockFetch.mockResolvedValueOnce(mockResponse)
      mockFileReader.readAsDataURL.mockImplementation(() => {
        mockFileReader.result = 'data:image/jpeg;base64,dGVzdA=='
        if (mockFileReader.onload) {
          mockFileReader.onload()
        }
      })

      const { processOCR } = useOCRConfig()
      const testFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
      
      return processOCR(testFile).then(result => {
        expect(result.customerName).toBe('Solo Cliente')
        expect(result.productName).toBeUndefined()
        expect(result.productCode).toBeUndefined()
        expect(result.lotNumber).toBe('LOT002')
        expect(result.productionDate).toBeUndefined()
        expect(result.orderNumber).toBeUndefined()
      })
    })
  })
})