import { promises as fs } from 'fs';

it('loads default component templates sample', async () => {
  const data = JSON.parse(
    await fs.readFile('samples/default-component-templates.json', 'utf-8')
  );
  expect(Array.isArray(data.templates)).toBe(true);
  expect(data.templates.length).toBeGreaterThan(0);
  expect(Array.isArray(data.categories)).toBe(true);
});

it('exports default renderers map', async () => {
  const { defaultRenderers } = await import('../samples/default-renderers.js');
  expect(defaultRenderers).toBeDefined();
  expect(typeof defaultRenderers.text).toBe('function');
});
