import { test, expect } from '@playwright/test'

test.describe('Dashboard - Liberaciones Recientes', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navegar al dashboard principal
    await page.goto('http://localhost:3000')
    
    // Verificar si necesitamos hacer login
    const isLoginPage = page.url().includes('/auth/login') || await page.locator('h1:has-text("Iniciar Sesión")').isVisible()
    
    if (isLoginPage) {
      // Esperar a que el formulario de login cargue
      await page.waitForSelector('#email input', { timeout: 5000 })
      
      // Hacer login con credenciales del .env usando selectores correctos para BaseInput
      await page.fill('#email input', 'acristi@7works.cl')
      await page.fill('#password input', 'Martin.2020')
      
      // Buscar el botón de login y hacer click
      const loginButton = page.locator('button[type="submit"]').first()
      await loginButton.click()
      
      // Esperar redirección al dashboard (la app redirige a "/" que es el dashboard)
      await page.waitForURL('/', { timeout: 15000 })
    }
  })

  test('debe mostrar la sección "Liberaciones Recientes" en el dashboard', async ({ page }) => {
    // Verificar que estamos en el dashboard
    await expect(page.locator('h1:has-text("Dashboard")')).toBeVisible({ timeout: 10000 })
    
    // Verificar que la sección "Liberaciones Recientes" esté presente
    const liberacionesSection = page.locator('h3:has-text("Liberaciones Recientes")')
    await expect(liberacionesSection).toBeVisible({ timeout: 10000 })
    
    // Tomar captura de pantalla del dashboard completo
    await page.screenshot({ 
      path: 'screenshots/dashboard-liberaciones-recientes-overview.png',
      fullPage: true 
    })
  })

  test('debe mostrar el estado apropiado de liberaciones (con datos o mensaje de sin datos)', async ({ page }) => {
    // Esperar a que la página cargue completamente
    await page.waitForLoadState('networkidle', { timeout: 10000 })
    
    // Buscar ambos estados posibles
    const noDataMessage = page.locator('text=Aún no hay liberaciones')
    const liberacionesTable = page.locator('table')
    
    const hasNoDataMessage = await noDataMessage.isVisible().catch(() => false)
    const hasTable = await liberacionesTable.isVisible().catch(() => false)
    
    // Debe tener uno u otro estado
    expect(hasNoDataMessage || hasTable, 'Debe mostrar o el mensaje "Aún no hay liberaciones" o una tabla con datos').toBe(true)
    
    if (hasNoDataMessage) {
      await page.screenshot({ 
        path: 'screenshots/dashboard-sin-liberaciones.png',
        fullPage: true 
      })
    } else if (hasTable) {
      await page.screenshot({ 
        path: 'screenshots/dashboard-con-liberaciones.png',
        fullPage: true 
      })
    }
  })

  test('debe verificar la funcionalidad básica de la sección de liberaciones', async ({ page }) => {
    // Esperar a que la página cargue completamente
    await page.waitForLoadState('networkidle', { timeout: 10000 })
    
    // Buscar la tabla de liberaciones si existe
    const table = page.locator('table').first()
    const tableExists = await table.isVisible().catch(() => false)
    
    if (tableExists) {
      
      // Verificar que tenga headers
      const headers = await page.locator('th').allTextContents()
      
      // Verificar que tenga filas de datos
      const dataRows = await page.locator('tbody tr').count()
      
      // Capturar la tabla
      await table.screenshot({ 
        path: 'screenshots/dashboard-tabla-liberaciones.png'
      })
      
      expect(headers.length, 'La tabla debe tener headers').toBeGreaterThan(0)
      
    } else {
      // Verificar el estado sin datos
      const noDataMessage = await page.locator('text=Aún no hay liberaciones').isVisible()
      const createButton = await page.locator('text=Crear Liberación').isVisible()
      
      expect(noDataMessage, 'Debe mostrar mensaje de sin datos').toBe(true)
      expect(createButton, 'Debe mostrar botón para crear liberación').toBe(true)
    }
    
    // Tomar captura final del dashboard completo
    await page.screenshot({ 
      path: 'screenshots/dashboard-verificacion-final.png',
      fullPage: true 
    })
  })
})