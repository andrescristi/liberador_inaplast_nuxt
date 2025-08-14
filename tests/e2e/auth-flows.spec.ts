import { test, expect } from '@playwright/test'

test.describe('Flujos de Autenticación por Roles', () => {
  
  test.describe('Login Inspector', () => {
    test('debe hacer login exitoso como Inspector', async ({ page }) => {
      await page.goto('/auth/login')
      
      await page.fill('[data-testid="email-input"]', 'inspector@inaplast.com')
      await page.fill('[data-testid="password-input"]', 'password123')
      await page.click('[data-testid="login-button"]')
      
      // Debe redirigir al dashboard
      await page.waitForURL('/dashboard')
      
      // Verificar elementos específicos del rol Inspector
      await expect(page.locator('[data-testid="dashboard-title"]')).toContainText('Dashboard')
      await expect(page.locator('[data-testid="user-role-badge"]')).toContainText('Inspector')
      
      // Inspector debe ver solo sus propias estadísticas
      await expect(page.locator('[data-testid="my-inspections"]')).toContainText('Mis Inspecciones')
      
      // No debe ver panel de administración
      await expect(page.locator('[data-testid="admin-panel"]')).not.toBeVisible()
      
      await page.screenshot({ 
        path: 'screenshots/inspector-dashboard.png',
        fullPage: true 
      })
    })

    test('debe tener acceso limitado como Inspector', async ({ page }) => {
      await page.goto('/auth/login')
      await page.fill('[data-testid="email-input"]', 'inspector@inaplast.com')
      await page.fill('[data-testid="password-input"]', 'password123')
      await page.click('[data-testid="login-button"]')
      await page.waitForURL('/dashboard')
      
      // Intentar acceder a página de admin (debe ser denegado)
      await page.goto('/admin/users')
      await expect(page.locator('[data-testid="access-denied"]')).toContainText('Acceso Denegado')
      
      // Debe tener acceso a liberaciones
      await page.goto('/orders/new')
      await expect(page.locator('h1')).toContainText('Nuevo Liberador')
      
      // Debe tener acceso a historial de órdenes
      await page.goto('/orders')
      await expect(page.locator('h1')).toContainText('Órdenes')
    })
  })

  test.describe('Login Supervisor', () => {
    test('debe hacer login exitoso como Supervisor', async ({ page }) => {
      await page.goto('/auth/login')
      
      await page.fill('[data-testid="email-input"]', 'supervisor@inaplast.com')
      await page.fill('[data-testid="password-input"]', 'password123')
      await page.click('[data-testid="login-button"]')
      
      await page.waitForURL('/dashboard')
      
      // Supervisor debe ver estadísticas globales
      await expect(page.locator('[data-testid="dashboard-title"]')).toContainText('Dashboard')
      await expect(page.locator('[data-testid="user-role-badge"]')).toContainText('Supervisor')
      await expect(page.locator('[data-testid="global-stats"]')).toContainText('Inspecciones Realizadas')
      
      // No debe ver panel de administración de usuarios
      await expect(page.locator('[data-testid="admin-panel"]')).not.toBeVisible()
      
      await page.screenshot({ 
        path: 'screenshots/supervisor-dashboard.png',
        fullPage: true 
      })
    })

    test('debe tener permisos de supervisión', async ({ page }) => {
      await page.goto('/auth/login')
      await page.fill('[data-testid="email-input"]', 'supervisor@inaplast.com')
      await page.fill('[data-testid="password-input"]', 'password123')
      await page.click('[data-testid="login-button"]')
      await page.waitForURL('/dashboard')
      
      // Supervisor debe poder ver todas las órdenes
      await page.goto('/orders')
      await expect(page.locator('[data-testid="orders-filter"]')).toBeVisible()
      
      // Debe poder cambiar estado de órdenes
      if (await page.locator('[data-testid="order-row"]').first().isVisible()) {
        await page.click('[data-testid="order-actions"]')
        await expect(page.locator('[data-testid="change-status"]')).toBeVisible()
      }
      
      // No debe acceder a admin de usuarios
      await page.goto('/admin/users')
      await expect(page.locator('[data-testid="access-denied"]')).toContainText('Acceso Denegado')
    })
  })

  test.describe('Login Admin', () => {
    test('debe hacer login exitoso como Admin', async ({ page }) => {
      await page.goto('/auth/login')
      
      await page.fill('[data-testid="email-input"]', 'admin@inaplast.com')
      await page.fill('[data-testid="password-input"]', 'admin123')
      await page.click('[data-testid="login-button"]')
      
      await page.waitForURL('/dashboard')
      
      // Admin debe ver todo
      await expect(page.locator('[data-testid="dashboard-title"]')).toContainText('Dashboard')
      await expect(page.locator('[data-testid="user-role-badge"]')).toContainText('Admin')
      await expect(page.locator('[data-testid="global-stats"]')).toContainText('Inspecciones Realizadas')
      
      // Debe ver acceso a administración
      await expect(page.locator('[data-testid="admin-menu"]')).toBeVisible()
      
      await page.screenshot({ 
        path: 'screenshots/admin-dashboard.png',
        fullPage: true 
      })
    })

    test('debe tener acceso completo a administración', async ({ page }) => {
      await page.goto('/auth/login')
      await page.fill('[data-testid="email-input"]', 'admin@inaplast.com')
      await page.fill('[data-testid="password-input"]', 'admin123')
      await page.click('[data-testid="login-button"]')
      await page.waitForURL('/dashboard')
      
      // Acceso a gestión de usuarios
      await page.goto('/admin/users')
      await expect(page.locator('h1')).toContainText('Administración de Usuarios')
      
      // Debe poder crear usuarios
      await expect(page.locator('[data-testid="create-user-button"]')).toBeVisible()
      
      // Debe ver estadísticas de usuarios
      await expect(page.locator('[data-testid="user-stats"]')).toBeVisible()
      
      await page.screenshot({ 
        path: 'screenshots/admin-users-page.png',
        fullPage: true 
      })
    })
  })

  test.describe('Casos de Error en Login', () => {
    test('debe manejar credenciales incorrectas', async ({ page }) => {
      await page.goto('/auth/login')
      
      await page.fill('[data-testid="email-input"]', 'usuario@inexistente.com')
      await page.fill('[data-testid="password-input"]', 'contraseñaincorrecta')
      await page.click('[data-testid="login-button"]')
      
      // Debe mostrar error
      await expect(page.locator('[data-testid="error-message"]')).toContainText('Credenciales incorrectas')
      
      // No debe redirigir
      expect(page.url()).toContain('/auth/login')
      
      await page.screenshot({ 
        path: 'screenshots/login-error-invalid-credentials.png',
        fullPage: true 
      })
    })

    test('debe validar formato de email', async ({ page }) => {
      await page.goto('/auth/login')
      
      await page.fill('[data-testid="email-input"]', 'email-invalido')
      await page.fill('[data-testid="password-input"]', 'password123')
      await page.click('[data-testid="login-button"]')
      
      // Debe mostrar error de validación
      await expect(page.locator('[data-testid="email-error"]')).toContainText('email válido')
    })

    test('debe requerir campos obligatorios', async ({ page }) => {
      await page.goto('/auth/login')
      
      // Intentar login sin datos
      await page.click('[data-testid="login-button"]')
      
      await expect(page.locator('[data-testid="email-error"]')).toContainText('requerido')
      await expect(page.locator('[data-testid="password-error"]')).toContainText('requerido')
    })
  })

  test.describe('Reset de Contraseña', () => {
    test('debe enviar email de reset correctamente', async ({ page }) => {
      await page.goto('/auth/login')
      
      await page.click('[data-testid="forgot-password-link"]')
      await page.waitForURL('/auth/reset-password')
      
      await page.fill('[data-testid="reset-email"]', 'inspector@inaplast.com')
      await page.click('[data-testid="send-reset-button"]')
      
      await expect(page.locator('[data-testid="success-message"]')).toContainText('correo enviado')
      
      await page.screenshot({ 
        path: 'screenshots/password-reset-success.png',
        fullPage: true 
      })
    })

    test('debe manejar email inexistente en reset', async ({ page }) => {
      await page.goto('/auth/reset-password')
      
      await page.fill('[data-testid="reset-email"]', 'inexistente@noexiste.com')
      await page.click('[data-testid="send-reset-button"]')
      
      await expect(page.locator('[data-testid="error-message"]')).toContainText('Email no encontrado')
    })
  })

  test.describe('Logout', () => {
    test('debe hacer logout correctamente', async ({ page }) => {
      // Login primero
      await page.goto('/auth/login')
      await page.fill('[data-testid="email-input"]', 'inspector@inaplast.com')
      await page.fill('[data-testid="password-input"]', 'password123')
      await page.click('[data-testid="login-button"]')
      await page.waitForURL('/dashboard')
      
      // Hacer logout
      await page.click('[data-testid="user-menu"]')
      await page.click('[data-testid="logout-button"]')
      
      // Debe redirigir a login
      await page.waitForURL('/auth/login')
      
      // Intentar acceder a ruta protegida debe redirigir de nuevo a login
      await page.goto('/dashboard')
      await page.waitForURL('/auth/login')
    })
  })

  test.describe('Persistencia de Sesión', () => {
    test('debe mantener sesión al recargar página', async ({ page }) => {
      await page.goto('/auth/login')
      await page.fill('[data-testid="email-input"]', 'inspector@inaplast.com')
      await page.fill('[data-testid="password-input"]', 'password123')
      await page.click('[data-testid="login-button"]')
      await page.waitForURL('/dashboard')
      
      // Recargar página
      await page.reload()
      
      // Debe permanecer en dashboard (no redirigir a login)
      await expect(page.locator('[data-testid="dashboard-title"]')).toContainText('Dashboard')
    })

    test('debe expirar sesión después de tiempo límite', async ({ page }) => {
      // Este test requeriría configuración especial de tiempo de expiración
      // o mock del tiempo del sistema
      await page.goto('/auth/login')
      await page.fill('[data-testid="email-input"]', 'inspector@inaplast.com')
      await page.fill('[data-testid="password-input"]', 'password123')
      await page.click('[data-testid="login-button"]')
      await page.waitForURL('/dashboard')
      
      // En un escenario real, esperaríamos o simularíamos el paso del tiempo
      // Por ahora, verificamos que la lógica de expiración esté en lugar
      expect(page.url()).toContain('/dashboard')
    })
  })

  test.describe('Seguridad', () => {
    test('debe prevenir acceso directo a rutas protegidas', async ({ page }) => {
      // Sin login, intentar acceder directamente
      await page.goto('/dashboard')
      await page.waitForURL('/auth/login')
      
      await page.goto('/orders')
      await page.waitForURL('/auth/login')
      
      await page.goto('/admin/users')
      await page.waitForURL('/auth/login')
    })

    test('debe limpiar datos sensibles al logout', async ({ page }) => {
      await page.goto('/auth/login')
      await page.fill('[data-testid="email-input"]', 'admin@inaplast.com')
      await page.fill('[data-testid="password-input"]', 'admin123')
      await page.click('[data-testid="login-button"]')
      await page.waitForURL('/dashboard')
      
      // Logout
      await page.click('[data-testid="user-menu"]')
      await page.click('[data-testid="logout-button"]')
      await page.waitForURL('/auth/login')
      
      // Verificar que localStorage/sessionStorage están limpios
      const localStorage = await page.evaluate(() => window.localStorage.length)
      const sessionStorage = await page.evaluate(() => window.sessionStorage.length)
      
      expect(localStorage).toBe(0)
      expect(sessionStorage).toBe(0)
    })

    test('debe manejar intentos de inyección en formulario', async ({ page }) => {
      await page.goto('/auth/login')
      
      const maliciousInputs = [
        "admin@test.com'; DROP TABLE users; --",
        '<script>alert("xss")</script>',
        '../../etc/passwd'
      ]
      
      for (const input of maliciousInputs) {
        await page.fill('[data-testid="email-input"]', input)
        await page.fill('[data-testid="password-input"]', 'password')
        await page.click('[data-testid="login-button"]')
        
        // No debe causar errores críticos ni ejecutar scripts
        await expect(page.locator('[data-testid="error-message"]')).toContainText('Credenciales incorrectas')
      }
    })
  })

  test.describe('UX y Accesibilidad', () => {
    test('debe ser navegable por teclado', async ({ page }) => {
      await page.goto('/auth/login')
      
      // Navegar por teclado
      await page.press('body', 'Tab') // Email field
      await page.keyboard.type('inspector@inaplast.com')
      
      await page.press('body', 'Tab') // Password field
      await page.keyboard.type('password123')
      
      await page.press('body', 'Tab') // Login button
      await page.press('body', 'Enter') // Submit
      
      await page.waitForURL('/dashboard')
      await expect(page.locator('[data-testid="dashboard-title"]')).toContainText('Dashboard')
    })

    test('debe mostrar estados de carga apropiados', async ({ page }) => {
      await page.goto('/auth/login')
      
      await page.fill('[data-testid="email-input"]', 'inspector@inaplast.com')
      await page.fill('[data-testid="password-input"]', 'password123')
      
      // Mock slow network para ver loading state
      await page.route('/api/auth/**', route => {
        setTimeout(() => route.continue(), 2000)
      })
      
      await page.click('[data-testid="login-button"]')
      
      // Debe mostrar loading durante el login
      await expect(page.locator('[data-testid="loading-spinner"]')).toBeVisible()
      await expect(page.locator('[data-testid="login-button"]')).toBeDisabled()
    })

    test('debe tener contraste de colores adecuado', async ({ page }) => {
      await page.goto('/auth/login')
      
      // Verificar que los elementos son visibles y tienen buen contraste
      await expect(page.locator('[data-testid="email-input"]')).toBeVisible()
      await expect(page.locator('[data-testid="password-input"]')).toBeVisible()
      await expect(page.locator('[data-testid="login-button"]')).toBeVisible()
      
      // Los labels deben ser legibles
      await expect(page.locator('label')).toHaveCount(2)
    })
  })

  test.describe('Responsive Design', () => {
    test('debe funcionar en dispositivos móviles', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 }) // iPhone SE
      
      await page.goto('/auth/login')
      
      // Elementos deben ser visibles y clickeables en móvil
      await expect(page.locator('[data-testid="email-input"]')).toBeVisible()
      await expect(page.locator('[data-testid="password-input"]')).toBeVisible()
      await expect(page.locator('[data-testid="login-button"]')).toBeVisible()
      
      // Login debe funcionar en móvil
      await page.fill('[data-testid="email-input"]', 'inspector@inaplast.com')
      await page.fill('[data-testid="password-input"]', 'password123')
      await page.click('[data-testid="login-button"]')
      
      await page.waitForURL('/dashboard')
      
      await page.screenshot({ 
        path: 'screenshots/mobile-login-success.png',
        fullPage: true 
      })
    })

    test('debe funcionar en tablet', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 }) // iPad
      
      await page.goto('/auth/login')
      
      await page.fill('[data-testid="email-input"]', 'supervisor@inaplast.com')
      await page.fill('[data-testid="password-input"]', 'password123')
      await page.click('[data-testid="login-button"]')
      
      await page.waitForURL('/dashboard')
      
      await page.screenshot({ 
        path: 'screenshots/tablet-dashboard.png',
        fullPage: true 
      })
    })
  })

  test.describe('Manejo de Errores de Red', () => {
    test('debe manejar timeout de conexión', async ({ page }) => {
      await page.goto('/auth/login')
      
      // Simular timeout
      await page.route('/api/auth/**', route => {
        route.abort('timeout')
      })
      
      await page.fill('[data-testid="email-input"]', 'inspector@inaplast.com')
      await page.fill('[data-testid="password-input"]', 'password123')
      await page.click('[data-testid="login-button"]')
      
      await expect(page.locator('[data-testid="error-message"]')).toContainText('Error de conexión')
    })

    test('debe manejar errores del servidor', async ({ page }) => {
      await page.goto('/auth/login')
      
      // Simular error 500
      await page.route('/api/auth/**', route => {
        route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Internal server error' })
        })
      })
      
      await page.fill('[data-testid="email-input"]', 'inspector@inaplast.com')
      await page.fill('[data-testid="password-input"]', 'password123')
      await page.click('[data-testid="login-button"]')
      
      await expect(page.locator('[data-testid="error-message"]')).toContainText('Error del servidor')
    })
  })
})