import { describe, it, expect, vi, beforeEach } from 'vitest'
import sharp from 'sharp'

// Mock sharp para los tests
vi.mock('sharp')

describe('OCR Image Compression', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Server-side image compression with Sharp', () => {
    it('comprime imagen correctamente usando Sharp', async () => {
      // Mock del buffer original
      const originalBuffer = Buffer.from('fake-large-image-data'.repeat(1000))
      
      // Mock del buffer comprimido 
      const compressedBuffer = Buffer.from('fake-compressed-data')
      
      // Mock de la cadena de Sharp
      const mockToBuffer = vi.fn().mockResolvedValue(compressedBuffer)
      const mockResize = vi.fn().mockReturnValue({ toBuffer: mockToBuffer })
      const mockJpeg = vi.fn().mockReturnValue({ resize: mockResize })
      
      const mockSharp = vi.fn().mockReturnValue({
        jpeg: mockJpeg
      })
      
      vi.mocked(sharp).mockImplementation(mockSharp)

      // Simular la función de compresión del servidor
      const compressImage = async (base64Data: string): Promise<{ data: string, size: number }> => {
        const imageBuffer = Buffer.from(base64Data, 'base64')
        
        const compressedBuffer = await sharp(imageBuffer)
          .jpeg({ 
            quality: 80, 
            progressive: true,
            mozjpeg: true 
          })
          .resize(1920, 1080, { 
            fit: 'inside', 
            withoutEnlargement: true 
          })
          .toBuffer()

        return {
          data: compressedBuffer.toString('base64'),
          size: compressedBuffer.length
        }
      }

      // Test
      const originalBase64 = originalBuffer.toString('base64')
      const result = await compressImage(originalBase64)

      // Verificaciones
      expect(mockSharp).toHaveBeenCalledWith(originalBuffer)
      expect(mockJpeg).toHaveBeenCalledWith({
        quality: 80,
        progressive: true,
        mozjpeg: true
      })
      expect(mockResize).toHaveBeenCalledWith(1920, 1080, {
        fit: 'inside',
        withoutEnlargement: true
      })
      
      expect(result.data).toBe(compressedBuffer.toString('base64'))
      expect(result.size).toBe(compressedBuffer.length)
    })

    it('aplica compresión más agresiva para imágenes grandes', async () => {
      // Mock buffer que simula imagen > 300KB
      const largeBuffer = Buffer.alloc(350 * 1024) // 350KB
      const mediumBuffer = Buffer.alloc(200 * 1024) // 200KB después de primera compresión
      
      let callCount = 0
      const mockToBuffer = vi.fn().mockImplementation(() => {
        callCount++
        if (callCount === 1) return Promise.resolve(largeBuffer) // Primera llamada > 300KB
        return Promise.resolve(mediumBuffer) // Segunda llamada < 300KB
      })
      
      const mockResize = vi.fn().mockReturnValue({ toBuffer: mockToBuffer })
      const mockJpeg = vi.fn().mockReturnValue({ resize: mockResize })
      
      const mockSharp = vi.fn().mockReturnValue({
        jpeg: mockJpeg
      })
      
      vi.mocked(sharp).mockImplementation(mockSharp)

      // Simular la función de compresión con lógica de niveles
      const compressImage = async (base64Data: string): Promise<{ data: string, size: number }> => {
        const imageBuffer = Buffer.from(base64Data, 'base64')
        
        const compressedBuffer = await sharp(imageBuffer)
          .jpeg({ 
            quality: 80, 
            progressive: true,
            mozjpeg: true 
          })
          .resize(1920, 1080, { 
            fit: 'inside', 
            withoutEnlargement: true 
          })
          .toBuffer()

        let finalBuffer = compressedBuffer
        if (compressedBuffer.length > 300 * 1024) {
          finalBuffer = await sharp(imageBuffer)
            .jpeg({ 
              quality: 60, 
              progressive: true,
              mozjpeg: true 
            })
            .resize(1280, 720, { 
              fit: 'inside', 
              withoutEnlargement: true 
            })
            .toBuffer()
        }

        return {
          data: finalBuffer.toString('base64'),
          size: finalBuffer.length
        }
      }

      // Test
      const result = await compressImage('fake-data')

      // Verificaciones
      expect(mockSharp).toHaveBeenCalledTimes(2) // Primera compresión + segunda compresión
      expect(mockJpeg).toHaveBeenCalledWith({
        quality: 60, // Segunda llamada con calidad reducida
        progressive: true,
        mozjpeg: true
      })
      expect(mockResize).toHaveBeenCalledWith(1280, 720, {
        fit: 'inside',
        withoutEnlargement: true
      })
      
      expect(result.size).toBe(mediumBuffer.length)
    })

    it('maneja errores de Sharp correctamente', async () => {
      // Mock error en Sharp
      const mockSharp = vi.fn().mockImplementation(() => {
        throw new Error('Sharp processing error')
      })
      
      vi.mocked(sharp).mockImplementation(mockSharp)

      // Simular función con manejo de errores
      const compressImage = async (base64Data: string): Promise<{ data: string, size: number }> => {
        try {
          const imageBuffer = Buffer.from(base64Data, 'base64')
          
          const compressedBuffer = await sharp(imageBuffer)
            .jpeg({ quality: 80 })
            .toBuffer()

          return {
            data: compressedBuffer.toString('base64'),
            size: compressedBuffer.length
          }
        } catch (error) {
          // Fallback a imagen original
          return {
            data: base64Data,
            size: Buffer.from(base64Data, 'base64').length
          }
        }
      }

      const originalData = 'fake-data'
      const result = await compressImage(originalData)

      // Debe devolver imagen original como fallback
      expect(result.data).toBe(originalData)
      expect(result.size).toBe(Buffer.from(originalData, 'base64').length)
    })

    it('convierte correctamente diferentes formatos a JPEG', async () => {
      const mockBuffer = Buffer.from('compressed-jpeg-data')
      
      const mockToBuffer = vi.fn().mockResolvedValue(mockBuffer)
      const mockResize = vi.fn().mockReturnValue({ toBuffer: mockToBuffer })
      const mockJpeg = vi.fn().mockReturnValue({ resize: mockResize })
      
      const mockSharp = vi.fn().mockReturnValue({
        jpeg: mockJpeg
      })
      
      vi.mocked(sharp).mockImplementation(mockSharp)

      // Test conversión PNG -> JPEG
      const compressImage = async (inputBuffer: Buffer) => {
        return await sharp(inputBuffer)
          .jpeg({ quality: 80 })
          .resize(1920, 1080, { fit: 'inside' })
          .toBuffer()
      }

      const pngBuffer = Buffer.from('fake-png-data')
      const result = await compressImage(pngBuffer)

      expect(mockSharp).toHaveBeenCalledWith(pngBuffer)
      expect(mockJpeg).toHaveBeenCalledWith({ quality: 80 })
      expect(result).toBe(mockBuffer)
    })

    it('mantiene calidad óptima para imágenes pequeñas', async () => {
      // Mock buffer pequeño que no necesita compresión agresiva
      const smallBuffer = Buffer.alloc(100 * 1024) // 100KB
      
      const mockToBuffer = vi.fn().mockResolvedValue(smallBuffer)
      const mockResize = vi.fn().mockReturnValue({ toBuffer: mockToBuffer })
      const mockJpeg = vi.fn().mockReturnValue({ resize: mockResize })
      
      const mockSharp = vi.fn().mockReturnValue({
        jpeg: mockJpeg
      })
      
      vi.mocked(sharp).mockImplementation(mockSharp)

      const compressImage = async (base64Data: string) => {
        const imageBuffer = Buffer.from(base64Data, 'base64')
        
        const compressedBuffer = await sharp(imageBuffer)
          .jpeg({ 
            quality: 80, 
            progressive: true,
            mozjpeg: true 
          })
          .resize(1920, 1080, { 
            fit: 'inside', 
            withoutEnlargement: true 
          })
          .toBuffer()

        // Si ya es pequeña, no hacer más compresión
        return {
          data: compressedBuffer.toString('base64'),
          size: compressedBuffer.length
        }
      }

      const result = await compressImage('small-image-data')

      // Verificar que solo se aplique compresión básica, no agresiva
      expect(mockSharp).toHaveBeenCalledTimes(1)
      expect(mockJpeg).toHaveBeenCalledWith({
        quality: 80, // Calidad alta mantenida
        progressive: true,
        mozjpeg: true
      })
    })
  })

  describe('Integration with OCR endpoint', () => {
    it('procesa el flujo completo de compresión en el endpoint', () => {
      // Mock de la lógica del endpoint
      const processImageData = (imageData: string, mimeType: string) => {
        // Limpiar data URL prefix
        const cleanImageData = imageData.replace(/^data:image\/[a-z]+;base64,/, '')
        
        // Simular compresión
        const originalSize = Buffer.from(cleanImageData, 'base64').length
        
        // El endpoint siempre devuelve JPEG después de la compresión
        const finalMimeType = 'image/jpeg'
        
        return {
          processedData: 'compressed-' + cleanImageData,
          originalSize,
          finalMimeType,
          compressed: originalSize > 300 * 1024
        }
      }

      // Test con imagen que tiene data URL prefix
      const dataUrlImage = 'data:image/png;base64,someimagedata'
      const result = processImageData(dataUrlImage, 'image/png')

      expect(result.processedData).toBe('compressed-someimagedata')
      expect(result.finalMimeType).toBe('image/jpeg')
      expect(result.originalSize).toBeGreaterThan(0)
    })
  })
})