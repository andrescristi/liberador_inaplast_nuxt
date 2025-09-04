import { describe, it, expect } from 'vitest'
import { resolve } from 'path'
import { readFileSync } from 'fs'

const configPath = resolve(process.cwd(), 'nuxt.config.ts')

describe('Configuración de Auto-importación de Componentes', () => {
  let configContent: string

  it('el archivo de configuración existe y es legible', () => {
    expect(() => {
      configContent = readFileSync(configPath, 'utf-8')
    }).not.toThrow()
    expect(configContent).toBeTruthy()
  })

  it('incluye configuración de componentes con prefijos', () => {
    configContent = readFileSync(configPath, 'utf-8')
    
    // Verificar que la configuración de componentes existe
    expect(configContent).toContain('components:')
    
    // Verificar prefijo Ui para componentes UI
    expect(configContent).toContain(`prefix: 'Ui'`)
    expect(configContent).toContain(`path: '~/components/ui'`)
    
    // Verificar prefijo Core para componentes core
    expect(configContent).toContain(`prefix: 'Core'`)
    expect(configContent).toContain(`path: '~/components/core'`)
  })

  it('incluye todos los directorios de componentes necesarios', () => {
    configContent = readFileSync(configPath, 'utf-8')
    
    const expectedPaths = [
      '~/components',
      '~/components/ui',
      '~/components/core',
      '~/components/feedback',
      '~/components/orders',
      '~/components/admin'
    ]
    
    expectedPaths.forEach(path => {
      expect(configContent).toContain(`path: '${path}'`)
    })
  })

  it('tiene configuración global habilitada para todos los componentes', () => {
    configContent = readFileSync(configPath, 'utf-8')
    
    // Contar ocurrencias de global: true
    const globalTrueMatches = configContent.match(/global: true/g)
    expect(globalTrueMatches).toBeTruthy()
    expect(globalTrueMatches!.length).toBeGreaterThanOrEqual(6) // 6 directorios configurados
  })

  it('mantiene configuración de auto-imports para composables', () => {
    configContent = readFileSync(configPath, 'utf-8')
    
    expect(configContent).toContain('imports:')
    expect(configContent).toContain('~/composables')
    expect(configContent).toContain('~/composables/**')
  })

  describe('validación de estructura de configuración', () => {
    it('la configuración de componentes es un array', () => {
      configContent = readFileSync(configPath, 'utf-8')
      
      // Buscar el patrón components: [ ... ]
      const componentConfigMatch = configContent.match(/components:\s*\[([\s\S]*?)\]/m)
      expect(componentConfigMatch).toBeTruthy()
    })

    it('cada entrada de componente tiene la estructura correcta', () => {
      configContent = readFileSync(configPath, 'utf-8')
      
      // Verificar estructura básica para componentes UI
      const uiComponentConfig = configContent.match(/{\s*path:\s*'~\/components\/ui',\s*prefix:\s*'Ui',\s*global:\s*true\s*}/s)
      expect(uiComponentConfig).toBeTruthy()
      
      // Verificar estructura básica para componentes Core  
      const coreComponentConfig = configContent.match(/{\s*path:\s*'~\/components\/core',\s*prefix:\s*'Core',\s*global:\s*true\s*}/s)
      expect(coreComponentConfig).toBeTruthy()
    })
  })
})