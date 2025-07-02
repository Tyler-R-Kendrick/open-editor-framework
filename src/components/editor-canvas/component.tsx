import React, { useRef, useEffect, useState, useCallback } from 'react';
import { DraggableCore, DraggableData, DraggableEvent } from 'react-draggable';
import { EditorTheme, CanvasState } from '../../types/editor-types';
import ZoomOut from '@spectrum-icons/workflow/ZoomOut';
import ZoomIn from '@spectrum-icons/workflow/ZoomIn';
import Refresh from '@spectrum-icons/workflow/Refresh';
import { BaseComponent } from '../../types/component-base';
import { useAppDispatch, useAppSelector } from '../../store';
import { setComponents, updateComponent } from '../../store';
import { ActionCreators } from 'redux-undo';

interface PinchState {
  startDistance: number;
  startZoom: number;
}

import type { Resolution } from '../../types/editor-types';

interface EditorCanvasProps {
  theme: EditorTheme;
  resolution?: Resolution;
  'aria-label'?: string;
}

/**
 * HTML5 Canvas-based editor panel with touch and accessibility support
 * Features:
 * - Touch-optimized interactions (pan, zoom, tap, long press)
 * - Keyboard accessibility and shortcuts
 * - Component selection and manipulation
 * - Canvas rendering with zoom/pan
 * - Multi-touch gesture support
 */
