import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('renders toolbar', async ({ page }) => {
  await expect(page.getByRole('toolbar')).toBeVisible();
});

test('renders component palette', async ({ page }) => {
  await expect(page.getByLabel('Component Library')).toBeVisible();
});

test('renders design canvas', async ({ page }) => {
  await expect(page.getByLabel('Design Canvas')).toBeVisible();
});

test('renders properties panel', async ({ page }) => {
  await expect(page.getByLabel('Properties Panel')).toBeVisible();
});

test('can toggle theme', async ({ page }) => {
  const toggle = page.getByRole('button', { name: /dark/i });
  await toggle.click();
  await expect(page.getByRole('button', { name: /light/i })).toBeVisible();
});
