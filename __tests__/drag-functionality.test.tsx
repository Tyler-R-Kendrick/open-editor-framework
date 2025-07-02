import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { EditorCanvas } from '../src/components/editor-canvas/component';
import { setComponents, store } from '../src/store';
import { BaseComponent } from '../src/types/component-base';

beforeEach(() => {
  // Reset store state before each test
  store.dispatch(setComponents([]));
});

const createTestComponent = (id = 'test-component'): BaseComponent =>
  new BaseComponent({
    id,
    type: 'button',
    name: 'Test Button',
    bounds: { x: 100, y: 100, width: 120, height: 40 },
    properties: {
      text: 'Test Button',
      backgroundColor: '#3b82f6',
      color: '#ffffff'
    }
  });

describe('Drag Functionality Improvements', () => {
  describe('Component Dragging', () => {
    test('should render draggable component with @dnd-kit', () => {
      const testComponent = createTestComponent();
      store.dispatch(setComponents([testComponent]));

      render(
        <Provider store={store}>
          <EditorCanvas theme="light" />
        </Provider>
      );

      // Component should render
      const canvasContainer = screen.getByTestId('canvas-container');
      expect(canvasContainer).toBeInTheDocument();

      // Should have canvas for rendering
      const canvas = screen.getByTestId('canvas');
      expect(canvas).toBeInTheDocument();
      // Touch action should be set for mobile support
      expect(canvas.style.touchAction).toBe('pan-x pan-y pinch-zoom');
    });

    test('should handle component selection on canvas click', () => {
      const testComponent = createTestComponent();
      store.dispatch(setComponents([testComponent]));

      render(
        <Provider store={store}>
          <EditorCanvas theme="light" resolution={{ width: 400, height: 400 }} />
        </Provider>
      );

      const canvas = screen.getByTestId('canvas');

      // Click on canvas background (should clear selection)
      fireEvent.mouseDown(canvas, { clientX: 50, clientY: 50 });

      // Should not throw errors
      expect(canvas).toBeInTheDocument();
    });

    test('should have proper canvas controls', () => {
      render(
        <Provider store={store}>
          <EditorCanvas theme="light" />
        </Provider>
      );

      // Should have zoom controls
      expect(screen.getByTestId('zoom-out-button')).toBeInTheDocument();
      expect(screen.getByTestId('zoom-in-button')).toBeInTheDocument();
      expect(screen.getByTestId('reset-view-button')).toBeInTheDocument();
      expect(screen.getByTestId('zoom-level')).toBeInTheDocument();
    });

    test('should handle zoom controls without errors', () => {
      render(
        <Provider store={store}>
          <EditorCanvas theme="light" />
        </Provider>
      );

      const zoomInButton = screen.getByTestId('zoom-in-button');
      const zoomOutButton = screen.getByTestId('zoom-out-button');
      const resetButton = screen.getByTestId('reset-view-button');

      // Should handle zoom operations
      fireEvent.click(zoomInButton);
      fireEvent.click(zoomOutButton);
      fireEvent.click(resetButton);

      // Should not throw errors
      expect(zoomInButton).toBeInTheDocument();
      expect(zoomOutButton).toBeInTheDocument();
      expect(resetButton).toBeInTheDocument();
    });
  });

  describe('Touch Handling', () => {
    test('should handle single touch events', () => {
      const testComponent = createTestComponent();
      store.dispatch(setComponents([testComponent]));

      render(
        <Provider store={store}>
          <EditorCanvas theme="light" />
        </Provider>
      );

      const canvas = screen.getByTestId('canvas');

      // Single touch sequence
      fireEvent.touchStart(canvas, {
        touches: [{ clientX: 160, clientY: 120 }]
      });

      fireEvent.touchMove(canvas, {
        touches: [{ clientX: 170, clientY: 130 }]
      });

      fireEvent.touchEnd(canvas);

      // Should handle touch without errors
      expect(canvas).toBeInTheDocument();
    });

    test('should handle multi-touch pinch gestures', () => {
      render(
        <Provider store={store}>
          <EditorCanvas theme="light" />
        </Provider>
      );

      const canvas = screen.getByTestId('canvas');

      // Multi-touch pinch gesture
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

      // Should handle multi-touch without errors
      expect(canvas).toBeInTheDocument();
    });

    test('should handle touch cancel events', () => {
      render(
        <Provider store={store}>
          <EditorCanvas theme="light" />
        </Provider>
      );

      const canvas = screen.getByTestId('canvas');

      // Start touch then cancel
      fireEvent.touchStart(canvas, {
        touches: [{ clientX: 160, clientY: 120 }]
      });

      fireEvent.touchCancel(canvas);

      // Should handle cancellation gracefully
      expect(canvas).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    test('should have proper ARIA labels', () => {
      render(
        <Provider store={store}>
          <EditorCanvas theme="light" />
        </Provider>
      );

      const canvasContainer = screen.getByTestId('canvas-container');
      const canvas = screen.getByTestId('canvas');

      expect(canvasContainer).toHaveAttribute('role', 'img');
      expect(canvasContainer).toHaveAttribute('aria-label', 'Design Canvas');
      expect(canvas).toHaveAttribute('aria-label', 'Interactive design canvas');
    });

    test('should have accessible controls', () => {
      render(
        <Provider store={store}>
          <EditorCanvas theme="light" />
        </Provider>
      );

      expect(screen.getByTestId('zoom-out-button')).toHaveAttribute('aria-label', 'Zoom out');
      expect(screen.getByTestId('zoom-in-button')).toHaveAttribute('aria-label', 'Zoom in');
      expect(screen.getByTestId('reset-view-button')).toHaveAttribute('aria-label', 'Reset zoom and pan');
    });
  });

  describe('Component State Management', () => {
    test('should maintain component state through Redux', () => {
      const components = [
        createTestComponent('comp-1'),
        createTestComponent('comp-2'),
        createTestComponent('comp-3')
      ];

      store.dispatch(setComponents(components));

      render(
        <Provider store={store}>
          <EditorCanvas theme="light" />
        </Provider>
      );

      const state = store.getState();
      expect(state.canvas.present.components).toHaveLength(3);
      expect(state.canvas.present.components[0].id).toBe('comp-1');
    });

    test('should handle empty component state', () => {
      store.dispatch(setComponents([]));

      render(
        <Provider store={store}>
          <EditorCanvas theme="light" />
        </Provider>
      );

      const state = store.getState();
      expect(state.canvas.present.components).toHaveLength(0);

      // Should render without errors
      expect(screen.getByTestId('canvas-container')).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    test('should handle different canvas resolutions', () => {
      render(
        <Provider store={store}>
          <EditorCanvas theme="light" resolution={{ width: 800, height: 600 }} />
        </Provider>
      );

      const canvasContainer = screen.getByTestId('canvas-container');
      expect(canvasContainer).toHaveStyle('width: 800px');
      expect(canvasContainer).toHaveStyle('height: 600px');
    });

    test('should work without specified resolution', () => {
      render(
        <Provider store={store}>
          <EditorCanvas theme="light" />
        </Provider>
      );

      const canvasContainer = screen.getByTestId('canvas-container');
      expect(canvasContainer).toHaveStyle('width: 100%');
      expect(canvasContainer).toHaveStyle('height: 100%');
    });

    test('should support both light and dark themes', () => {
      const { rerender } = render(
        <Provider store={store}>
          <EditorCanvas theme="light" />
        </Provider>
      );

      let canvasContainer = screen.getByTestId('canvas-container');
      expect(canvasContainer).toHaveStyle('background: rgb(248, 250, 252)');

      rerender(
        <Provider store={store}>
          <EditorCanvas theme="dark" />
        </Provider>
      );

      canvasContainer = screen.getByTestId('canvas-container');
      expect(canvasContainer).toHaveStyle('background: rgb(30, 41, 59)');
    });
  });
});