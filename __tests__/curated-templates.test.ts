import { promises as fs } from 'fs';

interface CuratedTemplate {
  id: string;
  name: string;
  icon: string;
  description: string;
  category: string;
  template: {
    type: string;
    defaultSize: { width: number; height: number };
    properties: Record<string, unknown>;
  };
}

interface CuratedTemplatesData {
  templates: CuratedTemplate[];
  categories: string[];
}

async function loadJson(path: string): Promise<CuratedTemplatesData> {
  return JSON.parse(await fs.readFile(path, 'utf-8'));
}

describe('curated component templates fixtures', () => {
  it('serves identical content from public/assets and samples', async () => {
    const [publicRaw, samplesRaw] = await Promise.all([
      fs.readFile('public/assets/curated-component-templates.json', 'utf-8'),
      fs.readFile('samples/curated-component-templates.json', 'utf-8')
    ]);
    expect(publicRaw).toBe(samplesRaw);
  });

  describe.each([
    ['public/assets/curated-component-templates.json'],
    ['samples/curated-component-templates.json']
  ])('%s', (path) => {
    it('parses as valid JSON with templates and categories arrays', async () => {
      const data = await loadJson(path);
      expect(Array.isArray(data.templates)).toBe(true);
      expect(data.templates.length).toBeGreaterThan(0);
      expect(Array.isArray(data.categories)).toBe(true);
      expect(data.categories).toContain('All');
    });

    it('gives every template a unique, non-empty id', async () => {
      const data = await loadJson(path);
      const ids = data.templates.map((t) => t.id);
      expect(ids.every((id) => typeof id === 'string' && id.length > 0)).toBe(
        true
      );
      expect(new Set(ids).size).toBe(ids.length);
    });

    it('requires name, icon, description, and category on every template', async () => {
      const data = await loadJson(path);
      for (const template of data.templates) {
        expect(typeof template.name).toBe('string');
        expect(template.name.length).toBeGreaterThan(0);
        expect(typeof template.icon).toBe('string');
        expect(typeof template.description).toBe('string');
        expect(template.description.length).toBeGreaterThan(0);
        expect(typeof template.category).toBe('string');
      }
    });

    it('references only categories declared in the categories array', async () => {
      const data = await loadJson(path);
      for (const template of data.templates) {
        expect(data.categories).toContain(template.category);
      }
    });

    it('gives every template a positive default size', async () => {
      const data = await loadJson(path);
      for (const template of data.templates) {
        expect(template.template.defaultSize.width).toBeGreaterThan(0);
        expect(template.template.defaultSize.height).toBeGreaterThan(0);
      }
    });

    it('gives every template a known component type and non-empty properties', async () => {
      const data = await loadJson(path);
      for (const template of data.templates) {
        expect(['text', 'button', 'container']).toContain(
          template.template.type
        );
        expect(typeof template.template.properties).toBe('object');
        expect(template.template.properties).not.toBeNull();
      }
    });

    it('includes the curated set expected by the E3 experiment', async () => {
      const data = await loadJson(path);
      const ids = data.templates.map((t) => t.id);
      expect(ids).toEqual(
        expect.arrayContaining(['label', 'button', 'container', 'heading', 'card'])
      );
    });
  });
});