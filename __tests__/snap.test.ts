import {
  SNAP_GRID_SIZE,
  computeAlignmentGuides,
  snapBounds
} from '../src/utils/snap';
import type { Bounds } from '../src/types/editor-types';

describe('snap utilities', () => {
  const moving: Bounds = { x: 53, y: 47, width: 100, height: 40 };

  it('uses an 8px grid', () => {
    expect(SNAP_GRID_SIZE).toBe(8);
  });

  it('snaps bounds to the grid when snap mode is enabled', () => {
    const snapped = snapBounds(moving, [], { mode: 'guides-snap' });
    expect(snapped.x % SNAP_GRID_SIZE).toBe(0);
    expect(snapped.y % SNAP_GRID_SIZE).toBe(0);
  });

  it('does not change position in control mode', () => {
    expect(snapBounds(moving, [], { mode: 'control' })).toEqual(moving);
  });

  it('snaps to sibling edges when within threshold', () => {
    const siblings: Bounds[] = [{ x: 200, y: 50, width: 80, height: 40 }];
    const near: Bounds = { x: 196, y: 48, width: 100, height: 40 };
    const snapped = snapBounds(near, siblings, {
      mode: 'guides-snap',
      threshold: 6
    });
    expect(snapped.x).toBe(200);
    expect(snapped.y).toBe(50);
  });

  it('computes alignment guide lines for nearby siblings', () => {
    const siblings: Bounds[] = [{ x: 200, y: 50, width: 80, height: 40 }];
    const near: Bounds = { x: 196, y: 48, width: 100, height: 40 };
    const guides = computeAlignmentGuides(near, siblings, { threshold: 6 });
    expect(
      guides.some((g) => g.orientation === 'vertical' && g.position === 200)
    ).toBe(true);
    expect(
      guides.some((g) => g.orientation === 'horizontal' && g.position === 50)
    ).toBe(true);
  });

  it('returns no guides in control mode', () => {
    const siblings: Bounds[] = [{ x: 200, y: 50, width: 80, height: 40 }];
    expect(
      computeAlignmentGuides(moving, siblings, {
        mode: 'control',
        threshold: 6
      })
    ).toEqual([]);
  });
});
