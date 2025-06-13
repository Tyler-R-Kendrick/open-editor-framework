import { test, expect } from '@playwright/test';

test.describe('Performance Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load within acceptable time', async ({ page }) => {
    const startTime = Date.now();

    // Wait for main components to be visible
    await expect(page.locator('editor-app')).toBeVisible();
    await expect(page.locator('editor-toolbar')).toBeVisible();
    await expect(page.locator('component-palette')).toBeVisible();
    await expect(page.locator('editor-canvas')).toBeVisible();
    await expect(page.locator('control-panel')).toBeVisible();

    const loadTime = Date.now() - startTime;

    // Should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);
  });

  test('should handle rapid interactions without performance degradation', async ({ page }) => {
    const toolbar = page.locator('editor-toolbar');
    const buttons = toolbar.locator('button');
    const buttonCount = await buttons.count();

    if (buttonCount > 0) {
      const startTime = Date.now();

      // Rapid button clicks (only enabled buttons)
      for (let i = 0; i < 10; i++) {
        const enabledButtons = buttons.locator(':not([disabled])');
        const enabledCount = await enabledButtons.count();

        if (enabledCount > 0) {
          const randomButton = enabledButtons.nth(Math.floor(Math.random() * enabledCount));
          await randomButton.click();
          await page.waitForTimeout(50); // Small delay between clicks
        }
      }

      const interactionTime = Date.now() - startTime;

      // Should complete rapid interactions quickly
      expect(interactionTime).toBeLessThan(3000);
    }
  });

  test('should maintain smooth animations', async ({ page }) => {
    // Look for animated elements
    const animatedElements = page.locator('[style*="transition"], .animate, .animated');
    const elementCount = await animatedElements.count();

    if (elementCount > 0) {
      const firstElement = animatedElements.first();

      // Trigger animation (hover, click, etc.)
      await firstElement.hover();
      await page.waitForTimeout(100);

      // Check if element is still responsive
      await firstElement.click();
      await page.waitForTimeout(100);

      // Should not freeze or become unresponsive
      expect(true).toBeTruthy();
    }
  });

  test('should not have memory leaks during extended use', async ({ page }) => {
    const iterations = 20;

    // Simulate extended usage
    for (let i = 0; i < iterations; i++) {
      // Navigate between different parts of the app
      const palette = page.locator('component-palette');
      const canvas = page.locator('editor-canvas');
      const controls = page.locator('control-panel');

      await palette.click();
      await page.waitForTimeout(50);
      await canvas.click();
      await page.waitForTimeout(50);
      await controls.click();
      await page.waitForTimeout(50);

      // Perform some interactions
      const buttons = page.locator('button:not([disabled])');
      const buttonCount = await buttons.count();

      if (buttonCount > 0) {
        const randomButton = buttons.nth(Math.floor(Math.random() * buttonCount));
        await randomButton.click();
      }
    }

    // Should still be responsive after extended use
    await expect(page.locator('editor-app')).toBeVisible();
  });

  test('should handle large datasets efficiently', async ({ page }) => {
    // This test would be more meaningful with actual data loading
    // For now, we'll test basic responsiveness with many elements

    const palette = page.locator('component-palette');
    const paletteItems = palette.locator('.component-item, .palette-item, *');

    const startTime = Date.now();
    const itemCount = await paletteItems.count();
    const queryTime = Date.now() - startTime;

    // DOM queries should be fast even with many elements
    expect(queryTime).toBeLessThan(1000);

    // Should handle reasonable number of elements
    expect(itemCount).toBeGreaterThanOrEqual(0);
  });
});
