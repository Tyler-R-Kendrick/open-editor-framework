import { ComponentHelper } from '../src/utils/helpers';
import { BaseComponent } from '../src/types/component-base';

function createParentWithChild() {
  const child = new BaseComponent({
    id: 'child',
    type: 'text',
    name: 'Child',
    bounds: { x: 0, y: 0, width: 10, height: 10 },
    parent: 'parent',
    children: []
  });
  const parent = new BaseComponent({
    id: 'parent',
    type: 'container',
    name: 'Parent',
    bounds: { x: 0, y: 0, width: 20, height: 20 },
    children: [child]
  });
  child.parent = parent.id;
  return { parent, child };
}

describe('ComponentHelper.duplicateComponent', () => {
  test('updates parent id of duplicated children', () => {
    const { parent, child } = createParentWithChild();
    const duplicate = ComponentHelper.duplicateComponent(parent, {
      x: 0,
      y: 0
    });

    expect(duplicate.id).not.toBe(parent.id);
    expect(duplicate.children).toHaveLength(1);
    const dupChild = duplicate.children![0];
    expect(dupChild.id).not.toBe(child.id);
    expect(dupChild.parent).toBe(duplicate.id);
  });
});
