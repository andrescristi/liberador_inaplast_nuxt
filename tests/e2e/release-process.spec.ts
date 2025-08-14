import { test, expect } from '@playwright/test'

test.describe('Proceso Completo de Liberación de Producto', () => {
  
  test.beforeEach(async ({ page }) => {
    // Setup: Login como Inspector
    await page.goto('/auth/login')
    await page.fill('[data-testid="email-input"]', 'inspector@inaplast.com')
    await page.fill('[data-testid="password-input"]', 'password123')
    await page.click('[data-testid="login-button"]')
    
    // Esperar redirección al dashboard
    await page.waitForURL('/dashboard')
  })

  test('debe completar el flujo completo de liberación exitosa', async ({ page }) => {
    // Navegar a nueva liberación
    await page.click('[data-testid="new-release-button"]')
    await page.waitForURL('/orders/new')
    
    // Verificar que estamos en paso 1
    await expect(page.locator('h2')).toContainText('Paso 1: Datos Iniciales')
    
    // PASO 1: Subir imagen y cantidad de cajas
    await page.setInputFiles('input[type="file"]', 'tests/fixtures/sample-label.jpg')
    await page.fill('[data-testid="box-quantity"]', '50')
    
    // Verificar que el botón siguiente se habilita
    await expect(page.locator('[data-testid="next-step"]')).toBeEnabled()
    await page.click('[data-testid="next-step"]')
    
    // PASO 2: Detalles del producto
    await expect(page.locator('h2')).toContainText('Paso 2: Detalles del Producto')
    
    await page.fill('[data-testid="client"]', 'CLIENTE_TEST_SA_CV')
    await page.fill('[data-testid="batch"]', 'LOTE001_2025')
    await page.fill('[data-testid="order"]', 'PED_001_2025')
    await page.fill('[data-testid="product"]', 'ENVASE_PLASTICO_500ML')
    await page.fill('[data-testid="units"]', '1000')
    await page.fill('[data-testid="purchase-order"]', 'OC_2025_001')
    await page.fill('[data-testid="machine"]', 'INYECTORA_03')
    await page.fill('[data-testid="manufacturing-date"]', '2025-08-14')
    await page.selectOption('[data-testid="shift"]', 'mañana')
    await page.fill('[data-testid="shift-manager"]', 'Juan Pérez')
    await page.fill('[data-testid="operator"]', 'María García')
    await page.fill('[data-testid="quality-inspector"]', 'Carlos López')
    
    // Seleccionar nivel de muestreo
    await page.selectOption('[data-testid="sampling-level"]', 'S2')
    
    // Verificar que aparece recomendación de muestreo
    await expect(page.locator('[data-testid="recommended-sampling"]')).toContainText('8 unidades')
    
    // Seleccionar muestreo real
    await page.selectOption('[data-testid="actual-sampling"]', '8')
    
    await page.click('[data-testid="next-step"]')
    
    // PASO 3: Pruebas de calidad
    await expect(page.locator('h2')).toContainText('Paso 3: Pruebas de Calidad')
    
    // Realizar todas las pruebas (aprobar todas)
    await page.click('[data-testid="test1-toggle"]') // Dimensiones - APROBADO
    await page.click('[data-testid="test2-toggle"]') // Resistencia - APROBADO  
    await page.click('[data-testid="test3-toggle"]') // Acabado - APROBADO
    
    // Verificar resultado general
    await expect(page.locator('[data-testid="overall-result"]')).toContainText('TODAS LAS PRUEBAS APROBADAS')
    await expect(page.locator('[data-testid="overall-status"]')).toContainText('APROBADO')
    
    await page.click('[data-testid="next-step"]')
    
    // PASO 4: Resumen y resultados
    await expect(page.locator('h2')).toContainText('Paso 4: Resumen y Resultados')
    
    // Verificar resultado final
    await expect(page.locator('[data-testid="final-result"]')).toContainText('PRODUCTO APROBADO')
    
    // Verificar resumen de datos
    await expect(page.locator('[data-testid="summary-client"]')).toContainText('CLIENTE_TEST_SA_CV')
    await expect(page.locator('[data-testid="summary-batch"]')).toContainText('LOTE001_2025')
    await expect(page.locator('[data-testid="summary-sampling"]')).toContainText('8 unidades')
    
    // Guardar liberación
    await page.click('[data-testid="save-release"]')
    
    // Verificar éxito y redirección
    await expect(page.locator('[data-testid="success-toast"]')).toContainText('Liberador guardado exitosamente')
    await page.waitForURL('/orders')
    
    // Tomar screenshot del resultado
    await page.screenshot({ 
      path: 'screenshots/release-process-complete-success.png',
      fullPage: true 
    })
  })

  test('debe manejar liberación rechazada correctamente', async ({ page }) => {
    await page.goto('/orders/new')
    
    // Completar pasos 1 y 2 normalmente
    await page.setInputFiles('input[type="file"]', 'tests/fixtures/sample-label.jpg')
    await page.fill('[data-testid="box-quantity"]', '25')
    await page.click('[data-testid="next-step"]')
    
    // Llenar datos del producto
    await page.fill('[data-testid="client"]', 'CLIENTE_RECHAZO')
    await page.fill('[data-testid="batch"]', 'LOTE_FAIL_001')
    await page.fill('[data-testid="order"]', 'PED_FAIL_001')
    await page.fill('[data-testid="product"]', 'PRODUCTO_DEFECTUOSO')
    await page.fill('[data-testid="units"]', '500')
    await page.fill('[data-testid="machine"]', 'INYECTORA_02')
    await page.fill('[data-testid="manufacturing-date"]', '2025-08-14')
    await page.selectOption('[data-testid="shift"]', 'tarde')
    await page.fill('[data-testid="shift-manager"]', 'Ana Martínez')
    await page.fill('[data-testid="operator"]', 'Pedro Rodríguez')
    await page.fill('[data-testid="quality-inspector"]', 'Elena Sánchez')
    await page.selectOption('[data-testid="sampling-level"]', 'S3')
    await page.selectOption('[data-testid="actual-sampling"]', '5')
    
    await page.click('[data-testid="next-step"]')
    
    // PASO 3: Fallar algunas pruebas
    await page.click('[data-testid="test1-toggle"]') // Dimensiones - APROBADO
    // test2 queda RECHAZADO (false por defecto)
    await page.click('[data-testid="test3-toggle"]') // Acabado - APROBADO
    
    // Verificar que el resultado general es rechazo
    await expect(page.locator('[data-testid="overall-result"]')).toContainText('HAY PRUEBAS RECHAZADAS')
    await expect(page.locator('[data-testid="overall-status"]')).toContainText('RECHAZADO')
    
    await page.click('[data-testid="next-step"]')
    
    // PASO 4: Verificar resultado de rechazo
    await expect(page.locator('[data-testid="final-result"]')).toContainText('PRODUCTO RECHAZADO')
    await expect(page.locator('[data-testid="rejection-reason"]')).toContainText('No cumple con los estándares requeridos')
    
    // Guardar liberación rechazada
    await page.click('[data-testid="save-release"]')
    
    await expect(page.locator('[data-testid="success-toast"]')).toContainText('Resultado: RECHAZADO')
    await page.waitForURL('/orders')
    
    await page.screenshot({ 
      path: 'screenshots/release-process-complete-rejection.png',
      fullPage: true 
    })
  })

  test('debe validar formularios en cada paso', async ({ page }) => {
    await page.goto('/orders/new')
    
    // PASO 1: Intentar avanzar sin datos
    await expect(page.locator('[data-testid="next-step"]')).toBeDisabled()
    
    // Agregar solo imagen, sin cantidad
    await page.setInputFiles('input[type="file"]', 'tests/fixtures/sample-label.jpg')
    await expect(page.locator('[data-testid="next-step"]')).toBeDisabled()
    
    // Agregar cantidad inválida
    await page.fill('[data-testid="box-quantity"]', '0')
    await expect(page.locator('[data-testid="next-step"]')).toBeDisabled()
    
    // Cantidad válida
    await page.fill('[data-testid="box-quantity"]', '10')
    await expect(page.locator('[data-testid="next-step"]')).toBeEnabled()
    
    await page.click('[data-testid="next-step"]')
    
    // PASO 2: Verificar validaciones de campos requeridos
    await expect(page.locator('[data-testid="next-step"]')).toBeDisabled()
    
    // Llenar solo algunos campos
    await page.fill('[data-testid="client"]', 'Cliente Test')
    await page.fill('[data-testid="batch"]', 'LOTE001')
    await expect(page.locator('[data-testid="next-step"]')).toBeDisabled()
    
    // Tomar screenshot de validación
    await page.screenshot({ 
      path: 'screenshots/form-validation-step2.png',
      fullPage: true 
    })
  })

  test('debe manejar upload de archivos correctamente', async ({ page }) => {
    await page.goto('/orders/new')
    
    // Test con archivo muy grande (debe fallar)
    await page.setInputFiles('input[type="file"]', 'tests/fixtures/large-file.jpg')
    await expect(page.locator('[data-testid="error-toast"]')).toContainText('muy grande')
    
    // Test con tipo de archivo incorrecto
    await page.setInputFiles('input[type="file"]', 'tests/fixtures/document.pdf')
    await expect(page.locator('[data-testid="error-toast"]')).toContainText('tipo de archivo')
    
    // Test con archivo válido
    await page.setInputFiles('input[type="file"]', 'tests/fixtures/sample-label.jpg')
    await expect(page.locator('[data-testid="image-preview"]')).toBeVisible()
    
    // Verificar botón de cambiar imagen
    await page.click('[data-testid="change-image"]')
    await expect(page.locator('[data-testid="image-preview"]')).not.toBeVisible()
  })

  test('debe calcular muestreo dinámicamente', async ({ page }) => {
    await page.goto('/orders/new')
    
    // Completar paso 1
    await page.setInputFiles('input[type="file"]', 'tests/fixtures/sample-label.jpg')
    await page.fill('[data-testid="box-quantity"]', '100')
    await page.click('[data-testid="next-step"]')
    
    // Llenar datos básicos del producto
    await page.fill('[data-testid="client"]', 'Cliente')
    await page.fill('[data-testid="batch"]', 'LOTE001')
    await page.fill('[data-testid="order"]', 'PED001')
    await page.fill('[data-testid="product"]', 'Producto')
    await page.fill('[data-testid="units"]', '2000')
    await page.fill('[data-testid="machine"]', 'MAQ001')
    await page.fill('[data-testid="manufacturing-date"]', '2025-08-14')
    await page.selectOption('[data-testid="shift"]', 'mañana')
    await page.fill('[data-testid="shift-manager"]', 'Manager')
    await page.fill('[data-testid="operator"]', 'Operator')
    await page.fill('[data-testid="quality-inspector"]', 'Inspector')
    
    // Test diferentes niveles de muestreo
    const samplingTests = [
      { level: 'S1', expectedMin: 10, expectedMax: 10 },
      { level: 'S2', expectedMin: 15, expectedMax: 15 },
      { level: 'S3', expectedMin: 20, expectedMax: 20 },
      { level: 'S4', expectedMin: 25, expectedMax: 25 }
    ]
    
    for (const { level, expectedMin, expectedMax } of samplingTests) {
      await page.selectOption('[data-testid="sampling-level"]', level)
      
      const recommendedText = await page.locator('[data-testid="recommended-sampling"]').textContent()
      const recommended = parseInt(recommendedText?.match(/\d+/)?.[0] || '0')
      
      expect(recommended).toBeGreaterThanOrEqual(expectedMin)
      expect(recommended).toBeLessThanOrEqual(expectedMax)
    }
    
    await page.screenshot({ 
      path: 'screenshots/sampling-calculation-test.png',
      fullPage: true 
    })
  })

  test('debe prevenir navegación con datos incompletos', async ({ page }) => {
    await page.goto('/orders/new')
    
    // Intentar navegar directamente a paso 3 (debe redirigir a paso 1)
    await page.goto('/orders/new?step=3')
    await expect(page.locator('[data-testid="current-step"]')).toContainText('1')
    
    // Completar paso 1 parcialmente e intentar ir a paso 3
    await page.setInputFiles('input[type="file"]', 'tests/fixtures/sample-label.jpg')
    await page.goto('/orders/new?step=3')
    await expect(page.locator('[data-testid="current-step"]')).toContainText('1')
  })

  test('debe mantener datos al navegar entre pasos', async ({ page }) => {
    await page.goto('/orders/new')
    
    // Completar paso 1
    await page.setInputFiles('input[type="file"]', 'tests/fixtures/sample-label.jpg')
    await page.fill('[data-testid="box-quantity"]', '30')
    await page.click('[data-testid="next-step"]')
    
    // Completar paso 2 parcialmente
    await page.fill('[data-testid="client"]', 'Cliente Persistente')
    await page.fill('[data-testid="batch"]', 'LOTE_PERSIST')
    
    // Volver al paso 1
    await page.click('[data-testid="previous-step"]')
    
    // Verificar que los datos se mantienen
    const boxQuantity = await page.locator('[data-testid="box-quantity"]').inputValue()
    expect(boxQuantity).toBe('30')
    
    // Ir de nuevo al paso 2
    await page.click('[data-testid="next-step"]')
    
    // Verificar que los datos del paso 2 se mantienen
    const client = await page.locator('[data-testid="client"]').inputValue()
    const batch = await page.locator('[data-testid="batch"]').inputValue()
    
    expect(client).toBe('Cliente Persistente')
    expect(batch).toBe('LOTE_PERSIST')
  })

  test('debe manejar errores de guardado', async ({ page }) => {
    // Mock de error en API
    await page.route('/api/orders', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Database error' })
      })
    })
    
    await page.goto('/orders/new')
    
    // Completar todo el flujo
    await page.setInputFiles('input[type="file"]', 'tests/fixtures/sample-label.jpg')
    await page.fill('[data-testid="box-quantity"]', '20')
    await page.click('[data-testid="next-step"]')
    
    // Llenar datos mínimos para paso 2
    await page.fill('[data-testid="client"]', 'Cliente')
    await page.fill('[data-testid="batch"]', 'LOTE001')
    await page.fill('[data-testid="order"]', 'PED001')
    await page.fill('[data-testid="product"]', 'Producto')
    await page.fill('[data-testid="units"]', '400')
    await page.fill('[data-testid="machine"]', 'MAQ001')
    await page.fill('[data-testid="manufacturing-date"]', '2025-08-14')
    await page.selectOption('[data-testid="shift"]', 'mañana')
    await page.fill('[data-testid="shift-manager"]', 'Manager')
    await page.fill('[data-testid="operator"]', 'Operator')
    await page.fill('[data-testid="quality-inspector"]', 'Inspector')
    await page.selectOption('[data-testid="sampling-level"]', 'S1')
    await page.selectOption('[data-testid="actual-sampling"]', '2')
    
    await page.click('[data-testid="next-step"]')
    
    // Aprobar todas las pruebas
    await page.click('[data-testid="test1-toggle"]')
    await page.click('[data-testid="test2-toggle"]')
    await page.click('[data-testid="test3-toggle"]')
    
    await page.click('[data-testid="next-step"]')
    
    // Intentar guardar (debe fallar)
    await page.click('[data-testid="save-release"]')
    
    // Verificar mensaje de error
    await expect(page.locator('[data-testid="error-toast"]')).toContainText('Error al guardar')
    
    // Verificar que permanecemos en la página
    expect(page.url()).toContain('/orders/new')
    
    await page.screenshot({ 
      path: 'screenshots/release-process-save-error.png',
      fullPage: true 
    })
  })

  test('debe validar límites de muestreo por nivel', async ({ page }) => {
    await page.goto('/orders/new')
    
    // Test con cantidad muy pequeña
    await page.setInputFiles('input[type="file"]', 'tests/fixtures/sample-label.jpg')
    await page.fill('[data-testid="box-quantity"]', '1')
    await page.click('[data-testid="next-step"]')
    
    // Completar datos básicos
    await page.fill('[data-testid="client"]', 'Cliente')
    await page.fill('[data-testid="batch"]', 'LOTE001')
    await page.fill('[data-testid="order"]', 'PED001')
    await page.fill('[data-testid="product"]', 'Producto')
    await page.fill('[data-testid="units"]', '10')
    await page.fill('[data-testid="machine"]', 'MAQ001')
    await page.fill('[data-testid="manufacturing-date"]', '2025-08-14')
    await page.selectOption('[data-testid="shift"]', 'mañana')
    await page.fill('[data-testid="shift-manager"]', 'Manager')
    await page.fill('[data-testid="operator"]', 'Operator')
    await page.fill('[data-testid="quality-inspector"]', 'Inspector')
    
    // Para cantidad muy pequeña, todos los niveles deben recomendar mínimo 1
    await page.selectOption('[data-testid="sampling-level"]', 'S1')
    await expect(page.locator('[data-testid="recommended-sampling"]')).toContainText('1 unidad')
    
    await page.selectOption('[data-testid="sampling-level"]', 'S4')
    const recommendedS4 = await page.locator('[data-testid="recommended-sampling"]').textContent()
    const recommended = parseInt(recommendedS4?.match(/\d+/)?.[0] || '0')
    expect(recommended).toBeGreaterThanOrEqual(1)
  })

  test('debe manejar sesiones expiradas durante el proceso', async ({ page }) => {
    await page.goto('/orders/new')
    
    // Simular expiración de sesión
    await page.route('/api/**', route => {
      route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Unauthorized' })
      })
    })
    
    // Completar paso 1
    await page.setInputFiles('input[type="file"]', 'tests/fixtures/sample-label.jpg')
    await page.fill('[data-testid="box-quantity"]', '20')
    await page.click('[data-testid="next-step"]')
    
    // Al intentar guardar debe redirigir a login
    // (esto dependería de la implementación específica del manejo de sesiones)
  })
})