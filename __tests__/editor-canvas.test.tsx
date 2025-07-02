import React from 'react';
import { render, screen } from '@testing-library/react';
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
