/**
 * Prueba E2E robusta para verificar que cantidad_unidades_con_falla
 * se guarda correctamente en la base de datos
 */

import { test, expect } from '@playwright/test'

interface OrderTestData {
  id: number
  aprobado: boolean
  cantidad_unidades_con_falla: number
  tests: {
    id: number
    name: string
  }
}


test.describe('Verificación de cantidad_unidades_con_falla', () => {
  let createdOrderId: number | null = null

  test.beforeEach(async ({ page }) => {
    // Login con credenciales del archivo .env
    await page.goto('/auth/login')
    await page.waitForLoadState('networkidle')

    // Usar las credenciales usando selectores CSS
    await page.fill('input[type="email"]', 'acristi@7works.cl')
    await page.fill('input[type="password"]', 'Martin.2020')
    await page.click('button[type="submit"], button:has-text("Iniciar")')
    
    // Esperar navegación exitosa al dashboard (la raíz muestra el dashboard)
    await page.waitForURL('/', { timeout: 10000 })
    await expect(page.locator('h1')).toContainText('Dashboard')

    // Inicializar cliente Supabase para verificaciones de DB
    await page.addInitScript(() => {
      window.testSupabaseClient = {
        url: 'https://ohgyqnxrtvjjambumksj.supabase.co',
        key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9oZ3lxbnhydHZqamFtYnVta3NqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQwNjkyMzUsImV4cCI6MjA2OTY0NTIzNX0.oGWpXxRiwIZ_ZTV4UbTVpCDJyywzrdUi6uTCn_8OAKE'
      }
    })
  })

  test.afterEach(async ({ page }) => {
    // Limpiar datos de prueba si se creó una orden
    if (createdOrderId) {
      try {
        // Eliminar los orders_tests primero (restricción de clave foránea)
        await page.evaluate((orderId) => {
          return fetch('/api/supabase/cleanup', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              table: 'orders_tests', 
              condition: { order: orderId }
            })
          })
        }, createdOrderId)

        // Luego eliminar la orden
        await page.evaluate((orderId) => {
          return fetch('/api/supabase/cleanup', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              table: 'orders', 
              condition: { id: orderId }
            })
          })
        }, createdOrderId)

      } catch (error) {
        console.error('⚠️ Error limpiando datos de prueba:', error)
      }
    }
  })

  test('debe guardar cantidad_unidades_con_falla correctamente para tests rechazados', async ({ page }) => {
    // Datos de prueba específicos
    const testData = {
      cliente: 'CLIENTE_TEST_E2E',
      producto: 'PRODUCTO_TEST_FALLAS',
      lote: 'LOTE_E2E_001',
      pedido: 'PEDIDO_E2E_001',
      fechaFabricacion: '2025-01-15',
      codigoProducto: 'CODIGO_E2E_001',
      cantidadEmbalajes: 5,
      unidadesPorEmbalaje: 100,
      cantidadMuestra: 13,
      turno: 'mañana',
      jefeDeTurno: 'JEFE_TEST',
      ordenDeCompra: 'OC_E2E_001',
      numeroOperario: 'OP001_E2E',
      maquina: 'MAQ_E2E_001',
      inspectorCalidad: 'INSPECTOR_E2E',
      // Tests rechazados específicos:
      // Test ID 3: "No tienen los hilos cortados" - 3 fallas
      // Test ID 5: "No tienen rebarba en ninguna parte" - 7 fallas
      failedTests: [
        { id: 3, fallas: 3 },
        { id: 5, fallas: 7 }
      ]
    }


    // PASO 1: Navegar a /orders/new
    await page.goto('/orders/new')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('h1')).toContainText('Nuevo Liberador')

    // Captura inicial
    await page.screenshot({ 
      path: 'screenshots/step1-initial.png',
      fullPage: true 
    })

    // PASO 1: Completar datos iniciales
    
    // Buscar campo por texto del label
    const cantidadEmbalajesInput = page.locator('input[type="number"]:near(label:has-text("embalajes"))')
    await cantidadEmbalajesInput.fill(testData.cantidadEmbalajes.toString())
    
    // Esperar un momento para que los valores se procesen
    await page.waitForTimeout(500)
    
    await page.click('button:has-text("Siguiente")')
    
    // Esperar a que aparezca el paso 2
    await expect(page.locator('h2:has-text("Paso 2")')).toBeVisible({ timeout: 5000 })

    // PASO 2: Completar datos del producto
    
    // Llenar campos usando selectores basados en labels
    await page.locator('input:near(label:has-text("Unidades por Embalaje"))').fill(testData.unidadesPorEmbalaje.toString())
    await page.locator('input:near(label:has-text("Número de Lote"))').fill(testData.lote)
    await page.locator('input:near(label:has-text("Nombre del Cliente"))').fill(testData.cliente)
    await page.locator('input:near(label:has-text("Número de Pedido"))').fill(testData.pedido)
    await page.locator('input:near(label:has-text("Nombre del Producto"))').fill(testData.producto)
    await page.locator('input:near(label:has-text("Fecha de Fabricación"))').fill(testData.fechaFabricacion)
    await page.locator('input:near(label:has-text("Código del Producto"))').fill(testData.codigoProducto)
    await page.locator('select:near(label:has-text("Turno"))').selectOption(testData.turno)
    await page.locator('input:near(label:has-text("Jefe de Turno"))').fill(testData.jefeDeTurno)
    await page.locator('input:near(label:has-text("Orden de Compra"))').fill(testData.ordenDeCompra)
    await page.locator('input:near(label:has-text("Número de Operario"))').fill(testData.numeroOperario)
    await page.locator('input:near(label:has-text("Máquina"))').fill(testData.maquina)
    await page.locator('input:near(label:has-text("Inspector de Calidad"))').fill(testData.inspectorCalidad)

    await page.screenshot({ 
      path: 'screenshots/step2-completed.png',
      fullPage: true 
    })

    await page.click('button:has-text("Siguiente")')
    
    // Esperar a que aparezca el paso 3
    await expect(page.locator('h2:has-text("Paso 3")')).toBeVisible({ timeout: 5000 })
    
    // Esperar que la recomendación de muestreo se cargue (buscar spinner o contenido)
    await page.waitForSelector('.animate-spin, text="Recomendación de Muestreo"', { timeout: 10000 })
    
    // Esperar que termine la carga (que no haya spinner)
    await page.waitForFunction(() => !document.querySelector('.animate-spin'), { timeout: 15000 })

    // PASO 3: Configurar pruebas de calidad con rechazos específicos
    
    // Confirmar que la cantidad de muestra está correcta
    const cantidadMuestraInput = page.locator('input[type="number"]:near(text("Cantidad de Unidades a Muestrear"))')
    await expect(cantidadMuestraInput).toHaveValue(testData.cantidadMuestra.toString())

    // Configurar tests rechazados específicos
    for (const failedTest of testData.failedTests) {
      
      // Buscar el switch del test específico por su ID
      const testSwitch = page.locator(`input[id="test-${failedTest.id}"]`)
      await expect(testSwitch).toBeVisible({ timeout: 5000 })
      
      // Verificar estado actual del switch
      const isCurrentlyChecked = await testSwitch.isChecked()
      
      // Si está aprobado, hacer click para rechazarlo
      if (isCurrentlyChecked) {
        await testSwitch.click()
        await page.waitForTimeout(500) // Esperar que la UI se actualice
      }
      
      // Verificar que ahora está rechazado
      await expect(testSwitch).not.toBeChecked()
      
      // Buscar y llenar el campo de cantidad de fallas
      const failureInput = page.locator(`input[id="rejection-${failedTest.id}"]`)
      await expect(failureInput).toBeVisible({ timeout: 5000 })
      await failureInput.fill(failedTest.fallas.toString())
      
      // Verificar que el valor se guardó correctamente
      await expect(failureInput).toHaveValue(failedTest.fallas.toString())
      
    }

    // Verificar el resumen de pruebas
    const totalRejections = testData.failedTests.reduce((sum, test) => sum + test.fallas, 0)
    await expect(page.locator('text="Total unidades rechazadas:"').locator('../span')).toContainText(`${totalRejections} unidades`)

    await page.screenshot({ 
      path: 'screenshots/step3-tests-configured.png',
      fullPage: true 
    })

    await page.click('button:has-text("Ver Resumen")')
    
    // Esperar a que aparezca el paso 4
    await expect(page.locator('h2:has-text("Paso 4")')).toBeVisible({ timeout: 5000 })

    // PASO 4: Completar y guardar la orden
    
    // Esperar que el resumen se cargue completamente
    await page.waitForSelector('h2:has-text("Paso 4"), text="Resumen"', { timeout: 10000 })
    
    await page.screenshot({ 
      path: 'screenshots/step4-summary.png',
      fullPage: true 
    })

    // Interceptar la petición de creación de orden para obtener el ID
    const orderCreationPromise = page.waitForResponse(response => 
      response.url().includes('/api/orders') && 
      response.request().method() === 'POST' &&
      response.status() === 200
    )

    await page.click('button:has-text("Guardar Orden")')
    
    // Esperar respuesta de creación y extraer ID
    const orderResponse = await orderCreationPromise
    const orderData = await orderResponse.json()
    createdOrderId = orderData.data.order.id
    

    // Esperar redirección a listado de órdenes
    await page.waitForURL('/orders', { timeout: 15000 })
    await expect(page.locator('h1, h2')).toContainText('Órdenes')

    await page.screenshot({ 
      path: 'screenshots/order-created-success.png',
      fullPage: true 
    })

    // VERIFICACIÓN EN SUPABASE: Obtener datos de la orden creada
    
    const dbData = await page.evaluate(async (orderId) => {
      const response = await fetch(`/api/orders/${orderId}`)
      if (!response.ok) {
        throw new Error(`Error obteniendo orden: ${response.status}`)
      }
      return await response.json()
    }, createdOrderId)

    // Verificar datos básicos de la orden
    expect(dbData.data.cliente).toBe(testData.cliente)
    expect(dbData.data.producto).toBe(testData.producto)
    expect(dbData.data.status).toBe('Rechazado') // Debe estar rechazada por tener tests fallidos

    // Verificar orders_tests
    const ordersTests = dbData.data.orders_tests
    expect(ordersTests).toBeTruthy()
    expect(Array.isArray(ordersTests)).toBe(true)
    
    // Debe tener 18 tests (todos los tests disponibles)
    expect(ordersTests.length).toBe(18)

    // Verificar tests específicos rechazados
    for (const failedTest of testData.failedTests) {
      const dbTest = ordersTests.find((ot: OrderTestData) => ot.tests.id === failedTest.id)
      expect(dbTest, `Test ${failedTest.id} no encontrado en la base de datos`).toBeTruthy()
      expect(dbTest.aprobado, `Test ${failedTest.id} debería estar rechazado`).toBe(false)
      expect(dbTest.cantidad_unidades_con_falla, 
        `Test ${failedTest.id} debería tener ${failedTest.fallas} fallas`
      ).toBe(failedTest.fallas)
      
    }

    // Verificar que tests aprobados no tienen fallas
    const approvedTests = ordersTests.filter((ot: OrderTestData) => ot.aprobado)
    for (const approvedTest of approvedTests) {
      expect(approvedTest.cantidad_unidades_con_falla, 
        `Test aprobado ${approvedTest.tests.id} no debería tener fallas`
      ).toBe(0)
    }

    // Verificar que NO hay valores 0 para tests rechazados
    const rejectedTests = ordersTests.filter((ot: OrderTestData) => !ot.aprobado)
    expect(rejectedTests.length, 'Debería haber exactamente 2 tests rechazados').toBe(2)
    
    for (const rejectedTest of rejectedTests) {
      expect(rejectedTest.cantidad_unidades_con_falla, 
        `Test rechazado ${rejectedTest.tests.id} debería tener fallas > 0`
      ).toBeGreaterThan(0)
    }


    // Captura final de éxito
    await page.screenshot({ 
      path: 'screenshots/test-success-final.png',
      fullPage: true 
    })
  })

  test('debe manejar correctamente múltiples rechazos con diferentes cantidades', async ({ page }) => {
    // Test adicional para verificar edge cases
    const testData = {
      cliente: 'CLIENTE_MULTI_TEST',
      producto: 'PRODUCTO_MULTI_FALLAS',
      lote: 'LOTE_MULTI_001',
      pedido: 'PEDIDO_MULTI_001',
      fechaFabricacion: '2025-01-16',
      codigoProducto: 'CODIGO_MULTI_001',
      cantidadEmbalajes: 3,
      unidadesPorEmbalaje: 50,
      cantidadMuestra: 8,
      turno: 'tarde',
      jefeDeTurno: 'JEFE_MULTI',
      ordenDeCompra: 'OC_MULTI_001',
      numeroOperario: 'OP002_MULTI',
      maquina: 'MAQ_MULTI_001',
      inspectorCalidad: 'INSPECTOR_MULTI',
      // Más tests rechazados con cantidades variadas
      failedTests: [
        { id: 1, fallas: 1 }, // Mínimo
        { id: 2, fallas: 2 },
        { id: 4, fallas: 5 },
        { id: 6, fallas: 8 }  // Máximo (igual a la muestra)
      ]
    }


    // Seguir el mismo flujo pero más rápido
    await page.goto('/orders/new')
    await expect(page.locator('h1')).toContainText('Nuevo Liberador')

    // Paso 1
    const cantidadEmbalajesInput2 = page.locator('input[type="number"]:near(label:has-text("embalajes"))')
    await cantidadEmbalajesInput2.fill(testData.cantidadEmbalajes.toString())
    await page.click('button:has-text("Siguiente")')
    
    // Paso 2
    await expect(page.locator('h2:has-text("Paso 2")')).toBeVisible()
    await page.locator('input:near(label:has-text("Unidades por Embalaje"))').fill(testData.unidadesPorEmbalaje.toString())
    await page.locator('input:near(label:has-text("Número de Lote"))').fill(testData.lote)
    await page.locator('input:near(label:has-text("Nombre del Cliente"))').fill(testData.cliente)
    await page.locator('input:near(label:has-text("Número de Pedido"))').fill(testData.pedido)
    await page.locator('input:near(label:has-text("Nombre del Producto"))').fill(testData.producto)
    await page.locator('input:near(label:has-text("Fecha de Fabricación"))').fill(testData.fechaFabricacion)
    await page.locator('input:near(label:has-text("Código del Producto"))').fill(testData.codigoProducto)
    await page.locator('select:near(label:has-text("Turno"))').selectOption(testData.turno)
    await page.locator('input:near(label:has-text("Jefe de Turno"))').fill(testData.jefeDeTurno)
    await page.locator('input:near(label:has-text("Orden de Compra"))').fill(testData.ordenDeCompra)
    await page.locator('input:near(label:has-text("Número de Operario"))').fill(testData.numeroOperario)
    await page.locator('input:near(label:has-text("Máquina"))').fill(testData.maquina)
    await page.locator('input:near(label:has-text("Inspector de Calidad"))').fill(testData.inspectorCalidad)
    await page.click('button:has-text("Siguiente")')
    
    // Paso 3
    await expect(page.locator('h2:has-text("Paso 3")')).toBeVisible()
    await page.waitForFunction(() => !document.querySelector('.animate-spin'), { timeout: 15000 })

    // Configurar múltiples tests rechazados
    for (const failedTest of testData.failedTests) {
      const testSwitch = page.locator(`input[id="test-${failedTest.id}"]`)
      if (await testSwitch.isChecked()) {
        await testSwitch.click()
        await page.waitForTimeout(300)
      }
      
      const failureInput = page.locator(`input[id="rejection-${failedTest.id}"]`)
      await expect(failureInput).toBeVisible()
      await failureInput.fill(failedTest.fallas.toString())
    }

    await page.click('button:has-text("Ver Resumen")')
    
    // Paso 4
    await expect(page.locator('h2:has-text("Paso 4")')).toBeVisible()
    await page.waitForSelector('h2:has-text("Paso 4"), text="Resumen"', { timeout: 10000 })

    const orderCreationPromise = page.waitForResponse(response => 
      response.url().includes('/api/orders') && 
      response.request().method() === 'POST' &&
      response.status() === 200
    )

    await page.click('button:has-text("Guardar Orden")')
    
    const orderResponse = await orderCreationPromise
    const orderData = await orderResponse.json()
    createdOrderId = orderData.data.order.id

    await page.waitForURL('/orders')

    // Verificar en DB
    const dbData = await page.evaluate(async (orderId) => {
      const response = await fetch(`/api/orders/${orderId}`)
      return await response.json()
    }, createdOrderId)

    const ordersTests = dbData.data.orders_tests
    const rejectedTests = ordersTests.filter((ot: OrderTestData) => !ot.aprobado)
    
    expect(rejectedTests.length).toBe(testData.failedTests.length)
    
    // Verificar cada test rechazado
    for (const failedTest of testData.failedTests) {
      const dbTest = rejectedTests.find((ot: OrderTestData) => ot.tests.id === failedTest.id)
      expect(dbTest).toBeTruthy()
      expect(dbTest.cantidad_unidades_con_falla).toBe(failedTest.fallas)
    }

  })
})