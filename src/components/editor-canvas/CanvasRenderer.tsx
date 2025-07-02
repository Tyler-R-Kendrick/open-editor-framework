import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { BaseComponent } from '../../types/component-base';
import { EditorTheme } from '../../types/editor-types';
import { CanvasHelper } from '../../utils/helpers';

export interface CanvasRendererProps {
  components: BaseComponent[];
  selectedComponents: string[];
  width?: number;
  height?: number;
  zoom: number;
  pan: { x: number; y: number };
  theme: EditorTheme;
  gridSize?: number;
  showGrid?: boolean;
  onCanvasReady?: (ctx: CanvasRenderingContext2D) => void;
}

export interface CanvasRendererRef {
  getContext: () => CanvasRenderingContext2D | null;
  redraw: () => void;
}

export const CanvasRenderer = forwardRef<CanvasRendererRef, CanvasRendererProps>(({
  components,
  selectedComponents,
  width,
  height,
  zoom,
  pan,
  theme,
  gridSize = 20,
  showGrid = true,
  onCanvasReady
}, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  useImperativeHandle(ref, () => ({
    getContext: () => ctxRef.current,
    redraw: () => renderCanvas()
  }));

  const renderComponent = (ctx: CanvasRenderingContext2D, component: BaseComponent) => {
    const { bounds } = component;

    // Apply zoom and pan transformation
    ctx.save();
    ctx.translate(pan.x, pan.y);
    ctx.scale(zoom, zoom);

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
        ctx.fillStyle = String(component.properties.backgroundColor ?? '#3b82f6');
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

        // Image icon placeholder
        ctx.fillStyle = '#9ca3af';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(
          '🖼️',
          bounds.x + bounds.width / 2,
          bounds.y + bounds.height / 2
        );
        ctx.textAlign = 'start';
        break;

      default:
        // Default rectangle for unknown types
        ctx.fillStyle = '#f3f4f6';
        ctx.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);
    }

    // Draw selection border if selected
    if (selectedComponents.includes(component.id)) {
      CanvasHelper.drawSelectionBorder(ctx, bounds);
      CanvasHelper.drawResizeHandles(ctx, bounds);
    }

    ctx.restore();

    // Render children recursively
    if (component.children) {
      component.children.forEach(child => renderComponent(ctx, child));
    }
  };

  const renderCanvas = () => {
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set background
    ctx.fillStyle = theme === 'dark' ? '#1e293b' : '#f8fafc';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid if enabled
    if (showGrid) {
      ctx.save();
      ctx.translate(pan.x, pan.y);
      ctx.scale(zoom, zoom);
      CanvasHelper.drawGrid(
        ctx,
        width || canvas.width / zoom,
        height || canvas.height / zoom,
        gridSize,
        theme === 'dark' ? '#334155' : '#e2e8f0'
      );
      ctx.restore();
    }

    // Render all components
    components.forEach(component => renderComponent(ctx, component));
  };

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = CanvasHelper.getHighDPIContext(canvas);
    ctxRef.current = ctx;

    if (ctx && onCanvasReady) {
      onCanvasReady(ctx);
    }
  }, [onCanvasReady]);

  // Re-render when dependencies change
  useEffect(() => {
    renderCanvas();
  }, [components, selectedComponents, zoom, pan, theme, showGrid, gridSize, width, height]);

  return (
    <canvas
      ref={canvasRef}
      className="block select-none"
      style={{
        width: width || '100%',
        height: height || '100%',
        touchAction: 'none'
      }}
      aria-label="Canvas renderer"
      data-testid="canvas-renderer"
    />
  );
});

CanvasRenderer.displayName = 'CanvasRenderer';