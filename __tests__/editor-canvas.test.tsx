import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
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

test('renders no overlay until a component is selected', () => {
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
  expect(overlays.length).toBe(0);
});

test('touch drag moves selected component', () => {
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

  const canvas = container.querySelector('canvas') as HTMLCanvasElement;
  act(() => {
    fireEvent.touchStart(canvas, {
      touches: [{ clientX: 5, clientY: 5 }]
    });
  });

  const overlay = container.querySelector(
    'div[aria-hidden="true"]'
  ) as HTMLElement;
  expect(overlay).toBeTruthy();

  act(() => {
    fireEvent.mouseDown(overlay, { clientX: 5, clientY: 5 });
    fireEvent.mouseMove(overlay, { clientX: 25, clientY: 25 });
    fireEvent.mouseUp(overlay, { clientX: 25, clientY: 25 });
  });

  const moved = store.getState().canvas.present.components[0];
  expect(moved.bounds.x).toBeGreaterThan(0);
  expect(moved.bounds.y).toBeGreaterThan(0);
});
