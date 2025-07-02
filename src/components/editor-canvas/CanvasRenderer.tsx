import React, { useEffect } from 'react';
import type { BaseComponent } from '../../types/component-base';
import type {
  EditorTheme,
  Resolution,
  CanvasState
} from '../../types/editor-types';

interface CanvasRendererProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  canvasState: CanvasState;
  components: BaseComponent[];
  theme: EditorTheme;
  resolution?: Resolution;
  onCanvasReady?: () => void;
}

export const CanvasRenderer: React.FC<CanvasRendererProps> = ({
  canvasRef,
  canvasState,
  components,
  theme,
  resolution,
  onCanvasReady
}) => {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    onCanvasReady?.();

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.scale(dpr, dpr);
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    const observer = new ResizeObserver(resizeCanvas);
    observer.observe(canvas);
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      observer.disconnect();
    };
  }, [canvasRef, onCanvasReady]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { width, height } = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, width, height);
    ctx.save();
    ctx.translate(canvasState.pan.x, canvasState.pan.y);
    ctx.scale(canvasState.zoom, canvasState.zoom);

    ctx.strokeStyle = theme === 'dark' ? '#374151' : '#f1f5f9';
    ctx.lineWidth = 1;
    const gridSize = 20;
    for (let x = 0; x < width / canvasState.zoom; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height / canvasState.zoom);
      ctx.stroke();
    }
    for (let y = 0; y < height / canvasState.zoom; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width / canvasState.zoom, y);
      ctx.stroke();
    }

    components.forEach((c) => {
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      ctx.fillRect(c.bounds.x, c.bounds.y, c.bounds.width, c.bounds.height);
      ctx.strokeRect(c.bounds.x, c.bounds.y, c.bounds.width, c.bounds.height);
      if (canvasState.selectedComponents.includes(c.id)) {
        ctx.strokeStyle = '#3b82f6';
        ctx.setLineDash([5, 5]);
        ctx.strokeRect(
          c.bounds.x - 2,
          c.bounds.y - 2,
          c.bounds.width + 4,
          c.bounds.height + 4
        );
        ctx.setLineDash([]);
      }
    });
    ctx.restore();
  }, [canvasRef, canvasState, components, theme, resolution]);

  return null;
};
