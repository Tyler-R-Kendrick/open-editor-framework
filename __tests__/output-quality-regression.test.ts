import {
  validateComponentTree,
  meanAlignmentError
} from '../src/utils/outputQuality';
import { encodeComponents, decodeComponents } from '../src/utils/share';
import { snapBounds, SNAP_GRID_SIZE } from '../src/utils/snap';
import { BaseComponent } from '../src/types/component-base';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Offline regression suite for output-quality experiments (stateless checks).
 */
describe('output quality regression suite', () => {
  const fixturesDir = path.join(__dirname, '../tests/visual-corpus');

  it('validates every visual-corpus fixture as structurally sound', () => {
    const fixtures = fs
      .readdirSync(fixturesDir)
      .filter((file) => file.endsWith('.json'));
    expect(fixtures.length).toBeGreaterThan(0);

    for (const fixture of fixtures) {
      const components = JSON.parse(
        fs.readFileSync(path.join(fixturesDir, fixture), 'utf8')
      );
      const report = validateComponentTree(components);
      expect(report.valid).toBe(true);
      expect(decodeComponents(encodeComponents(components))).toEqual(components);
    }
  });

  it('keeps snap+validate pipeline deterministic for sibling layouts', () => {
    const a = {
      x: 3,
      y: 5,
      width: 80,
      height: 40
    };
    const b = {
      x: 100,
      y: 5,
      width: 80,
      height: 40
    };
    const snapped = snapBounds(a, [b], { mode: 'guides-snap' });
    expect(snapped.x % SNAP_GRID_SIZE).toBe(0);
    expect(snapped.y % SNAP_GRID_SIZE).toBe(0);

    const components = [
      new BaseComponent({
        id: 'a',
        type: 'text',
        name: 'A',
        bounds: snapped
      }),
      new BaseComponent({
        id: 'b',
        type: 'text',
        name: 'B',
        bounds: b
      })
    ];
    expect(validateComponentTree(components).valid).toBe(true);
    expect(meanAlignmentError(components)).toBeLessThanOrEqual(8);
  });
});
