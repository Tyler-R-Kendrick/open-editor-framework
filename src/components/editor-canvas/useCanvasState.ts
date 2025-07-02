import React, { useState } from 'react';
// Gesture handling with @use-gesture/react
import { useGesture } from '@use-gesture/react';
import { clamp } from 'lodash';
import type { Point, CanvasState } from '../../types/editor-types';

interface UseCanvasStateOptions {
  onZoomChange?: (zoom: number) => void;
  onPanChange?: (pan: Point) => void;
  onSelectionChange?: (ids: string[]) => void;
}

export function useCanvasState(
  target: React.RefObject<HTMLElement | null>,
  options: UseCanvasStateOptions = {}
) {
  const [state, setState] = useState<CanvasState>({
    zoom: 1,
    pan: { x: 0, y: 0 },
    selectedComponents: [],
    clipboard: []
  });

  // @use-gesture/react integration
  useGesture(
    {
      onDrag: ({ delta: [dx, dy] }) => {
        setState((prev) => {
          const pan = { x: prev.pan.x + dx, y: prev.pan.y + dy };
          options.onPanChange?.(pan);
          return { ...prev, pan };
        });
      },
      onPinch: ({ offset: [d] }) => {
        setState((prev) => {
          const zoom = clamp(d, 0.1, 5);
          options.onZoomChange?.(zoom);
          return { ...prev, zoom };
        });
      }
    },
    {
      target,
      eventOptions: { passive: false },
      enabled: typeof PointerEvent !== 'undefined'
    }
  );

  const setSelected = (ids: string[]) => {
    setState((prev) => {
      options.onSelectionChange?.(ids);
      return { ...prev, selectedComponents: ids };
    });
  };

  return { state, setState, setSelected };
}
