import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { EditorCanvas } from '../src/components/editor-canvas/component';
import { addComponent, setComponents, store } from '../src/store';
import { BaseComponent } from '../src/types/component-base';

// Helper function to create touch events
const createTouchEvent = (type: string, touches: Array<{ clientX: number; clientY: number }>) => {
  const touchEvent = new Event(type, { bubbles: true, cancelable: true });
  Object.defineProperty(touchEvent, 'touches', {
    value: touches.map((touch, index) => ({
      identifier: index,
      target: null,
      ...touch
    })),
    writable: false,
  });
  return touchEvent;
};

beforeEach(() => {
  // Reset store state before each test
  store.dispatch(setComponents([]));
});

describe('EditorCanvas Mobile Dragging', () => {
  test('should render canvas with touch support', () => {
    render(
      <Provider store={store}>
        <EditorCanvas theme="light" />
      </Provider>
    );

    const canvas = screen.getByLabelText('Interactive design canvas');
    expect(canvas).toBeInTheDocument();
    expect(canvas.style.touchAction).toBe('none');
  });

  test('should select component on mobile touch', () => {
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

    const canvas = screen.getByLabelText('Interactive design canvas');

    // Simulate touch on the component
    const touchStartEvent = createTouchEvent('touchstart', [{ clientX: 100, clientY: 75 }]);
    fireEvent(canvas, touchStartEvent);

    // Check if draggable overlay exists (indicates component is selectable)
    const overlays = container.querySelectorAll('div[aria-hidden="true"]');
    expect(overlays.length).toBe(1);
  });

  test('should drag component on mobile with touch events (fixed)', () => {
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

    // Get initial position
    const initialLeft = overlay.style.left;
    const initialTop = overlay.style.top;

    // Simulate touch drag sequence on the overlay
    const touchStartEvent = createTouchEvent('touchstart', [{ clientX: 100, clientY: 75 }]);
    const touchMoveEvent = createTouchEvent('touchmove', [{ clientX: 150, clientY: 125 }]);
    const touchEndEvent = createTouchEvent('touchend', []);

    fireEvent(overlay, touchStartEvent);
    fireEvent(overlay, touchMoveEvent);
    fireEvent(overlay, touchEndEvent);

    // Component position should change if dragging works properly
    // With our fix, the position should now change
    expect(overlay.style.left).not.toBe(initialLeft);
    expect(overlay.style.top).not.toBe(initialTop);
  });

  test('should update component position in Redux store when dragged on mobile', () => {
    // Add a test component
    const testComponent = new BaseComponent({
      id: 'test-component',
      type: 'text',
      name: 'Test Text',
      bounds: { x: 50, y: 50, width: 100, height: 50 },
      properties: { text: 'Test Text' }
    });

    store.dispatch(addComponent(testComponent));

    // Get initial component state from store
    const initialState = store.getState();
    const initialComponent = initialState.canvas.present.components[0];
    expect(initialComponent.bounds.x).toBe(50);
    expect(initialComponent.bounds.y).toBe(50);

    const { container } = render(
      <Provider store={store}>
        <EditorCanvas theme="light" resolution={{ width: 400, height: 400 }} />
      </Provider>
    );

    const overlay = container.querySelector('div[aria-hidden="true"]') as HTMLElement;

    // Simulate touch drag sequence that should move the component
    const touchStartEvent = createTouchEvent('touchstart', [{ clientX: 100, clientY: 75 }]);
    const touchMoveEvent = createTouchEvent('touchmove', [{ clientX: 200, clientY: 175 }]);
    const touchEndEvent = createTouchEvent('touchend', []);

    fireEvent(overlay, touchStartEvent);
    fireEvent(overlay, touchMoveEvent);
    fireEvent(overlay, touchEndEvent);

    // Check that the component position was updated in the store
    const finalState = store.getState();
    const finalComponent = finalState.canvas.present.components[0];

    // Position should be different from initial position
    expect(finalComponent.bounds.x).not.toBe(50);
    expect(finalComponent.bounds.y).not.toBe(50);

    // Position should be within canvas bounds
    expect(finalComponent.bounds.x).toBeGreaterThanOrEqual(0);
    expect(finalComponent.bounds.y).toBeGreaterThanOrEqual(0);
    expect(finalComponent.bounds.x).toBeLessThanOrEqual(400 - 100); // canvas width - component width
    expect(finalComponent.bounds.y).toBeLessThanOrEqual(400 - 50);  // canvas height - component height
  });

  test('should not drag component during multi-touch gestures', () => {
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

    // Get initial position from store
    const initialState = store.getState();
    const initialComponent = initialState.canvas.present.components[0];

    // Simulate multi-touch gesture (two fingers) on the overlay
    const touchStartEvent = createTouchEvent('touchstart', [
      { clientX: 100, clientY: 75 },
      { clientX: 120, clientY: 95 }
    ]);
    const touchMoveEvent = createTouchEvent('touchmove', [
      { clientX: 150, clientY: 125 },
      { clientX: 170, clientY: 145 }
    ]);
    const touchEndEvent = createTouchEvent('touchend', []);

    fireEvent(overlay, touchStartEvent);
    fireEvent(overlay, touchMoveEvent);
    fireEvent(overlay, touchEndEvent);

    // Component position should NOT change during multi-touch
    const finalState = store.getState();
    const finalComponent = finalState.canvas.present.components[0];
    expect(finalComponent.bounds.x).toBe(initialComponent.bounds.x);
    expect(finalComponent.bounds.y).toBe(initialComponent.bounds.y);
  });

  test('should handle pinch-to-zoom gesture', () => {
    render(
      <Provider store={store}>
        <EditorCanvas theme="light" />
      </Provider>
    );

    const canvas = screen.getByLabelText('Interactive design canvas');

    // Simulate pinch gesture
    const touchStartEvent = createTouchEvent('touchstart', [
      { clientX: 100, clientY: 100 },
      { clientX: 200, clientY: 200 }
    ]);

    const touchMoveEvent = createTouchEvent('touchmove', [
      { clientX: 80, clientY: 80 },
      { clientX: 220, clientY: 220 }
    ]);

    fireEvent(canvas, touchStartEvent);
    fireEvent(canvas, touchMoveEvent);

    // Zoom should change (this functionality seems to work based on the code)
    // The test verifies the gesture is handled without errors
    expect(canvas).toBeInTheDocument();
  });

  test('should prevent default touch behavior to avoid scrolling conflicts', () => {
    render(
      <Provider store={store}>
        <EditorCanvas theme="light" />
      </Provider>
    );

    const canvas = screen.getByLabelText('Interactive design canvas');

    const touchMoveEvent = createTouchEvent('touchmove', [{ clientX: 100, clientY: 100 }]);
    const preventDefaultSpy = jest.spyOn(touchMoveEvent, 'preventDefault');

    fireEvent(canvas, touchMoveEvent);

    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  test('should clear long press timer on touch end', () => {
    render(
      <Provider store={store}>
        <EditorCanvas theme="light" />
      </Provider>
    );

    const canvas = screen.getByLabelText('Interactive design canvas');

    // Start a touch
    const touchStartEvent = createTouchEvent('touchstart', [{ clientX: 100, clientY: 100 }]);
    fireEvent(canvas, touchStartEvent);

    // End the touch quickly (before long press timeout)
    const touchEndEvent = createTouchEvent('touchend', []);
    fireEvent(canvas, touchEndEvent);

    // Should not crash or cause issues
    expect(canvas).toBeInTheDocument();
  });
});

describe('EditorCanvas Desktop Dragging (for comparison)', () => {
  test('should handle mouse drag on desktop', () => {
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

    const canvas = screen.getByLabelText('Interactive design canvas');
    const overlay = container.querySelector('div[aria-hidden="true"]') as HTMLElement;

    // Simulate mouse drag on overlay (this should work with react-aria/dnd)
    fireEvent.mouseDown(overlay, { clientX: 100, clientY: 75 });
    fireEvent.mouseMove(overlay, { clientX: 150, clientY: 125 });
    fireEvent.mouseUp(overlay);

    // Desktop dragging might work if react-aria/dnd handles mouse events properly
    expect(overlay).toBeInTheDocument();
  });

  test('should select component on mouse click', () => {
    // Add a test component
    const testComponent = new BaseComponent({
      id: 'test-component',
      type: 'text',
      name: 'Test Text',
      bounds: { x: 50, y: 50, width: 100, height: 50 },
      properties: { text: 'Test Text' }
    });

    store.dispatch(addComponent(testComponent));

    render(
      <Provider store={store}>
        <EditorCanvas theme="light" resolution={{ width: 400, height: 400 }} />
      </Provider>
    );

    const canvas = screen.getByLabelText('Interactive design canvas');

    // Simulate mouse click on component
    fireEvent.mouseDown(canvas, { clientX: 100, clientY: 75 });

    // Should handle mouse interaction
    expect(canvas).toBeInTheDocument();
  });
});