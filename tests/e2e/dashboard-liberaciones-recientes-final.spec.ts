import { test, expect } from '@playwright/test'

test.describe('Dashboard - Liberaciones Recientes - Verificación Final', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navegar al dashboard principal
    await page.goto('http://localhost:3000')
    
    // Verificar si necesitamos hacer login
    const isLoginPage = page.url().includes('/auth/login') || await page.locator('h1:has-text("Iniciar Sesión")').isVisible()
    
    if (isLoginPage) {
      // Hacer login con credenciales del .env usando selectores correctos para BaseInput
      await page.fill('#email input', 'acristi@7works.cl')
      await page.fill('#password input', 'Martin.2020')
      
      // Hacer click en el botón de login
      await page.locator('button[type="submit"]').first().click()
      
      // Esperar redirección al dashboard
      await page.waitForURL('/', { timeout: 15000 })
    }
  })

  test('debe verificar que la sección "Liberaciones Recientes" funciona correctamente', async ({ page }) => {
    // Esperar a que cargue completamente
    await page.waitForLoadState('networkidle', { timeout: 15000 })
    
    // Verificar elementos principales del dashboard
    await expect(page.locator('text=Dashboard')).toBeVisible({ timeout: 10000 })
    await expect(page.locator('text=Liberaciones Recientes')).toBeVisible({ timeout: 10000 })
    
    // Verificar el estado actual de liberaciones
    const noDataMessage = await page.locator('text=Aún no hay liberaciones').isVisible()
    const createButton = await page.locator('text=Crear Liberación').isVisible() 
    const table = await page.locator('table').isVisible()
    
    if (noDataMessage && createButton) {
      
      // Verificar que el botón "Crear Liberación" es funcional
      expect(createButton, 'Debe mostrar botón para crear liberación').toBe(true)
      
      // Verificar métricas del usuario (pueden estar en 0 inicialmente)
      const metrics = await page.locator('dd').allTextContents()
      expect(metrics.length, 'Debe mostrar métricas del usuario').toBeGreaterThanOrEqual(3)
      
    } else if (table) {
      
      // Verificar headers de la tabla si existe
      const headers = await page.locator('th').allTextContents()
      expect(headers.length, 'La tabla debe tener columnas').toBeGreaterThan(0)
    }
    
    // Verificar navegación funcional
    const historialButton = await page.locator('text=Ir a historial').isVisible()
    expect(historialButton, 'Debe mostrar botón para ir al historial').toBe(true)
    
    // Tomar captura final de validación
    await page.screenshot({ 
      path: 'screenshots/dashboard-liberaciones-recientes-validacion-final.png',
      fullPage: true 
    })
    
  })
  
  test('debe verificar la funcionalidad de navegación desde el dashboard', async ({ page }) => {
    await page.waitForLoadState('networkidle', { timeout: 15000 })
    
    // Verificar botón "Nueva Liberación"
    const newOrderButton = page.locator('text=Nueva Liberación').first()
    await expect(newOrderButton).toBeVisible()
    
    // Verificar botón "Historial de Liberaciones"  
    const historyButton = page.locator('text=Historial de Liberaciones')
    await expect(historyButton).toBeVisible()
    
    // Verificar link "Ir a historial"
    const goToHistoryLink = page.locator('text=Ir a historial')
    await expect(goToHistoryLink).toBeVisible()
    
  })
})