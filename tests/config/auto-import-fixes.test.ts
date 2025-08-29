/**
 * Tests para validar las correcciones en la configuración de auto-imports
 * 
 * Verifica que:
 * - No existan imports duplicados
 * - Los composables se auto-importen correctamente
 * - La configuración manual de chunks funcione
 * - No haya dependencias circulares
 */
import { describe, it, expect } from 'vitest'
import { fileURLToPath } from 'node:url'
import { readFileSync } from 'node:fs'
import path from 'node:path'

// Obtener rutas de archivos de configuración
const currentDir = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(currentDir, '../..')
const nuxtConfigPath = path.join(projectRoot, 'nuxt.config.ts')
const composablesIndexPath = path.join(projectRoot, 'app/composables/index.ts')

describe('Auto-import Configuration Fixes', () => {
  describe('Nuxt Config - Manual Chunking', () => {
    it('debería tener configuración de manual chunks para evitar dependencias circulares', () => {
      const nuxtConfig = readFileSync(nuxtConfigPath, 'utf-8')
      
      // Verificar que existe la configuración de manualChunks
      expect(nuxtConfig).toContain('manualChunks')
      expect(nuxtConfig).toContain('admin-bundle')
      expect(nuxtConfig).toContain('ui-components')
      expect(nuxtConfig).toContain('auth-composables')
      expect(nuxtConfig).toContain('orders-composables')
    })

    it('debería agrupar admin components con useModalForm para evitar circular dependencies', () => {
      const nuxtConfig = readFileSync(nuxtConfigPath, 'utf-8')
      
      // Verificar la agrupación específica que soluciona el problema
      expect(nuxtConfig).toContain(`id.includes('components/admin/')`)
      expect(nuxtConfig).toContain(`id.includes('composables/ui/useModalForm')`)
      expect(nuxtConfig).toContain(`id.includes('composables/ui/index')`)
      expect(nuxtConfig).toContain(`return 'admin-bundle'`)
    })

    it('debería tener configuración correcta de chunks por dominio', () => {
      const nuxtConfig = readFileSync(nuxtConfigPath, 'utf-8')
      
      // Verificar agrupación por dominios
      expect(nuxtConfig).toContain(`id.includes('components/ui/')`)
      expect(nuxtConfig).toContain(`return 'ui-components'`)
      
      expect(nuxtConfig).toContain(`id.includes('composables/auth/')`)
      expect(nuxtConfig).toContain(`return 'auth-composables'`)
      
      expect(nuxtConfig).toContain(`id.includes('composables/orders/')`)
      expect(nuxtConfig).toContain(`return 'orders-composables'`)
      
      expect(nuxtConfig).toContain(`id.includes('node_modules')`)
      expect(nuxtConfig).toContain(`return 'vendor'`)
    })

    it('debería tener configuración de imports con estructura jerárquica', () => {
      const nuxtConfig = readFileSync(nuxtConfigPath, 'utf-8')
      
      expect(nuxtConfig).toContain(`'~/composables'`)
      expect(nuxtConfig).toContain(`'~/composables/**'`)
    })

    it('debería tener configuración de components con prefixes correctos', () => {
      const nuxtConfig = readFileSync(nuxtConfigPath, 'utf-8')
      
      expect(nuxtConfig).toContain(`prefix: 'Ui'`)
      expect(nuxtConfig).toContain(`prefix: 'Core'`)
      expect(nuxtConfig).toContain(`path: '~/components/ui'`)
      expect(nuxtConfig).toContain(`path: '~/components/core'`)
      expect(nuxtConfig).toContain(`path: '~/components/admin'`)
      expect(nuxtConfig).toContain(`path: '~/components/orders'`)
    })
  })

  describe('Composables Index - Duplicate Imports Fix', () => {
    it('no debería tener exports duplicados de useAuth', () => {
      const composablesIndex = readFileSync(composablesIndexPath, 'utf-8')
      
      // Verificar que no existe el export individual de useAuth
      expect(composablesIndex).not.toContain(`export { useAuth } from './useAuth'`)
      
      // Pero sí debe tener el export from './auth'
      expect(composablesIndex).toContain(`export * from './auth'`)
    })

    it('no debería tener exports individuales de composables del directorio raíz', () => {
      const composablesIndex = readFileSync(composablesIndexPath, 'utf-8')
      
      // Estos exports individuales fueron removidos para evitar duplicación
      expect(composablesIndex).not.toContain(`export { useDebounce } from './useDebounce'`)
      expect(composablesIndex).not.toContain(`export { useImageCompression } from './useImageCompression'`)
      expect(composablesIndex).not.toContain(`export { useLogger } from './useLogger'`)
      expect(composablesIndex).not.toContain(`export { useOCRConfig } from './useOCRConfig'`)
      expect(composablesIndex).not.toContain(`export { useProfile } from './useProfile'`)
    })

    it('debería tener structure correcta de exports por dominio', () => {
      const composablesIndex = readFileSync(composablesIndexPath, 'utf-8')
      
      // Verificar exports por dominio
      expect(composablesIndex).toContain(`export * from './auth'`)
      expect(composablesIndex).toContain(`export * from './ui'`)
      expect(composablesIndex).toContain(`export * from './admin'`)
      expect(composablesIndex).toContain(`export * from './orders'`)
      expect(composablesIndex).toContain(`export * from './muestreo'`)
      expect(composablesIndex).toContain(`export * from './dashboard'`)
    })

    it('debería terminar correctamente sin caracteres extra', () => {
      const composablesIndex = readFileSync(composablesIndexPath, 'utf-8')
      
      // Verificar que termina correctamente sin trailing content
      const lastLine = composablesIndex.trim().split('\n').pop()
      expect(lastLine).toBe(`export * from './dashboard'`)
    })
  })

  describe('useAuth Legacy File Removal', () => {
    it('el archivo legacy useAuth.ts no debería existir', () => {
      const useAuthLegacyPath = path.join(projectRoot, 'app/composables/useAuth.ts')
      
      expect(() => {
        readFileSync(useAuthLegacyPath, 'utf-8')
      }).toThrow()
    })
  })

  describe('TypeScript Type Safety Improvements', () => {
    it('useLogger debería tener tipos explícitos en lugar de any', () => {
      const useLoggerPath = path.join(projectRoot, 'app/composables/useLogger.ts')
      const useLoggerContent = readFileSync(useLoggerPath, 'utf-8')
      
      // Verificar que se removió el uso de 'any' tipo
      expect(useLoggerContent).not.toContain(`(instance.type as any)?.name`)
      expect(useLoggerContent).not.toContain(`(instance.type as any)?.__name`)
      
      // Verificar que se usa tipo explícito
      expect(useLoggerContent).toContain(`{ name?: string; __name?: string }`)
    })

    it('useOrderState debería usar tipos explícitos en orderStats', () => {
      const useOrderStatePath = path.join(projectRoot, 'app/composables/orders/useOrderState.ts')
      const useOrderStateContent = readFileSync(useOrderStatePath, 'utf-8')
      
      // Verificar que no usa 'any' en orderStats
      expect(useOrderStateContent).not.toContain(`(stats as any)[order.status]`)
      
      // Verificar que usa keyof typeof para type safety
      expect(useOrderStateContent).toContain(`keyof typeof stats`)
      expect(useOrderStateContent).toContain(`const statusKey = order.status as keyof typeof stats`)
      expect(useOrderStateContent).toContain(`stats[statusKey]++`)
    })

    it('updateOrder debería usar type assertion explícita', () => {
      const useOrderStatePath = path.join(projectRoot, 'app/composables/orders/useOrderState.ts')
      const useOrderStateContent = readFileSync(useOrderStatePath, 'utf-8')
      
      // Verificar que usa type assertion para Order
      expect(useOrderStateContent).toContain(`} as Order`)
    })
  })

  describe('Order Interface Enhancements', () => {
    it('Order interface debería tener nuevos campos opcionales', () => {
      const orderTypesPath = path.join(projectRoot, 'app/types/orders.ts')
      const orderTypesContent = readFileSync(orderTypesPath, 'utf-8')
      
      // Verificar nuevos campos
      expect(orderTypesContent).toContain(`order_number?: string`)
      expect(orderTypesContent).toContain(`customer_name?: string`) 
      expect(orderTypesContent).toContain(`part_number?: string`)
      
      // Verificar comentario descriptivo
      expect(orderTypesContent).toContain(`// Campos adicionales para búsqueda y display`)
    })

    it('OrderFilters debería incluir campo customer', () => {
      const orderTypesPath = path.join(projectRoot, 'app/types/orders.ts')
      const orderTypesContent = readFileSync(orderTypesPath, 'utf-8')
      
      expect(orderTypesContent).toContain(`customer?: string`)
    })
  })

  describe('Build Configuration Validation', () => {
    it('debería tener configuración ESM correcta para Vercel', () => {
      const nuxtConfig = readFileSync(nuxtConfigPath, 'utf-8')
      
      expect(nuxtConfig).toContain(`preset: 'vercel'`)
      expect(nuxtConfig).toContain(`format: 'esm'`)
    })

    it('debería tener configuración SSR optimizada', () => {
      const nuxtConfig = readFileSync(nuxtConfigPath, 'utf-8')
      
      expect(nuxtConfig).toContain(`noExternal: ['vue', '@vue/shared']`)
      expect(nuxtConfig).toContain(`include: ['vue']`)
    })

    it('debería tener payload extraction deshabilitado', () => {
      const nuxtConfig = readFileSync(nuxtConfigPath, 'utf-8')
      
      expect(nuxtConfig).toContain(`payloadExtraction: false`)
    })
  })
})

