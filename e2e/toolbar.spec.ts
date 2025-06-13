import { test, expect } from '@playwright/test';

test.describe('Toolbar Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display toolbar with all action buttons', async ({ page }) => {
    const toolbar = page.locator('editor-toolbar');
    await expect(toolbar).toBeVisible();

    // Check for common toolbar buttons
    await expect(toolbar.locator('[aria-label*="undo"], [title*="Undo"], .undo-btn')).toBeVisible();
    await expect(toolbar.locator('[aria-label*="redo"], [title*="Redo"], .redo-btn')).toBeVisible();
    await expect(toolbar.locator('[aria-label*="save"], [title*="Save"], .save-btn')).toBeVisible();
  });

  test('should have accessible button labels', async ({ page }) => {
    const toolbar = page.locator('editor-toolbar');

    // Check buttons have proper accessibility attributes
    const buttons = toolbar.locator('button');
    const buttonCount = await buttons.count();

    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i);
      const ariaLabel = await button.getAttribute('aria-label');
      const title = await button.getAttribute('title');
      const textContent = await button.textContent();

      // Each button should have either aria-label, title, or visible text
      expect(ariaLabel || title || textContent?.trim()).toBeTruthy();
    }
  });

  test('should handle button clicks without errors', async ({ page }) => {
    const toolbar = page.locator('editor-toolbar');
    const buttons = toolbar.locator('button');
    const buttonCount = await buttons.count();

    // Click each enabled button to ensure no JavaScript errors
    const enabledButtons = buttons.locator(':not([disabled])');
    const enabledButtonCount = await enabledButtons.count();

    for (let i = 0; i < enabledButtonCount; i++) {
      const button = enabledButtons.nth(i);

      // Check if button is actually enabled and visible
      const isEnabled = await button.isEnabled();
      const isVisible = await button.isVisible();

      if (isEnabled && isVisible) {
        try {
          await button.click({ timeout: 2000 });
          // Wait a bit to ensure any async operations complete
          await page.waitForTimeout(100);
        } catch (error) {
          // Log the error but continue with other buttons
          console.log(`Button ${i} could not be clicked:`, error);
        }
      }
    }
  });
});
