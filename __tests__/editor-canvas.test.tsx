import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EditorCanvas } from '../src/components/editor-canvas/component';
import { Provider } from 'react-redux';
import { store, addComponent, setComponents } from '../src/store';
import { BaseComponent } from '../src/types/component-base';

test('renders editor canvas', () => {
  render(
    <Provider store={store}>
      <EditorCanvas theme="light" />
    </Provider>
  );
  const canvas = screen.getByRole('img', { name: /design canvas/i });
  expect(canvas).toBeInTheDocument();
});

test('renders draggable overlay for each component', () => {
  store.dispatch(setComponents([]));
  store.dispatch(
    addComponent(
      new BaseComponent({
        id: 'c1',
        type: 'text',
        name: 'Text',
        bounds: { x: 0, y: 0, width: 50, height: 20 },
        properties: {}
      })
    )
  );

  const { container } = render(
    <Provider store={store}>
      <EditorCanvas theme="light" resolution={{ width: 200, height: 200 }} />
    </Provider>
  );

  const overlays = container.querySelectorAll('div[aria-hidden="true"]');
  expect(overlays.length).toBe(1);
});

test('dispatches selection-change event on component select', () => {
  store.dispatch(setComponents([]));
  const comp = new BaseComponent({
    id: 'c2',
    type: 'text',
    name: 'Text',
    bounds: { x: 0, y: 0, width: 50, height: 20 },
    properties: {}
  });
  store.dispatch(addComponent(comp));

  const handler = jest.fn();
  window.addEventListener('selection-change', handler);

  render(
    <Provider store={store}>
      <EditorCanvas theme="light" resolution={{ width: 200, height: 200 }} />
    </Provider>
  );

  handler.mockClear();

  const canvas = screen.getByTestId('canvas');
  fireEvent.mouseDown(canvas, { clientX: 10, clientY: 10 });

  expect(handler).toHaveBeenCalledTimes(1);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const event = handler.mock.calls[0][0] as any;
  expect(event.detail.selectedComponents).toEqual([comp.id]);

  window.removeEventListener('selection-change', handler);
});

test('dispatches component-move event when dragging ends', async () => {
  store.dispatch(setComponents([]));
  const comp = new BaseComponent({
    id: 'c3',
    type: 'text',
    name: 'Text',
    bounds: { x: 0, y: 0, width: 50, height: 20 },
    properties: {}
  });
  store.dispatch(addComponent(comp));

  const handler = jest.fn();
  window.addEventListener('component-move', handler);

  const { container } = render(
    <Provider store={store}>
      <EditorCanvas theme="light" resolution={{ width: 200, height: 200 }} />
    </Provider>
  );

  const draggable = container.querySelector(
    `[data-testid="draggable-component-${comp.id}"]`
  ) as HTMLElement;
  expect(draggable).toBeInTheDocument();

  await userEvent.pointer(
    [
      { keys: '[MouseLeft>]', target: draggable, coords: { x: 10, y: 10 } },
      { coords: { x: 20, y: 10 } },
      { keys: '[/MouseLeft]', coords: { x: 20, y: 10 } }
    ],
    { document: draggable.ownerDocument }
  );

  expect(handler).toHaveBeenCalled();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const evt = handler.mock.calls[0][0] as any;
  expect(evt.detail.component.id).toBe(comp.id);

  window.removeEventListener('component-move', handler);
});
