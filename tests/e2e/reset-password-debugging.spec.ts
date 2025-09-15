import { test, expect } from '@playwright/test'

test.describe('Reset Password Flow - Debugging', () => {
  let baseURL: string

  test.beforeAll(async () => {
    // Esperamos que el servidor esté corriendo en localhost:3001
    baseURL = 'http://localhost:3001'
  })

  test('Diagnóstico inicial - verificar disponibilidad de la página', async ({ page }) => {
    // Intentar navegar directamente a la página (sin token)
    await page.goto(`${baseURL}/auth/reset-password`)

    // Capturar screenshot de la página inicial
    await page.screenshot({
      path: 'screenshots/reset-password-page-initial.png',
      fullPage: true
    })

    // Verificar que se carga la página
    await expect(page.locator('h2')).toContainText('Restablecer Contraseña')
  })

  test('Escenario 1 - Validación de contraseñas no coincidentes', async ({ page }) => {
    await page.goto(`${baseURL}/auth/reset-password`)

    // Llenar el formulario con contraseñas diferentes
    await page.fill('#password', 'nuevaPassword123')
    await page.fill('#confirmPassword', 'diferentePassword456')

    // Capturar estado antes de enviar
    await page.screenshot({
      path: 'screenshots/reset-password-different-passwords-before.png',
      fullPage: true
    })

    // Enviar formulario
    await page.click('button[type="submit"]')

    // Capturar estado después de enviar
    await page.screenshot({
      path: 'screenshots/reset-password-different-passwords-after.png',
      fullPage: true
    })

    // Verificar que aparece el mensaje de error
    const errorMessage = page.locator('.bg-red-50 .text-red-600')
    await expect(errorMessage).toContainText('Las contraseñas no coinciden')
  })

  test('Escenario 2 - Contraseña muy corta', async ({ page }) => {
    await page.goto(`${baseURL}/auth/reset-password`)

    // Llenar el formulario con contraseña corta
    const shortPassword = '123'
    await page.fill('#password', shortPassword)
    await page.fill('#confirmPassword', shortPassword)

    // Capturar estado antes de enviar
    await page.screenshot({
      path: 'screenshots/reset-password-short-password-before.png',
      fullPage: true
    })

    // Enviar formulario
    await page.click('button[type="submit"]')

    // Esperar por mensaje de error o respuesta
    await page.waitForTimeout(2000)

    // Capturar estado después de enviar
    await page.screenshot({
      path: 'screenshots/reset-password-short-password-after.png',
      fullPage: true
    })

    // Verificar si hay error en pantalla
    const errorElement = page.locator('.bg-red-50')
    const hasError = await errorElement.isVisible()

    if (hasError) {
      const errorText = await errorElement.textContent()
    }
  })

  test('Escenario 3 - Contraseña válida sin token de reset', async ({ page }) => {
    
    // Interceptar llamadas a la API
    let apiCallMade = false
    let apiResponse: any = null
    let apiError: any = null
    
    page.on('response', async (response) => {
      if (response.url().includes('/api/auth/update-password')) {
        apiCallMade = true
        try {
          apiResponse = await response.json()
        } catch (e) {
          apiError = e
        }
      }
    })
    
    await page.goto(`${baseURL}/auth/reset-password`)
    
    // Llenar el formulario con contraseña válida
    const validPassword = 'validPassword123!'
    await page.fill('#password', validPassword)
    await page.fill('#confirmPassword', validPassword)
    
    // Capturar estado antes de enviar
    await page.screenshot({ 
      path: 'screenshots/reset-password-valid-no-token-before.png',
      fullPage: true 
    })
    
    // Enviar formulario
    await page.click('button[type="submit"]')
    
    // Esperar por respuesta o error
    await page.waitForTimeout(3000)
    
    // Capturar estado después de enviar
    await page.screenshot({ 
      path: 'screenshots/reset-password-valid-no-token-after.png',
      fullPage: true 
    })
    
    // Verificar estado del botón
    const submitButton = page.locator('button[type="submit"]')
    const buttonText = await submitButton.textContent()
    const isDisabled = await submitButton.isDisabled()
    
    
    // Verificar si hay mensajes de error
    const errorElement = page.locator('.bg-red-50')
    const hasError = await errorElement.isVisible()
    
    if (hasError) {
      const errorText = await errorElement.textContent()
    }
    
  })

  test('Escenario 4 - Simular con token de reset válido', async ({ page }) => {
    
    // Interceptar respuestas de la API para simular diferentes escenarios
    await page.route('**/api/auth/update-password', async (route, request) => {
      const body = request.postDataJSON()
      
      // Simular diferentes respuestas basadas en la contraseña
      if (body.password === 'errorPassword') {
        await route.fulfill({
          status: 400,
          contentType: 'application/json',
          body: JSON.stringify({
            statusMessage: 'Error simulado: Contraseña no válida'
          })
        })
      } else if (body.password === 'rateLimitPassword') {
        await route.fulfill({
          status: 429,
          contentType: 'application/json',
          body: JSON.stringify({
            statusMessage: 'Demasiadas solicitudes. Intenta de nuevo en unos minutos.'
          })
        })
      } else if (body.password === 'sessionExpiredPassword') {
        await route.fulfill({
          status: 401,
          contentType: 'application/json',
          body: JSON.stringify({
            statusMessage: 'Sesión expirada. Por favor, inicia sesión nuevamente.'
          })
        })
      } else {
        // Simular éxito
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            message: 'Contraseña actualizada exitosamente'
          })
        })
      }
    })
    
    // Caso exitoso
    await page.goto(`${baseURL}/auth/reset-password?access_token=dummy_token`)
    
    const successPassword = 'validNewPassword123!'
    await page.fill('#password', successPassword)
    await page.fill('#confirmPassword', successPassword)
    
    await page.screenshot({ 
      path: 'screenshots/reset-password-success-before.png',
      fullPage: true 
    })
    
    await page.click('button[type="submit"]')
    await page.waitForTimeout(2000)
    
    await page.screenshot({ 
      path: 'screenshots/reset-password-success-after.png',
      fullPage: true 
    })
    
    // Caso de error 400
    await page.goto(`${baseURL}/auth/reset-password`)
    
    await page.fill('#password', 'errorPassword')
    await page.fill('#confirmPassword', 'errorPassword')
    
    await page.screenshot({ 
      path: 'screenshots/reset-password-error400-before.png',
      fullPage: true 
    })
    
    await page.click('button[type="submit"]')
    await page.waitForTimeout(2000)
    
    await page.screenshot({ 
      path: 'screenshots/reset-password-error400-after.png',
      fullPage: true 
    })
    
    const errorMessage = await page.locator('.bg-red-50').textContent()
    
    // Caso de rate limit
    await page.goto(`${baseURL}/auth/reset-password`)
    
    await page.fill('#password', 'rateLimitPassword')
    await page.fill('#confirmPassword', 'rateLimitPassword')
    
    await page.click('button[type="submit"]')
    await page.waitForTimeout(2000)
    
    await page.screenshot({ 
      path: 'screenshots/reset-password-rate-limit.png',
      fullPage: true 
    })
    
    const rateLimitMessage = await page.locator('.bg-red-50').textContent()
    
    // Caso de sesión expirada
    await page.goto(`${baseURL}/auth/reset-password`)
    
    await page.fill('#password', 'sessionExpiredPassword')
    await page.fill('#confirmPassword', 'sessionExpiredPassword')
    
    await page.click('button[type="submit"]')
    await page.waitForTimeout(2000)
    
    await page.screenshot({ 
      path: 'screenshots/reset-password-session-expired.png',
      fullPage: true 
    })
    
    const sessionMessage = await page.locator('.bg-red-50').textContent()
  })

  test('Escenario 5 - Verificar comportamiento del UI durante carga', async ({ page }) => {
    
    // Simular respuesta lenta de la API
    await page.route('**/api/auth/update-password', async (route) => {
      // Esperar 3 segundos antes de responder
      await new Promise(resolve => setTimeout(resolve, 3000))
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          message: 'Contraseña actualizada exitosamente'
        })
      })
    })
    
    await page.goto(`${baseURL}/auth/reset-password`)
    
    const validPassword = 'loadingTestPassword123!'
    await page.fill('#password', validPassword)
    await page.fill('#confirmPassword', validPassword)
    
    // Capturar antes de hacer clic
    await page.screenshot({ 
      path: 'screenshots/reset-password-loading-before.png',
      fullPage: true 
    })
    
    // Hacer clic en submit
    await page.click('button[type="submit"]')
    
    // Capturar inmediatamente después del clic (estado de carga)
    await page.screenshot({ 
      path: 'screenshots/reset-password-loading-during.png',
      fullPage: true 
    })
    
    // Verificar que el botón está deshabilitado y muestra texto de carga
    const submitButton = page.locator('button[type="submit"]')
    const isDisabled = await submitButton.isDisabled()
    const buttonText = await submitButton.textContent()
    
    
    // Esperar a que termine la carga
    await page.waitForTimeout(4000)
    
    // Capturar después de la carga
    await page.screenshot({ 
      path: 'screenshots/reset-password-loading-after.png',
      fullPage: true 
    })
    
    // Verificar estado final
    const finalButtonText = await submitButton.textContent()
    const finalIsDisabled = await submitButton.isDisabled()
    
  })

  test('Escenario 6 - Verificar accesibilidad y navegación', async ({ page }) => {
    
    await page.goto(`${baseURL}/auth/reset-password`)
    
    // Capturar estado inicial
    await page.screenshot({ 
      path: 'screenshots/reset-password-accessibility-initial.png',
      fullPage: true 
    })
    
    // Verificar que se puede navegar con teclado
    await page.press('body', 'Tab')
    await page.screenshot({ 
      path: 'screenshots/reset-password-accessibility-tab1.png',
      fullPage: true 
    })
    
    // Llenar primer campo con teclado
    await page.type('#password', 'accessibilityTest123!')
    
    // Navegar al segundo campo
    await page.press('#password', 'Tab')
    await page.screenshot({ 
      path: 'screenshots/reset-password-accessibility-tab2.png',
      fullPage: true 
    })
    
    // Llenar segundo campo
    await page.type('#confirmPassword', 'accessibilityTest123!')
    
    // Navegar al botón
    await page.press('#confirmPassword', 'Tab')
    await page.screenshot({ 
      path: 'screenshots/reset-password-accessibility-tab3.png',
      fullPage: true 
    })
    
    
    // Verificar labels y estructura
    const passwordLabel = await page.locator('label[for="password"]').textContent()
    const confirmLabel = await page.locator('label[for="confirmPassword"]').textContent()
    
  })
})