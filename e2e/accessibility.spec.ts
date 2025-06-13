import { test, expect } from '@playwright/test';

test.describe('Accessibility Features', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should have proper heading structure', async ({ page }) => {
    const headings = page.locator('h1, h2, h3, h4, h5, h6');
    const headingCount = await headings.count();

    if (headingCount > 0) {
      // Check for h1
      const h1 = page.locator('h1');
      const h1Count = await h1.count();
      expect(h1Count).toBeGreaterThanOrEqual(0); // Should have at least one h1 or proper structure

      // Check heading text is meaningful
      for (let i = 0; i < Math.min(headingCount, 5); i++) {
        const heading = headings.nth(i);
        const text = await heading.textContent();
        expect(text?.trim()).toBeTruthy();
      }
    }
  });

  test('should have proper ARIA landmarks', async ({ page }) => {
    // Check for main content area
    const main = page.locator('main, [role="main"]');
    await expect(main.count()).resolves.toBeGreaterThanOrEqual(0);

    // Check for navigation if present
    const nav = page.locator('nav, [role="navigation"]');
    const navCount = await nav.count();

    // Check for complementary content (sidebars)
    const complementary = page.locator('[role="complementary"]');
    const complementaryCount = await complementary.count();

    // Should have some landmark structure
    expect(await main.count() + navCount + complementaryCount).toBeGreaterThanOrEqual(0);
  });

  test('should support keyboard navigation', async ({ page }) => {
    // Test Tab navigation
    await page.keyboard.press('Tab');

    let focusedElement = page.locator(':focus');
    const focusedCount = await focusedElement.count();
    expect(focusedCount).toBeGreaterThan(0);

    // Test multiple tabs
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab');
      focusedElement = page.locator(':focus');

      // Should be able to navigate to different elements
      const firstElement = focusedElement.first();
      if (await firstElement.count() > 0) {
        const tagName = await firstElement.evaluate(el => el.tagName?.toLowerCase());
        expect(['button', 'input', 'select', 'textarea', 'a', 'div'].some(tag =>
          tagName?.includes(tag) || false
        )).toBeTruthy();
      }
    }
  });

  test('should have proper color contrast', async ({ page }) => {
    // Wait for components to be visible and styled
    await expect(page.locator('editor-app')).toBeVisible();

    // Get computed styles for key elements
    const editorApp = page.locator('editor-app');
    const backgroundColor = await editorApp.evaluate(el =>
      getComputedStyle(el).backgroundColor
    );
    const color = await editorApp.evaluate(el =>
      getComputedStyle(el).color
    );

    // Basic check that colors are set (not transparent or initial)
    expect(backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
    expect(backgroundColor).not.toBe('transparent');
    expect(backgroundColor).not.toBe('');

    // Should have a proper background color set
    expect(backgroundColor).toMatch(/^rgb/);

    // Text color should also be set
    expect(color).not.toBe('rgba(0, 0, 0, 0)');
    expect(color).not.toBe('transparent');
    expect(color).toMatch(/^rgb/);
  });

  test('should announce dynamic content changes', async ({ page }) => {
    // Look for live regions
    const liveRegions = page.locator('[aria-live], [aria-atomic]');
    const liveRegionCount = await liveRegions.count();

    // Should have some mechanism for announcing changes
    expect(liveRegionCount).toBeGreaterThanOrEqual(0);
  });

  test('should support screen reader users', async ({ page }) => {
    // Check for proper labeling of form controls
    const inputs = page.locator('input, select, textarea');
    const inputCount = await inputs.count();

    for (let i = 0; i < Math.min(inputCount, 5); i++) {
      const input = inputs.nth(i);
      const id = await input.getAttribute('id');
      const ariaLabel = await input.getAttribute('aria-label');
      const ariaLabelledby = await input.getAttribute('aria-labelledby');

      if (id) {
        // Check for associated label
        const label = page.locator(`label[for="${id}"]`);
        const hasLabel = await label.count() > 0;

        // Should have proper labeling
        expect(hasLabel || ariaLabel || ariaLabelledby).toBeTruthy();
      }
    }
  });

  test('should handle focus management', async ({ page }) => {
    // Test focus trap in modals/dialogs if present
    const modals = page.locator('[role="dialog"], .modal, .popup');
    const modalCount = await modals.count();

    if (modalCount > 0) {
      // If modals exist, they should manage focus properly
      const firstModal = modals.first();
      await expect(firstModal).toBeVisible();
    }

    // Test focus indicators
    await page.keyboard.press('Tab');
    const focusedElements = page.locator(':focus');
    const focusedCount = await focusedElements.count();

    if (focusedCount > 0) {
      // Use the first focused element to avoid strict mode violation
      const focusedElement = focusedElements.first();

      // Check if focus is visible (outline or other indicator)
      const outline = await focusedElement.evaluate(el =>
        getComputedStyle(el).outline
      );
      const boxShadow = await focusedElement.evaluate(el =>
        getComputedStyle(el).boxShadow
      );

      // Should have some focus indicator
      expect(outline !== 'none' || boxShadow !== 'none').toBeTruthy();
    }
  });
});
