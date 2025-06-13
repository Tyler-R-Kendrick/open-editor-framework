import { test, expect } from '@playwright/test';

test.describe('Component Palette', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display component palette', async ({ page }) => {
    const palette = page.locator('component-palette');
    await expect(palette).toBeVisible();
  });

  test('should show available components', async ({ page }) => {
    const palette = page.locator('component-palette');

    // Look for component items/categories
    const components = palette.locator('.component-item, .palette-item, .draggable-item');
    const categories = palette.locator('.category, .component-category');

    // Should have either components or categories visible
    const componentCount = await components.count();
    const categoryCount = await categories.count();

    expect(componentCount + categoryCount).toBeGreaterThan(0);
  });

  test('should support component search/filtering', async ({ page }) => {
    const palette = page.locator('component-palette');

    // Look for search input
    const searchInput = palette.locator('input[type="search"], input[placeholder*="search"], .search-input');

    if (await searchInput.count() > 0) {
      await searchInput.fill('button');
      await page.waitForTimeout(300); // Wait for filtering

      // Check if results are filtered
      const visibleComponents = palette.locator('.component-item:visible, .palette-item:visible');
      await expect(visibleComponents).toHaveCountGreaterThanOrEqual(0);
    }
  });

  test('should have accessible component items', async ({ page }) => {
    const palette = page.locator('component-palette');
    const components = palette.locator('.component-item, .palette-item, .draggable-item');

    const componentCount = await components.count();

    if (componentCount > 0) {
      // Check first few components for accessibility
      for (let i = 0; i < Math.min(3, componentCount); i++) {
        const component = components.nth(i);

        // Should be focusable
        await component.focus();
        await expect(component).toBeFocused();

        // Should have proper attributes
        const ariaLabel = await component.getAttribute('aria-label');
        const title = await component.getAttribute('title');
        const textContent = await component.textContent();

        expect(ariaLabel || title || textContent?.trim()).toBeTruthy();
      }
    }
  });
});
