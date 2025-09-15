/**
 * Prueba E2E robusta para verificar que cantidad_unidades_con_falla
 * se guarda correctamente usando las APIs directamente
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

interface CreatedOrderData {
  id: number
  cliente: string
  producto: string
  status: string
  orders_tests: OrderTestData[]
}

test.describe('Verificación API de cantidad_unidades_con_falla', () => {
  let createdOrderId: number | null = null

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

  test('debe crear orden con cantidad_unidades_con_falla usando API directa', async ({ page }) => {

    // Login primero para tener sesión válida
    await page.goto('/auth/login')
    await page.waitForLoadState('networkidle')
    await page.fill('input[type="email"]', 'acristi@7works.cl')
    await page.fill('input[type="password"]', 'Martin.2020')
    await page.click('button[type="submit"], button:has-text("Iniciar")')
    await page.waitForURL('/', { timeout: 10000 })

    // Datos de prueba específicos
    const testData = {
      cliente: 'CLIENTE_API_TEST',
      producto: 'PRODUCTO_API_TEST',
      pedido: 'PEDIDO_API_001',
      fecha_fabricacion: '2025-01-15',
      codigo_producto: 'CODIGO_API_001',
      turno: 'mañana',
      numero_operario: 'OP_API_001',
      maquina: 'MAQ_API_001',
      inspector_calidad: 'INSPECTOR_API',
      unidadesPorEmbalaje: 100,
      cantidadEmbalajes: 5,
      cantidadMuestra: 13,
      // Tests específicos con rechazos
      ordersTests: [
        // Test 1: Aprobado
        { testId: 1, aprobado: true, cantidad_unidades_con_falla: 0 },
        // Test 2: Aprobado
        { testId: 2, aprobado: true, cantidad_unidades_con_falla: 0 },
        // Test 3: RECHAZADO con 3 fallas
        { testId: 3, aprobado: false, cantidad_unidades_con_falla: 3 },
        // Test 4: Aprobado
        { testId: 4, aprobado: true, cantidad_unidades_con_falla: 0 },
        // Test 5: RECHAZADO con 7 fallas
        { testId: 5, aprobado: false, cantidad_unidades_con_falla: 7 },
        // Tests 6-18: Todos aprobados
        { testId: 6, aprobado: true, cantidad_unidades_con_falla: 0 },
        { testId: 7, aprobado: true, cantidad_unidades_con_falla: 0 },
        { testId: 8, aprobado: true, cantidad_unidades_con_falla: 0 },
        { testId: 9, aprobado: true, cantidad_unidades_con_falla: 0 },
        { testId: 10, aprobado: true, cantidad_unidades_con_falla: 0 },
        { testId: 11, aprobado: true, cantidad_unidades_con_falla: 0 },
        { testId: 12, aprobado: true, cantidad_unidades_con_falla: 0 },
        { testId: 13, aprobado: true, cantidad_unidades_con_falla: 0 },
        { testId: 14, aprobado: true, cantidad_unidades_con_falla: 0 },
        { testId: 15, aprobado: true, cantidad_unidades_con_falla: 0 },
        { testId: 16, aprobado: true, cantidad_unidades_con_falla: 0 },
        { testId: 17, aprobado: true, cantidad_unidades_con_falla: 0 },
        { testId: 18, aprobado: true, cantidad_unidades_con_falla: 0 }
      ]
    }


    // Crear orden usando la API directamente
    const createOrderResponse = await page.evaluate(async (data) => {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      })
      
      if (!response.ok) {
        const error = await response.text()
        throw new Error(`Error ${response.status}: ${error}`)
      }
      
      return await response.json()
    }, testData)

    expect(createOrderResponse.success).toBe(true)
    expect(createOrderResponse.data.order).toBeTruthy()
    
    createdOrderId = createOrderResponse.data.order.id

    // Verificar respuesta inicial básica
    expect(createOrderResponse.data.order.cliente).toBe(testData.cliente)
    expect(createOrderResponse.data.order.producto).toBe(testData.producto)
    expect(createOrderResponse.data.order.status).toBe('Rechazado') // Debe estar rechazada por tener tests fallidos



    // Obtener datos frescos de la base de datos
    const dbOrderResponse = await page.evaluate(async (orderId) => {
      const response = await fetch(`/api/orders/${orderId}`)
      if (!response.ok) {
        throw new Error(`Error obteniendo orden: ${response.status}`)
      }
      return await response.json()
    }, createdOrderId)

    const dbOrderData = dbOrderResponse.data
    const dbOrdersTests = dbOrderData.orders_tests


    // Verificar datos básicos
    expect(dbOrderData.cliente).toBe(testData.cliente)
    expect(dbOrderData.status).toBe('Rechazado')

    // Verificar que hay 18 tests
    expect(dbOrdersTests.length).toBe(18)

    // Verificar tests específicos rechazados
    const rejectedTests = dbOrdersTests.filter((ot: OrderTestData) => !ot.aprobado)
    expect(rejectedTests.length).toBe(2)

    // Verificar test ID 3: debe estar rechazado con 3 fallas
    const test3 = dbOrdersTests.find((ot: OrderTestData) => ot.tests.id === 3)
    expect(test3, 'Test 3 no encontrado').toBeTruthy()
    expect(test3.aprobado, 'Test 3 debería estar rechazado').toBe(false)
    expect(test3.cantidad_unidades_con_falla, 'Test 3 debería tener 3 fallas').toBe(3)

    // Verificar test ID 5: debe estar rechazado con 7 fallas
    const test5 = dbOrdersTests.find((ot: OrderTestData) => ot.tests.id === 5)
    expect(test5, 'Test 5 no encontrado').toBeTruthy()
    expect(test5.aprobado, 'Test 5 debería estar rechazado').toBe(false)
    expect(test5.cantidad_unidades_con_falla, 'Test 5 debería tener 7 fallas').toBe(7)

    // Verificar que tests aprobados tienen 0 fallas
    const approvedTests = dbOrdersTests.filter((ot: OrderTestData) => ot.aprobado)
    expect(approvedTests.length).toBe(16)
    
    for (const approvedTest of approvedTests) {
      expect(approvedTest.cantidad_unidades_con_falla, 
        `Test aprobado ${approvedTest.tests.id} no debería tener fallas`
      ).toBe(0)
    }

    // Verificar que NO hay valores 0 para tests rechazados
    for (const rejectedTest of rejectedTests) {
      expect(rejectedTest.cantidad_unidades_con_falla, 
        `Test rechazado ${rejectedTest.tests.id} debería tener fallas > 0`
      ).toBeGreaterThan(0)
    }

    // Verificar suma total de fallas
    const totalFallas = rejectedTests.reduce((sum, test) => sum + test.cantidad_unidades_con_falla, 0)
    expect(totalFallas).toBe(10) // 3 + 7 = 10

  })

  test('debe manejar correctamente casos extremos de cantidad_unidades_con_falla', async ({ page }) => {
    // Test adicional para casos extremos

    // Login
    await page.goto('/auth/login')
    await page.waitForLoadState('networkidle')
    await page.fill('input[type="email"]', 'acristi@7works.cl')
    await page.fill('input[type="password"]', 'Martin.2020')
    await page.click('button[type="submit"], button:has-text("Iniciar")')
    await page.waitForURL('/', { timeout: 10000 })

    // Datos con casos extremos
    const extremeTestData = {
      cliente: 'CLIENTE_EXTREMO',
      producto: 'PRODUCTO_EXTREMO',
      pedido: 'PEDIDO_EXT_001',
      fecha_fabricacion: '2025-01-16',
      codigo_producto: 'CODIGO_EXT_001',
      turno: 'noche',
      numero_operario: 'OP_EXT_001',
      maquina: 'MAQ_EXT_001',
      inspector_calidad: 'INSPECTOR_EXT',
      unidadesPorEmbalaje: 50,
      cantidadEmbalajes: 2,
      cantidadMuestra: 8,
      ordersTests: [
        // Test con 1 falla (mínimo)
        { testId: 1, aprobado: false, cantidad_unidades_con_falla: 1 },
        // Test con fallas igual al tamaño de muestra (máximo)
        { testId: 2, aprobado: false, cantidad_unidades_con_falla: 8 },
        // Tests 3-18: Todos aprobados
        ...Array.from({ length: 16 }, (_, i) => ({ 
          testId: i + 3, 
          aprobado: true, 
          cantidad_unidades_con_falla: 0 
        }))
      ]
    }

    const response = await page.evaluate(async (data) => {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      
      if (!response.ok) {
        const error = await response.text()
        throw new Error(`Error ${response.status}: ${error}`)
      }
      
      return await response.json()
    }, extremeTestData)

    createdOrderId = response.data.order.id

    // Verificar casos extremos
    const dbResponse = await page.evaluate(async (orderId) => {
      const response = await fetch(`/api/orders/${orderId}`)
      return await response.json()
    }, createdOrderId)

    const extremeOrdersTests = dbResponse.data.orders_tests
    const extremeRejectedTests = extremeOrdersTests.filter((ot: OrderTestData) => !ot.aprobado)

    expect(extremeRejectedTests.length).toBe(2)

    // Verificar caso extremo: 1 falla (mínimo)
    const minTest = extremeRejectedTests.find((ot: OrderTestData) => ot.tests.id === 1)
    expect(minTest.cantidad_unidades_con_falla).toBe(1)

    // Verificar caso extremo: 8 fallas (máximo = tamaño de muestra)
    const maxTest = extremeRejectedTests.find((ot: OrderTestData) => ot.tests.id === 2)
    expect(maxTest.cantidad_unidades_con_falla).toBe(8)

  })
})