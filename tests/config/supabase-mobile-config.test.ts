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
    
    expect(envContent).toContain('USER=')
    expect(envContent).toContain('PASSWD=')
    
    // Verificar que las credenciales tienen formato válido
    const userMatch = envContent.match(/USER="?([^"\n]+)"?/)
    const passwdMatch = envContent.match(/PASSWD="?([^"\n]+)"?/)
    
    if (userMatch) {
      expect(userMatch[1]).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) // Email válido
    }
    
    if (passwdMatch) {
      expect(passwdMatch[1].length).toBeGreaterThanOrEqual(6) // Mínimo 6 caracteres
    }
  })

  it('debe tener rutas de redirección configuradas en nuxt.config.ts', () => {
    const configPath = path.join(process.cwd(), 'nuxt.config.ts')
    const configContent = fs.readFileSync(configPath, 'utf-8')
    
    expect(configContent).toContain('redirectOptions')
    expect(configContent).toContain('login: \'/auth/login\'')
    expect(configContent).toContain('callback: \'/auth/confirm\'')
    expect(configContent).toContain('exclude:')
  })

  it('debe configurar tipos TypeScript correctamente en nuxt.config.ts', () => {
    const configPath = path.join(process.cwd(), 'nuxt.config.ts')
    const configContent = fs.readFileSync(configPath, 'utf-8')
    
    expect(configContent).toContain('types: \'./app/types/database.types.ts\'')
  })
})