import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store, setComponents, addComponent } from '../src/store';
import { BaseComponent } from '../src/types/component-base';
import { EditorCanvas } from '../src/components/editor-canvas/component';
import { ControlPanel } from '../src/components/control-panel/component';

it('shows fields when selecting a newly added component', () => {
  store.dispatch(setComponents([]));
  const comp = new BaseComponent({
    id: 'c-select',
    type: 'text',
    name: 'Text',
    bounds: { x: 10, y: 10, width: 40, height: 20 },
    properties: { text: 'Hello' }
  });
  store.dispatch(addComponent(comp));

  render(
    <Provider store={store}>
      <div>
        <EditorCanvas theme="light" resolution={{ width: 200, height: 200 }} />
        <ControlPanel theme="light" />
      </div>
    </Provider>
  );

  const canvas = screen.getByTestId('canvas');
  fireEvent.mouseDown(canvas, { clientX: 15, clientY: 15 });

  expect(screen.getByDisplayValue('Hello')).toBeInTheDocument();
});