describe('Auto-import Resolution Verification', () => {
  describe('Composables Auto-import Structure', () => {
    it('debería tener configuración correcta de auto-imports', () => {
      const nuxtConfig = readFileSync(nuxtConfigPath, 'utf-8')
      
      // Verificar que la configuración de imports incluye subdirectorios
      expect(nuxtConfig).toContain(`dirs: [`)
      expect(nuxtConfig).toContain(`'~/composables'`)
      expect(nuxtConfig).toContain(`'~/composables/**'`)
    })
  })

  describe('Component Auto-import Structure', () => {
    it('debería tener estructura correcta para components auto-import', () => {
      const nuxtConfig = readFileSync(nuxtConfigPath, 'utf-8')
      
      // Verificar que todos los paths de components están definidos
      const componentPaths = [
        '~/components',
        '~/components/ui',
        '~/components/core', 
        '~/components/feedback',
        '~/components/orders',
        '~/components/admin',
        '~/components/muestreo'
      ]
      
      componentPaths.forEach(componentPath => {
        expect(nuxtConfig).toContain(`path: '${componentPath}'`)
      })
    })

    it('debería tener configuración global correcta para components', () => {
      const nuxtConfig = readFileSync(nuxtConfigPath, 'utf-8')
      
      expect(nuxtConfig).toContain(`global: true`)
    })
  })
})

