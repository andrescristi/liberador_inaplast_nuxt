import { test, expect } from '@playwright/test';

test.describe('Order Management App', () => {
  test('should load the homepage/dashboard', async ({ page }) => {
    await page.goto('/');
    
    // Check if page loads without errors
    await expect(page).toHaveTitle(/Order Management/);
    
    // Take a screenshot for debugging
    await page.screenshot({ path: 'homepage.png', fullPage: true });
    
    console.log('Page title:', await page.title());
    console.log('Page URL:', page.url());
  });

  test('should display dashboard components', async ({ page }) => {
    await page.goto('/');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Check for dashboard elements
    const dashboardTitle = page.locator('h1, h2').first();
    const metricCards = page.locator('[data-testid="metric-card"], .metric-card, .card').first();
    
    console.log('Dashboard title text:', await dashboardTitle.textContent().catch(() => 'Not found'));
    console.log('Metric cards count:', await metricCards.count().catch(() => 0));
    
    // Take screenshot for visual inspection
    await page.screenshot({ path: 'dashboard.png', fullPage: true });
  });

  test('should navigate to orders page', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Try to find and click orders link
    const ordersLink = page.locator('a[href*="orders"], nav a:has-text("Orders"), [data-testid="orders-link"]').first();
    
    if (await ordersLink.count() > 0) {
      await ordersLink.click();
      await page.waitForLoadState('networkidle');
      console.log('Navigated to orders page:', page.url());
    } else {
      console.log('Orders link not found, trying direct navigation');
      await page.goto('/orders');
    }
    
    await page.screenshot({ path: 'orders-page.png', fullPage: true });
  });

  test('should check for customers page', async ({ page }) => {
    await page.goto('/customers');
    await page.waitForLoadState('networkidle');
    
    console.log('Customers page URL:', page.url());
    console.log('Page status:', page.url().includes('customers') ? 'Loaded' : 'Failed to load');
    
    await page.screenshot({ path: 'customers-page.png', fullPage: true });
  });

  test('should check for products page', async ({ page }) => {
    await page.goto('/products');
    await page.waitForLoadState('networkidle');
    
    console.log('Products page URL:', page.url());
    console.log('Page status:', page.url().includes('products') ? 'Loaded' : 'Failed to load');
    
    await page.screenshot({ path: 'products-page.png', fullPage: true });
  });

  test('should check page structure and log all elements', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Log all major elements found
    const headings = await page.locator('h1, h2, h3').allTextContents();
    const links = await page.locator('a').allTextContents();
    const buttons = await page.locator('button').allTextContents();
    
    console.log('=== PAGE ANALYSIS ===');
    console.log('Headings found:', headings.slice(0, 10)); // First 10
    console.log('Links found:', links.slice(0, 10)); // First 10  
    console.log('Buttons found:', buttons.slice(0, 10)); // First 10
    
    // Check for Vue/Nuxt specific elements
    const nuxtElements = await page.locator('[data-nuxt], [data-vue], .nuxt-page, #__nuxt').count();
    console.log('Nuxt/Vue elements found:', nuxtElements);
    
    // Check for errors in console
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    console.log('Console errors:', errors);
    
    await page.screenshot({ path: 'full-analysis.png', fullPage: true });
  });
});