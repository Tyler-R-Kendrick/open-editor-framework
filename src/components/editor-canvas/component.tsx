import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useDroppable,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import classNames from 'classnames';
import React, { useCallback, useEffect, useRef } from 'react';
import { ActionCreators } from 'redux-undo';

import { updateComponent } from '../../store';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { BaseComponent } from '../../types/component-base';
import { EditorTheme, Resolution } from '../../types/editor-types';

import { CanvasControls } from './CanvasControls';
import { CanvasRenderer, CanvasRendererRef } from './CanvasRenderer';
import { DraggableComponent } from './DraggableComponent';
import { useCanvasState } from './useCanvasState';

interface EditorCanvasProps {
  theme: EditorTheme;
  resolution?: Resolution;
  'aria-label'?: string;
  showGrid?: boolean;
  gridSize?: number;
  onComponentSelect?: (componentId: string) => void;
  onComponentEdit?: (componentId: string) => void;
}

/**
 * Refactored EditorCanvas component using modular sub-components
 * Features:
 * - Modular architecture with reusable components
 * - Custom hooks for state management
 * - Event-driven architecture
 * - Library-based gesture handling
 */
export const EditorCanvas: React.FC<EditorCanvasProps> = ({
  theme,
  resolution,
  'aria-label': ariaLabel = 'Design Canvas',
  showGrid = true,
  gridSize = 20,
  onComponentSelect,
  onComponentEdit
}) => {
  const dispatch = useAppDispatch();
  const components = useAppSelector((state) => state.canvas.present.components);
  const canvasRendererRef = useRef<CanvasRendererRef>(null);

  // Use custom hook for canvas state management
  const {
    zoom,
    pan,
    selectedComponents,
    zoomIn,
    zoomOut,
    resetView,
    selectComponent,
    deselectAll,
    bind
  } = useCanvasState({
    onSelectionChange: (ids) => {
      ids.forEach(id => onComponentSelect?.(id));
    }
  });

  // Configure drag sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  );

  // Handle component selection
  const handleComponentSelect = useCallback((componentId: string) => {
    selectComponent(componentId, false);
  }, [selectComponent]);

  // Handle component double-click (edit)
  const handleComponentDoubleClick = useCallback((componentId: string) => {
    onComponentEdit?.(componentId);
  }, [onComponentEdit]);

  // Handle drag start
  const handleDragStart = useCallback((event: DragStartEvent) => {
    const componentId = event.active.id as string;
    selectComponent(componentId, false);
  }, [selectComponent]);

  // Handle drag end
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, delta } = event;
    if (!delta) return;

    const componentId = active.id as string;
    const component = components.find((c: BaseComponent) => c.id === componentId);
    if (!component) return;

    // Calculate new position
    const deltaX = delta.x / zoom;
    const deltaY = delta.y / zoom;

    let newX = component.bounds.x + deltaX;
    let newY = component.bounds.y + deltaY;

    // Constrain to canvas bounds if resolution is set
    if (resolution) {
      newX = Math.max(0, Math.min(newX, resolution.width - component.bounds.width));
      newY = Math.max(0, Math.min(newY, resolution.height - component.bounds.height));
    }

    // Update component position
    dispatch(
      updateComponent(
        new BaseComponent({
          ...component,
          bounds: {
            ...component.bounds,
            x: newX,
            y: newY
          }
        })
      )
    );
  }, [components, zoom, resolution, dispatch]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Undo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        dispatch(ActionCreators.undo());
      }
      // Redo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && e.shiftKey) {
        e.preventDefault();
        dispatch(ActionCreators.redo());
      }
      // Escape
      if (e.key === 'Escape') {
        deselectAll();
      }
      // Select all
      if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
        e.preventDefault();
        const allIds = components.map(c => c.id);
        selectComponent(allIds[0], false);
        allIds.slice(1).forEach(id => selectComponent(id, true));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dispatch, deselectAll, selectComponent, components]);

  // Droppable canvas setup
  const { setNodeRef } = useDroppable({
    id: 'canvas-drop-zone',
    data: {
      type: 'canvas'
    }
  });

  const containerClasses = classNames(
    'canvas-container',
    'relative overflow-hidden',
    {
      'bg-slate-800': theme === 'dark',
      'bg-slate-50': theme === 'light'
    }
  );

  const containerStyle: React.CSSProperties = {
    width: resolution ? `${resolution.width}px` : '100%',
    height: resolution ? `${resolution.height}px` : '100%',
    margin: resolution ? '0 auto' : undefined,
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div
        ref={setNodeRef}
        className={containerClasses}
        style={containerStyle}
        aria-label={ariaLabel}
        data-testid="canvas-container"
        {...bind()}
      >
        {/* Canvas renderer */}
        <CanvasRenderer
          ref={canvasRendererRef}
          components={components}
          selectedComponents={selectedComponents}
          width={resolution?.width}
          height={resolution?.height}
          zoom={zoom}
          pan={pan}
          theme={theme}
          showGrid={showGrid}
          gridSize={gridSize}
        />

        {/* Draggable component overlays */}
        {components.map(component => (
          <DraggableComponent
            key={component.id}
            component={component}
            isSelected={selectedComponents.includes(component.id)}
            zoom={zoom}
            pan={pan}
            onSelect={handleComponentSelect}
            onDoubleClick={handleComponentDoubleClick}
          />
        ))}

        {/* Canvas controls */}
        <CanvasControls
          zoom={zoom}
          onZoomIn={zoomIn}
          onZoomOut={zoomOut}
          onResetView={resetView}
          theme={theme}
        />
      </div>
    </DndContext>
  );
};
