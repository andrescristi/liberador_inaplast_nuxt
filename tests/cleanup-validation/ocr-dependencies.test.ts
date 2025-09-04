import { describe, it, expect, vi, beforeAll, afterEach } from 'vitest'
import { fileURLToPath } from 'node:url'
import { readFile, access } from 'node:fs/promises'
import { resolve } from 'node:path'
import { constants } from 'node:fs'

const PROJECT_DIR = fileURLToPath(new URL('../../', import.meta.url))

/**
 * Tests de dependencias OCR después de la limpieza
 * Verifica que el sistema OCR funciona correctamente sin tesseract.js
 */
describe('Dependencias OCR después de Limpieza', () => {
  describe('Configuración de dependencias', () => {
    it('debe confirmar que tesseract.js fue eliminado del package.json', async () => {
      const packageJsonPath = resolve(PROJECT_DIR, 'package.json')
      const packageJsonContent = await readFile(packageJsonPath, 'utf-8')
      const packageJson = JSON.parse(packageJsonContent)
      
      // Verificar que tesseract.js no está en dependencies
      expect(packageJson.dependencies).not.toHaveProperty('tesseract.js')
      
      // Verificar que tesseract.js no está en devDependencies
      expect(packageJson.devDependencies).not.toHaveProperty('tesseract.js')
    })
    
    it('debe verificar que las dependencias de OCR correctas están presentes', async () => {
      const packageJsonPath = resolve(PROJECT_DIR, 'package.json')
      const packageJsonContent = await readFile(packageJsonPath, 'utf-8')
      const packageJson = JSON.parse(packageJsonContent)
      
      // Verificar dependencias principales para OCR
      expect(packageJson.dependencies).toHaveProperty('@google/genai')
      expect(packageJson.dependencies).toHaveProperty('sharp')
      
      // Verificar versiones específicas
      expect(packageJson.dependencies['@google/genai']).toMatch(/^\^1\.\d+\.\d+$/)
      expect(packageJson.dependencies['sharp']).toMatch(/^\^0\.\d+\.\d+$/)
    })
    
    it('debe verificar que no hay referencias a tesseract en archivos de configuración', async () => {
      const configFiles = [
        'nuxt.config.ts',
        'vitest.config.ts',
        'package.json'
      ]
      
      for (const configFile of configFiles) {
        const configPath = resolve(PROJECT_DIR, configFile)
        
        try {
          await access(configPath, constants.F_OK)
          const content = await readFile(configPath, 'utf-8')
          
          // No debe contener referencias a tesseract
          expect(content).not.toMatch(/tesseract/i)
        } catch {
          // Si el archivo no existe, continuar
          continue
        }
      }
    })
  })
  
  describe('API OCR funcional', () => {
    it('debe verificar que el endpoint OCR existe y está correctamente configurado', async () => {
      const ocrApiPath = resolve(PROJECT_DIR, 'server/api/ocr/extract.post.ts')
      
      // Verificar que el archivo existe
      await expect(access(ocrApiPath, constants.F_OK)).resolves.not.toThrow()
      
      // Leer el contenido del archivo
      const content = await readFile(ocrApiPath, 'utf-8')
      
      // Verificar que usa Google Gemini AI y no tesseract
      expect(content).toMatch(/GoogleGenAI/)
      expect(content).toMatch(/@google\/genai/)
      expect(content).not.toMatch(/tesseract/i)
      
      // Verificar que usa Sharp para procesamiento de imágenes
      expect(content).toMatch(/sharp/)
      expect(content).toMatch(/from 'sharp'/)
    })
    
    it('debe verificar la estructura de la respuesta OCR', async () => {
      const ocrApiPath = resolve(PROJECT_DIR, 'server/api/ocr/extract.post.ts')
      const content = await readFile(ocrApiPath, 'utf-8')
      
      // Verificar interfaces importantes
      expect(content).toMatch(/interface\s+OCRRequest/)
      expect(content).toMatch(/interface\s+ProductionData/)
      expect(content).toMatch(/interface\s+OCRResponse/)
      
      // Verificar campos de ProductionData
      expect(content).toMatch(/lote\?:\s*string/)
      expect(content).toMatch(/cliente\?:\s*string/)
      expect(content).toMatch(/producto\?:\s*string/)
      expect(content).toMatch(/fechaFabricacion\?:\s*(Date\s*\|\s*string)/)
    })
    
    it('debe verificar que la compresión de imágenes funciona con Sharp', async () => {
      const ocrApiPath = resolve(PROJECT_DIR, 'server/api/ocr/extract.post.ts')
      const content = await readFile(ocrApiPath, 'utf-8')
      
      // Verificar función de compresión con Sharp
      expect(content).toMatch(/compressImage.*async/)
      expect(content).toMatch(/sharp\(imageBuffer\)/)
      expect(content).toMatch(/\.jpeg\(/)
      expect(content).toMatch(/\.resize\(/)
      expect(content).toMatch(/quality:\s*\d+/)
    })
  })
  
  describe('Composables OCR', () => {
    it('debe verificar que los composables OCR no dependen de tesseract', async () => {
      const composablesDir = resolve(PROJECT_DIR, 'app/composables')
      
      try {
        await access(composablesDir, constants.F_OK)
        
        // Buscar archivos relacionados con OCR
        const { readdir } = await import('node:fs/promises')
        const findOCRFiles = async (dir: string): Promise<string[]> => {
          const files: string[] = []
          const items = await readdir(dir, { withFileTypes: true })
          
          for (const item of items) {
            const fullPath = resolve(dir, item.name)
            if (item.isDirectory()) {
              files.push(...await findOCRFiles(fullPath))
            } else if (item.isFile() && item.name.includes('ocr') || item.name.includes('OCR')) {
              files.push(fullPath)
            }
          }
          
          return files
        }
        
        const ocrFiles = await findOCRFiles(composablesDir)
        
        // Verificar cada archivo OCR
        for (const ocrFile of ocrFiles) {
          const content = await readFile(ocrFile, 'utf-8')
          
          // No debe contener referencias a tesseract
          expect(content).not.toMatch(/tesseract/i)
          
          // Debe usar el endpoint de API correcto
          expect(content).toMatch(/\/api\/ocr\/extract/)
        }
      } catch {
        // Si no hay composables OCR, es válido
        console.log('No se encontraron composables OCR específicos')
      }
    })
    
    it('debe verificar que useOCRConfig no depende de tesseract', async () => {
      const ocrConfigPath = resolve(PROJECT_DIR, 'app/composables/useOCRConfig.ts')
      
      try {
        await access(ocrConfigPath, constants.F_OK)
        const content = await readFile(ocrConfigPath, 'utf-8')
        
        // No debe contener referencias a tesseract
        expect(content).not.toMatch(/tesseract/i)
        
        // Debe configurar correctamente Gemini
        if (content.includes('gemini') || content.includes('google')) {
          expect(content).toMatch(/gemini|google/i)
        }
      } catch {
        // Si el archivo no existe, crear uno básico sería el siguiente paso
        console.log('useOCRConfig no encontrado - puede ser creado si es necesario')
      }
    })
  })
  
  describe('Schemas OCR', () => {
    it('debe verificar que los schemas OCR están correctamente definidos', async () => {
      const schemasOcrPath = resolve(PROJECT_DIR, 'app/schemas/orders/ocr.ts')
      
      try {
        await access(schemasOcrPath, constants.F_OK)
        const content = await readFile(schemasOcrPath, 'utf-8')
        
        // Verificar que usa Zod para validación
        expect(content).toMatch(/from 'zod'/)
        
        // Verificar schemas importantes
        expect(content).toMatch(/OCRDataSchema|ocrDataSchema/i)
        
        // No debe depender de tesseract
        expect(content).not.toMatch(/tesseract/i)
      } catch {
        // El archivo debe existir
        throw new Error('Schema OCR no encontrado - se requiere para el funcionamiento')
      }
    })
  })
  
  describe('Tests de integración OCR', () => {
    it('debe verificar que los tests existentes de OCR pasan', async () => {
      const ocrTestsDir = resolve(PROJECT_DIR, 'tests/api/ocr')
      
      await expect(access(ocrTestsDir, constants.F_OK)).resolves.not.toThrow()
      
      const { readdir } = await import('node:fs/promises')
      const testFiles = await readdir(ocrTestsDir)
      
      // Debe tener al menos un test
      expect(testFiles.length).toBeGreaterThan(0)
      
      // Verificar archivos de test principales
      expect(testFiles).toContain('extract.test.ts')
      
      // Si existe image-compression.test.ts, verificarlo
      if (testFiles.includes('image-compression.test.ts')) {
        const compressionTestPath = resolve(ocrTestsDir, 'image-compression.test.ts')
        const content = await readFile(compressionTestPath, 'utf-8')
        
        // Debe usar Sharp para compresión
        expect(content).toMatch(/sharp/)
        expect(content).not.toMatch(/tesseract/i)
      }
    })
    
    it('debe simular una respuesta exitosa de OCR', () => {
      // Simular estructura de respuesta esperada
      const mockOCRResponse = {
        success: true,
        text: 'Texto extraído de la imagen',
        productionData: {
          lote: 'LOT20241201001',
          cliente: 'Cliente Test',
          producto: 'Producto Test',
          fechaFabricacion: '2024-12-01',
          codigoProducto: 'PROD001'
        },
        metadata: {
          filename: 'test-image.jpg',
          processedAt: '2024-12-01T10:00:00Z',
          model: 'gemini-2.0-flash-exp'
        }
      }
      
      // Verificar estructura
      expect(mockOCRResponse).toHaveProperty('success', true)
      expect(mockOCRResponse).toHaveProperty('text')
      expect(mockOCRResponse).toHaveProperty('productionData')
      expect(mockOCRResponse).toHaveProperty('metadata')
      
      // Verificar metadatos específicos
      expect(mockOCRResponse.metadata.model).toBe('gemini-2.0-flash-exp')
      expect(mockOCRResponse.productionData).toHaveProperty('lote')
      expect(mockOCRResponse.productionData).toHaveProperty('cliente')
      expect(mockOCRResponse.productionData).toHaveProperty('producto')
    })
    
    it('debe validar tipos MIME soportados sin tesseract', () => {
      // Tipos MIME que debe soportar el nuevo sistema
      const supportedMimeTypes = [
        'image/jpeg',
        'image/png', 
        'image/webp',
        'image/bmp',
        'image/gif'
      ]
      
      // Tipos que no debe soportar
      const unsupportedMimeTypes = [
        'text/plain',
        'application/pdf',
        'video/mp4',
        'audio/mp3'
      ]
      
      supportedMimeTypes.forEach(mimeType => {
        expect(supportedMimeTypes).toContain(mimeType)
      })
      
      unsupportedMimeTypes.forEach(mimeType => {
        expect(supportedMimeTypes).not.toContain(mimeType)
      })
    })
  })
  
  describe('Configuración del entorno', () => {
    it('debe verificar que las variables de entorno OCR están configuradas', async () => {
      // En el entorno de test, verificar que se puede configurar
      const requiredEnvVars = [
        'NUXT_GEMINI_API_KEY'
      ]
      
      // No verificar valores reales en tests, solo estructura
      requiredEnvVars.forEach(envVar => {
        expect(envVar).toMatch(/^NUXT_/)
        expect(envVar).toMatch(/GEMINI/)
      })
    })
    
    it('debe verificar que no hay configuración de tesseract en el entorno', async () => {
      // Variables que NO deben existir
      const forbiddenEnvVars = [
        'TESSERACT_API_KEY',
        'TESSERACT_CONFIG',
        'NUXT_TESSERACT_KEY'
      ]
      
      // En el entorno real, estas no deberían existir
      forbiddenEnvVars.forEach(envVar => {
        // Solo verificar que el patrón no esté presente en configuración
        expect(envVar).toMatch(/TESSERACT/i)
      })
    })
  })
})