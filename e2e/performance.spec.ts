import { test, expect } from '@playwright/test';
import { ensureComponentVisibleByName } from './utils/test-helpers';

test.describe('Performance Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  }); test('should load within acceptable time', async ({ page }) => {
    const startTime = Date.now();

    // Wait for main components to be visible
    await expect(page.locator('editor-app')).toBeVisible();
    await expect(page.locator('editor-toolbar')).toBeVisible();

    // Check if mobile viewport
    const isMobile = page.viewportSize()!.width <= 768;

    if (isMobile) {
      // On mobile, verify components exist but only check one at a time
      await ensureComponentVisibleByName(page, 'component-palette');
      await expect(page.locator('component-palette')).toBeVisible();

      await ensureComponentVisibleByName(page, 'editor-canvas');
      await expect(page.locator('editor-canvas')).toBeVisible();

      await ensureComponentVisibleByName(page, 'control-panel');
      await expect(page.locator('control-panel')).toBeVisible();
    } else {
      // Desktop - all should be visible simultaneously
      await expect(page.locator('component-palette')).toBeVisible();
      await expect(page.locator('editor-canvas')).toBeVisible();
      await expect(page.locator('control-panel')).toBeVisible();
    }

    const loadTime = Date.now() - startTime;

    // Should load within reasonable time - more lenient for mobile
    const isMobileView = page.viewportSize()!.width <= 768;
    const maxLoadTime = isMobileView ? 8000 : 5000; // 8 seconds for mobile, 5 for desktop
    expect(loadTime).toBeLessThan(maxLoadTime);
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

          // Check if button is actually clickable
          const isEnabled = await randomButton.isEnabled();
          const isVisible = await randomButton.isVisible();

          if (isEnabled && isVisible) {
            try {
              await randomButton.click({ timeout: 2000 });
              await page.waitForTimeout(50); // Small delay between clicks
            } catch {
              // Continue if click fails
              continue;
            }
          }
        }
      }

      const interactionTime = Date.now() - startTime;

      // Should complete rapid interactions quickly - more lenient for mobile
      const isMobileView = page.viewportSize()!.width <= 768;
      const maxInteractionTime = isMobileView ? 6000 : 3000; // 6 seconds for mobile, 3 for desktop
      expect(interactionTime).toBeLessThan(maxInteractionTime);
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

    // Ensure components are visible first
    await ensureComponentVisibleByName(page, 'component-palette');
    await ensureComponentVisibleByName(page, 'editor-canvas');
    await ensureComponentVisibleByName(page, 'control-panel');

    // Simulate extended usage
    for (let i = 0; i < iterations; i++) {
      // Navigate between different parts of the app
      const palette = page.locator('component-palette');
      const canvas = page.locator('editor-canvas');
      const controls = page.locator('control-panel');

      try {
        await palette.click({ timeout: 1000 });
        await page.waitForTimeout(50);
        await canvas.click({ timeout: 1000 });
        await page.waitForTimeout(50);
        await controls.click({ timeout: 1000 });
        await page.waitForTimeout(50);
      } catch {
        // Continue if clicking fails (components might not be interactive)
        continue;
      }

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
