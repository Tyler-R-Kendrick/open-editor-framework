import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  UniqueIdentifier,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import Refresh from '@spectrum-icons/workflow/Refresh';
import ZoomIn from '@spectrum-icons/workflow/ZoomIn';
import ZoomOut from '@spectrum-icons/workflow/ZoomOut';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActionCreators } from 'redux-undo';
import { setComponents, updateComponent } from '../../store';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { BaseComponent } from '../../types/component-base';
import { EditorTheme } from '../../types/editor-types';

import type { Resolution } from '../../types/editor-types';

interface PinchState {
  startDistance: number;
  startZoom: number;
}

interface EditorCanvasProps {
  theme: EditorTheme;
  resolution?: Resolution;
  'aria-label'?: string;
}

interface CanvasState {
  zoom: number;
  pan: { x: number; y: number };
  selectedComponents: string[];
}

interface DraggableComponentProps {
  component: BaseComponent;
  canvasState: CanvasState;
  isSelected: boolean;
}

const DraggableComponent: React.FC<DraggableComponentProps> = ({
  component,
  canvasState,
  isSelected
}) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: component.id,
      data: {
        type: 'component',
        component
      }
    });

  const style = {
    position: 'absolute' as const,
    left: component.bounds.x * canvasState.zoom + canvasState.pan.x,
    top: component.bounds.y * canvasState.zoom + canvasState.pan.y,
    width: component.bounds.width * canvasState.zoom,
    height: component.bounds.height * canvasState.zoom,
    transform: CSS.Transform.toString(transform),
    opacity: isDragging ? 0.5 : 1,
    cursor: isDragging ? 'grabbing' : 'grab',
    zIndex: isDragging ? 1000 : isSelected ? 999 : 1,
    border: isSelected ? '2px solid #3b82f6' : '2px solid transparent',
    borderRadius: '4px',
    touchAction: 'none'
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      aria-label={`Draggable ${component.type} component`}
      data-testid={`draggable-component-${component.id}`}
    >
      {/* Drag handle overlay - this ensures the whole component is draggable */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'transparent',
          zIndex: 1
        }}
        aria-hidden="true"
      />
    </div>
  );
};

interface DroppableCanvasProps {
  children: React.ReactNode;
  containerRef: React.RefObject<HTMLDivElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  theme: EditorTheme;
  resolution?: Resolution;
  canvasState: CanvasState;
  setCanvasState: React.Dispatch<React.SetStateAction<CanvasState>>;
  _components: BaseComponent[];
  handleMouseDown: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  handleMouseMove: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  handleMouseUp: () => void;
  handleTouchStart: (e: React.TouchEvent<HTMLCanvasElement>) => void;
  handleTouchMove: (e: React.TouchEvent<HTMLCanvasElement>) => void;
  handleTouchEnd: () => void;
}

