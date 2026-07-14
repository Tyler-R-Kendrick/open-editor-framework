import type { Bounds } from '../types/editor-types';
import type { BaseComponent } from '../types/component-base';

export interface StructuralIssue {
  code:
    | 'missing_id'
    | 'missing_bounds'
    | 'degenerate_bounds'
    | 'orphan_parent'
    | 'duplicate_id';
  componentId?: string;
  message: string;
}

export interface StructuralReport {
  valid: boolean;
  issues: StructuralIssue[];
  componentCount: number;
}

function hasValidBounds(bounds: unknown): bounds is Bounds {
  if (!bounds || typeof bounds !== 'object') return false;
  const b = bounds as Bounds;
  return (
    typeof b.x === 'number' &&
    typeof b.y === 'number' &&
    typeof b.width === 'number' &&
    typeof b.height === 'number' &&
    Number.isFinite(b.x) &&
    Number.isFinite(b.y) &&
    Number.isFinite(b.width) &&
    Number.isFinite(b.height)
  );
}

/**
 * Validates structural correctness of an editor component tree.
 * Stateless: pure function of the input tree with no side effects.
 */
export function validateComponentTree(
  components: unknown
): StructuralReport {
  const issues: StructuralIssue[] = [];
  if (!Array.isArray(components)) {
    return {
      valid: false,
      issues: [
        {
          code: 'missing_id',
          message: 'Component tree must be an array'
        }
      ],
      componentCount: 0
    };
  }

  const ids = new Set<string>();
  for (const raw of components) {
    const component = raw as Partial<BaseComponent>;
    if (!component?.id || typeof component.id !== 'string') {
      issues.push({
        code: 'missing_id',
        message: 'Component is missing a string id'
      });
      continue;
    }
    if (ids.has(component.id)) {
      issues.push({
        code: 'duplicate_id',
        componentId: component.id,
        message: `Duplicate component id: ${component.id}`
      });
    }
    ids.add(component.id);

    if (!hasValidBounds(component.bounds)) {
      issues.push({
        code: 'missing_bounds',
        componentId: component.id,
        message: `Component ${component.id} has invalid bounds`
      });
      continue;
    }

    if (component.bounds.width <= 0 || component.bounds.height <= 0) {
      issues.push({
        code: 'degenerate_bounds',
        componentId: component.id,
        message: `Component ${component.id} has non-positive size`
      });
    }
  }

  for (const raw of components) {
    const component = raw as Partial<BaseComponent>;
    if (
      component?.parent &&
      typeof component.parent === 'string' &&
      !ids.has(component.parent)
    ) {
      issues.push({
        code: 'orphan_parent',
        componentId: component.id,
        message: `Component ${component.id} references missing parent ${component.parent}`
      });
    }
  }

  return {
    valid: issues.length === 0,
    issues,
    componentCount: Array.isArray(components) ? components.length : 0
  };
}

/**
 * Mean absolute axis alignment error between sibling left/top edges.
 * Lower is better (more aligned). Returns 0 for fewer than 2 components.
 */
export function meanAlignmentError(components: BaseComponent[]): number {
  if (components.length < 2) return 0;
  let total = 0;
  let pairs = 0;
  for (let i = 0; i < components.length; i += 1) {
    for (let j = i + 1; j < components.length; j += 1) {
      const a = components[i].bounds;
      const b = components[j].bounds;
      total += Math.min(Math.abs(a.x - b.x), Math.abs(a.y - b.y));
      pairs += 1;
    }
  }
  return pairs === 0 ? 0 : total / pairs;
}
