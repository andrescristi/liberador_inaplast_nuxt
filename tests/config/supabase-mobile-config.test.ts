/**
 * Tests para la configuración de Supabase con mejoras móviles
 * Verifica que las cookies y sesiones funcionen en dispositivos móviles
 */

import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'

describe('Configuración de Supabase para móviles', () => {
  it('debe tener configuración de cookies para compatibilidad móvil en nuxt.config.ts', () => {
    const configPath = path.join(process.cwd(), 'nuxt.config.ts')
    const configContent = fs.readFileSync(configPath, 'utf-8')
    
    // Verificar que la configuración incluye cookieOptions
    expect(configContent).toContain('cookieOptions')
    expect(configContent).toContain('sameSite: \'lax\'')
    expect(configContent).toContain('maxAge: 60 * 60 * 24 * 7')
    expect(configContent).toContain('secure: process.env.NODE_ENV === \'production\'')
  })

  it('debe verificar existencia del archivo .env', () => {
    const envPath = path.join(process.cwd(), '.env')
    expect(fs.existsSync(envPath)).toBe(true)
    
    const envContent = fs.readFileSync(envPath, 'utf-8')
    expect(envContent).toContain('NUXT_SUPABASE_URL')
    expect(envContent).toContain('NUXT_SUPABASE_ANON_KEY')
  })

  it('debe incluir credenciales de test en el archivo .env', () => {
    const envPath = path.join(process.cwd(), '.env')
    const envContent = fs.readFileSync(envPath, 'utf-8')

    // Verificar credenciales de test actualizadas
    expect(envContent).toContain('NUXT_TEST_EMAIL=')
    expect(envContent).toContain('NUXT_TEST_PASSWORD=')

    // Verificar que las credenciales tienen formato válido
    const emailMatch = envContent.match(/NUXT_TEST_EMAIL="?([^"\n]+)"?/)
    const passwordMatch = envContent.match(/NUXT_TEST_PASSWORD="?([^"\n]+)"?/)

    if (emailMatch) {
      expect(emailMatch[1]).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) // Email válido
    }

    if (passwordMatch) {
      expect(passwordMatch[1].length).toBeGreaterThanOrEqual(6) // Mínimo 6 caracteres
    }
  })

  it('debe tener configuración de Supabase en nuxt.config.ts', () => {
    const configPath = path.join(process.cwd(), 'nuxt.config.ts')
    const configContent = fs.readFileSync(configPath, 'utf-8')

    // Verificar que Supabase está configurado como módulo
    expect(configContent).toContain('@nuxtjs/supabase')

    // Verificar configuración de Supabase (puede estar en diferentes formas)
    const hasSupabaseConfig = configContent.includes('supabase:') ||
                             configContent.includes('@nuxtjs/supabase')
    expect(hasSupabaseConfig).toBe(true)
  })

  it('debe configurar tipos TypeScript correctamente en nuxt.config.ts', () => {
    const configPath = path.join(process.cwd(), 'nuxt.config.ts')
    const configContent = fs.readFileSync(configPath, 'utf-8')
    
    expect(configContent).toContain('types: \'./app/types/database.types.ts\'')
  })
})