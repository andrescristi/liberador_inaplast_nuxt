import { describe, it, expect, beforeAll } from 'vitest'
import { fileURLToPath } from 'node:url'
import { readdir, access, stat } from 'node:fs/promises'
import { resolve, join } from 'node:path'
import { constants } from 'node:fs'

const APP_DIR = fileURLToPath(new URL('../../app', import.meta.url))

/**
 * Tests de integridad de routing después de la limpieza
 * Verifica que las rutas esenciales siguen funcionando sin login-simple.vue eliminado
 */
describe('Integridad de Routing después de Limpieza', () => {
  describe('Rutas de autenticación', () => {
    it('debe tener las rutas principales de auth disponibles', async () => {
      const authDir = resolve(APP_DIR, 'pages/auth')
      
      // Verificar que el directorio existe
      await expect(access(authDir, constants.F_OK)).resolves.not.toThrow()
      
      const files = await readdir(authDir)
      
      // Verificar rutas esenciales
      expect(files).toContain('login.vue')
      expect(files).toContain('profile.vue')
      expect(files).toContain('reset-password.vue')
      expect(files).toContain('confirm.vue')
      
      // Verificar que login-simple.vue fue eliminado correctamente
      expect(files).not.toContain('login-simple.vue')
    })
    
    it('debe tener solo un archivo de login principal', async () => {
      const authDir = resolve(APP_DIR, 'pages/auth')
      const files = await readdir(authDir)
      
      const loginFiles = files.filter(file => file.includes('login'))
      
      // Solo debe existir login.vue
      expect(loginFiles).toEqual(['login.vue'])
      expect(loginFiles).toHaveLength(1)
    })
    
    it('debe verificar que login.vue es accesible y válido', async () => {
      const loginPath = resolve(APP_DIR, 'pages/auth/login.vue')
      
      // Verificar que el archivo existe
      await expect(access(loginPath, constants.F_OK)).resolves.not.toThrow()
      
      // Verificar que es un archivo regular
      const stats = await stat(loginPath)
      expect(stats.isFile()).toBe(true)
      expect(stats.size).toBeGreaterThan(0)
    })
  })
  
  describe('Estructura de páginas', () => {
    it('debe mantener la estructura básica de páginas', async () => {
      const pagesDir = resolve(APP_DIR, 'pages')
      
      await expect(access(pagesDir, constants.F_OK)).resolves.not.toThrow()
      
      const items = await readdir(pagesDir, { withFileTypes: true })
      const directories = items.filter(item => item.isDirectory()).map(item => item.name)
      const files = items.filter(item => item.isFile()).map(item => item.name)
      
      // Verificar directorios principales
      expect(directories).toContain('auth')
      
      // Verificar archivos principales
      expect(files).toContain('index.vue')
    })
    
    it('debe verificar que no quedan archivos de prueba en páginas', async () => {
      const pagesDir = resolve(APP_DIR, 'pages')
      
      // Función recursiva para buscar archivos de prueba
      async function findTestFiles(dir: string): Promise<string[]> {
        const testFiles: string[] = []
        const items = await readdir(dir, { withFileTypes: true })
        
        for (const item of items) {
          const fullPath = join(dir, item.name)
          if (item.isDirectory()) {
            testFiles.push(...await findTestFiles(fullPath))
          } else if (item.isFile()) {
            // Buscar archivos que parezcan de prueba
            if (item.name.includes('simple') || 
                item.name.includes('test') || 
                item.name.includes('debug') ||
                item.name.includes('temp')) {
              testFiles.push(fullPath)
            }
          }
        }
        
        return testFiles
      }
      
      const testFiles = await findTestFiles(pagesDir)
      
      // No debe haber archivos de prueba
      expect(testFiles).toEqual([])
    })
  })
  
  describe('Rutas dinámicas y layouts', () => {
    it('debe verificar que los layouts siguen funcionando', async () => {
      const layoutsDir = resolve(APP_DIR, 'layouts')
      
      await expect(access(layoutsDir, constants.F_OK)).resolves.not.toThrow()
      
      const layouts = await readdir(layoutsDir)
      
      // Verificar layouts esenciales
      expect(layouts).toContain('auth.vue')
      expect(layouts).toContain('default.vue')
    })
    
    it('debe verificar middleware de rutas', async () => {
      const middlewareDir = resolve(APP_DIR, 'middleware')
      
      await expect(access(middlewareDir, constants.F_OK)).resolves.not.toThrow()
      
      const middlewares = await readdir(middlewareDir)
      
      // Verificar middlewares importantes
      expect(middlewares.length).toBeGreaterThan(0)
      
      // Verificar que existen middlewares de auth
      const authMiddlewares = middlewares.filter(m => m.includes('auth'))
      expect(authMiddlewares.length).toBeGreaterThan(0)
    })
  })
  
  describe('Navegación y componentes', () => {
    it('debe verificar que los componentes de navegación existen', async () => {
      const componentsDir = resolve(APP_DIR, 'components')
      
      await expect(access(componentsDir, constants.F_OK)).resolves.not.toThrow()
      
      // Verificar estructura de componentes
      const coreDir = resolve(componentsDir, 'core')
      await expect(access(coreDir, constants.F_OK)).resolves.not.toThrow()
      
      const navigationDir = resolve(componentsDir, 'navigation')
      await expect(access(navigationDir, constants.F_OK)).resolves.not.toThrow()
    })
    
    it('debe verificar que no hay referencias a login-simple en componentes', async () => {
      const componentsDir = resolve(APP_DIR, 'components')
      
      // Función para buscar referencias en archivos
      async function searchReferences(dir: string): Promise<string[]> {
        const references: string[] = []
        const items = await readdir(dir, { withFileTypes: true })
        
        for (const item of items) {
          const fullPath = join(dir, item.name)
          if (item.isDirectory()) {
            references.push(...await searchReferences(fullPath))
          } else if (item.isFile() && item.name.endsWith('.vue')) {
            try {
              const { readFile } = await import('node:fs/promises')
              const content = await readFile(fullPath, 'utf-8')
              
              if (content.includes('login-simple')) {
                references.push(fullPath)
              }
            } catch {
              // Ignorar errores de lectura
            }
          }
        }
        
        return references
      }
      
      const references = await searchReferences(componentsDir)
      
      // No debe haber referencias a login-simple
      expect(references).toEqual([])
    })
  })
})