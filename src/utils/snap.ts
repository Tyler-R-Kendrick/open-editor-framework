import type { Bounds } from '../types/editor-types';
import type { AlignmentVariant } from '../analytics/featureFlags';

export const SNAP_GRID_SIZE = 8;

export interface AlignmentGuide {
  orientation: 'horizontal' | 'vertical';
  position: number;
}

export interface SnapOptions {
  mode?: AlignmentVariant;
  threshold?: number;
  gridSize?: number;
}

function snapToGrid(value: number, gridSize: number): number {
  return Math.round(value / gridSize) * gridSize;
}

function collectEdges(bounds: Bounds): {
  vertical: number[];
  horizontal: number[];
} {
  return {
    vertical: [bounds.x, bounds.x + bounds.width / 2, bounds.x + bounds.width],
    horizontal: [
      bounds.y,
      bounds.y + bounds.height / 2,
      bounds.y + bounds.height
    ]
  };
}

export function computeAlignmentGuides(
  moving: Bounds,
  siblings: Bounds[],
  options: SnapOptions = {}
): AlignmentGuide[] {
  const mode = options.mode ?? 'guides';
  if (mode === 'control') return [];

  const threshold = options.threshold ?? 6;
  const movingEdges = collectEdges(moving);
  const guides: AlignmentGuide[] = [];
  const seen = new Set<string>();

  for (const sibling of siblings) {
    const siblingEdges = collectEdges(sibling);
    for (const m of movingEdges.vertical) {
      for (const s of siblingEdges.vertical) {
        if (Math.abs(m - s) <= threshold) {
          const key = `v:${s}`;
          if (!seen.has(key)) {
            seen.add(key);
            guides.push({ orientation: 'vertical', position: s });
          }
        }
      }
    }
    for (const m of movingEdges.horizontal) {
      for (const s of siblingEdges.horizontal) {
        if (Math.abs(m - s) <= threshold) {
          const key = `h:${s}`;
          if (!seen.has(key)) {
            seen.add(key);
            guides.push({ orientation: 'horizontal', position: s });
          }
        }
      }
    }
  }

  return guides;
}

export function snapBounds(
  moving: Bounds,
  siblings: Bounds[],
  options: SnapOptions = {}
): Bounds {
  const mode = options.mode ?? 'control';
  // Guides-only mode draws guides but leaves the position unchanged.
  if (mode !== 'guides-snap') return { ...moving };

  let { x, y } = moving;
  const threshold = options.threshold ?? 6;
  const gridSize = options.gridSize ?? SNAP_GRID_SIZE;

  const movingEdges = collectEdges(moving);
  let bestDx = Number.POSITIVE_INFINITY;
  let bestDy = Number.POSITIVE_INFINITY;
  let snapX: number | null = null;
  let snapY: number | null = null;

  for (const sibling of siblings) {
    const siblingEdges = collectEdges(sibling);
    for (const m of movingEdges.vertical) {
      for (const s of siblingEdges.vertical) {
        const dx = s - m;
        if (Math.abs(dx) <= threshold && Math.abs(dx) < Math.abs(bestDx)) {
          bestDx = dx;
          snapX = moving.x + dx;
        }
      }
    }
    for (const m of movingEdges.horizontal) {
      for (const s of siblingEdges.horizontal) {
        const dy = s - m;
        if (Math.abs(dy) <= threshold && Math.abs(dy) < Math.abs(bestDy)) {
          bestDy = dy;
          snapY = moving.y + dy;
        }
      }
    }
  }

  if (snapX !== null) x = snapX;
  if (snapY !== null) y = snapY;

  const movedX = x !== moving.x;
  const movedY = y !== moving.y;
  if (!movedX) x = snapToGrid(x, gridSize);
  if (!movedY) y = snapToGrid(y, gridSize);

  return { ...moving, x, y };
}
