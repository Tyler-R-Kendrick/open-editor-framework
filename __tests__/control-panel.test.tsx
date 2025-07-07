import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { ControlPanel } from '../src/components/control-panel/component';
import { store, addComponent, setComponents } from '../src/store';
import { BaseComponent } from '../src/types/component-base';

test('renders control panel container', () => {
  render(
    <Provider store={store}>
      <ControlPanel theme="light" />
    </Provider>
  );
  const panel = screen.getByLabelText(/properties panel/i);
  expect(panel).toBeInTheDocument();
});

test('updates when selection-change event fired', async () => {
  store.dispatch(setComponents([]));
  const comp = new BaseComponent({
    id: 'c1',
    type: 'text',
    name: 'Text',
    bounds: { x: 0, y: 0, width: 50, height: 20 },
    properties: { text: 'Label', extra: 'Alpha' }
  });
  store.dispatch(addComponent(comp));

  render(
    <Provider store={store}>
      <ControlPanel theme="light" />
    </Provider>
  );

  await act(async () => {
    window.dispatchEvent(
      new window.CustomEvent('selection-change', {
        detail: { selectedComponents: [comp.id] }
      })
    );
  });

  expect(await screen.findByDisplayValue('Label')).toBeInTheDocument();
  expect(screen.getByDisplayValue('Alpha')).toBeInTheDocument();
  expect(screen.getByTestId('selected-component-name').textContent).toBe(
    'Text'
  );
});
