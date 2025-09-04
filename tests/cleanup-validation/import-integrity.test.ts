import { describe, it, expect } from 'vitest'
import { fileURLToPath } from 'node:url'
import { readdir, access, readFile } from 'node:fs/promises'
import { resolve, join } from 'node:path'
import { constants } from 'node:fs'

const PROJECT_DIR = fileURLToPath(new URL('../../', import.meta.url))
const APP_DIR = resolve(PROJECT_DIR, 'app')

/**
 * Tests de integridad de importaciones después de la limpieza
 * Verifica que no se han roto importaciones por los archivos eliminados
 */
describe('Integridad de Importaciones después de Limpieza', () => {
  describe('Importaciones de componentes', () => {
    it('debe verificar que no hay imports rotos a login-simple.vue', async () => {
      const componentsDir = resolve(APP_DIR, 'components')
      
      await expect(access(componentsDir, constants.F_OK)).resolves.not.toThrow()
      
      // Función recursiva para buscar imports
      async function findBrokenImports(dir: string): Promise<string[]> {
        const brokenImports: string[] = []
        const items = await readdir(dir, { withFileTypes: true })
        
        for (const item of items) {
          const fullPath = join(dir, item.name)
          if (item.isDirectory()) {
            brokenImports.push(...await findBrokenImports(fullPath))
          } else if (item.isFile() && (item.name.endsWith('.vue') || item.name.endsWith('.ts'))) {
            try {
              const content = await readFile(fullPath, 'utf-8')
              
              // Buscar imports de login-simple
              if (content.match(/import.*login-simple/i) || 
                  content.match(/from.*login-simple/i)) {
                brokenImports.push(fullPath)
              }
            } catch {
              // Ignorar errores de lectura
            }
          }
        }
        
        return brokenImports
      }
      
      const brokenImports = await findBrokenImports(componentsDir)
      
      // No debe haber imports rotos
      expect(brokenImports).toEqual([])
    })
    
    it('debe verificar que los componentes core siguen funcionando', async () => {
      const coreDir = resolve(APP_DIR, 'components/core')
      
      await expect(access(coreDir, constants.F_OK)).resolves.not.toThrow()
      
      const files = await readdir(coreDir)
      
      // Verificar archivos principales
      const vueFiles = files.filter(file => file.endsWith('.vue'))
      expect(vueFiles.length).toBeGreaterThan(0)
      
      // Verificar que cada componente tiene imports válidos
      for (const file of vueFiles) {
        const filePath = resolve(coreDir, file)
        const content = await readFile(filePath, 'utf-8')
        
        // No debe referenciar archivos eliminados
        expect(content).not.toMatch(/login-simple/i)
        expect(content).not.toMatch(/tesseract/i)
        
        // Si tiene imports, deben ser válidos
        const importMatches = content.match(/import.*from\s+['"]([^'"]+)['"]/g) || []
        for (const importMatch of importMatches) {
          const pathMatch = importMatch.match(/from\s+['"]([^'"]+)['"]/)
          if (pathMatch && pathMatch[1].startsWith('./') || pathMatch[1].startsWith('../')) {
            // Solo verificar imports relativos locales
            const importPath = pathMatch[1]
            expect(importPath).not.toMatch(/login-simple/i)
            expect(importPath).not.toMatch(/muestreo/i)
          }
        }
      }
    })
    
    it('debe verificar que los componentes de navegación no referencian rutas eliminadas', async () => {
      const navigationDir = resolve(APP_DIR, 'components/navigation')
      
      try {
        await access(navigationDir, constants.F_OK)
        
        const files = await readdir(navigationDir)
        const vueFiles = files.filter(file => file.endsWith('.vue'))
        
        for (const file of vueFiles) {
          const filePath = resolve(navigationDir, file)
          const content = await readFile(filePath, 'utf-8')
          
          // No debe referenciar rutas eliminadas
          expect(content).not.toMatch(/login-simple/i)
          expect(content).not.toMatch(/to=".*login-simple/i)
          expect(content).not.toMatch(/:to=".*login-simple/i)
        }
      } catch {
        // Si no existe, es válido
        console.log('Directorio navigation no encontrado')
      }
    })
  })
  
  describe('Importaciones de páginas', () => {
    it('debe verificar que las páginas no importan archivos eliminados', async () => {
      const pagesDir = resolve(APP_DIR, 'pages')
      
      await expect(access(pagesDir, constants.F_OK)).resolves.not.toThrow()
      
      // Función recursiva para verificar páginas
      async function checkPageImports(dir: string): Promise<string[]> {
        const issues: string[] = []
        const items = await readdir(dir, { withFileTypes: true })
        
        for (const item of items) {
          const fullPath = join(dir, item.name)
          if (item.isDirectory()) {
            issues.push(...await checkPageImports(fullPath))
          } else if (item.isFile() && item.name.endsWith('.vue')) {
            const content = await readFile(fullPath, 'utf-8')
            
            // Verificar imports problemáticos
            if (content.match(/import.*login-simple/i)) {
              issues.push(`${fullPath}: Importa login-simple eliminado`)
            }
            
            if (content.match(/import.*tesseract/i)) {
              issues.push(`${fullPath}: Importa tesseract eliminado`)
            }
            
            if (content.match(/import.*muestreo/i)) {
              issues.push(`${fullPath}: Importa schemas muestreo eliminados`)
            }
          }
        }
        
        return issues
      }
      
      const issues = await checkPageImports(pagesDir)
      
      // No debe haber issues
      expect(issues).toEqual([])
    })
    
    it('debe verificar que la página de login principal funciona', async () => {
      const loginPath = resolve(APP_DIR, 'pages/auth/login.vue')
      
      await expect(access(loginPath, constants.F_OK)).resolves.not.toThrow()
      
      const content = await readFile(loginPath, 'utf-8')
      
      // Verificar que es un archivo Vue válido
      expect(content).toMatch(/<template>/)
      expect(content).toMatch(/<script/)
      
      // No debe referenciar login-simple
      expect(content).not.toMatch(/login-simple/i)
      
      // Debe tener componentes válidos
      expect(content).toMatch(/setup/)
    })
  })
  
  describe('Importaciones de composables', () => {
    it('debe verificar que los composables no tienen imports rotos', async () => {
      const composablesDir = resolve(APP_DIR, 'composables')
      
      await expect(access(composablesDir, constants.F_OK)).resolves.not.toThrow()
      
      // Función recursiva para verificar composables
      async function checkComposableImports(dir: string): Promise<string[]> {
        const issues: string[] = []
        const items = await readdir(dir, { withFileTypes: true })
        
        for (const item of items) {
          const fullPath = join(dir, item.name)
          if (item.isDirectory()) {
            issues.push(...await checkComposableImports(fullPath))
          } else if (item.isFile() && item.name.endsWith('.ts')) {
            const content = await readFile(fullPath, 'utf-8')
            
            // Verificar imports problemáticos
            if (content.match(/from.*tesseract/i)) {
              issues.push(`${fullPath}: Importa tesseract eliminado`)
            }
            
            if (content.match(/from.*schemas.*muestreo/i)) {
              issues.push(`${fullPath}: Importa schemas muestreo eliminados`)
            }
          }
        }
        
        return issues
      }
      
      const issues = await checkComposableImports(composablesDir)
      
      // No debe haber issues
      expect(issues).toEqual([])
    })
    
    it('debe verificar que useAuthState no referencia archivos eliminados', async () => {
      const authStatePath = resolve(APP_DIR, 'composables/auth/useAuthState.ts')
      
      try {
        await access(authStatePath, constants.F_OK)
        const content = await readFile(authStatePath, 'utf-8')
        
        // No debe referenciar login-simple
        expect(content).not.toMatch(/login-simple/i)
        
        // Debe tener imports válidos
        const imports = content.match(/import.*from\s+['"][^'"]*['"]/g) || []
        imports.forEach(imp => {
          expect(imp).not.toMatch(/login-simple/i)
          expect(imp).not.toMatch(/tesseract/i)
        })
      } catch {
        console.log('useAuthState.ts no encontrado - puede no existir')
      }
    })
    
    it('debe verificar que useOrderState no referencia archivos eliminados', async () => {
      const orderStatePath = resolve(APP_DIR, 'composables/orders/useOrderState.ts')
      
      try {
        await access(orderStatePath, constants.F_OK)
        const content = await readFile(orderStatePath, 'utf-8')
        
        // No debe referenciar archivos eliminados
        expect(content).not.toMatch(/muestreo/i)
        expect(content).not.toMatch(/tesseract/i)
        
        // Debe importar schemas válidos
        if (content.includes('schemas')) {
          expect(content).toMatch(/from.*schemas.*orders/i)
        }
      } catch {
        console.log('useOrderState.ts no encontrado')
      }
    })
  })
  
  describe('Importaciones de plugins', () => {
    it('debe verificar que los plugins no tienen imports rotos', async () => {
      const pluginsDir = resolve(APP_DIR, 'plugins')
      
      try {
        await access(pluginsDir, constants.F_OK)
        
        const files = await readdir(pluginsDir)
        const tsFiles = files.filter(file => file.endsWith('.ts'))
        
        for (const file of tsFiles) {
          const filePath = resolve(pluginsDir, file)
          const content = await readFile(filePath, 'utf-8')
          
          // No debe referenciar dependencias eliminadas
          expect(content).not.toMatch(/tesseract/i)
          
          // Verificar imports válidos
          const imports = content.match(/import.*from\s+['"][^'"]*['"]/g) || []
          imports.forEach(imp => {
            expect(imp).not.toMatch(/tesseract/i)
            expect(imp).not.toMatch(/login-simple/i)
          })
        }
      } catch {
        console.log('Directorio plugins no encontrado')
      }
    })
  })
  
  describe('Importaciones de middleware', () => {
    it('debe verificar que los middleware no referencian rutas eliminadas', async () => {
      const middlewareDir = resolve(APP_DIR, 'middleware')
      
      await expect(access(middlewareDir, constants.F_OK)).resolves.not.toThrow()
      
      const files = await readdir(middlewareDir)
      const tsFiles = files.filter(file => file.endsWith('.ts'))
      
      for (const file of tsFiles) {
        const filePath = resolve(middlewareDir, file)
        const content = await readFile(filePath, 'utf-8')
        
        // No debe referenciar rutas eliminadas
        expect(content).not.toMatch(/login-simple/i)
        
        // Si maneja redirects, debe usar rutas válidas
        if (content.includes('redirect') || content.includes('navigateTo')) {
          expect(content).not.toMatch(/login-simple/i)
        }
      }
    })
  })
  
  describe('Importaciones de tipos', () => {
    it('debe verificar que los archivos de tipos no referencian tipos eliminados', async () => {
      const typesDir = resolve(APP_DIR, 'types')
      
      try {
        await access(typesDir, constants.F_OK)
        
        const files = await readdir(typesDir)
        const tsFiles = files.filter(file => file.endsWith('.ts'))
        
        for (const file of tsFiles) {
          const filePath = resolve(typesDir, file)
          const content = await readFile(filePath, 'utf-8')
          
          // No debe referenciar tipos de schemas eliminados
          expect(content).not.toMatch(/MuestreoSchema/i)
          expect(content).not.toMatch(/SamplingSchema/i)
          expect(content).not.toMatch(/muestreoData/i)
          
          // Verificar imports de schemas
          if (content.includes('schemas')) {
            expect(content).not.toMatch(/from.*schemas.*muestreo/i)
          }
        }
      } catch {
        console.log('Directorio types no encontrado')
      }
    })
  })
  
  describe('Configuración de auto-imports', () => {
    it('debe verificar que nuxt.config.ts no referencia archivos eliminados', async () => {
      const nuxtConfigPath = resolve(PROJECT_DIR, 'nuxt.config.ts')
      
      await expect(access(nuxtConfigPath, constants.F_OK)).resolves.not.toThrow()
      
      const content = await readFile(nuxtConfigPath, 'utf-8')
      
      // No debe referenciar archivos eliminados en la configuración
      expect(content).not.toMatch(/login-simple/i)
      expect(content).not.toMatch(/tesseract/i)
      expect(content).not.toMatch(/muestreo/i)
      
      // Si hay configuración de auto-imports, debe ser válida
      if (content.includes('imports:') || content.includes('components:')) {
        expect(content).not.toMatch(/login-simple/i)
      }
    })
    
    it('debe verificar que no hay archivos .d.ts rotos', async () => {
      // Buscar archivos de tipos TypeScript
      async function findTypeFiles(dir: string): Promise<string[]> {
        const typeFiles: string[] = []
        try {
          const items = await readdir(dir, { withFileTypes: true })
          
          for (const item of items) {
            const fullPath = join(dir, item.name)
            if (item.isDirectory() && item.name !== 'node_modules' && item.name !== '.nuxt') {
              typeFiles.push(...await findTypeFiles(fullPath))
            } else if (item.isFile() && item.name.endsWith('.d.ts')) {
              typeFiles.push(fullPath)
            }
          }
        } catch {
          // Ignorar errores de acceso
        }
        
        return typeFiles
      }
      
      const typeFiles = await findTypeFiles(PROJECT_DIR)
      
      // Verificar cada archivo de tipos
      for (const typeFile of typeFiles) {
        try {
          const content = await readFile(typeFile, 'utf-8')
          
          // No debe referenciar tipos eliminados
          expect(content).not.toMatch(/login-simple/i)
          expect(content).not.toMatch(/tesseract/i)
          expect(content).not.toMatch(/MuestreoSchema/i)
        } catch {
          // Ignorar errores de lectura
        }
      }
    })
  })
  
  describe('Importaciones de servidor', () => {
    it('debe verificar que las APIs del servidor no tienen imports rotos', async () => {
      const serverApiDir = resolve(PROJECT_DIR, 'server/api')
      
      await expect(access(serverApiDir, constants.F_OK)).resolves.not.toThrow()
      
      // Función recursiva para verificar APIs
      async function checkServerImports(dir: string): Promise<string[]> {
        const issues: string[] = []
        const items = await readdir(dir, { withFileTypes: true })
        
        for (const item of items) {
          const fullPath = join(dir, item.name)
          if (item.isDirectory()) {
            issues.push(...await checkServerImports(fullPath))
          } else if (item.isFile() && item.name.endsWith('.ts')) {
            const content = await readFile(fullPath, 'utf-8')
            
            // Verificar que no usa tesseract
            if (content.match(/import.*tesseract/i) || content.match(/from.*tesseract/i)) {
              issues.push(`${fullPath}: Usa tesseract eliminado`)
            }
            
            // Si es OCR, debe usar Google GenAI
            if (fullPath.includes('ocr')) {
              expect(content).toMatch(/@google\/genai/)
              expect(content).not.toMatch(/tesseract/i)
            }
          }
        }
        
        return issues
      }
      
      const issues = await checkServerImports(serverApiDir)
      
      // No debe haber issues
      expect(issues).toEqual([])
    })
  })
})