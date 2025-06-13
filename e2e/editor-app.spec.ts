import { test, expect } from '@playwright/test';

test.describe('Editor App - Basic Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load the editor app', async ({ page }) => {
    // Check if the editor app component is present
    await expect(page.locator('editor-app')).toBeVisible();
  });

  test('should display all main editor components', async ({ page }) => {
    // Check for main components
    await expect(page.locator('editor-toolbar')).toBeVisible();
    await expect(page.locator('component-palette')).toBeVisible();
    await expect(page.locator('editor-canvas')).toBeVisible();
    await expect(page.locator('control-panel')).toBeVisible();
  });

  test('should have correct layout structure', async ({ page }) => {
    const editorContainer = page.locator('.editor-container');
    await expect(editorContainer).toBeVisible();

    // Check grid areas are properly set
    const toolbar = page.locator('.toolbar-area');
    const palette = page.locator('.palette-area');
    const canvas = page.locator('.canvas-area');
    const controls = page.locator('.controls-area');

    await expect(toolbar).toBeVisible();
    await expect(palette).toBeVisible();
    await expect(canvas).toBeVisible();
    await expect(controls).toBeVisible();
  });

  test('should be responsive on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Check if the app adapts to mobile
    await expect(page.locator('editor-app')).toBeVisible();

    // On mobile, layout should stack vertically or hide some panels
    const editorContainer = page.locator('.editor-container');
    await expect(editorContainer).toBeVisible();
  });
});
