import Refresh from '@spectrum-icons/workflow/Refresh';
import ZoomIn from '@spectrum-icons/workflow/ZoomIn';
import ZoomOut from '@spectrum-icons/workflow/ZoomOut';
import classNames from 'classnames';
import React from 'react';

export interface CanvasControlsProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  theme: 'light' | 'dark';
  className?: string;
}

export const CanvasControls: React.FC<CanvasControlsProps> = ({
  zoom,
  onZoomIn,
  onZoomOut,
  onResetView,
  theme,
  className
}) => {
  const controlsClasses = classNames(
    'canvas-controls',
    'absolute bottom-4 right-4 flex gap-2 rounded-lg p-2 shadow-md',
    {
      'bg-gray-700': theme === 'dark',
      'bg-white': theme === 'light'
    },
    className
  );

  const buttonClasses = classNames(
    'px-3 py-2 border-0 rounded cursor-pointer transition-colors',
    {
      'bg-gray-600 text-gray-100 hover:bg-gray-500': theme === 'dark',
      'bg-gray-100 text-gray-900 hover:bg-gray-200': theme === 'light'
    }
  );

  return (
    <div
      className={controlsClasses}
      data-testid="canvas-controls"
      role="toolbar"
      aria-label="Canvas zoom and pan controls"
    >
      <button
        onClick={onZoomOut}
        className={buttonClasses}
        aria-label="Zoom out"
        data-testid="zoom-out-button"
      >
        <ZoomOut aria-hidden="true" size="S" />
      </button>

      <span
        className={classNames('px-3 py-2 text-sm', {
          'text-gray-100': theme === 'dark',
          'text-gray-900': theme === 'light'
        })}
        data-testid="zoom-level"
        aria-live="polite"
        aria-atomic="true"
      >
        {Math.round(zoom * 100)}%
      </span>

      <button
        onClick={onZoomIn}
        className={buttonClasses}
        aria-label="Zoom in"
        data-testid="zoom-in-button"
      >
        <ZoomIn aria-hidden="true" size="S" />
      </button>

      <button
        onClick={onResetView}
        className={buttonClasses}
        aria-label="Reset zoom and pan"
        data-testid="reset-view-button"
      >
        <Refresh aria-hidden="true" size="S" />
      </button>
    </div>
  );
};