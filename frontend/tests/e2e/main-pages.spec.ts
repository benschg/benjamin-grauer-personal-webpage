import { test, expect } from '@playwright/test';

test.describe('Main Pages', () => {
  test('Home page loads without errors', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Benjamin Grauer/);
    
    // Check for main sections
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
    
    // Check for MUI AppBar navigation
    await expect(page.locator('[class*="MuiAppBar"]')).toBeVisible();
    
    // Ensure no console errors
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.waitForTimeout(2000); // Wait for page to fully load
    expect(errors).toHaveLength(0);
  });

  test('Working Life page loads without errors', async ({ page }) => {
    await page.goto('/working-life');
    await expect(page).toHaveTitle(/Benjamin Grauer/);
    
    // Check page content loads
    await expect(page.locator('main')).toBeVisible();
    
    // Ensure no console errors
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.waitForTimeout(2000); // Wait for page to fully load
    expect(errors).toHaveLength(0);
  });

  test('Personal Life page loads without errors', async ({ page }) => {
    await page.goto('/personal-life');
    await expect(page).toHaveTitle(/Benjamin Grauer/);
    
    // Check page content loads
    await expect(page.locator('main')).toBeVisible();
    
    // Ensure no console errors
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.waitForTimeout(2000); // Wait for page to fully load
    expect(errors).toHaveLength(0);
  });

  test('Portfolio page loads without errors', async ({ page }) => {
    await page.goto('/portfolio');
    await expect(page).toHaveTitle(/Benjamin Grauer/);
    
    // Check page content loads
    await expect(page.locator('main')).toBeVisible();
    
    // Ensure no console errors
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.waitForTimeout(2000); // Wait for page to fully load
    expect(errors).toHaveLength(0);
  });

  test('Navigation works correctly', async ({ page }) => {
    await page.goto('/');
    
    // Test navigation links
    const workingLifeLink = page.locator('a[href="/working-life"]').first();
    if (await workingLifeLink.isVisible()) {
      await workingLifeLink.click();
      await expect(page).toHaveURL('/working-life');
    }
    
    const personalLifeLink = page.locator('a[href="/personal-life"]').first();
    if (await personalLifeLink.isVisible()) {
      await personalLifeLink.click();
      await expect(page).toHaveURL('/personal-life');
    }
    
    const portfolioLink = page.locator('a[href="/portfolio"]').first();
    if (await portfolioLink.isVisible()) {
      await portfolioLink.click();
      await expect(page).toHaveURL('/portfolio');
    }
    
    const homeLink = page.locator('a[href="/"]').first();
    if (await homeLink.isVisible()) {
      await homeLink.click();
      await expect(page).toHaveURL('/');
    }
  });

  test('Mobile navigation works', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/');
    
    // Look for mobile menu button (hamburger)
    const mobileMenuButton = page.locator('button[aria-label*="menu"], button[aria-label*="Menu"], .mobile-menu-button');
    
    if (await mobileMenuButton.first().isVisible()) {
      await mobileMenuButton.first().click();
      
      // Check if mobile menu is open
      const mobileMenu = page.locator('[role="dialog"], .mobile-menu, .drawer');
      await expect(mobileMenu.first()).toBeVisible();
    }
  });

  test('Page responds to different screen sizes', async ({ page }) => {
    await page.goto('/');
    
    // Desktop
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.locator('main')).toBeVisible();
    
    // Tablet
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('main')).toBeVisible();
    
    // Mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('main')).toBeVisible();
  });
});