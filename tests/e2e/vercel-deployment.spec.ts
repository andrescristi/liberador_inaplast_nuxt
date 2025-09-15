import { test, expect } from '@playwright/test'

test.describe('Vercel Deployment', () => {
  test('should load main page correctly with user login', async ({ page }) => {
    // Ir a la página de login (que es la página por defecto debido a auth)
    await page.goto('/')

    // Verificar que el logger no cause errores H3
    const consoleErrors = []
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text())
      }
    })

    // Esperar que la página cargue
    await expect(page).toHaveTitle(/Iniciar Sesión/)

    
    // Esperar 20 segundos para que el usuario pueda ingresar credenciales manualmente
    await page.waitForTimeout(20000)

    // Verificar que no hay errores relacionados con pino-pretty
    const pinoPrettyErrors = consoleErrors.filter(error => 
      error.includes('pino-pretty') || error.includes('transport target')
    )
    expect(pinoPrettyErrors).toHaveLength(0)
  })

  test('should display CoreAppNavigation component with login wait', async ({ page }) => {
    await page.goto('/')

    
    // Esperar 20 segundos para login manual
    await page.waitForTimeout(20000)

    // Verificar que el componente de navegación está presente
    await expect(page.locator('nav').first()).toBeVisible()

    // Verificar elementos específicos de la navbar
    await expect(page.locator('text=Inaplast')).toBeVisible()
    
    // En móvil debe haber navegación inferior
    const isMobile = await page.evaluate(() => window.innerWidth < 768)
    if (isMobile) {
      await expect(page.locator('.mobile-bottom-nav')).toBeVisible()
    }
  })

  test('should handle responsive navigation', async ({ page }) => {
    // Probar en desktop
    await page.setViewportSize({ width: 1280, height: 720 })
    await page.goto('/')

    // Verificar navegación desktop
    await expect(page.locator('.hidden.md\\:flex')).toBeVisible()

    // Probar en móvil
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Verificar navegación móvil
    await expect(page.locator('.md\\:hidden')).toBeVisible()
    await expect(page.locator('.mobile-bottom-nav')).toBeVisible()
  })

  test('should not show H3 pino-pretty errors', async ({ page }) => {
    const h3Errors = []
    
    page.on('response', response => {
      if (response.status() === 500) {
        h3Errors.push(response.url())
      }
    })

    await page.goto('/')
    
    // Esperar un momento para que se capturen todos los errores
    await page.waitForTimeout(2000)
    
    // No debería haber errores 500 relacionados con el servidor
    expect(h3Errors).toHaveLength(0)
  })
})