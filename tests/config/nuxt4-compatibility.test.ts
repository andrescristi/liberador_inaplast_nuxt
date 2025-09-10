import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { join } from 'path'

describe('Nuxt 4 Compatibility', () => {
  it('debe tener configuración de srcDir para Nuxt 4', () => {
    const configFile = readFileSync(join(process.cwd(), 'nuxt.config.ts'), 'utf-8')
    
    expect(configFile).toContain("srcDir: 'app/'")
  })

  it('debe tener auto-imports configurado para composables anidados', () => {
    const configFile = readFileSync(join(process.cwd(), 'nuxt.config.ts'), 'utf-8')
    
    expect(configFile).toContain('imports: {')
    expect(configFile).toContain("'~/composables'")
    expect(configFile).toContain("'~/composables/**'")
  })

  it('debe tener estructura de directorios de Nuxt 4', async () => {
    const { existsSync } = await import('fs')
    
    // Verificar que existe la estructura app/
    expect(existsSync('app/composables')).toBe(true)
    expect(existsSync('app/components')).toBe(true)
    expect(existsSync('app/plugins')).toBe(true)
    expect(existsSync('app/pages')).toBe(true)
    expect(existsSync('app/layouts')).toBe(true)
    
    // Verificar composables anidados
    expect(existsSync('app/composables/auth')).toBe(true)
    expect(existsSync('app/composables/tools/useLogger.ts')).toBe(true)
  })

  it('debe tener plugins organizados correctamente', async () => {
    const { existsSync } = await import('fs')
    
    // Verificar plugins en app/
    expect(existsSync('app/plugins/logger.client.ts')).toBe(true)
    expect(existsSync('app/plugins/logger.server.ts')).toBe(true)
    
    // Verificar plugins del servidor
    expect(existsSync('server/plugins/logger.ts')).toBe(true)
  })

  it('debe tener tipos TypeScript correctos', async () => {
    const { existsSync } = await import('fs')
    
    expect(existsSync('app/types/logger.d.ts')).toBe(true)
    expect(existsSync('app/types/database.types.ts')).toBe(true)
  })

  it('debe tener fecha de compatibilidad de Nuxt 4', () => {
    const configFile = readFileSync(join(process.cwd(), 'nuxt.config.ts'), 'utf-8')
    
    expect(configFile).toContain("compatibilityDate: '2025-08-11'")
  })
})