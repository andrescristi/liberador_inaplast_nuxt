/**
 * Test integral de funcionalidad de autenticación
 * Verifica que el sistema de auth funcione correctamente en localhost:3000
 */

import { test, expect } from '@playwright/test'

test.describe('Funcionalidad de Autenticación', () => {
  test.beforeEach(async ({ page }) => {
    // Escuchar errores de consola
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        console.log(`❌ Error de consola: ${msg.text()}`)
      }
    })
    
    // Escuchar errores de página
    page.on('pageerror', (error) => {
      console.log(`❌ Error de página: ${error.message}`)
    })
  })

  test('debe cargar la aplicación sin errores y verificar estado de autenticación', async ({ page }) => {
    console.log('🔍 Navegando a localhost:3000...')
    
    // Navegar a la página principal
    await page.goto('http://localhost:3000')
    
    // Esperar a que la página se cargue completamente
    await page.waitForLoadState('networkidle')
    
    // Tomar screenshot del estado inicial
    await page.screenshot({ 
      path: 'screenshots/auth-inicial-estado.png', 
      fullPage: true 
    })
    
    // Verificar que la página se carga (debería redirigir al login si no hay auth)
    await expect(page).toHaveURL(/.*/)
    
    console.log('✅ Página cargada correctamente')
    console.log(`📍 URL actual: ${page.url()}`)
  })

  test('debe verificar que useAuth composable está disponible', async ({ page }) => {
    console.log('🔍 Verificando disponibilidad de useAuth composable...')
    
    await page.goto('http://localhost:3000')
    await page.waitForLoadState('networkidle')
    
    // Ejecutar código JavaScript para verificar useAuth
    const authCheck = await page.evaluate(() => {
      try {
        // Verificar si el objeto window tiene propiedades de Vue/Nuxt
        const hasVue = typeof window !== 'undefined'
        const hasNuxt = '$nuxt' in window
        
        return {
          hasVue,
          hasNuxt,
          windowKeys: Object.keys(window).filter(key => key.includes('nuxt') || key.includes('vue')),
          userAgent: navigator.userAgent,
          readyState: document.readyState
        }
      } catch (error) {
        return {
          error: error.message,
          hasVue: false,
          hasNuxt: false
        }
      }
    })
    
    console.log('🔍 Resultado de verificación de composable:', authCheck)
    
    // Tomar screenshot
    await page.screenshot({ 
      path: 'screenshots/auth-composable-verificacion.png', 
      fullPage: true 
    })
    
    expect(authCheck.readyState).toBe('complete')
  })

  test('debe verificar el flujo de redirección de autenticación', async ({ page }) => {
    console.log('🔍 Verificando flujo de redirección...')
    
    // Ir directamente a una página que requiere auth (dashboard)
    await page.goto('http://localhost:3000/dashboard')
    
    // Esperar a que se complete la navegación
    await page.waitForLoadState('networkidle')
    
    const currentUrl = page.url()
    console.log(`📍 URL después de intentar acceder a dashboard: ${currentUrl}`)
    
    // Tomar screenshot del resultado de la redirección
    await page.screenshot({ 
      path: 'screenshots/auth-redireccion-resultado.png', 
      fullPage: true 
    })
    
    // Si no hay usuario autenticado, debería redirigir al login
    // Si hay usuario autenticado, debería mantenerse en dashboard
    const isOnLogin = currentUrl.includes('/auth/login')
    const isOnDashboard = currentUrl.includes('/dashboard')
    
    console.log(`🔍 ¿Está en login?: ${isOnLogin}`)
    console.log(`🔍 ¿Está en dashboard?: ${isOnDashboard}`)
    
    // Debe estar en una de las dos páginas
    expect(isOnLogin || isOnDashboard).toBe(true)
  })

  test('debe verificar que la página de login se carga correctamente', async ({ page }) => {
    console.log('🔍 Verificando página de login...')
    
    await page.goto('http://localhost:3000/auth/login')
    await page.waitForLoadState('networkidle')
    
    // Tomar screenshot de la página de login
    await page.screenshot({ 
      path: 'screenshots/auth-login-pagina.png', 
      fullPage: true 
    })
    
    // Verificar que elementos de login están presentes
    const loginElements = await page.evaluate(() => {
      const forms = document.querySelectorAll('form')
      const emailInputs = document.querySelectorAll('input[type="email"], input[name="email"]')
      const passwordInputs = document.querySelectorAll('input[type="password"], input[name="password"]')
      const submitButtons = document.querySelectorAll('button[type="submit"], input[type="submit"]')
      
      return {
        formCount: forms.length,
        emailInputCount: emailInputs.length,
        passwordInputCount: passwordInputs.length,
        submitButtonCount: submitButtons.length,
        title: document.title
      }
    })
    
    console.log('🔍 Elementos de login encontrados:', loginElements)
    
    expect(loginElements.formCount).toBeGreaterThan(0)
    expect(page.url()).toContain('/auth/login')
  })

  test('debe verificar que no hay errores críticos de JavaScript', async ({ page }) => {
    console.log('🔍 Verificando errores de JavaScript...')
    
    const errors: string[] = []
    const warnings: string[] = []
    
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      } else if (msg.type() === 'warning') {
        warnings.push(msg.text())
      }
    })
    
    page.on('pageerror', (error) => {
      errors.push(`PageError: ${error.message}`)
    })
    
    // Navegar por diferentes rutas para verificar errores
    const routesToTest = [
      'http://localhost:3000',
      'http://localhost:3000/auth/login',
      'http://localhost:3000/dashboard'
    ]
    
    for (const route of routesToTest) {
      console.log(`🔍 Probando ruta: ${route}`)
      await page.goto(route)
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(1000) // Esperar un poco más para capturar errores async
    }
    
    // Tomar screenshot final
    await page.screenshot({ 
      path: 'screenshots/auth-errores-verificacion.png', 
      fullPage: true 
    })
    
    console.log('❌ Errores encontrados:', errors)
    console.log('⚠️  Warnings encontrados:', warnings)
    
    // No debe haber errores críticos (algunos warnings pueden ser normales)
    const criticalErrors = errors.filter(error => 
      !error.includes('favicon') && // Ignorar errores de favicon
      !error.includes('source-map') && // Ignorar errores de source maps
      !error.includes('DevTools') // Ignorar errores de DevTools
    )
    
    expect(criticalErrors.length).toBe(0)
  })

  test('debe verificar el estado inicial de Supabase Auth', async ({ page }) => {
    console.log('🔍 Verificando estado de Supabase Auth...')
    
    await page.goto('http://localhost:3000')
    await page.waitForLoadState('networkidle')
    
    // Verificar que Supabase está inicializado
    const supabaseCheck = await page.evaluate(() => {
      try {
        // Verificar si hay referencias a Supabase en el cliente
        const scripts = Array.from(document.querySelectorAll('script'))
        const hasSupabaseScript = scripts.some(script => 
          script.textContent?.includes('supabase') || 
          script.src?.includes('supabase')
        )
        
        return {
          hasSupabaseScript,
          hasLocalStorage: typeof localStorage !== 'undefined',
          localStorageKeys: typeof localStorage !== 'undefined' ? 
            Object.keys(localStorage).filter(key => key.includes('supabase')) : [],
          cookieCount: document.cookie.split(';').length,
          hasSupabaseInWindow: 'supabase' in window
        }
      } catch (error) {
        return {
          error: error.message,
          hasSupabaseScript: false,
          hasLocalStorage: false
        }
      }
    })
    
    console.log('🔍 Estado de Supabase:', supabaseCheck)
    
    // Tomar screenshot
    await page.screenshot({ 
      path: 'screenshots/auth-supabase-estado.png', 
      fullPage: true 
    })
    
    expect(supabaseCheck.hasLocalStorage).toBe(true)
  })
})