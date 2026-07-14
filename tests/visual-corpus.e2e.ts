import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const { compressToEncodedURIComponent } = require('lz-string') as {
  compressToEncodedURIComponent: (input: string) => string;
};

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const corpusDir = path.join(__dirname, 'visual-corpus');
const fixtures = fs
  .readdirSync(corpusDir)
  .filter((file) => file.endsWith('.json'));

for (const fixture of fixtures) {
  test(`visual corpus: ${fixture}`, async ({ page }) => {
    const raw = fs.readFileSync(path.join(corpusDir, fixture), 'utf8');
    const components = JSON.parse(raw);
    const encoded = compressToEncodedURIComponent(JSON.stringify(components));

    await page.goto(`/?state=${encoded}`);
    await expect(page.getByRole('application')).toBeVisible();
    await expect(
      page.locator('[data-testid^="draggable-component-"]').first()
    ).toBeVisible({
      timeout: 10000
    });
    await expect(page).toHaveScreenshot(`${fixture}.png`, {
      fullPage: true,
      maxDiffPixelRatio: 0.02
    });
  });
}
