import React from 'react';
import classNames from 'classnames';
import ZoomIn from '@spectrum-icons/workflow/ZoomIn';
import ZoomOut from '@spectrum-icons/workflow/ZoomOut';
import Refresh from '@spectrum-icons/workflow/Refresh';
import { EditorTheme } from '../../types/editor-types';

interface CanvasControlsProps {
  zoom: number;
  theme: EditorTheme;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
}

export const CanvasControls: React.FC<CanvasControlsProps> = ({
  zoom,
  theme,
  onZoomIn,
  onZoomOut,
  onResetView
}) => {
  const buttonClass = classNames(
    'p-2 rounded',
    theme === 'dark'
      ? 'bg-slate-700 text-slate-100 hover:bg-slate-600'
      : 'bg-white text-slate-600 hover:bg-slate-100'
  );

  const containerClass = classNames(
    'absolute bottom-4 right-4 flex gap-2 rounded-lg shadow',
    theme === 'dark' ? 'bg-slate-700' : 'bg-white'
  );

  const labelClass = classNames(
    'px-3 flex items-center text-sm',
    theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
  );

  return (
    <div className={containerClass} data-testid="canvas-controls">
      <button
        onClick={onZoomOut}
        className={buttonClass}
        aria-label="Zoom out"
        data-testid="zoom-out-button"
      >
        <ZoomOut aria-hidden="true" size="S" />
      </button>
      <span className={labelClass} data-testid="zoom-level">
        {Math.round(zoom * 100)}%
      </span>
      <button
        onClick={onZoomIn}
        className={buttonClass}
        aria-label="Zoom in"
        data-testid="zoom-in-button"
      >
        <ZoomIn aria-hidden="true" size="S" />
      </button>
      <button
        onClick={onResetView}
        className={buttonClass}
        aria-label="Reset zoom and pan"
        data-testid="reset-view-button"
      >
        <Refresh aria-hidden="true" size="S" />
      </button>
    </div>
  );
};
