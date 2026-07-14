import React, { useEffect, useRef } from 'react';
import type { BaseComponent } from '../../types/component-base';
import type { EditorTheme } from '../../types/editor-types';

interface ShareOutputPreviewProps {
  components: BaseComponent[];
  theme: EditorTheme;
  width?: number;
  height?: number;
  'aria-label'?: string;
}

/**
 * Renders a static thumbnail of the current canvas output for share preview (E5).
 */
export const ShareOutputPreview: React.FC<ShareOutputPreviewProps> = ({
  components,
  theme,
  width = 440,
  height = 240,
  'aria-label': ariaLabel
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    ctx.fillStyle = theme === 'dark' ? '#111827' : '#f8fafc';
    ctx.fillRect(0, 0, width, height);

    if (components.length === 0) {
      ctx.fillStyle = theme === 'dark' ? '#9ca3af' : '#64748b';
      ctx.font = '14px system-ui, sans-serif';
      ctx.fillText('Empty canvas', 16, 28);
      return;
    }

    let minX = Number.POSITIVE_INFINITY;
    let minY = Number.POSITIVE_INFINITY;
    let maxX = Number.NEGATIVE_INFINITY;
    let maxY = Number.NEGATIVE_INFINITY;
    for (const component of components) {
      minX = Math.min(minX, component.bounds.x);
      minY = Math.min(minY, component.bounds.y);
      maxX = Math.max(maxX, component.bounds.x + component.bounds.width);
      maxY = Math.max(maxY, component.bounds.y + component.bounds.height);
    }

    const contentWidth = Math.max(1, maxX - minX);
    const contentHeight = Math.max(1, maxY - minY);
    const padding = 16;
    const scale = Math.min(
      (width - padding * 2) / contentWidth,
      (height - padding * 2) / contentHeight,
      1
    );
    const offsetX = (width - contentWidth * scale) / 2 - minX * scale;
    const offsetY = (height - contentHeight * scale) / 2 - minY * scale;

    for (const component of components) {
      const x = component.bounds.x * scale + offsetX;
      const y = component.bounds.y * scale + offsetY;
      const w = component.bounds.width * scale;
      const h = component.bounds.height * scale;

      ctx.fillStyle = String(
        component.properties.backgroundColor ??
          (component.type === 'button' ? '#0f766e' : '#ffffff')
      );
      ctx.fillRect(x, y, w, h);
      ctx.strokeStyle = String(component.properties.borderColor ?? '#cbd5e1');
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, w, h);

      const label = String(
        component.properties.text ?? component.name ?? component.type
      );
      ctx.fillStyle = String(component.properties.color ?? '#0f172a');
      ctx.font = `${Math.max(10, Math.min(16, h * 0.45))}px system-ui, sans-serif`;
      ctx.fillText(label.slice(0, 28), x + 6, y + Math.min(h - 4, h / 2 + 4), w - 12);
    }
  }, [components, height, theme, width]);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label={ariaLabel || 'Share output preview'}
      data-testid="share-output-preview"
      style={{
        width,
        height,
        borderRadius: '8px',
        border: `1px solid ${theme === 'dark' ? '#4b5563' : '#e2e8f0'}`,
        display: 'block',
        maxWidth: '100%'
      }}
    />
  );
};
