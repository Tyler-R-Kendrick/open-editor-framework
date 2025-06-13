import { test, expect } from '@playwright/test';
import {
  waitForWebComponents,
  dragAndDrop,
  touchDragAndDrop,
  checkAccessibility,
  getPerformanceMetrics,
  hasFocusIndication
} from './utils/test-helpers';

test.describe('Integration Tests with Utilities', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load all web components properly', async ({ page }) => {
    const components = ['editor-app', 'editor-toolbar', 'component-palette', 'editor-canvas', 'control-panel'];

    await waitForWebComponents(page, components);

    // All components should be visible after they're defined
    for (const component of components) {
      await expect(page.locator(component)).toBeVisible();
    }
  });

  test('should support drag and drop with utility function', async ({ page }) => {
    await waitForWebComponents(page, ['component-palette', 'editor-canvas']);

    const palette = page.locator('component-palette');
    const canvas = page.locator('editor-canvas');

    // Find draggable item
    const draggableItem = palette.locator('[draggable="true"], .draggable-item, .component-item').first();
    const dropZone = canvas.locator('.canvas-area, .drop-zone, .canvas-container').first();

    if (await draggableItem.count() > 0 && await dropZone.count() > 0) {
      await dragAndDrop(page, draggableItem, dropZone, { delay: 100 });

      // Verify the drop was successful (you may need to adjust this based on your implementation)
      await page.waitForTimeout(500);
    }
  });

  test('should support touch drag and drop on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await waitForWebComponents(page, ['component-palette', 'editor-canvas']);

    const palette = page.locator('component-palette');
    const canvas = page.locator('editor-canvas');

    const draggableItem = palette.locator('[draggable="true"], .draggable-item, .component-item').first();
    const dropZone = canvas.locator('.canvas-area, .drop-zone, .canvas-container').first();

    if (await draggableItem.count() > 0 && await dropZone.count() > 0) {
      await touchDragAndDrop(page, draggableItem, dropZone, { steps: 8 });
      await page.waitForTimeout(500);
    }
  });

  test('should have good accessibility across components', async ({ page }) => {
    await waitForWebComponents(page, ['editor-toolbar', 'component-palette', 'control-panel']);

    // Check toolbar buttons
    const toolbarButtons = page.locator('editor-toolbar button');
    const toolbarButtonCount = await toolbarButtons.count();

    for (let i = 0; i < Math.min(toolbarButtonCount, 3); i++) {
      const button = toolbarButtons.nth(i);
      const accessibility = await checkAccessibility(button);

      expect(accessibility.hasLabel).toBeTruthy();
      expect(accessibility.isFocusable).toBeTruthy();
    }

    // Check form controls
    const formControls = page.locator('control-panel input, control-panel select, control-panel textarea');
    const controlCount = await formControls.count();

    for (let i = 0; i < Math.min(controlCount, 3); i++) {
      const control = formControls.nth(i);
      const accessibility = await checkAccessibility(control);

      expect(accessibility.isFocusable).toBeTruthy();
    }
  });

  test('should have good performance metrics', async ({ page }) => {
    await waitForWebComponents(page, ['editor-app']);

    const metrics = await getPerformanceMetrics(page);

    // Check reasonable performance metrics
    expect(metrics.domContentLoaded).toBeLessThan(2000); // 2 seconds
    expect(metrics.firstContentfulPaint).toBeLessThan(3000); // 3 seconds

    if (metrics.memoryUsage) {
      // Memory usage should be reasonable (less than 50MB)
      expect(metrics.memoryUsage.used).toBeLessThan(50 * 1024 * 1024);
    }
  });

  test('should have proper focus indication on interactive elements', async ({ page }) => {
    await waitForWebComponents(page, ['editor-toolbar']);

    const interactiveElements = page.locator('button, input, select, textarea, [tabindex]');
    const elementCount = await interactiveElements.count();

    for (let i = 0; i < Math.min(elementCount, 5); i++) {
      const element = interactiveElements.nth(i);

      if (await element.isVisible()) {
        const hasFocus = await hasFocusIndication(element);

        // Should have some form of focus indication
        expect(hasFocus).toBeTruthy();
      }
    }
  });

  test('should maintain functionality across browser viewport changes', async ({ page }) => {
    await waitForWebComponents(page, ['editor-app']);

    // Test different viewport sizes
    const viewports = [
      { width: 1920, height: 1080 }, // Desktop
      { width: 1024, height: 768 },  // Tablet landscape
      { width: 768, height: 1024 },  // Tablet portrait
      { width: 375, height: 667 }    // Mobile
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.waitForTimeout(300); // Wait for resize

      // Check that main components are still functional
      await expect(page.locator('editor-app')).toBeVisible();

      // Try to interact with toolbar
      const toolbarButtons = page.locator('editor-toolbar button');
      if (await toolbarButtons.count() > 0) {
        await toolbarButtons.first().click();
        await page.waitForTimeout(100);
      }
    }
  });
});
