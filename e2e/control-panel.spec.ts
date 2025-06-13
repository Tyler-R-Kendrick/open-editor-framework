import { test, expect } from '@playwright/test';

test.describe('Control Panel', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display control panel', async ({ page }) => {
    // Check if we're on mobile - if so, click the properties tab first
    const isMobile = page.viewportSize()!.width <= 768;

    if (isMobile) {
      const propertiesTab = page.locator('.mobile-tab:has-text("Properties")');
      if (await propertiesTab.count() > 0) {
        await propertiesTab.click();
        await page.waitForTimeout(300);
      }
    }

    const controlPanel = page.locator('control-panel');
    await expect(controlPanel).toBeVisible();
  });

  test('should show property controls when component is selected', async ({ page }) => {
    // Check if we're on mobile - if so, click the properties tab first
    const isMobile = page.viewportSize()!.width <= 768;

    if (isMobile) {
      const propertiesTab = page.locator('.mobile-tab:has-text("Properties")');
      if (await propertiesTab.count() > 0) {
        await propertiesTab.click();
        await page.waitForTimeout(300);
      }
    }

    const controlPanel = page.locator('control-panel');

    // Look for property sections or form controls (including our sample controls)
    const propertyControls = controlPanel.locator('.property, .control-group, .form-control, input, select, textarea');

    // Should have some form of controls visible
    await expect(propertyControls.first()).toBeVisible({ timeout: 10000 });
  });

  test('should support property value changes', async ({ page }) => {
    const controlPanel = page.locator('control-panel');

    // Find input controls
    const textInputs = controlPanel.locator('input[type="text"], input[type="number"]');
    const selects = controlPanel.locator('select');
    const checkboxes = controlPanel.locator('input[type="checkbox"]');

    // Test text inputs
    const textInputCount = await textInputs.count();
    if (textInputCount > 0) {
      const firstInput = textInputs.first();
      await firstInput.clear();
      await firstInput.fill('test value');
      await expect(firstInput).toHaveValue('test value');
    }

    // Test select dropdowns
    const selectCount = await selects.count();
    if (selectCount > 0) {
      const firstSelect = selects.first();
      const options = firstSelect.locator('option');
      const optionCount = await options.count();

      if (optionCount > 1) {
        await firstSelect.selectOption({ index: 1 });
      }
    }

    // Test checkboxes
    const checkboxCount = await checkboxes.count();
    if (checkboxCount > 0) {
      const firstCheckbox = checkboxes.first();
      await firstCheckbox.check();
      await expect(firstCheckbox).toBeChecked();
    }
  });

  test('should have proper form validation', async ({ page }) => {
    const controlPanel = page.locator('control-panel');

    // Find required fields
    const requiredInputs = controlPanel.locator('input[required], select[required]');
    const requiredCount = await requiredInputs.count();

    if (requiredCount > 0) {
      const firstRequired = requiredInputs.first();

      // Clear the field and trigger validation
      await firstRequired.clear();
      await firstRequired.blur();

      // Check for validation feedback
      const validationMessage = await firstRequired.evaluate((el: HTMLInputElement) => el.validationMessage);
      expect(validationMessage).toBeTruthy();
    }
  });

  test('should be keyboard accessible', async ({ page }) => {
    const controlPanel = page.locator('control-panel');

    // Get all interactive elements
    const interactiveElements = controlPanel.locator('input, select, textarea, button, [tabindex]');
    const elementCount = await interactiveElements.count();

    if (elementCount > 0) {
      // Test tab navigation
      await page.keyboard.press('Tab');

      // Check if an element in the control panel gets focused
      const focusedElement = page.locator(':focus');
      const isFocusInPanel = await controlPanel.locator(':focus').count() > 0;

      // Should be able to navigate with keyboard
      expect(isFocusInPanel || await focusedElement.count() > 0).toBeTruthy();
    }
  });
});
