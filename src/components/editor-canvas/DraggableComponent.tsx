import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import classNames from 'classnames';
import React, { useCallback } from 'react';
import { BaseComponent } from '../../types/component-base';

export interface DraggableComponentProps {
  component: BaseComponent;
  isSelected: boolean;
  zoom: number;
  pan: { x: number; y: number };
  onSelect?: (componentId: string) => void;
  onDoubleClick?: (componentId: string) => void;
  className?: string;
}

export const DraggableComponent: React.FC<DraggableComponentProps> = ({
  component,
  isSelected,
  zoom,
  pan,
  onSelect,
  onDoubleClick,
  className
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging
  } = useDraggable({
    id: component.id,
    data: {
      type: 'component',
      component
    }
  });

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect?.(component.id);
  }, [component.id, onSelect]);

  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onDoubleClick?.(component.id);
  }, [component.id, onDoubleClick]);

  const componentClasses = classNames(
    'draggable-component',
    'absolute touch-none',
    {
      'opacity-50': isDragging,
      'cursor-grabbing': isDragging,
      'cursor-grab': !isDragging,
      'z-[1000]': isDragging,
      'z-[999]': isSelected && !isDragging,
      'z-[1]': !isSelected && !isDragging,
      'border-2 border-blue-500': isSelected,
      'border-2 border-transparent': !isSelected,
      'rounded': true
    },
    className
  );

  const style: React.CSSProperties = {
    left: component.bounds.x * zoom + pan.x,
    top: component.bounds.y * zoom + pan.y,
    width: component.bounds.width * zoom,
    height: component.bounds.height * zoom,
    transform: CSS.Transform.toString(transform),
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={componentClasses}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      {...listeners}
      {...attributes}
      aria-label={`Draggable ${component.type} component`}
      aria-selected={isSelected}
      role="button"
      data-testid={`draggable-component-${component.id}`}
    >
      {/* Drag handle overlay */}
      <div
        className="absolute inset-0 bg-transparent z-[1]"
        aria-hidden="true"
      />
    </div>
  );
};