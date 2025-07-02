import { useGesture } from '@use-gesture/react';
import { clamp } from 'lodash';
import { useCallback, useRef, useState } from 'react';

export interface CanvasState {
  zoom: number;
  pan: { x: number; y: number };
  selectedComponents: string[];
}

export interface UseCanvasStateOptions {
  minZoom?: number;
  maxZoom?: number;
  zoomStep?: number;
  onZoomChange?: (zoom: number) => void;
  onPanChange?: (pan: { x: number; y: number }) => void;
  onSelectionChange?: (selectedIds: string[]) => void;
}

export function useCanvasState(options: UseCanvasStateOptions = {}) {
  const {
    minZoom = 0.1,
    maxZoom = 5,
    zoomStep = 0.1,
    onZoomChange,
    onPanChange,
    onSelectionChange
  } = options;

  const [state, setState] = useState<CanvasState>({
    zoom: 1,
    pan: { x: 0, y: 0 },
    selectedComponents: []
  });

  const lastPinchDistance = useRef(0);

  // Zoom controls
  const setZoom = useCallback((zoom: number | ((prev: number) => number)) => {
    setState(prev => {
      const newZoom = typeof zoom === 'function' ? zoom(prev.zoom) : zoom;
      const clampedZoom = clamp(newZoom, minZoom, maxZoom);

      if (clampedZoom !== prev.zoom) {
        onZoomChange?.(clampedZoom);
      }

      return { ...prev, zoom: clampedZoom };
    });
  }, [minZoom, maxZoom, onZoomChange]);

  const zoomIn = useCallback(() => {
    setZoom(z => z + zoomStep);
  }, [setZoom, zoomStep]);

  const zoomOut = useCallback(() => {
    setZoom(z => z - zoomStep);
  }, [setZoom, zoomStep]);

  // Pan controls
  const setPan = useCallback((pan: { x: number; y: number } | ((prev: { x: number; y: number }) => { x: number; y: number })) => {
    setState(prev => {
      const newPan = typeof pan === 'function' ? pan(prev.pan) : pan;

      if (newPan.x !== prev.pan.x || newPan.y !== prev.pan.y) {
        onPanChange?.(newPan);
      }

      return { ...prev, pan: newPan };
    });
  }, [onPanChange]);

  // Selection controls
  const selectComponent = useCallback((componentId: string, multiSelect = false) => {
    setState(prev => {
      let newSelection: string[];

      if (multiSelect) {
        newSelection = prev.selectedComponents.includes(componentId)
          ? prev.selectedComponents.filter(id => id !== componentId)
          : [...prev.selectedComponents, componentId];
      } else {
        newSelection = [componentId];
      }

      onSelectionChange?.(newSelection);
      return { ...prev, selectedComponents: newSelection };
    });
  }, [onSelectionChange]);

  const deselectAll = useCallback(() => {
    setState(prev => {
      if (prev.selectedComponents.length > 0) {
        onSelectionChange?.([]);
      }
      return { ...prev, selectedComponents: [] };
    });
  }, [onSelectionChange]);

  const selectAll = useCallback((componentIds: string[]) => {
    setState(prev => {
      onSelectionChange?.(componentIds);
      return { ...prev, selectedComponents: componentIds };
    });
  }, [onSelectionChange]);

  // Reset view
  const resetView = useCallback(() => {
    setState({
      zoom: 1,
      pan: { x: 0, y: 0 },
      selectedComponents: state.selectedComponents
    });
    onZoomChange?.(1);
    onPanChange?.({ x: 0, y: 0 });
  }, [state.selectedComponents, onZoomChange, onPanChange]);

  // Gesture bindings for pan and zoom
  const bind = useGesture({
    onWheel: ({ event, delta: [, dy] }) => {
      event.preventDefault();
      const scaleFactor = 1 - dy * 0.001;
      setZoom(z => z * scaleFactor);
    },
    onPinch: ({ offset: [distance], first, last }) => {
      if (first) {
        lastPinchDistance.current = distance;
      } else if (!last) {
        const scale = distance / lastPinchDistance.current;
        setZoom(z => z * scale);
        lastPinchDistance.current = distance;
      }
    },
    onDrag: ({ delta: [dx, dy], buttons, shiftKey }) => {
      // Only pan with middle mouse button or shift+left click
      if (buttons === 4 || (buttons === 1 && shiftKey)) {
        setPan(p => ({ x: p.x + dx, y: p.y + dy }));
      }
    }
  }, {
    wheel: { preventDefault: true },
    drag: { filterTaps: true }
  });

  return {
    // State
    zoom: state.zoom,
    pan: state.pan,
    selectedComponents: state.selectedComponents,

    // Actions
    setZoom,
    zoomIn,
    zoomOut,
    setPan,
    selectComponent,
    deselectAll,
    selectAll,
    resetView,

    // Gesture bindings
    bind
  };
}