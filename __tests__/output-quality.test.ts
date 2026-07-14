import { validateComponentTree, meanAlignmentError } from '../src/utils/outputQuality';
import { BaseComponent } from '../src/types/component-base';

describe('output quality structural checks', () => {
  it('accepts a valid tree', () => {
    const report = validateComponentTree([
      {
        id: 'a',
        type: 'text',
        name: 'A',
        bounds: { x: 0, y: 0, width: 10, height: 10 },
        properties: {}
      }
    ]);
    expect(report.valid).toBe(true);
    expect(report.componentCount).toBe(1);
  });

  it('flags duplicate ids and orphan parents', () => {
    const report = validateComponentTree([
      {
        id: 'a',
        type: 'text',
        name: 'A',
        bounds: { x: 0, y: 0, width: 10, height: 10 },
        parent: 'missing'
      },
      {
        id: 'a',
        type: 'button',
        name: 'Dup',
        bounds: { x: 0, y: 0, width: 10, height: 10 }
      }
    ]);
    expect(report.valid).toBe(false);
    expect(report.issues.some((i) => i.code === 'duplicate_id')).toBe(true);
    expect(report.issues.some((i) => i.code === 'orphan_parent')).toBe(true);
  });

  it('uses not_array when the root value is not an array', () => {
    const report = validateComponentTree({ id: 'x' });
    expect(report.valid).toBe(false);
    expect(report.issues[0].code).toBe('not_array');
  });

  it('skips orphan checks for components without a string id', () => {
    const report = validateComponentTree([
      {
        type: 'text',
        name: 'NoId',
        bounds: { x: 0, y: 0, width: 10, height: 10 },
        parent: 'missing'
      }
    ]);
    expect(report.issues.some((i) => i.code === 'missing_id')).toBe(true);
    expect(report.issues.some((i) => i.code === 'orphan_parent')).toBe(false);
  });

  it('flags degenerate bounds', () => {
    const report = validateComponentTree([
      {
        id: 'a',
        type: 'text',
        name: 'A',
        bounds: { x: 0, y: 0, width: 0, height: 10 }
      }
    ]);
    expect(report.valid).toBe(false);
    expect(report.issues[0].code).toBe('degenerate_bounds');
  });

  it('computes mean alignment error', () => {
    const components = [
      new BaseComponent({
        id: 'a',
        type: 'text',
        name: 'A',
        bounds: { x: 0, y: 0, width: 10, height: 10 }
      }),
      new BaseComponent({
        id: 'b',
        type: 'text',
        name: 'B',
        bounds: { x: 8, y: 0, width: 10, height: 10 }
      })
    ];
    expect(meanAlignmentError(components)).toBe(0);
    components[1].bounds.y = 4;
    expect(meanAlignmentError(components)).toBe(4);
  });
});
