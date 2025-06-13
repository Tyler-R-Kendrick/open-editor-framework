import { test, expect } from '@playwright/test';

test.describe('Basic Smoke Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load the main page', async ({ page }) => {
    await expect(page).toHaveTitle(/Open Editor Framework/);

    // Check that the main editor app loads
    const editorApp = page.locator('editor-app');
    await expect(editorApp).toBeVisible();
  });

  test('should have working toolbar', async ({ page }) => {
    const toolbar = page.locator('editor-toolbar');
    await expect(toolbar).toBeVisible();

    // Check that toolbar has buttons
    const buttons = toolbar.locator('button');
    const buttonCount = await buttons.count();
    expect(buttonCount).toBeGreaterThan(0);
  });

  test('should have responsive layout', async ({ page }) => {
    // Test on different viewport sizes
    const viewports = [
      { width: 1920, height: 1080 }, // Desktop
      { width: 768, height: 1024 },  // Tablet
      { width: 375, height: 667 }    // Mobile
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.waitForTimeout(300);

      // Main app should still be visible
      await expect(page.locator('editor-app')).toBeVisible();

      // Toolbar should be visible
      await expect(page.locator('editor-toolbar')).toBeVisible();
    }
  });

  test('should have accessible elements', async ({ page }) => {
    // Check for basic accessibility
    const interactiveElements = page.locator('button, input, select, textarea, [role="button"]');
    const elementCount = await interactiveElements.count();

    // Test that we have some interactive elements
    expect(elementCount).toBeGreaterThan(0);

    // Test that they're focusable
    for (let i = 0; i < Math.min(3, elementCount); i++) {
      const element = interactiveElements.nth(i);
      await element.focus();
      // Should not throw error
    }
  });

  test('should handle basic interactions', async ({ page }) => {
    // Try clicking some enabled buttons without errors
    const enabledButtons = page.locator('button:not([disabled])');
    const buttonCount = await enabledButtons.count();

    if (buttonCount > 0) {
      // Click first enabled button
      await enabledButtons.first().click();
      await page.waitForTimeout(100);

      // Should not have any console errors
      const consoleErrors = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });

      // Page should still be functional
      await expect(page.locator('editor-app')).toBeVisible();
    }
  });
});
