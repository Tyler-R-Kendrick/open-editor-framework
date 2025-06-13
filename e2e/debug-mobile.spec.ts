import { test, expect } from '@playwright/test';
import { ensureComponentVisibleByName } from './utils/test-helpers';

test.describe('Debug Mobile Layout', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.setViewportSize({ width: 375, height: 667 }); // Mobile size
  });

  test('debug mobile tab switching and visibility', async ({ page }) => {
    // Wait for app to load
    await expect(page.locator('editor-app')).toBeVisible();

    console.log('=== Initial state ===');

    // Check initial state
    const paletteVisible = await page.locator('component-palette').isVisible();
    const canvasVisible = await page.locator('editor-canvas').isVisible();
    const controlsVisible = await page.locator('control-panel').isVisible();

    console.log(`Initial visibility - Palette: ${paletteVisible}, Canvas: ${canvasVisible}, Controls: ${controlsVisible}`);

    // Check mobile tabs
    const mobileTabs = page.locator('.mobile-tab');
    const tabCount = await mobileTabs.count();
    console.log(`Mobile tabs found: ${tabCount}`);

    for (let i = 0; i < tabCount; i++) {
      const tab = mobileTabs.nth(i);
      const text = await tab.textContent();
      const isActive = await tab.evaluate(el => el.classList.contains('active'));
      console.log(`Tab ${i}: "${text}" - Active: ${isActive}`);
    }

    console.log('=== Switching to Components tab ===');

    // Try to switch to components tab
    const componentsTab = page.locator('.mobile-tab:has-text("Components")');
    if (await componentsTab.count() > 0) {
      await componentsTab.click();
      await page.waitForTimeout(1000);

      // Check visibility after switch
      const paletteVisible2 = await page.locator('component-palette').isVisible();
      const canvasVisible2 = await page.locator('editor-canvas').isVisible();
      const controlsVisible2 = await page.locator('control-panel').isVisible();

      console.log(`After Components click - Palette: ${paletteVisible2}, Canvas: ${canvasVisible2}, Controls: ${controlsVisible2}`);

      // Check if draggable items are visible
      const draggableItems = page.locator('component-palette [draggable="true"], component-palette .component-card');
      const itemCount = await draggableItems.count();
      console.log(`Draggable items found: ${itemCount}`);

      if (itemCount > 0) {
        const firstItem = draggableItems.first();
        const itemVisible = await firstItem.isVisible();
        const itemBox = await firstItem.boundingBox();
        console.log(`First draggable item visible: ${itemVisible}, boundingBox: ${JSON.stringify(itemBox)}`);
      }
    }

    console.log('=== Switching to Canvas tab ===');

    // Now switch to canvas tab
    const canvasTab = page.locator('.mobile-tab:has-text("Canvas")');
    if (await canvasTab.count() > 0) {
      await canvasTab.click();
      await page.waitForTimeout(1000);

      const paletteVisible3 = await page.locator('component-palette').isVisible();
      const canvasVisible3 = await page.locator('editor-canvas').isVisible();
      const controlsVisible3 = await page.locator('control-panel').isVisible();

      console.log(`After Canvas click - Palette: ${paletteVisible3}, Canvas: ${canvasVisible3}, Controls: ${controlsVisible3}`);
    }

    console.log('=== Testing ensureComponentVisibleByName ===');

    // Test our helper function
    try {
      await ensureComponentVisibleByName(page, 'component-palette');
      const paletteVisible4 = await page.locator('component-palette').isVisible();
      console.log(`After ensureComponentVisibleByName(component-palette): ${paletteVisible4}`);

      const draggableItems2 = page.locator('component-palette [draggable="true"], component-palette .component-card');
      const itemCount2 = await draggableItems2.count();
      console.log(`Draggable items after helper: ${itemCount2}`);

      if (itemCount2 > 0) {
        const firstItem2 = draggableItems2.first();
        const itemVisible2 = await firstItem2.isVisible();
        console.log(`First draggable item visible after helper: ${itemVisible2}`);
      }
    } catch (error) {
      console.log(`ensureComponentVisibleByName failed: ${error}`);
    }
  });
});
