import { render } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { EditorCanvas } from '../src/components/editor-canvas/component';
import { addComponent, setComponents, store } from '../src/store';
import { BaseComponent } from '../src/types/component-base';

beforeEach(() => {
  store.dispatch(setComponents([]));
});

test('debug - should render overlay and test touch event structure', () => {
  // Add a test component
  const testComponent = new BaseComponent({
    id: 'test-component',
    type: 'text',
    name: 'Test Text',
    bounds: { x: 50, y: 50, width: 100, height: 50 },
    properties: { text: 'Test Text' }
  });

  store.dispatch(addComponent(testComponent));

  const { container } = render(
    <Provider store={store}>
      <EditorCanvas theme="light" resolution={{ width: 400, height: 400 }} />
    </Provider>
  );

  // Check that overlay exists
  const overlay = container.querySelector('div[aria-hidden="true"]') as HTMLElement;
  expect(overlay).toBeInTheDocument();

  // Check initial position
  console.log('Initial overlay style left:', overlay.style.left);
  console.log('Initial overlay style top:', overlay.style.top);

  // Check that overlay has touch handlers
  expect(overlay.ontouchstart).toBeDefined();
  expect(overlay.ontouchmove).toBeDefined();
  expect(overlay.ontouchend).toBeDefined();

  // Test if the overlay position matches the component bounds
  // With zoom=1 and pan={x:0,y:0}, the position should be bounds * zoom + pan
  // So bounds.x=50 * 1 + 0 = 50px
  expect(overlay.style.left).toBe('50px');
  expect(overlay.style.top).toBe('50px');
  expect(overlay.style.width).toBe('100px');
  expect(overlay.style.height).toBe('50px');
});

test('debug - should trigger touch handlers when simulated properly', () => {
  // Add a test component
  const testComponent = new BaseComponent({
    id: 'test-component',
    type: 'text',
    name: 'Test Text',
    bounds: { x: 50, y: 50, width: 100, height: 50 },
    properties: { text: 'Test Text' }
  });

  store.dispatch(addComponent(testComponent));

  const { container } = render(
    <Provider store={store}>
      <EditorCanvas theme="light" resolution={{ width: 400, height: 400 }} />
    </Provider>
  );

  const overlay = container.querySelector('div[aria-hidden="true"]') as HTMLElement;

  // Create a mock touch event with the proper structure
  const mockTouchEvent = {
    preventDefault: jest.fn(),
    touches: [{
      clientX: 100,
      clientY: 75,
      identifier: 0,
      target: overlay
    }],
    type: 'touchstart',
    currentTarget: overlay
  } as unknown as React.TouchEvent<HTMLDivElement>;

  // Manually call the touch handlers if they exist
  if (overlay.ontouchstart) {
    overlay.ontouchstart(mockTouchEvent);
  }

  // Check if preventDefault was called
  expect(mockTouchEvent.preventDefault).toHaveBeenCalled();

  console.log('Mock touch event processed');
});

test('debug - check Redux store updates', () => {
  // Add a test component
  const testComponent = new BaseComponent({
    id: 'test-component',
    type: 'text',
    name: 'Test Text',
    bounds: { x: 50, y: 50, width: 100, height: 50 },
    properties: { text: 'Test Text' }
  });

  store.dispatch(addComponent(testComponent));

  // Check initial state
  const initialState = store.getState();
  expect(initialState.canvas.present.components).toHaveLength(1);
  expect(initialState.canvas.present.components[0].bounds.x).toBe(50);
  expect(initialState.canvas.present.components[0].bounds.y).toBe(50);

  console.log('Initial component state:', initialState.canvas.present.components[0]);
});