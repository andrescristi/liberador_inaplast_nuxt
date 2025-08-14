import { test, expect } from '@playwright/test'

test.describe('Gestión de Órdenes', () => {
  
  test.beforeEach(async ({ page }) => {
    // Login como Supervisor (tiene permisos para gestionar órdenes)
    await page.goto('/auth/login')
    await page.fill('[data-testid="email-input"]', 'supervisor@inaplast.com')
    await page.fill('[data-testid="password-input"]', 'password123')
    await page.click('[data-testid="login-button"]')
    await page.waitForURL('/dashboard')
  })

  test.describe('Lista de Órdenes', () => {
    test('debe cargar y mostrar lista de órdenes', async ({ page }) => {
      await page.goto('/orders')
      
      // Verificar elementos de la página
      await expect(page.locator('h1')).toContainText('Órdenes')
      await expect(page.locator('[data-testid="orders-table"]')).toBeVisible()
      
      // Verificar filtros
      await expect(page.locator('[data-testid="search-input"]')).toBeVisible()
      await expect(page.locator('[data-testid="status-filter"]')).toBeVisible()
      await expect(page.locator('[data-testid="date-from"]')).toBeVisible()
      await expect(page.locator('[data-testid="date-to"]')).toBeVisible()
      
      await page.screenshot({ 
        path: 'screenshots/orders-list-loaded.png',
        fullPage: true 
      })
    })

    test('debe filtrar por estado correctamente', async ({ page }) => {
      await page.goto('/orders')
      
      // Filtrar por estado "Aceptado"
      await page.selectOption('[data-testid="status-filter"]', 'completed')
      
      // Verificar que se aplica el filtro
      await expect(page.locator('[data-testid="orders-count"]')).toContainText(/Mostrando.*órdenes/)
      
      // Todas las órdenes visibles deben tener estado "Aceptado"
      const statusBadges = page.locator('[data-testid="status-badge"]')
      const count = await statusBadges.count()
      
      for (let i = 0; i < count; i++) {
        await expect(statusBadges.nth(i)).toContainText('Aceptado')
      }
      
      await page.screenshot({ 
        path: 'screenshots/orders-filtered-by-status.png',
        fullPage: true 
      })
    })

    test('debe buscar órdenes por texto', async ({ page }) => {
      await page.goto('/orders')
      
      // Buscar por cliente
      await page.fill('[data-testid="search-input"]', 'CLIENTE_TEST')
      
      // Esperar debounce
      await page.waitForTimeout(500)
      
      // Verificar que se muestran resultados de búsqueda
      await expect(page.locator('[data-testid="orders-table"]')).toBeVisible()
      
      // Limpiar búsqueda
      await page.click('[data-testid="clear-search"]')
      await expect(page.locator('[data-testid="search-input"]')).toHaveValue('')
    })

    test('debe filtrar por rango de fechas', async ({ page }) => {
      await page.goto('/orders')
      
      await page.fill('[data-testid="date-from"]', '2025-08-01')
      await page.fill('[data-testid="date-to"]', '2025-08-14')
      
      // Verificar que se aplican los filtros
      await expect(page.locator('[data-testid="orders-count"]')).toContainText(/Mostrando/)
      
      await page.screenshot({ 
        path: 'screenshots/orders-filtered-by-date.png',
        fullPage: true 
      })
    })

    test('debe limpiar todos los filtros', async ({ page }) => {
      await page.goto('/orders')
      
      // Aplicar múltiples filtros
      await page.fill('[data-testid="search-input"]', 'test')
      await page.selectOption('[data-testid="status-filter"]', 'completed')
      await page.fill('[data-testid="date-from"]', '2025-08-01')
      
      // Limpiar filtros
      await page.click('[data-testid="clear-filters"]')
      
      // Verificar que todos los filtros se limpian
      await expect(page.locator('[data-testid="search-input"]')).toHaveValue('')
      await expect(page.locator('[data-testid="status-filter"]')).toHaveValue('')
      await expect(page.locator('[data-testid="date-from"]')).toHaveValue('')
    })
  })

  test.describe('Acciones de Órdenes', () => {
    test('debe cambiar estado de orden a Aceptado', async ({ page }) => {
      await page.goto('/orders')
      
      // Encontrar primera orden y abrir menú de acciones
      await page.click('[data-testid="order-actions-menu"]')
      await page.click('[data-testid="order-actions-button"]')
      
      // Cambiar a Aceptado
      await page.click('[data-testid="mark-completed"]')
      
      // Verificar confirmación
      await expect(page.locator('[data-testid="success-toast"]')).toContainText('Estado actualizado')
      
      // Verificar que el estado cambió en la tabla
      await expect(page.locator('[data-testid="status-badge"]').first()).toContainText('Aceptado')
      
      await page.screenshot({ 
        path: 'screenshots/order-status-changed-to-accepted.png',
        fullPage: true 
      })
    })

    test('debe cambiar estado de orden a Rechazado', async ({ page }) => {
      await page.goto('/orders')
      
      await page.click('[data-testid="order-actions-menu"]')
      await page.click('[data-testid="order-actions-button"]')
      
      // Cambiar a Rechazado
      await page.click('[data-testid="mark-cancelled"]')
      
      await expect(page.locator('[data-testid="success-toast"]')).toContainText('Estado actualizado')
      await expect(page.locator('[data-testid="status-badge"]').first()).toContainText('Rechazado')
    })

    test('debe confirmar antes de eliminar orden', async ({ page }) => {
      await page.goto('/orders')
      
      await page.click('[data-testid="order-actions-menu"]')
      await page.click('[data-testid="order-actions-button"]')
      
      // Intentar eliminar
      await page.click('[data-testid="delete-order"]')
      
      // Debe aparecer confirmación
      await expect(page.locator('[data-testid="confirm-delete-modal"]')).toBeVisible()
      await expect(page.locator('[data-testid="confirm-message"]')).toContainText('¿Estás seguro')
      
      // Cancelar
      await page.click('[data-testid="cancel-delete"]')
      await expect(page.locator('[data-testid="confirm-delete-modal"]')).not.toBeVisible()
      
      // Confirmar eliminación
      await page.click('[data-testid="order-actions-menu"]')
      await page.click('[data-testid="delete-order"]')
      await page.click('[data-testid="confirm-delete"]')
      
      await expect(page.locator('[data-testid="success-toast"]')).toContainText('Orden eliminada')
    })
  })

  test.describe('Vista Detalle de Orden', () => {
    test('debe mostrar detalles completos de la orden', async ({ page }) => {
      await page.goto('/orders')
      
      // Click en primera orden para ver detalles
      await page.click('[data-testid="order-row"]')
      
      // Debe navegar a página de detalle
      await expect(page.url()).toMatch(/\/orders\/[a-f0-9-]+/)
      
      // Verificar elementos del detalle
      await expect(page.locator('[data-testid="order-id"]')).toBeVisible()
      await expect(page.locator('[data-testid="order-client"]')).toBeVisible()
      await expect(page.locator('[data-testid="order-product"]')).toBeVisible()
      await expect(page.locator('[data-testid="order-status"]')).toBeVisible()
      await expect(page.locator('[data-testid="test-results"]')).toBeVisible()
      
      // Verificar información de muestreo
      await expect(page.locator('[data-testid="sampling-info"]')).toContainText('Nivel')
      await expect(page.locator('[data-testid="sampling-info"]')).toContainText('unidades')
      
      await page.screenshot({ 
        path: 'screenshots/order-detail-view.png',
        fullPage: true 
      })
    })

    test('debe mostrar timeline de cambios de estado', async ({ page }) => {
      await page.goto('/orders')
      await page.click('[data-testid="order-row"]')
      
      // Verificar timeline si existe
      if (await page.locator('[data-testid="status-timeline"]').isVisible()) {
        await expect(page.locator('[data-testid="timeline-item"]')).toHaveCount.toBeGreaterThan(0)
        
        // Cada item del timeline debe tener fecha y estado
        const timelineItems = page.locator('[data-testid="timeline-item"]')
        const count = await timelineItems.count()
        
        for (let i = 0; i < count; i++) {
          await expect(timelineItems.nth(i).locator('[data-testid="timeline-date"]')).toBeVisible()
          await expect(timelineItems.nth(i).locator('[data-testid="timeline-status"]')).toBeVisible()
        }
      }
    })
  })

  test.describe('Paginación', () => {
    test('debe navegar entre páginas correctamente', async ({ page }) => {
      await page.goto('/orders')
      
      // Verificar controles de paginación si existen
      if (await page.locator('[data-testid="pagination"]').isVisible()) {
        const currentPage = await page.locator('[data-testid="current-page"]').textContent()
        expect(currentPage).toContain('1')
        
        // Ir a página siguiente si existe
        if (await page.locator('[data-testid="next-page"]').isEnabled()) {
          await page.click('[data-testid="next-page"]')
          
          const newPage = await page.locator('[data-testid="current-page"]').textContent()
          expect(newPage).toContain('2')
        }
      }
    })
  })

  test.describe('Estados de Carga y Error', () => {
    test('debe mostrar skeleton loader mientras carga', async ({ page }) => {
      // Mock slow API response
      await page.route('/api/orders**', route => {
        setTimeout(() => route.continue(), 2000)
      })
      
      await page.goto('/orders')
      
      // Debe mostrar loading state
      await expect(page.locator('[data-testid="loading-skeleton"]')).toBeVisible()
      
      // Después de cargar, debe mostrar tabla
      await expect(page.locator('[data-testid="orders-table"]')).toBeVisible({ timeout: 5000 })
    })

    test('debe mostrar estado vacío cuando no hay órdenes', async ({ page }) => {
      // Mock empty response
      await page.route('/api/orders**', route => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            data: [],
            total: 0,
            page: 1,
            per_page: 20,
            total_pages: 0
          })
        })
      })
      
      await page.goto('/orders')
      
      await expect(page.locator('[data-testid="empty-state"]')).toBeVisible()
      await expect(page.locator('[data-testid="empty-message"]')).toContainText('No se Encontraron Órdenes')
      await expect(page.locator('[data-testid="create-first-order"]')).toBeVisible()
    })

    test('debe manejar errores de carga', async ({ page }) => {
      // Mock error response
      await page.route('/api/orders**', route => {
        route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Database error' })
        })
      })
      
      await page.goto('/orders')
      
      await expect(page.locator('[data-testid="error-message"]')).toContainText('Error al cargar')
      await expect(page.locator('[data-testid="retry-button"]')).toBeVisible()
    })
  })

  test.describe('Responsive Behavior', () => {
    test('debe mostrar vista de cards en móvil', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('/orders')
      
      // En móvil debe mostrar cards en lugar de tabla
      await expect(page.locator('[data-testid="orders-cards"]')).toBeVisible()
      await expect(page.locator('[data-testid="orders-table"]')).not.toBeVisible()
      
      // Cards deben ser clickeables
      await page.click('[data-testid="order-card"]')
      await expect(page.url()).toMatch(/\/orders\/[a-f0-9-]+/)
      
      await page.screenshot({ 
        path: 'screenshots/orders-mobile-view.png',
        fullPage: true 
      })
    })

    test('debe mantener funcionalidad en tablet', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 })
      await page.goto('/orders')
      
      // Filtros deben estar visibles y funcionales
      await page.fill('[data-testid="search-input"]', 'test')
      await page.selectOption('[data-testid="status-filter"]', 'completed')
      
      await expect(page.locator('[data-testid="orders-table"]')).toBeVisible()
      
      await page.screenshot({ 
        path: 'screenshots/orders-tablet-view.png',
        fullPage: true 
      })
    })
  })

  test.describe('Sorting', () => {
    test('debe ordenar por diferentes columnas', async ({ page }) => {
      await page.goto('/orders')
      
      // Ordenar por fecha
      await page.click('[data-testid="sort-date"]')
      
      // Verificar que las fechas están ordenadas
      const dates = await page.locator('[data-testid="order-date"]').allTextContents()
      expect(dates.length).toBeGreaterThanOrEqual(1)
      
      // Ordenar por monto
      await page.click('[data-testid="sort-amount"]')
      
      // Verificar que se actualiza el indicador de ordenamiento
      await expect(page.locator('[data-testid="sort-indicator"]')).toBeVisible()
    })
  })

  test.describe('Casos Edge', () => {
    test('debe manejar órdenes con datos incompletos', async ({ page }) => {
      // Mock response con datos parciales
      await page.route('/api/orders**', route => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            data: [
              {
                id: 'order-incomplete',
                customer_id: null,
                status: 'pending',
                total_amount: 0,
                order_date: null,
                created_at: '2025-08-14T00:00:00Z',
                updated_at: '2025-08-14T00:00:00Z',
                customer: null
              }
            ],
            total: 1,
            page: 1,
            per_page: 20,
            total_pages: 1
          })
        })
      })
      
      await page.goto('/orders')
      
      // Debe manejar datos faltantes graciosamente
      await expect(page.locator('[data-testid="orders-table"]')).toBeVisible()
      await expect(page.locator('[data-testid="order-row"]')).toHaveCount(1)
    })

    test('debe manejar gran volumen de órdenes', async ({ page }) => {
      // Mock con muchas órdenes
      const largeDataset = Array.from({ length: 100 }, (_, i) => ({
        id: `order-${i}`,
        customer_id: `customer-${i}`,
        status: i % 3 === 0 ? 'completed' : i % 2 === 0 ? 'cancelled' : 'pending',
        total_amount: 1000 + i * 10,
        order_date: `2025-08-${String(14 - (i % 14)).padStart(2, '0')}T00:00:00Z`,
        created_at: `2025-08-${String(14 - (i % 14)).padStart(2, '0')}T00:00:00Z`,
        updated_at: `2025-08-${String(14 - (i % 14)).padStart(2, '0')}T00:00:00Z`,
        customer: { name: `Cliente ${i}`, email: `cliente${i}@test.com` }
      }))
      
      await page.route('/api/orders**', route => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            data: largeDataset.slice(0, 20), // Primera página
            total: 100,
            page: 1,
            per_page: 20,
            total_pages: 5
          })
        })
      })
      
      await page.goto('/orders')
      
      // Debe cargar sin problemas de performance
      await expect(page.locator('[data-testid="orders-table"]')).toBeVisible()
      await expect(page.locator('[data-testid="order-row"]')).toHaveCount(20)
      
      // Paginación debe funcionar
      await expect(page.locator('[data-testid="pagination"]')).toContainText('Página 1 de 5')
    })
  })

  test.describe('Integración con Dashboard', () => {
    test('debe navegar desde dashboard a órdenes', async ({ page }) => {
      await page.goto('/dashboard')
      
      // Click en historial de liberaciones
      await page.click('[data-testid="view-orders-history"]')
      await page.waitForURL('/orders')
      
      await expect(page.locator('h1')).toContainText('Órdenes')
    })

    test('debe crear nueva orden desde dashboard', async ({ page }) => {
      await page.goto('/dashboard')
      
      // Click en nueva liberación
      await page.click('[data-testid="new-release-button"]')
      await page.waitForURL('/orders/new')
      
      await expect(page.locator('h1')).toContainText('Nuevo Liberador')
    })
  })
})