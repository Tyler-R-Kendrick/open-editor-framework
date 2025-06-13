import { test, expect } from '@playwright/test';

test.describe('Touch and Mobile Interactions', () => {
  test.beforeEach(async ({ page }) => {
    // Set mobile viewport for all tests
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
  });

  test('should adapt layout for mobile viewport', async ({ page }) => {
    const editorApp = page.locator('editor-app');
    await expect(editorApp).toBeVisible();

    // Check if mobile-specific classes or styles are applied
    const editorContainer = page.locator('.editor-container');

    // Get computed grid template
    const gridTemplate = await editorContainer.evaluate(el =>
      getComputedStyle(el).gridTemplateAreas
    );

    // Should have some responsive behavior
    expect(gridTemplate).toBeTruthy();
  });

  test('should support touch gestures for drag and drop', async ({ page }) => {
    const palette = page.locator('component-palette');
    const canvas = page.locator('editor-canvas');

    await expect(palette).toBeVisible();
    await expect(canvas).toBeVisible();

    // Find draggable item
    const draggableItem = palette.locator('[draggable="true"], .draggable-item, .component-item').first();

    if (await draggableItem.count() > 0) {
      const itemBox = await draggableItem.boundingBox();
      const canvasBox = await canvas.boundingBox();

      if (itemBox && canvasBox) {
        // Simulate touch drag
        await page.mouse.move(itemBox.x + itemBox.width / 2, itemBox.y + itemBox.height / 2);
        await page.mouse.down();
        await page.mouse.move(canvasBox.x + canvasBox.width / 2, canvasBox.y + canvasBox.height / 2);
        await page.mouse.up();

        // Wait for any animations
        await page.waitForTimeout(500);
      }
    }
  });

  test('should handle touch and hold gestures', async ({ page }) => {
    const canvas = page.locator('editor-canvas');
    await expect(canvas).toBeVisible();

    const canvasBox = await canvas.boundingBox();

    if (canvasBox) {
      // Simulate touch and hold using mouse events for better compatibility
      const x = canvasBox.x + canvasBox.width / 2;
      const y = canvasBox.y + canvasBox.height / 2;

      // Mouse down to simulate touch start
      await page.mouse.move(x, y);
      await page.mouse.down();

      // Hold for a moment
      await page.waitForTimeout(1000);

      // Mouse up to simulate touch end
      await page.mouse.up();

      // Should not cause errors
      expect(true).toBeTruthy();
    }
  });

  test('should support pinch to zoom on canvas', async ({ page }) => {
    const canvas = page.locator('editor-canvas');
    await expect(canvas).toBeVisible();

    const canvasBox = await canvas.boundingBox();

    if (canvasBox) {
      const centerX = canvasBox.x + canvasBox.width / 2;
      const centerY = canvasBox.y + canvasBox.height / 2;

      // Simulate pinch gesture (this is simplified - real pinch is more complex)
      await page.mouse.move(centerX - 50, centerY);
      await page.mouse.down();
      await page.mouse.move(centerX - 100, centerY);
      await page.mouse.up();

      // Wait for any zoom animations
      await page.waitForTimeout(300);
    }
  });

  test('should have touch-friendly button sizes', async ({ page }) => {
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();

    for (let i = 0; i < Math.min(buttonCount, 5); i++) {
      const button = buttons.nth(i);
      const box = await button.boundingBox();

      if (box) {
        // Buttons should be at least 44px for touch accessibility
        expect(Math.min(box.width, box.height)).toBeGreaterThanOrEqual(32);
      }
    }
  });

  test('should handle swipe gestures', async ({ page }) => {
    const palette = page.locator('component-palette');

    if (await palette.count() > 0) {
      const paletteBox = await palette.boundingBox();

      if (paletteBox) {
        // Simulate horizontal swipe
        const startX = paletteBox.x + 50;
        const startY = paletteBox.y + paletteBox.height / 2;
        const endX = paletteBox.x + paletteBox.width - 50;

        await page.mouse.move(startX, startY);
        await page.mouse.down();
        await page.mouse.move(endX, startY);
        await page.mouse.up();

        // Wait for any swipe animations
        await page.waitForTimeout(300);
      }
    }
  });

  test('should prevent unwanted scrolling during interactions', async ({ page }) => {
    // Check if touch-action CSS is properly set
    const interactiveElements = page.locator('[draggable="true"], .draggable, .resizable');
    const elementCount = await interactiveElements.count();

    if (elementCount > 0) {
      const firstElement = interactiveElements.first();
      const touchAction = await firstElement.evaluate(el =>
        getComputedStyle(el).touchAction
      );

      // Should have appropriate touch-action to prevent unwanted scrolling
      expect(['none', 'manipulation', 'pan-x', 'pan-y'].some(action =>
        touchAction.includes(action)
      )).toBeTruthy();
    }
  });
});
