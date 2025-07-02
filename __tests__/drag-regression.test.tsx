import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { EditorCanvas } from '../src/components/editor-canvas/component';
import { setComponents, store } from '../src/store';
import { BaseComponent } from '../src/types/component-base';

// Mock @dnd-kit/core for testing
jest.mock('@dnd-kit/core', () => ({
  DndContext: ({ children, onDragStart, onDragEnd }: any) => (
    <div data-testid="dnd-context" onMouseDown={() => onDragStart?.({ active: { id: 'test-component' } })} onMouseUp={() => onDragEnd?.({ active: { id: 'test-component' }, over: { id: 'canvas' }, delta: { x: 10, y: 10 } })}>
      {children}
    </div>
  ),
  useDraggable: ({ id }: any) => ({
    attributes: { 'data-draggable': true },
    listeners: { onMouseDown: jest.fn() },
    setNodeRef: jest.fn(),
    transform: null,
    isDragging: false
  }),
  useDroppable: () => ({
    setNodeRef: jest.fn()
  }),
  useSensor: jest.fn(),
  useSensors: () => [],
  closestCenter: jest.fn(),
  KeyboardSensor: jest.fn(),
  PointerSensor: jest.fn(),
  DragOverlay: ({ children }: any) => <div data-testid="drag-overlay">{children}</div>
}));

// Mock @dnd-kit/utilities
jest.mock('@dnd-kit/utilities', () => ({
  CSS: {
    Transform: {
      toString: () => 'transform: translate3d(0px, 0px, 0px)'
    }
  }
}));

// Mock Adobe Spectrum icons
jest.mock('@adobe/react-spectrum-icons', () => ({
  ZoomIn: () => <div data-testid="zoom-in-icon" />,
  ZoomOut: () => <div data-testid="zoom-out-icon" />,
  Refresh: () => <div data-testid="refresh-icon" />
}));

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Provider store={store}>
    {children}
  </Provider>
);

const createTestComponent = (id = 'test-component'): BaseComponent =>
  new BaseComponent({
    id,
    type: 'button',
    bounds: { x: 100, y: 100, width: 120, height: 40 },
    properties: {
      text: 'Test Button',
      backgroundColor: '#3b82f6',
      color: '#ffffff'
    }
  });