const DroppableCanvas: React.FC<DroppableCanvasProps> = ({
  children,
  containerRef,
  canvasRef,
  theme,
  resolution,
  canvasState,
  setCanvasState,
  _components,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp,
  handleTouchStart,
  handleTouchMove,
  handleTouchEnd
}) => {
  const { setNodeRef } = useDroppable({
    id: 'canvas-drop-zone',
    data: {
      type: 'canvas'
    }
  });

  return (
    <div
      ref={(node) => {
        setNodeRef(node);
        if (containerRef.current !== node) {
          containerRef.current = node;
        }
      }}
      className="canvas-container"
      style={{
        width: resolution ? `${resolution.width}px` : '100%',
        height: resolution ? `${resolution.height}px` : '100%',
        margin: resolution ? '0 auto' : undefined,
        position: 'relative',
        overflow: 'hidden',
        background: theme === 'dark' ? '#1e293b' : '#f8fafc'
      }}
      role="img"
      aria-label="Design Canvas"
      data-testid="canvas-container"
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
          touchAction: 'pan-x pan-y pinch-zoom',
          userSelect: 'none'
        }}
        aria-label="Interactive design canvas"
        data-testid="canvas"
      />

      {children}

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
        data-testid="canvas-controls"
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
          data-testid="zoom-out-button"
        >
          <ZoomOut aria-hidden="true" size="S" />
        </button>
        <span
          style={{
            padding: '8px 12px',
            color: theme === 'dark' ? '#f8fafc' : '#1e293b',
            fontSize: '14px'
          }}
          data-testid="zoom-level"
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
          data-testid="zoom-in-button"
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
          data-testid="reset-view-button"
        >
          <Refresh aria-hidden="true" size="S" />
        </button>
      </div>
    </div>
  );
};

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
  resolution
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const touchStartTimeRef = useRef(0);
  const longPressTimerRef = useRef<number | null>(null);

  const [canvasState, setCanvasState] = useState({
    zoom: 1,
    pan: { x: 0, y: 0 },
    selectedComponents: [] as string[]
  });

  const dispatch = useAppDispatch();
  const components = useAppSelector((state) => state.canvas.present.components);
  const [_isDragging, setIsDragging] = useState(false);
  const [lastTouch, setLastTouch] = useState<PinchState | null>(null);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

  // Configure drag sensors with better touch support
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8 // 8px movement required to start drag
      }
    }),
    useSensor(KeyboardSensor)
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id);
    setIsDragging(true);

    // Clear any pending long press timer
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }

    // Select the component being dragged
    const componentId = event.active.id as string;
    setCanvasState((prev) => ({
      ...prev,
      selectedComponents: [componentId]
    }));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over, delta } = event;

    setActiveId(null);
    setIsDragging(false);

    if (!over || !delta) return;

    // Calculate new position based on drag delta
    const componentId = active.id as string;
    const component = components.find((c) => c.id === componentId);

    if (!component) return;

    // Convert pixel delta to canvas coordinates
    const deltaX = delta.x / canvasState.zoom;
    const deltaY = delta.y / canvasState.zoom;

    const newX = component.bounds.x + deltaX;
    const newY = component.bounds.y + deltaY;

    // Constrain to canvas bounds
    let constrainedX = newX;
    let constrainedY = newY;

    if (resolution) {
      constrainedX = Math.max(
        0,
        Math.min(newX, resolution.width - component.bounds.width)
      );
      constrainedY = Math.max(
        0,
        Math.min(newY, resolution.height - component.bounds.height)
      );
    }

    // Update component position
    dispatch(
      updateComponent(
        new BaseComponent({
          ...component,
          bounds: {
            ...component.bounds,
            x: constrainedX,
            y: constrainedY
          }
        })
      )
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
      } else {
        setCanvasState((prev) => ({ ...prev, selectedComponents: [] }));
      }
    },
    [canvasState.pan, canvasState.zoom, components]
  );

  const handleMouseMove = useCallback(
    (_e: React.MouseEvent<HTMLCanvasElement>) => {
      // Mouse move handled by DnD context
    },
    []
  );

  const handleMouseUp = useCallback(() => {
    // Mouse up handled by DnD context
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

          if (!clickedComponent) {
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
    },
    [canvasState.zoom, canvasState.pan, components]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent<HTMLCanvasElement>) => {
      // Only prevent default for multi-touch gestures
      if (e.touches.length > 1) {
        e.preventDefault();
      }

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
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <DroppableCanvas
        containerRef={containerRef}
        canvasRef={canvasRef}
        theme={theme}
        resolution={resolution}
        canvasState={canvasState}
        setCanvasState={setCanvasState}
        _components={components}
        handleMouseDown={handleMouseDown}
        handleMouseMove={handleMouseMove}
        handleMouseUp={handleMouseUp}
        handleTouchStart={handleTouchStart}
        handleTouchMove={handleTouchMove}
        handleTouchEnd={handleTouchEnd}
      >
        {components.map((component) => (
          <DraggableComponent
            key={component.id}
            component={component}
            canvasState={canvasState}
            isSelected={canvasState.selectedComponents.includes(component.id)}
          />
        ))}
      </DroppableCanvas>

      <DragOverlay>
        {activeId ? (
          <div
            style={{
              width: '100px',
              height: '60px',
              backgroundColor: '#3b82f6',
              opacity: 0.8,
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '12px'
            }}
          >
            Dragging...
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};
