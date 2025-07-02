import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import type { BaseComponent } from '../../types/component-base';
import type { CanvasState } from '../../types/editor-types';

interface DraggableComponentProps {
  component: BaseComponent;
  canvasState: CanvasState;
  isSelected: boolean;
  onSelect?: (id: string) => void;
  onDoubleClick?: (id: string) => void;
}

export const DraggableComponent: React.FC<DraggableComponentProps> = ({
  component,
  canvasState,
  isSelected,
  onSelect,
  onDoubleClick
}) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: component.id,
      data: { type: 'component', component }
    });

  const style: React.CSSProperties = {
    position: 'absolute',
    left: component.bounds.x * canvasState.zoom + canvasState.pan.x,
    top: component.bounds.y * canvasState.zoom + canvasState.pan.y,
    width: component.bounds.width * canvasState.zoom,
    height: component.bounds.height * canvasState.zoom,
    transform: CSS.Transform.toString(transform),
    opacity: isDragging ? 0.5 : 1,
    cursor: isDragging ? 'grabbing' : 'grab',
    zIndex: isDragging ? 1000 : isSelected ? 999 : 1,
    border: isSelected ? '2px solid #3b82f6' : '2px solid transparent',
    borderRadius: 4,
    touchAction: 'none'
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect?.(component.id);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDoubleClick?.(component.id);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
      role="button"
      tabIndex={0}
      aria-label={`Draggable ${component.type} component`}
      data-testid={`draggable-component-${component.id}`}
    >
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