export const EditorCanvas: React.FC<EditorCanvasProps> = ({
  theme,
  resolution,
  'aria-label': ariaLabel
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const touchStartTimeRef = useRef(0);
  const longPressTimerRef = useRef<number | null>(null);

  const [canvasState, setCanvasState] = useState<CanvasState>({
    zoom: 1,
    pan: { x: 0, y: 0 },
    selectedComponents: [],
    clipboard: []
  });

  const dispatch = useAppDispatch();
  const components = useAppSelector((state) => state.canvas.present.components);
  const [isDragging, setIsDragging] = useState(false);
  const [lastTouch, setLastTouch] = useState<PinchState | null>(null);

  const activeDragIdRef = useRef<string | null>(null);

  const DraggableOverlay: React.FC<{ component: BaseComponent }> = ({
    component
  }) => {
    const nodeRef = useRef<HTMLDivElement>(null);
    const startBoundsRef = useRef(component.bounds);

    const handleStart = useCallback(() => {
      activeDragIdRef.current = component.id;
      startBoundsRef.current = component.bounds;
      setIsDragging(true);
      setCanvasState((prev) => ({
        ...prev,
        selectedComponents: [component.id]
      }));
    }, [component.id, component.bounds]);

    /* eslint-disable react-hooks/exhaustive-deps */
    const handleDrag = useCallback(
      (_e: DraggableEvent, data: DraggableData) => {
        if (activeDragIdRef.current !== component.id) return;
        let x = startBoundsRef.current.x + data.deltaX / canvasState.zoom;
        let y = startBoundsRef.current.y + data.deltaY / canvasState.zoom;

        if (resolution) {
          x = Math.max(
            0,
            Math.min(x, resolution.width - component.bounds.width)
          );
          y = Math.max(
            0,
            Math.min(y, resolution.height - component.bounds.height)
          );
        }

        dispatch(
          updateComponent(
            new BaseComponent({
              ...component,
              bounds: { ...component.bounds, x, y }
            })
          )
        );
      },
      [component, canvasState.zoom, resolution, dispatch]
    );
    /* eslint-enable react-hooks/exhaustive-deps */

    const handleStop = useCallback(() => {
      if (activeDragIdRef.current !== component.id) return;
      activeDragIdRef.current = null;
      setIsDragging(false);
    }, [component.id]);

    return (
      <DraggableCore
        nodeRef={nodeRef}
        onStart={handleStart}
        onDrag={handleDrag}
        onStop={handleStop}
        scale={canvasState.zoom}
      >
        <div
          ref={nodeRef}
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: component.bounds.x * canvasState.zoom + canvasState.pan.x,
            top: component.bounds.y * canvasState.zoom + canvasState.pan.y,
            width: component.bounds.width * canvasState.zoom,
            height: component.bounds.height * canvasState.zoom,
            background: 'transparent',
            touchAction: 'none'
          }}
        />
      </DraggableCore>
    );
  };

  const handleUndo = useCallback(() => {
    dispatch(ActionCreators.undo());
  }, [dispatch]);

  const handleRedo = useCallback(() => {
    dispatch(ActionCreators.redo());
  }, [dispatch]);

  const initializeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    ctxRef.current = ctx;

    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();

      // Set up canvas for high DPI displays
      const devicePixelRatio = window.devicePixelRatio || 1;

      canvas.width = rect.width * devicePixelRatio;
      canvas.height = rect.height * devicePixelRatio;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      if (ctx) {
        ctx.scale(devicePixelRatio, devicePixelRatio);
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    const observer = new ResizeObserver(resizeCanvas);
    observer.observe(container);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      observer.disconnect();
    };
  }, []);

  const renderComponent = useCallback(
    (component: BaseComponent) => {
      const ctx = ctxRef.current;
      if (!ctx) return;

      const { bounds } = component;

      // Render component background
      ctx.fillStyle = String(component.properties.backgroundColor ?? '#ffffff');
      ctx.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);

      // Render component border
      ctx.strokeStyle = String(component.properties.borderColor ?? '#e2e8f0');
      ctx.lineWidth = Number(component.properties.borderWidth ?? 1);
      ctx.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);

      // Render component content based on type
      switch (component.type) {
        case 'text':
          ctx.fillStyle = String(component.properties.color ?? '#000000');
          ctx.font = `${Number(component.properties.fontSize ?? 16)}px ${String(component.properties.fontFamily ?? 'Arial')}`;
          ctx.fillText(
            String(component.properties.text ?? 'Text Component'),
            bounds.x + 10,
            bounds.y + bounds.height / 2 + 6
          );
          break;

        case 'button':
          // Button background
          ctx.fillStyle = String(
            component.properties.backgroundColor ?? '#3b82f6'
          );
          ctx.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);

          // Button text
          ctx.fillStyle = String(component.properties.color ?? '#ffffff');
          ctx.font = `${Number(component.properties.fontSize ?? 14)}px ${String(component.properties.fontFamily ?? 'Arial')}`;
          ctx.textAlign = 'center';
          ctx.fillText(
            String(component.properties.text ?? 'Button'),
            bounds.x + bounds.width / 2,
            bounds.y + bounds.height / 2 + 4
          );
          ctx.textAlign = 'start';
          break;

        case 'image':
          ctx.fillStyle = '#f3f4f6';
          ctx.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);
          ctx.strokeStyle = '#d1d5db';
          ctx.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);

          // Image icon
          ctx.fillStyle = '#9ca3af';
          ctx.font = '20px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(
            '🖼️',
            bounds.x + bounds.width / 2,
            bounds.y + bounds.height / 2 + 8
          );
          ctx.textAlign = 'start';
          break;
      }

      // Render selection indicator
      if (canvasState.selectedComponents.includes(component.id)) {
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.strokeRect(
          bounds.x - 2,
          bounds.y - 2,
          bounds.width + 4,
          bounds.height + 4
        );
        ctx.setLineDash([]);

        // Render resize handles
        const handleSize = 8;
        ctx.fillStyle = '#3b82f6';

        // Corner handles
        ctx.fillRect(
          bounds.x - handleSize / 2,
          bounds.y - handleSize / 2,
          handleSize,
          handleSize
        );
        ctx.fillRect(
          bounds.x + bounds.width - handleSize / 2,
          bounds.y - handleSize / 2,
          handleSize,
          handleSize
        );
        ctx.fillRect(
          bounds.x - handleSize / 2,
          bounds.y + bounds.height - handleSize / 2,
          handleSize,
          handleSize
        );
        ctx.fillRect(
          bounds.x + bounds.width - handleSize / 2,
          bounds.y + bounds.height - handleSize / 2,
          handleSize,
          handleSize
        );
      }
    },
    [canvasState.selectedComponents]
  );

  const renderCanvas = useCallback(() => {
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;

    const { width, height } = canvas.getBoundingClientRect();

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Apply pan and zoom transformations
    ctx.save();
    ctx.translate(canvasState.pan.x, canvasState.pan.y);
    ctx.scale(canvasState.zoom, canvasState.zoom);

    // Render grid
    ctx.strokeStyle = theme === 'dark' ? '#374151' : '#f1f5f9';
    ctx.lineWidth = 1;
    const gridSize = 20;
    const startX =
      (((-canvasState.pan.x / canvasState.zoom) % gridSize) + gridSize) %
      gridSize;
    const startY =
      (((-canvasState.pan.y / canvasState.zoom) % gridSize) + gridSize) %
      gridSize;

    for (let x = startX; x < width / canvasState.zoom; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height / canvasState.zoom);
      ctx.stroke();
    }

    for (let y = startY; y < height / canvasState.zoom; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width / canvasState.zoom, y);
      ctx.stroke();
    }

    // Render components
    components.forEach((component) => {
      renderComponent(component);
    });

    ctx.restore();
  }, [canvasState.pan, canvasState.zoom, components, renderComponent, theme]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Delete':
        case 'Backspace':
          dispatch(
            setComponents(
              components.filter(
                (c) => !canvasState.selectedComponents.includes(c.id)
              )
            )
          );
          setCanvasState((prev) => ({ ...prev, selectedComponents: [] }));
          break;
        case 'Escape':
          setCanvasState((prev) => ({ ...prev, selectedComponents: [] }));
          break;
        case 'a':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            setCanvasState((prev) => ({
              ...prev,
              selectedComponents: components.map((c) => c.id)
            }));
          }
          break;
        case 'z':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            if (e.shiftKey) {
              handleRedo();
            } else {
              handleUndo();
            }
          }
          break;
      }
    },
    [
      canvasState.selectedComponents,
      components,
      handleUndo,
      handleRedo,
      dispatch
    ]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left - canvasState.pan.x) / canvasState.zoom;
      const y = (e.clientY - rect.top - canvasState.pan.y) / canvasState.zoom;

      // Check if clicking on a component
      const clickedComponent = components.find(
        (component) =>
          x >= component.bounds.x &&
          x <= component.bounds.x + component.bounds.width &&
          y >= component.bounds.y &&
          y <= component.bounds.y + component.bounds.height
      );

      if (clickedComponent) {
        setCanvasState((prev) => ({
          ...prev,
          selectedComponents: e.shiftKey
            ? [...prev.selectedComponents, clickedComponent.id]
            : [clickedComponent.id]
        }));
        setIsDragging(true);
      } else {
        setCanvasState((prev) => ({ ...prev, selectedComponents: [] }));
      }
    },
    [canvasState.pan, canvasState.zoom, components]
  );

  const handleMouseMove = useCallback(
    (_e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isDragging) return;

      // Handle dragging logic here
      // This would update component positions based on mouse movement
    },
    [isDragging]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent<HTMLCanvasElement>) => {
      touchStartTimeRef.current = Date.now();

      if (e.touches.length === 1) {
        const canvas = canvasRef.current;
        if (canvas) {
          const rect = canvas.getBoundingClientRect();
          const x =
            (e.touches[0].clientX - rect.left - canvasState.pan.x) /
            canvasState.zoom;
          const y =
            (e.touches[0].clientY - rect.top - canvasState.pan.y) /
            canvasState.zoom;

          const clickedComponent = components.find(
            (component) =>
              x >= component.bounds.x &&
              x <= component.bounds.x + component.bounds.width &&
              y >= component.bounds.y &&
              y <= component.bounds.y + component.bounds.height
          );

          if (clickedComponent) {
            setCanvasState((prev) => ({
              ...prev,
              selectedComponents: [clickedComponent.id]
            }));
          } else {
            setCanvasState((prev) => ({ ...prev, selectedComponents: [] }));
          }
        }
      }

      // Handle multi-touch gestures
      if (e.touches.length === 2) {
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];

        const distance = Math.sqrt(
          Math.pow(touch2.clientX - touch1.clientX, 2) +
            Math.pow(touch2.clientY - touch1.clientY, 2)
        );

        setLastTouch({
          startDistance: distance,
          startZoom: canvasState.zoom
        });
      }

      // Long press detection
      longPressTimerRef.current = window.setTimeout(() => {
        // Handle long press (context menu, etc.)
        if ('vibrate' in navigator) {
          navigator.vibrate(50);
        }
      }, 500);
    },
    [canvasState.zoom, canvasState.pan, components]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent<HTMLCanvasElement>) => {
      e.preventDefault();

      if (
        e.touches.length === 2 &&
        lastTouch?.startDistance !== undefined &&
        lastTouch?.startZoom !== undefined
      ) {
        // Handle pinch-to-zoom
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];

        const distance = Math.sqrt(
          Math.pow(touch2.clientX - touch1.clientX, 2) +
            Math.pow(touch2.clientY - touch1.clientY, 2)
        );

        const scale = distance / lastTouch.startDistance!;
        const newZoom = Math.max(
          0.1,
          Math.min(5, lastTouch.startZoom! * scale)
        );

        setCanvasState((prev) => ({ ...prev, zoom: newZoom }));
      } else if (e.touches.length === 1) {
        // Handle single-touch pan
        const canvas = canvasRef.current;
        if (!canvas) return;

        canvas.getBoundingClientRect();
      }
    },
    [lastTouch]
  );

  const handleTouchEnd = useCallback(() => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
    }
    setLastTouch(null);
  }, []);

  // Initialize canvas on mount
  useEffect(() => {
    const cleanup = initializeCanvas();
    return () => {
      cleanup?.();
    };
  }, [initializeCanvas]);

  // Render canvas whenever relevant state changes
  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  // Keyboard event listeners
  useEffect(() => {
    const undoHandler = () => handleUndo();
    const redoHandler = () => handleRedo();

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('editor-undo', undoHandler);
    window.addEventListener('editor-redo', redoHandler);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('editor-undo', undoHandler);
      window.removeEventListener('editor-redo', redoHandler);
    };
  }, [handleKeyDown, handleUndo, handleRedo]);

  return (
    <div
      ref={containerRef}
      className="canvas-container"
      style={{
        width: resolution ? `${resolution.width}px` : '100%',
        height: resolution ? `${resolution.height}px` : '100%',
        margin: resolution ? '0 auto' : undefined,
        position: 'relative',
        overflow: 'hidden',
        background: theme === 'dark' ? '#1e293b' : '#f8fafc',
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
      role="img"
      aria-label={ariaLabel || 'Design Canvas'}
    >
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          display: 'block',
          touchAction: 'none',
          userSelect: 'none'
        }}
        aria-label="Interactive design canvas"
      />

      {components.map((component) =>
        canvasState.selectedComponents.includes(component.id) ? (
          <DraggableOverlay key={component.id} component={component} />
        ) : null
      )}

      {/* Canvas controls overlay */}
      <div
        style={{
          position: 'absolute',
          bottom: '16px',
          right: '16px',
          display: 'flex',
          gap: '8px',
          background: theme === 'dark' ? '#374151' : 'white',
          borderRadius: '8px',
          padding: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}
      >
        <button
          onClick={() =>
            setCanvasState((prev) => ({
              ...prev,
              zoom: Math.max(0.1, prev.zoom - 0.1)
            }))
          }
          style={{
            padding: '8px 12px',
            border: 'none',
            borderRadius: '4px',
            background: theme === 'dark' ? '#4b5563' : '#f3f4f6',
            color: theme === 'dark' ? '#f8fafc' : '#1e293b',
            cursor: 'pointer'
          }}
          aria-label="Zoom out"
        >
          <ZoomOut aria-hidden="true" size="S" />
        </button>
        <span
          style={{
            padding: '8px 12px',
            color: theme === 'dark' ? '#f8fafc' : '#1e293b',
            fontSize: '14px'
          }}
        >
          {Math.round(canvasState.zoom * 100)}%
        </span>
        <button
          onClick={() =>
            setCanvasState((prev) => ({
              ...prev,
              zoom: Math.min(5, prev.zoom + 0.1)
            }))
          }
          style={{
            padding: '8px 12px',
            border: 'none',
            borderRadius: '4px',
            background: theme === 'dark' ? '#4b5563' : '#f3f4f6',
            color: theme === 'dark' ? '#f8fafc' : '#1e293b',
            cursor: 'pointer'
          }}
          aria-label="Zoom in"
        >
          <ZoomIn aria-hidden="true" size="S" />
        </button>
        <button
          onClick={() =>
            setCanvasState((prev) => ({
              ...prev,
              zoom: 1,
              pan: { x: 0, y: 0 }
            }))
          }
          style={{
            padding: '8px 12px',
            border: 'none',
            borderRadius: '4px',
            background: theme === 'dark' ? '#4b5563' : '#f3f4f6',
            color: theme === 'dark' ? '#f8fafc' : '#1e293b',
            cursor: 'pointer'
          }}
          aria-label="Reset zoom and pan"
        >
          <Refresh aria-hidden="true" size="S" />
        </button>
      </div>
    </div>
  );
};
