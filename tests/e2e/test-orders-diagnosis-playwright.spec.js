import { test } from '@playwright/test';

test.describe('Diagnóstico de /orders/new', () => {
  test('Diagnóstico completo con login manual', async ({ page }) => {
    console.log('🔍 Iniciando diagnóstico completo de /orders/new');
    console.log('👆 Se abrirá una ventana del navegador para que ingreses las credenciales');
    
    // Configurar captura de mensajes de consola
    const consoleMessages = [];
    page.on('console', msg => {
      const message = `${msg.type()}: ${msg.text()}`;
      consoleMessages.push(message);
      console.log(`🖥️ Console: ${message}`);
    });
    
    // Configurar captura de errores
    page.on('pageerror', error => {
      console.log(`❌ Error de página: ${error.message}`);
    });
    
    // 1. Intentar acceder a /orders/new sin autenticación
    console.log('📍 Paso 1: Accediendo a /orders/new sin autenticación...');
    await page.goto('http://localhost:3000/orders/new');
    
    await page.screenshot({ 
      path: 'screenshots/diagnosis-step1-unauthenticated.png',
      fullPage: true 
    });
    
    const redirectUrl = page.url();
    console.log(`📍 Redirigido a: ${redirectUrl}`);
    
    // 2. Verificar que estamos en la página de login
    if (redirectUrl.includes('/auth/login')) {
      console.log('✅ Redirección a login funcionando correctamente');
      
      console.log('👆 AHORA INGRESA TUS CREDENCIALES EN LA VENTANA DEL NAVEGADOR');
      console.log('⏳ Esperando hasta 60 segundos para que completes el login...');
      
      // Esperar hasta que el usuario complete el login (máximo 60 segundos)
      try {
        await page.waitForURL('http://localhost:3000/', { timeout: 60000 });
        console.log('✅ Login completado, redirigido al dashboard');
      } catch {
        console.log('⚠️ Timeout esperando login o no se redirigió al dashboard');
        console.log('🔄 Continuando con el análisis desde la página actual...');
      }
      
      await page.screenshot({ 
        path: 'screenshots/diagnosis-step2-after-login.png',
        fullPage: true 
      });
      
    } else {
      console.log('⚠️ No se redirigió al login como esperado');
    }
    
    // 3. Ahora intentar acceder a /orders/new autenticado
    console.log('📍 Paso 3: Intentando acceder a /orders/new autenticado...');
    
    // Configurar monitoreo de network
    const requests = [];
    const responses = [];
    
    page.on('request', request => {
      requests.push({
        url: request.url(),
        method: request.method(),
        timestamp: Date.now()
      });
    });
    
    page.on('response', response => {
      responses.push({
        url: response.url(),
        status: response.status(),
        statusText: response.statusText(),
        timestamp: Date.now()
      });
    });
    
    await page.goto('http://localhost:3000/orders/new');
    
    // Esperar a que la página cargue completamente
    await page.waitForTimeout(3000);
    
    await page.screenshot({ 
      path: 'screenshots/diagnosis-step3-orders-new-authenticated.png',
      fullPage: true 
    });
    
    const finalUrl = page.url();
    const title = await page.title();
    
    console.log(`📍 URL final: ${finalUrl}`);
    console.log(`📄 Título: ${title}`);
    
    // 4. Verificar si la página se cargó correctamente
    if (finalUrl.includes('/orders/new')) {
      console.log('✅ Accedió correctamente a /orders/new');
      
      // Verificar componentes esperados
      const orderWizardExists = await page.locator('//').count() > 0;
      console.log(`🧙‍♂️ OrderWizard presente: ${orderWizardExists}`);
      
      // Buscar elementos específicos que deberían existir
      const headingExists = await page.locator('h1, h2, .wizard-title').count() > 0;
      const formExists = await page.locator('form, .wizard-step').count() > 0;
      const buttonsExist = await page.locator('button').count() > 0;
      
      console.log(`📋 Encabezado presente: ${headingExists}`);
      console.log(`📝 Formulario/wizard presente: ${formExists}`);
      console.log(`🔘 Botones presentes: ${buttonsExist}`);
      
    } else {
      console.log(`❌ No se pudo acceder a /orders/new, redirigido a: ${finalUrl}`);
    }
    
    // 5. Análisis de red
    console.log('\n📡 Análisis de requests de red:');
    console.log(`📤 Total requests: ${requests.length}`);
    console.log(`📨 Total responses: ${responses.length}`);
    
    // Filtrar requests relevantes
    const relevantRequests = requests.filter(req => 
      req.url.includes('orders') || req.url.includes('auth') || req.url.includes('api')
    );
    
    const relevantResponses = responses.filter(res => 
      res.url.includes('orders') || res.url.includes('auth') || res.url.includes('api')
    );
    
    console.log('\n🔗 Requests relevantes:');
    relevantRequests.forEach(req => {
      console.log(`   ${req.method} ${req.url}`);
    });
    
    console.log('\n📨 Responses relevantes:');
    relevantResponses.forEach(res => {
      console.log(`   ${res.status} ${res.statusText} - ${res.url}`);
    });
    
    // 6. Resumen de mensajes de consola
    console.log('\n🖥️ Mensajes de consola capturados:');
    consoleMessages.forEach(msg => {
      console.log(`   ${msg}`);
    });
    
    // 7. Generar reporte final
    const diagnosticReport = {
      timestamp: new Date().toISOString(),
      steps: {
        unauthenticatedAccess: {
          initialUrl: 'http://localhost:3000/orders/new',
          redirectUrl: redirectUrl,
          redirectedToLogin: redirectUrl.includes('/auth/login')
        },
        authenticatedAccess: {
          finalUrl: finalUrl,
          title: title,
          accessedOrdersNew: finalUrl.includes('/orders/new'),
          pageLoadedCorrectly: finalUrl.includes('/orders/new')
        },
        network: {
          totalRequests: requests.length,
          totalResponses: responses.length,
          relevantRequests: relevantRequests.length,
          relevantResponses: relevantResponses.length
        },
        console: {
          totalMessages: consoleMessages.length,
          messages: consoleMessages
        }
      }
    };
    
    // Guardar reporte
    await page.evaluate((report) => {
      console.log('📊 Reporte de diagnóstico:', JSON.stringify(report, null, 2));
    }, diagnosticReport);
    
    // Screenshot final del reporte
    await page.screenshot({ 
      path: 'screenshots/diagnosis-final-report.png',
      fullPage: true 
    });
    
    console.log('\n✅ Diagnóstico completado');
    console.log('📸 Screenshots guardados en: screenshots/diagnosis-*.png');
    
    // Mantener la ventana abierta por un momento para revisión manual
    console.log('🔍 Manteniendo ventana abierta por 10 segundos para revisión manual...');
    await page.waitForTimeout(10000);
  });
});