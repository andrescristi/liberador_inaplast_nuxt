import { test, expect, type Page } from '@playwright/test'

test.describe('Login Form Functionality Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to login page
    await page.goto('http://localhost:3000/auth/login')
    
    // Wait for the page to be fully loaded
    await page.waitForSelector('form', { state: 'visible' })
  })

  test('1. Login page loads correctly', async ({ page }) => {
    // Check if main elements are present
    await expect(page.locator('h1')).toContainText('Iniciar Sesión')
    await expect(page.locator('p')).toContainText('Accede a tu cuenta de Inaplast')
    
    // Check form fields
    await expect(page.locator('#email')).toBeVisible()
    await expect(page.locator('#password')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toBeVisible()
    
    // Take screenshot
    await page.screenshot({ 
      path: 'screenshots/login-page-loaded.png', 
      fullPage: true 
    })
  })

  test('2. Form fields can be filled', async ({ page }) => {
    const emailField = page.locator('#email')
    const passwordField = page.locator('#password')
    
    // Fill email field
    await emailField.fill('test@example.com')
    await expect(emailField).toHaveValue('test@example.com')
    
    // Fill password field
    await passwordField.fill('password123')
    await expect(passwordField).toHaveValue('password123')
    
    // Take screenshot after filling
    await page.screenshot({ 
      path: 'screenshots/form-fields-filled.png', 
      fullPage: true 
    })
  })

  test('3. Form validation works correctly', async ({ page }) => {
    const emailField = page.locator('#email')
    const passwordField = page.locator('#password')
    const submitButton = page.locator('button[type="submit"]')
    
    // Test empty fields - button should be disabled initially
    await expect(submitButton).toBeDisabled()
    
    // Test invalid email
    await emailField.fill('invalid-email')
    await passwordField.fill('12345')
    
    // Wait a bit for validation to process
    await page.waitForTimeout(500)
    
    // Button should still be disabled for invalid email and short password
    await expect(submitButton).toBeDisabled()
    
    // Test valid email but short password
    await emailField.fill('test@example.com')
    await passwordField.fill('123')
    await page.waitForTimeout(500)
    await expect(submitButton).toBeDisabled()
    
    // Test valid credentials
    await passwordField.fill('password123')
    await page.waitForTimeout(500)
    
    // Button should now be enabled
    await expect(submitButton).toBeEnabled()
    
    // Take screenshot
    await page.screenshot({ 
      path: 'screenshots/form-validation.png', 
      fullPage: true 
    })
  })

  test('4. Submit button state management', async ({ page }) => {
    const emailField = page.locator('#email')
    const passwordField = page.locator('#password')
    const submitButton = page.locator('button[type="submit"]')
    
    // Initially disabled
    await expect(submitButton).toBeDisabled()
    
    // Fill valid data
    await emailField.fill('test@example.com')
    await passwordField.fill('password123')
    
    // Wait for state update
    await page.waitForTimeout(500)
    
    // Should be enabled now
    await expect(submitButton).toBeEnabled()
    
    // Clear fields and check it gets disabled again
    await emailField.fill('')
    await page.waitForTimeout(500)
    await expect(submitButton).toBeDisabled()
  })

  test('5. Password visibility toggle works', async ({ page }) => {
    const passwordField = page.locator('#password')
    
    // Fill password first
    await passwordField.fill('mypassword')
    
    // Toggle button should appear
    const toggleButton = page.locator('button[type="button"]').filter({ hasText: '' })
    
    // Wait for the toggle button to appear
    await page.waitForTimeout(500)
    
    // Check if password field type is initially 'password'
    await expect(passwordField).toHaveAttribute('type', 'password')
    
    // Click toggle button
    await toggleButton.first().click()
    
    // Should now be text type
    await expect(passwordField).toHaveAttribute('type', 'text')
    
    // Click again to hide
    await toggleButton.first().click()
    await expect(passwordField).toHaveAttribute('type', 'password')
    
    // Take screenshot
    await page.screenshot({ 
      path: 'screenshots/password-toggle.png', 
      fullPage: true 
    })
  })

  test('6. Form submission with test credentials', async ({ page }) => {
    const emailField = page.locator('#email')
    const passwordField = page.locator('#password')
    const submitButton = page.locator('button[type="submit"]')
    
    // Fill valid test credentials
    await emailField.fill('test@inaplast.com')
    await passwordField.fill('testpassword123')
    
    // Wait for button to be enabled
    await page.waitForTimeout(500)
    
    // Submit form
    await submitButton.click()
    
    // Check if loading state appears
    await expect(submitButton).toContainText('Iniciando sesión...')
    
    // Wait for response (either success or error)
    await page.waitForTimeout(3000)
    
    // Take screenshot of result
    await page.screenshot({ 
      path: 'screenshots/form-submission-result.png', 
      fullPage: true 
    })
  })

  test('7. Console errors check', async ({ page }) => {
    const errors: string[] = []
    
    // Collect console errors
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })
    
    // Interact with the form
    await page.locator('#email').fill('test@example.com')
    await page.locator('#password').fill('password123')
    
    // Wait for any async operations
    await page.waitForTimeout(1000)
    
    // Check if there are JavaScript errors
    if (errors.length > 0) {
      console.log('JavaScript Errors Found:', errors)
    }
    
    expect(errors.length).toBe(0)
  })

  test('8. Form reactive behavior test', async ({ page }) => {
    const emailField = page.locator('#email')
    const passwordField = page.locator('#password')
    const submitButton = page.locator('button[type="submit"]')
    
    // Test rapid input changes
    await emailField.fill('t')
    await page.waitForTimeout(100)
    await emailField.fill('te')
    await page.waitForTimeout(100)
    await emailField.fill('test@')
    await page.waitForTimeout(100)
    await emailField.fill('test@example.com')
    
    await passwordField.fill('p')
    await page.waitForTimeout(100)
    await passwordField.fill('pass')
    await page.waitForTimeout(100)
    await passwordField.fill('password123')
    
    // Wait for final validation
    await page.waitForTimeout(500)
    
    // Button should be enabled
    await expect(submitButton).toBeEnabled()
    
    // Test clearing and re-filling
    await emailField.clear()
    await passwordField.clear()
    await page.waitForTimeout(500)
    await expect(submitButton).toBeDisabled()
    
    // Re-fill
    await emailField.fill('new@test.com')
    await passwordField.fill('newpassword123')
    await page.waitForTimeout(500)
    await expect(submitButton).toBeEnabled()
  })

  test('9. Forgot password modal functionality', async ({ page }) => {
    // Click forgot password link
    await page.locator('text=¿Olvidaste tu contraseña?').click()
    
    // Modal should open
    await expect(page.locator('text=Restablecer Contraseña')).toBeVisible()
    
    // Fill reset email
    await page.locator('#reset-email').fill('test@example.com')
    
    // Take screenshot of modal
    await page.screenshot({ 
      path: 'screenshots/forgot-password-modal.png', 
      fullPage: true 
    })
    
    // Cancel modal
    await page.locator('button', { hasText: 'Cancelar' }).click()
    
    // Modal should close
    await expect(page.locator('text=Restablecer Contraseña')).not.toBeVisible()
  })

  test('10. Network and performance check', async ({ page }) => {
    // Monitor network requests
    const requests: string[] = []
    page.on('request', (request) => {
      requests.push(request.url())
    })
    
    // Fill and submit form
    await page.locator('#email').fill('test@example.com')
    await page.locator('#password').fill('password123')
    await page.waitForTimeout(500)
    
    // Check if form is responsive (no hanging)
    const submitButton = page.locator('button[type="submit"]')
    await expect(submitButton).toBeEnabled()
    
    // Measure page load time
    const startTime = Date.now()
    await page.reload()
    await page.waitForSelector('form')
    const loadTime = Date.now() - startTime
    
    console.log(`Page load time: ${loadTime}ms`)
    expect(loadTime).toBeLessThan(5000) // Should load within 5 seconds
  })
})