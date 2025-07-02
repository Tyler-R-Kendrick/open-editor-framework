import { useGesture } from '@use-gesture/react';
import { useState } from 'react';

export interface GestureHandlers {
  onDrag?: (state: { movement: [number, number]; velocity: [number, number]; active: boolean }) => void;
  onPinch?: (state: { offset: [number, number]; active: boolean }) => void;
  onTap?: () => void;
  onLongPress?: () => void;
}

export function useGestures(handlers: GestureHandlers) {
  const [isDragging, setIsDragging] = useState(false);
  const [isPinching, setIsPinching] = useState(false);

  const bind = useGesture({
    onDrag: ({ movement, velocity, active }) => {
      setIsDragging(active);
      handlers.onDrag?.({ movement, velocity, active });
    },
    onPinch: ({ offset, active }) => {
      setIsPinching(active);
      handlers.onPinch?.({ offset, active });
    },
    onClick: () => {
      handlers.onTap?.();
    },
    onPointerDown: ({ event }) => {
      // Long press detection
      const timeoutId = setTimeout(() => {
        handlers.onLongPress?.();
      }, 500);

      const cleanup = () => {
        clearTimeout(timeoutId);
        event.target?.removeEventListener('pointerup', cleanup);
        event.target?.removeEventListener('pointermove', cleanup);
      };

      event.target?.addEventListener('pointerup', cleanup);
      event.target?.addEventListener('pointermove', cleanup);
    }
  });

  return {
    bind,
    isDragging,
    isPinching
  };
}