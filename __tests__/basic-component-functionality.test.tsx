import { render } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { EditorCanvas } from '../src/components/editor-canvas/component';
import { addComponent, setComponents, store } from '../src/store';
import { BaseComponent } from '../src/types/component-base';

beforeEach(() => {
  store.dispatch(setComponents([]));
});

test('should add and display text components on canvas', () => {
  // Add a text component (like a label)
  const textComponent = new BaseComponent({
    id: 'text-1',
    type: 'text',
    name: 'Text Label',
    bounds: { x: 100, y: 100, width: 200, height: 30 },
    properties: {
      text: 'Hello World',
      fontSize: 16,
      color: '#000000'
    }
  });

  store.dispatch(addComponent(textComponent));

  const { container } = render(
    <Provider store={store}>
      <EditorCanvas theme="light" resolution={{ width: 800, height: 600 }} />
    </Provider>
  );

  // Check that the component is in the store
  const state = store.getState();
  expect(state.canvas.present.components).toHaveLength(1);
  expect(state.canvas.present.components[0].type).toBe('text');
  expect(state.canvas.present.components[0].properties.text).toBe('Hello World');

  // Check that a draggable overlay exists for the component
  const overlays = container.querySelectorAll('div[aria-hidden="true"]');
  expect(overlays).toHaveLength(1);

  const overlay = overlays[0] as HTMLElement;
  expect(overlay.style.left).toBe('100px');
  expect(overlay.style.top).toBe('100px');
  expect(overlay.style.width).toBe('200px');
  expect(overlay.style.height).toBe('30px');
});

test('should add and display button components on canvas', () => {
  // Add a button component
  const buttonComponent = new BaseComponent({
    id: 'button-1',
    type: 'button',
    name: 'Click Button',
    bounds: { x: 50, y: 200, width: 120, height: 40 },
    properties: {
      text: 'Click Me',
      backgroundColor: '#3b82f6',
      color: '#ffffff'
    }
  });

  store.dispatch(addComponent(buttonComponent));

  const { container } = render(
    <Provider store={store}>
      <EditorCanvas theme="light" resolution={{ width: 800, height: 600 }} />
    </Provider>
  );

  // Check that the component is in the store
  const state = store.getState();
  expect(state.canvas.present.components).toHaveLength(1);
  expect(state.canvas.present.components[0].type).toBe('button');
  expect(state.canvas.present.components[0].properties.text).toBe('Click Me');

  // Check that a draggable overlay exists for the component
  const overlays = container.querySelectorAll('div[aria-hidden="true"]');
  expect(overlays).toHaveLength(1);

  const overlay = overlays[0] as HTMLElement;
  expect(overlay.style.left).toBe('50px');
  expect(overlay.style.top).toBe('200px');
  expect(overlay.style.width).toBe('120px');
  expect(overlay.style.height).toBe('40px');
});

test('should add multiple components and display all overlays', () => {
  // Add multiple components
  const components = [
    new BaseComponent({
      id: 'text-1',
      type: 'text',
      name: 'Label 1',
      bounds: { x: 10, y: 10, width: 100, height: 20 },
      properties: { text: 'Label 1' }
    }),
    new BaseComponent({
      id: 'button-1',
      type: 'button',
      name: 'Button 1',
      bounds: { x: 10, y: 50, width: 80, height: 30 },
      properties: { text: 'Button 1' }
    }),
    new BaseComponent({
      id: 'image-1',
      type: 'image',
      name: 'Image 1',
      bounds: { x: 10, y: 100, width: 150, height: 100 },
      properties: {}
    })
  ];

  components.forEach(component => {
    store.dispatch(addComponent(component));
  });

  const { container } = render(
    <Provider store={store}>
      <EditorCanvas theme="light" resolution={{ width: 800, height: 600 }} />
    </Provider>
  );

  // Check that all components are in the store
  const state = store.getState();
  expect(state.canvas.present.components).toHaveLength(3);

  // Check that draggable overlays exist for all components
  const overlays = container.querySelectorAll('div[aria-hidden="true"]');
  expect(overlays).toHaveLength(3);

  // Verify positions of overlays match component bounds
  expect((overlays[0] as HTMLElement).style.left).toBe('10px');
  expect((overlays[0] as HTMLElement).style.top).toBe('10px');

  expect((overlays[1] as HTMLElement).style.left).toBe('10px');
  expect((overlays[1] as HTMLElement).style.top).toBe('50px');

  expect((overlays[2] as HTMLElement).style.left).toBe('10px');
  expect((overlays[2] as HTMLElement).style.top).toBe('100px');
});