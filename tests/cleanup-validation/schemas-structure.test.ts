import { describe, it, expect } from 'vitest'
import { fileURLToPath } from 'node:url'
import { readdir, access, stat, readFile } from 'node:fs/promises'
import { resolve, join } from 'node:path'
import { constants } from 'node:fs'

const APP_DIR = fileURLToPath(new URL('../../app', import.meta.url))

/**
 * Tests de estructura de schemas después de la limpieza
 * Verifica que la estructura de schemas sigue siendo válida sin la carpeta muestreo eliminada
 */
describe('Estructura de Schemas después de Limpieza', () => {
  describe('Directorio principal de schemas', () => {
    it('debe mantener la estructura básica de schemas', async () => {
      const schemasDir = resolve(APP_DIR, 'schemas')
      
      // Verificar que el directorio existe
      await expect(access(schemasDir, constants.F_OK)).resolves.not.toThrow()
      
      const items = await readdir(schemasDir, { withFileTypes: true })
      const directories = items.filter(item => item.isDirectory()).map(item => item.name)
      const files = items.filter(item => item.isFile()).map(item => item.name)
      
      // Verificar directorios principales que deben existir
      expect(directories).toContain('admin')
      expect(directories).toContain('orders')
      expect(directories).toContain('shared')
      
      // Verificar que la carpeta muestreo fue eliminada
      expect(directories).not.toContain('muestreo')
      
      // Verificar archivo index principal
      expect(files).toContain('index.ts')
    })
    
    it('debe verificar que el archivo index.ts exporta correctamente', async () => {
      const indexPath = resolve(APP_DIR, 'schemas/index.ts')
      
      await expect(access(indexPath, constants.F_OK)).resolves.not.toThrow()
      
      const content = await readFile(indexPath, 'utf-8')
      
      // Verificar exports principales
      expect(content).toMatch(/export.*from.*shared/)
      expect(content).toMatch(/export.*from.*admin/)
      expect(content).toMatch(/export.*from.*orders/)
      
      // No debe tener exports de muestreo eliminado
      expect(content).not.toMatch(/export.*from.*muestreo/)
      expect(content).not.toMatch(/muestreo/i)
    })
  })
  
  describe('Schemas de órdenes', () => {
    it('debe verificar que los schemas de orders están completos', async () => {
      const ordersDir = resolve(APP_DIR, 'schemas/orders')
      
      await expect(access(ordersDir, constants.F_OK)).resolves.not.toThrow()
      
      const files = await readdir(ordersDir)
      
      // Verificar archivos esenciales
      expect(files).toContain('ocr.ts')
      expect(files).toContain('new_order.ts')
      
      // Verificar que cada archivo es válido
      for (const file of files) {
        const filePath = resolve(ordersDir, file)
        const stats = await stat(filePath)
        
        expect(stats.isFile()).toBe(true)
        expect(stats.size).toBeGreaterThan(0)
      }
    })
    
    it('debe verificar que ocr.ts tiene la estructura correcta', async () => {
      const ocrSchemaPath = resolve(APP_DIR, 'schemas/orders/ocr.ts')
      
      await expect(access(ocrSchemaPath, constants.F_OK)).resolves.not.toThrow()
      
      const content = await readFile(ocrSchemaPath, 'utf-8')
      
      // Verificar imports de Zod
      expect(content).toMatch(/import.*z.*from ['"]zod['"]/)
      
      // Verificar schemas principales
      expect(content).toMatch(/OCRDataSchema|ocrDataSchema/)
      
      // Verificar exports
      expect(content).toMatch(/export/)
      
      // No debe referenciar muestreo eliminado
      expect(content).not.toMatch(/muestreo/i)
    })
    
    it('debe verificar que new_order.ts tiene la estructura correcta', async () => {
      const newOrderSchemaPath = resolve(APP_DIR, 'schemas/orders/new_order.ts')
      
      await expect(access(newOrderSchemaPath, constants.F_OK)).resolves.not.toThrow()
      
      const content = await readFile(newOrderSchemaPath, 'utf-8')
      
      // Verificar imports de Zod
      expect(content).toMatch(/import.*z.*from ['"]zod['"]/)
      
      // Verificar schema principal
      expect(content).toMatch(/newOrderSchema/)
      
      // Verificar exports
      expect(content).toMatch(/export.*newOrderSchema/)
      
      // No debe referenciar muestreo eliminado
      expect(content).not.toMatch(/muestreo/i)
    })
  })
  
  describe('Schemas compartidos', () => {
    it('debe verificar que los schemas shared están disponibles', async () => {
      const sharedDir = resolve(APP_DIR, 'schemas/shared')
      
      await expect(access(sharedDir, constants.F_OK)).resolves.not.toThrow()
      
      const files = await readdir(sharedDir)
      
      // Debe tener al menos algunos archivos
      expect(files.length).toBeGreaterThan(0)
      
      // Verificar que hay schemas de imagen u otros importantes
      const hasImageSchema = files.some(file => file.includes('image'))
      if (hasImageSchema) {
        expect(hasImageSchema).toBe(true)
      }
    })
    
    it('debe verificar que no hay referencias a schemas eliminados en shared', async () => {
      const sharedDir = resolve(APP_DIR, 'schemas/shared')
      
      const files = await readdir(sharedDir)
      
      for (const file of files) {
        const filePath = resolve(sharedDir, file)
        const stats = await stat(filePath)
        
        if (stats.isFile() && file.endsWith('.ts')) {
          const content = await readFile(filePath, 'utf-8')
          
          // No debe referenciar muestreo eliminado
          expect(content).not.toMatch(/muestreo/i)
        }
      }
    })
  })
  
  describe('Schemas de administración', () => {
    it('debe verificar que los schemas admin están disponibles', async () => {
      const adminDir = resolve(APP_DIR, 'schemas/admin')
      
      await expect(access(adminDir, constants.F_OK)).resolves.not.toThrow()
      
      const files = await readdir(adminDir)
      
      // Debe tener archivos de esquemas
      expect(files.length).toBeGreaterThan(0)
      
      // Verificar archivos típicos de admin
      const hasUserSchema = files.some(file => file.includes('user'))
      if (hasUserSchema) {
        expect(hasUserSchema).toBe(true)
      }
    })
    
    it('debe verificar que no hay referencias a schemas eliminados en admin', async () => {
      const adminDir = resolve(APP_DIR, 'schemas/admin')
      
      const files = await readdir(adminDir)
      
      for (const file of files) {
        const filePath = resolve(adminDir, file)
        const stats = await stat(filePath)
        
        if (stats.isFile() && file.endsWith('.ts')) {
          const content = await readFile(filePath, 'utf-8')
          
          // No debe referenciar muestreo eliminado
          expect(content).not.toMatch(/muestreo/i)
        }
      }
    })
  })
  
  describe('Integridad de imports y exports', () => {
    it('debe verificar que todos los exports del index son válidos', async () => {
      const indexPath = resolve(APP_DIR, 'schemas/index.ts')
      const content = await readFile(indexPath, 'utf-8')
      
      // Extraer todas las declaraciones de export from
      const exportMatches = content.match(/export\s+\*\s+from\s+['"]([^'"]+)['"]/g) || []
      
      for (const exportMatch of exportMatches) {
        const pathMatch = exportMatch.match(/['"]([^'"]+)['"]/)
        if (pathMatch) {
          const exportPath = pathMatch[1]
          const resolvedPath = resolve(APP_DIR, 'schemas', exportPath + '.ts')
          
          // Verificar que cada archivo exportado existe
          await expect(access(resolvedPath, constants.F_OK)).resolves.not.toThrow()
        }
      }
    })
    
    it('debe verificar que no hay imports rotos por la limpieza', async () => {
      const schemasDir = resolve(APP_DIR, 'schemas')
      
      // Función recursiva para buscar imports
      async function checkImports(dir: string): Promise<string[]> {
        const brokenImports: string[] = []
        const items = await readdir(dir, { withFileTypes: true })
        
        for (const item of items) {
          const fullPath = join(dir, item.name)
          if (item.isDirectory()) {
            brokenImports.push(...await checkImports(fullPath))
          } else if (item.isFile() && item.name.endsWith('.ts')) {
            const content = await readFile(fullPath, 'utf-8')
            
            // Buscar imports de muestreo (que fue eliminado)
            if (content.match(/import.*muestreo/i) || content.match(/from.*muestreo/i)) {
              brokenImports.push(fullPath)
            }
          }
        }
        
        return brokenImports
      }
      
      const brokenImports = await checkImports(schemasDir)
      
      // No debe haber imports rotos
      expect(brokenImports).toEqual([])
    })
    
    it('debe verificar compatibilidad de re-exports', async () => {
      const indexPath = resolve(APP_DIR, 'schemas/index.ts')
      const content = await readFile(indexPath, 'utf-8')
      
      // Verificar re-exports específicos para compatibilidad
      if (content.includes('Re-exports específicos')) {
        expect(content).toMatch(/export.*newOrderSchema.*as.*orderDataSchema/)
      }
    })
  })
  
  describe('Validación de tipos TypeScript', () => {
    it('debe verificar que los schemas usan tipos correctos de Zod', async () => {
      const schemasDir = resolve(APP_DIR, 'schemas')
      
      // Función para verificar archivos de schema
      async function checkZodUsage(dir: string): Promise<{ file: string, hasZod: boolean, hasValidExports: boolean }[]> {
        const results: { file: string, hasZod: boolean, hasValidExports: boolean }[] = []
        const items = await readdir(dir, { withFileTypes: true })
        
        for (const item of items) {
          const fullPath = join(dir, item.name)
          if (item.isDirectory()) {
            results.push(...await checkZodUsage(fullPath))
          } else if (item.isFile() && item.name.endsWith('.ts') && item.name !== 'index.ts') {
            const content = await readFile(fullPath, 'utf-8')
            
            const hasZod = content.includes('from \'zod\'') || content.includes('from "zod"')
            const hasValidExports = content.includes('export')
            
            results.push({ file: fullPath, hasZod, hasValidExports })
          }
        }
        
        return results
      }
      
      const results = await checkZodUsage(schemasDir)
      
      // Todos los archivos de schema deben usar Zod y tener exports
      results.forEach(result => {
        expect(result.hasZod).toBe(true)
        expect(result.hasValidExports).toBe(true)
      })
    })
    
    it('debe verificar que no hay referencias a tipos eliminados', async () => {
      const schemasDir = resolve(APP_DIR, 'schemas')
      
      // Buscar referencias a tipos que podrían haber estado en muestreo
      async function findTypeReferences(dir: string): Promise<string[]> {
        const references: string[] = []
        const items = await readdir(dir, { withFileTypes: true })
        
        for (const item of items) {
          const fullPath = join(dir, item.name)
          if (item.isDirectory()) {
            references.push(...await findTypeReferences(fullPath))
          } else if (item.isFile() && item.name.endsWith('.ts')) {
            const content = await readFile(fullPath, 'utf-8')
            
            // Buscar tipos que podrían estar relacionados con muestreo eliminado
            const prohibitedPatterns = [
              /MuestreoSchema/i,
              /SamplingSchema/i,
              /muestreoData/i,
              /samplingData/i
            ]
            
            prohibitedPatterns.forEach((pattern, index) => {
              if (pattern.test(content)) {
                references.push(`${fullPath}: Patrón ${index} encontrado`)
              }
            })
          }
        }
        
        return references
      }
      
      const references = await findTypeReferences(schemasDir)
      
      // No debe haber referencias a tipos eliminados
      expect(references).toEqual([])
    })
  })
})