describe('Circular Dependency Prevention', () => {
  describe('Manual Chunk Strategy', () => {
    it('debería tener estrategia específica para admin+useModalForm bundle', () => {
      const nuxtConfig = readFileSync(nuxtConfigPath, 'utf-8')
      
      // Esta es la configuración clave que resuelve la dependencia circular
      const adminBundleConfig = `// Agrupar admin components y useModalForm juntos para evitar dependencias circulares
            if (id.includes('components/admin/') || 
                id.includes('composables/ui/useModalForm') ||
                id.includes('composables/ui/index')) {
              return 'admin-bundle'
            }`
      
      // Verificar presencia de comentario explicativo
      expect(nuxtConfig).toContain('evitar dependencias circulares')
      expect(nuxtConfig).toContain('admin-bundle')
    })

    it('debería separar UI components en bundle independiente', () => {
      const nuxtConfig = readFileSync(nuxtConfigPath, 'utf-8')
      
      expect(nuxtConfig).toContain(`return 'ui-components'`)
      expect(nuxtConfig).toContain('Agrupar todos los componentes UI base juntos')
    })

    it('debería agrupar composables por dominio', () => {
      const nuxtConfig = readFileSync(nuxtConfigPath, 'utf-8')
      
      expect(nuxtConfig).toContain('Agrupar composables por dominio')
      expect(nuxtConfig).toContain(`return 'auth-composables'`)
      expect(nuxtConfig).toContain(`return 'orders-composables'`)
    })

    it('debería tener bundle separado para vendors', () => {
      const nuxtConfig = readFileSync(nuxtConfigPath, 'utf-8')
      
      expect(nuxtConfig).toContain(`return 'vendor'`)
      expect(nuxtConfig).toContain(`id.includes('node_modules')`)
    })
  })
})