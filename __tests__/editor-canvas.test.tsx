import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
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

test('dispatches selection-change when a component is selected', async () => {
  store.dispatch(setComponents([]));
  const comp = new BaseComponent({
    id: 'sel1',
    type: 'text',
    name: 'Text',
    bounds: { x: 50, y: 50, width: 40, height: 20 },
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

  const canvas = screen.getByTestId('canvas');
  fireEvent.mouseDown(canvas, { clientX: 60, clientY: 60 });

  await waitFor(() => expect(handler).toHaveBeenCalled());
  const event = handler.mock.calls[0][0] as CustomEvent;
  expect(event.detail.selectedComponents).toEqual(['sel1']);

  window.removeEventListener('selection-change', handler);
});

test('dispatches component-move when dragging ends', async () => {
  store.dispatch(setComponents([]));
  const comp = new BaseComponent({
    id: 'drag1',
    type: 'text',
    name: 'Text',
    bounds: { x: 0, y: 0, width: 40, height: 20 },
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

  fireEvent.mouseDown(draggable, { clientX: 10, clientY: 10 });
  fireEvent.mouseMove(draggable, { clientX: 30, clientY: 30 });
  fireEvent.mouseUp(draggable);

  await waitFor(() => expect(handler).toHaveBeenCalled());
  const moveEvent = handler.mock.calls[0][0] as CustomEvent;
  expect(moveEvent.detail.component.id).toBe('drag1');
  expect(moveEvent.detail.position).toEqual({ x: 20, y: 20 });

  window.removeEventListener('component-move', handler);
});
