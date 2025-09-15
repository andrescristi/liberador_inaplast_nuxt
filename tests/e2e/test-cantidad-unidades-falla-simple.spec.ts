/**
 * Prueba E2E simplificada para verificar navegación del wizard
 */

import { test, expect } from '@playwright/test'

test.describe('Test Simplificado de Wizard', () => {
  
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto('/auth/login')
    await page.waitForLoadState('networkidle')

    await page.fill('input[type="email"]', 'acristi@7works.cl')
    await page.fill('input[type="password"]', 'Martin.2020')
    await page.click('button[type="submit"], button:has-text("Iniciar")')
    
    // Esperar dashboard
    await page.waitForURL('/', { timeout: 10000 })
    await expect(page.locator('h1')).toContainText('Dashboard')
  })

  test('debe navegar por los pasos del wizard correctamente', async ({ page }) => {

    // PASO 0: Ir a crear nueva orden
    await page.goto('/orders/new')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('h1')).toContainText('Nuevo Liberador')
    
    await page.screenshot({ 
      path: 'screenshots/wizard-step0.png',
      fullPage: true 
    })

    // PASO 1: Datos iniciales
    
    // Subir imagen de prueba
    const fileInput = page.locator('input[type="file"]')
    if (await fileInput.count() > 0) {
      await fileInput.setInputFiles('tests/fixtures/test-label.png')
      
      // Esperar un poco para que se procese la imagen
      await page.waitForTimeout(2000)
    }
    
    // Buscar el input de cantidad de embalajes
    const inputs = await page.locator('input[type="number"]').all()
    
    if (inputs.length > 0) {
      await inputs[0].fill('5')
    }
    
    await page.screenshot({ 
      path: 'screenshots/wizard-step1.png',
      fullPage: true 
    })

    // Buscar botón "Siguiente"
    const nextButton = page.locator('button:has-text("Siguiente")')
    if (await nextButton.isVisible()) {
      await nextButton.click()
      
      // Esperar a que el botón pueda estar procesando OCR
      await page.waitForTimeout(3000)
    }
    
    // Esperar Paso 2 con más tiempo (OCR puede demorar)
    try {
      await expect(page.locator('h2:has-text("Paso 2")')).toBeVisible({ timeout: 30000 })
    } catch (e) {
      await page.screenshot({ path: 'screenshots/debug-no-step2.png', fullPage: true })
      
      // Intentar buscar elementos alternativos
      const hasStep2Text = await page.locator('text="Paso 2"').count()
      const hasDetallesText = await page.locator('text="Detalles del Producto"').count()
      
      if (hasStep2Text > 0 || hasDetallesText > 0) {
      } else {
        throw e
      }
    }
    
    await page.screenshot({ 
      path: 'screenshots/wizard-step2.png',
      fullPage: true 
    })

    // PASO 2: Llenar algunos campos básicos
    
    // Llenar campos requeridos
    const allInputs = await page.locator('input').all()
    
    // Buscar campos específicos por placeholder o label
    try {
      await page.locator('input:near(label:has-text("Cliente"))').first().fill('CLIENTE_TEST', { timeout: 2000 })
    } catch (e) {
      await page.locator('input[placeholder*="Cliente"], input[placeholder*="cliente"]').first().fill('CLIENTE_TEST', { timeout: 2000 })
    }
    
    try {
      await page.locator('input:near(label:has-text("Producto"))').first().fill('PRODUCTO_TEST', { timeout: 2000 })
    } catch (e) {
      await page.locator('input[placeholder*="Producto"], input[placeholder*="producto"]').first().fill('PRODUCTO_TEST', { timeout: 2000 })
    }
    
    await page.screenshot({ 
      path: 'screenshots/wizard-step2-filled.png',
      fullPage: true 
    })
    
  })
})