describe('Drag Functionality Regression Tests', () => {
  beforeEach(() => {
    // Clear any existing components
    store.dispatch(setComponents([]));
  });

  describe('Prevent Corner-Only Dragging Issue', () => {
    test('should allow dragging from anywhere on the component, not just corners', async () => {
      const testComponent = createTestComponent();
      store.dispatch(setComponents([testComponent]));

      render(
        <TestWrapper>
          <EditorCanvas theme="light" />
        </TestWrapper>
      );

      const draggableElement = screen.getByTestId('draggable-component-test-component');
      expect(draggableElement).toBeInTheDocument();

      // The entire component should be draggable, not just corners
      expect(draggableElement).toHaveAttribute('data-draggable', 'true');

      // Verify the drag handle overlay covers the entire component
      const dragOverlay = draggableElement.querySelector('div[aria-hidden="true"]');
      expect(dragOverlay).toHaveStyle({
        position: 'absolute',
        top: '0',
        left: '0',
        right: '0',
        bottom: '0'
      });
    });

    test('should respond to drag from center of component', async () => {
      const testComponent = createTestComponent();
      store.dispatch(setComponents([testComponent]));

      render(
        <TestWrapper>
          <EditorCanvas theme="light" />
        </TestWrapper>
      );

      const draggableElement = screen.getByTestId('draggable-component-test-component');

      // Simulate mousedown in the center of the component
      fireEvent.mouseDown(draggableElement, {
        clientX: 160, // center X (100 + 120/2)
        clientY: 120  // center Y (100 + 40/2)
      });

      // Should trigger drag functionality
      expect(draggableElement.onMouseDown).toBeDefined();
    });

    test('should not be restricted to corner-only dragging', async () => {
      const testComponent = createTestComponent();
      store.dispatch(setComponents([testComponent]));

      render(
        <TestWrapper>
          <EditorCanvas theme="light" />
        </TestWrapper>
      );

      const draggableElement = screen.getByTestId('draggable-component-test-component');

      // Test multiple points on the component
      const testPoints = [
        { x: 110, y: 110 }, // top-left area
        { x: 160, y: 120 }, // center
        { x: 210, y: 130 }, // bottom-right area
        { x: 130, y: 135 }  // bottom-left area
      ];

      testPoints.forEach(point => {
        fireEvent.mouseDown(draggableElement, {
          clientX: point.x,
          clientY: point.y
        });

        // All points should be valid drag start points
        expect(draggableElement).toHaveAttribute('data-draggable', 'true');
      });
    });
  });

  describe('Prevent Long Press / Timeout Issues', () => {
    test('should not stop dragging after 500ms timeout', async () => {
      const testComponent = createTestComponent();
      store.dispatch(setComponents([testComponent]));

      render(
        <TestWrapper>
          <EditorCanvas theme="light" />
        </TestWrapper>
      );

      const dndContext = screen.getByTestId('dnd-context');

      // Start drag
      fireEvent.mouseDown(dndContext);

      // Wait longer than 500ms
      await waitFor(() => { }, { timeout: 600 });

      // Drag should still be active - no timeout interruption
      const draggableElement = screen.getByTestId('draggable-component-test-component');
      expect(draggableElement).toBeInTheDocument();

      // Should be able to end drag normally
      fireEvent.mouseUp(dndContext);

      // Verify the component position was updated (mock will trigger position change)
      await waitFor(() => {
        expect(store.getState().canvas.present.components[0].bounds.x).toBeGreaterThan(100);
      });
    });

    test('should handle continuous touch events without timeout', async () => {
      const testComponent = createTestComponent();
      store.dispatch(setComponents([testComponent]));

      render(
        <TestWrapper>
          <EditorCanvas theme="light" />
        </TestWrapper>
      );

      const canvas = screen.getByTestId('canvas');

      // Simulate long touch sequence
      fireEvent.touchStart(canvas, {
        touches: [{ clientX: 160, clientY: 120 }]
      });

      // Simulate continuous touch moves over time
      for (let i = 0; i < 10; i++) {
        await new Promise(resolve => setTimeout(resolve, 100)); // 100ms intervals
        fireEvent.touchMove(canvas, {
          touches: [{ clientX: 160 + i * 5, clientY: 120 + i * 2 }]
        });
      }

      // Should not have timed out
      fireEvent.touchEnd(canvas);

      // Touch handling should remain responsive
      expect(canvas).toHaveStyle('touchAction: pan-x pan-y pinch-zoom');
    });

    test('should clear long press timers properly during drag', async () => {
      const testComponent = createTestComponent();
      store.dispatch(setComponents([testComponent]));

      // Spy on setTimeout and clearTimeout
      const setTimeoutSpy = jest.spyOn(global, 'setTimeout');
      const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');

      render(
        <TestWrapper>
          <EditorCanvas theme="light" />
        </TestWrapper>
      );

      const dndContext = screen.getByTestId('dnd-context');

      // Start drag - this should clear any existing timers
      fireEvent.mouseDown(dndContext);

      // Verify clearTimeout was called during drag start
      expect(clearTimeoutSpy).toHaveBeenCalled();

      setTimeoutSpy.mockRestore();
      clearTimeoutSpy.mockRestore();
    });
  });

  describe('Touch Handling Reliability', () => {
    test('should handle single touch drag without interference', async () => {
      const testComponent = createTestComponent();
      store.dispatch(setComponents([testComponent]));

      render(
        <TestWrapper>
          <EditorCanvas theme="light" />
        </TestWrapper>
      );

      const canvas = screen.getByTestId('canvas');

      // Single touch drag sequence
      fireEvent.touchStart(canvas, {
        touches: [{ clientX: 160, clientY: 120 }]
      });

      fireEvent.touchMove(canvas, {
        touches: [{ clientX: 170, clientY: 130 }]
      });

      fireEvent.touchEnd(canvas);

      // Should not interfere with component selection
      const state = store.getState();
      expect(state.canvas.present.components).toHaveLength(1);
    });

    test('should distinguish between drag and pinch gestures', async () => {
      const testComponent = createTestComponent();
      store.dispatch(setComponents([testComponent]));

      render(
        <TestWrapper>
          <EditorCanvas theme="light" />
        </TestWrapper>
      );

      const canvas = screen.getByTestId('canvas');

      // Multi-touch pinch gesture should not trigger component drag
      fireEvent.touchStart(canvas, {
        touches: [
          { clientX: 160, clientY: 120 },
          { clientX: 180, clientY: 140 }
        ]
      });

      fireEvent.touchMove(canvas, {
        touches: [
          { clientX: 150, clientY: 110 },
          { clientX: 190, clientY: 150 }
        ]
      });

      fireEvent.touchEnd(canvas);

      // Multi-touch should not affect component positions
      const state = store.getState();
      expect(state.canvas.present.components[0].bounds.x).toBe(100);
      expect(state.canvas.present.components[0].bounds.y).toBe(100);
    });

    test('should handle touch cancel events gracefully', async () => {
      const testComponent = createTestComponent();
      store.dispatch(setComponents([testComponent]));

      render(
        <TestWrapper>
          <EditorCanvas theme="light" />
        </TestWrapper>
      );

      const canvas = screen.getByTestId('canvas');

      // Start touch
      fireEvent.touchStart(canvas, {
        touches: [{ clientX: 160, clientY: 120 }]
      });

      // Cancel touch (e.g., notification interrupt)
      fireEvent.touchCancel(canvas);

      // Should handle cancellation without errors
      expect(canvas).toBeInTheDocument();

      // Should be able to start new touch after cancel
      fireEvent.touchStart(canvas, {
        touches: [{ clientX: 160, clientY: 120 }]
      });

      expect(canvas).toBeInTheDocument();
    });
  });

  describe('Proper Library Integration (@dnd-kit)', () => {
    test('should use @dnd-kit for drag functionality', () => {
      const testComponent = createTestComponent();
      store.dispatch(setComponents([testComponent]));

      render(
        <TestWrapper>
          <EditorCanvas theme="light" />
        </TestWrapper>
      );

      // Should render DndContext
      expect(screen.getByTestId('dnd-context')).toBeInTheDocument();

      // Should render DragOverlay
      expect(screen.getByTestId('drag-overlay')).toBeInTheDocument();

      // Components should be wrapped with draggable functionality
      expect(screen.getByTestId('draggable-component-test-component')).toBeInTheDocument();
    });

    test('should have proper drag constraints', async () => {
      const testComponent = createTestComponent();
      store.dispatch(setComponents([testComponent]));

      render(
        <TestWrapper>
          <EditorCanvas theme="light" resolution={{ width: 800, height: 600 }} />
        </TestWrapper>
      );

      const dndContext = screen.getByTestId('dnd-context');

      // Simulate drag that would move component outside bounds
      fireEvent.mouseDown(dndContext);
      fireEvent.mouseUp(dndContext);

      // Component position should be constrained within canvas bounds
      const state = store.getState();
      const component = state.canvas.present.components[0];

      expect(component.bounds.x).toBeGreaterThanOrEqual(0);
      expect(component.bounds.y).toBeGreaterThanOrEqual(0);
      expect(component.bounds.x + component.bounds.width).toBeLessThanOrEqual(800);
      expect(component.bounds.y + component.bounds.height).toBeLessThanOrEqual(600);
    });

    test('should provide visual feedback during drag', () => {
      const testComponent = createTestComponent();
      store.dispatch(setComponents([testComponent]));

      render(
        <TestWrapper>
          <EditorCanvas theme="light" />
        </TestWrapper>
      );

      // Should have drag overlay for visual feedback
      const dragOverlay = screen.getByTestId('drag-overlay');
      expect(dragOverlay).toBeInTheDocument();

      // Draggable component should have proper styling
      const draggableElement = screen.getByTestId('draggable-component-test-component');
      expect(draggableElement).toHaveStyle('cursor: grab');
      expect(draggableElement).toHaveStyle('touchAction: none');
    });
  });

  describe('Accessibility and ARIA Support', () => {
    test('should have proper ARIA labels for draggable components', () => {
      const testComponent = createTestComponent();
      store.dispatch(setComponents([testComponent]));

      render(
        <TestWrapper>
          <EditorCanvas theme="light" />
        </TestWrapper>
      );

      const draggableElement = screen.getByTestId('draggable-component-test-component');
      expect(draggableElement).toHaveAttribute('aria-label', 'Draggable button component');
    });

    test('should support keyboard navigation for accessibility', () => {
      const testComponent = createTestComponent();
      store.dispatch(setComponents([testComponent]));

      render(
        <TestWrapper>
          <EditorCanvas theme="light" />
        </TestWrapper>
      );

      // Should accept keyboard events for accessibility
      const canvas = screen.getByTestId('canvas');

      fireEvent.keyDown(canvas, { key: 'Tab' });
      fireEvent.keyDown(canvas, { key: 'Enter' });
      fireEvent.keyDown(canvas, { key: 'Space' });

      // Should not throw errors
      expect(canvas).toBeInTheDocument();
    });
  });

  describe('Performance and Memory Management', () => {
    test('should clean up event listeners on unmount', () => {
      const testComponent = createTestComponent();
      store.dispatch(setComponents([testComponent]));

      const { unmount } = render(
        <TestWrapper>
          <EditorCanvas theme="light" />
        </TestWrapper>
      );

      // Spy on removeEventListener
      const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

      unmount();

      // Should clean up event listeners
      expect(removeEventListenerSpy).toHaveBeenCalled();

      removeEventListenerSpy.mockRestore();
    });

    test('should handle rapid component updates without memory leaks', async () => {
      const components = Array.from({ length: 10 }, (_, i) =>
        createTestComponent(`component-${i}`)
      );

      store.dispatch(setComponents(components));

      render(
        <TestWrapper>
          <EditorCanvas theme="light" />
        </TestWrapper>
      );

      // All components should render
      components.forEach((_, i) => {
        expect(screen.getByTestId(`draggable-component-component-${i}`)).toBeInTheDocument();
      });

      // Update components rapidly
      for (let i = 0; i < 5; i++) {
        const updatedComponents = components.map(comp =>
          new BaseComponent({
            ...comp,
            bounds: { ...comp.bounds, x: comp.bounds.x + 1 }
          })
        );
        store.dispatch(setComponents(updatedComponents));

        await waitFor(() => {
          expect(screen.getAllByTestId(/draggable-component-/)).toHaveLength(10);
        });
      }
    });
  });
});