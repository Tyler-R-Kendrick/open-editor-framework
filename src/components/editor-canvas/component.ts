import { LitElement, html, css } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import { EditorTheme, Point, CanvasState, EditorComponent, TouchGesture } from '../../types/editor-types';

// Import styles
const componentStyles = css`
:host {
  display: block;
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  background: #ffffff;
  touch-action: manipulation;
}

.canvas-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  cursor: crosshair;
}

.canvas-layer {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: auto;
}

.canvas-background {
  background-image: 
    radial-gradient(circle, #e2e8f0 1px, transparent 1px);
  background-size: 20px 20px;
  background-position: 0 0, 10px 10px;
}

.canvas-overlay {
  pointer-events: none;
  z-index: 10;
}

.selection-indicator {
  position: absolute;
  border: 2px solid var(--editor-primary, #3b82f6);
  background: transparent;
  pointer-events: none;
  z-index: 20;
}

.resize-handle {
  position: absolute;
  width: 8px;
  height: 8px;
  background: var(--editor-primary, #3b82f6);
  border: 1px solid white;
  cursor: se-resize;
  z-index: 30;
}

.canvas-info {
  position: absolute;
  top: 10px;
  left: 10px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-family: monospace;
  pointer-events: none;
  z-index: 40;
}

/* Touch-specific styles */
@media (pointer: coarse) {
  .resize-handle {
    width: 16px;
    height: 16px;
  }
  
  .canvas-container {
    touch-action: none;
  }
}

/* High contrast mode */
@media (prefers-contrast: high) {
  :host {
    border: 2px solid black;
  }
  
  .selection-indicator {
    border-color: black;
    border-width: 3px;
  }
}

/* Dark theme */
:host([theme="dark"]) {
  background: #1e293b;
}

:host([theme="dark"]) .canvas-background {
  background-image: 
    radial-gradient(circle, #475569 1px, transparent 1px);
}
`;

/**
 * HTML5 Canvas-based editor component with touch and accessibility support
 * Features:
 * - Touch-optimized interactions (pan, zoom, tap, long press)
 * - Keyboard accessibility and shortcuts
 * - Component selection and manipulation
 * - Canvas rendering with zoom/pan
 * - Multi-touch gesture support
 */
@customElement('editor-canvas')
export class EditorCanvas extends LitElement {
  static styles = componentStyles;

  @property() theme: EditorTheme = 'light';

  @state() private canvasState: CanvasState = {
    zoom: 1,
    pan: { x: 0, y: 0 },
    selectedComponents: [],
    clipboard: [],
    history: [],
    historyIndex: -1
  };

  @state() private components: EditorComponent[] = [];
  @state() private isDragging = false;
  @state() private isResizing = false;
  @state() private lastTouch: TouchGesture | null = null;

  @query('.canvas-container') private canvasContainer!: HTMLDivElement;
  @query('canvas') private canvas!: HTMLCanvasElement;

  private ctx: CanvasRenderingContext2D | null = null;
  private animationId: number | null = null;
  private touchStartTime = 0;
  private longPressTimer: number | null = null;

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('keydown', this.handleKeyDown);
    this.addEventListener('keyup', this.handleKeyUp);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('keydown', this.handleKeyDown);
    this.removeEventListener('keyup', this.handleKeyUp);
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }

  firstUpdated() {
    this.initializeCanvas();
    this.startRenderLoop();
  }

  private initializeCanvas() {
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.resizeCanvas();

    // Set up canvas for high DPI displays
    const devicePixelRatio = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();

    this.canvas.width = rect.width * devicePixelRatio;
    this.canvas.height = rect.height * devicePixelRatio;
    this.canvas.style.width = rect.width + 'px';
    this.canvas.style.height = rect.height + 'px';

    if (this.ctx) {
      this.ctx.scale(devicePixelRatio, devicePixelRatio);
    }
  }

  private resizeCanvas() {
    if (!this.canvas || !this.canvasContainer) return;

    const rect = this.canvasContainer.getBoundingClientRect();
    this.canvas.style.width = rect.width + 'px';
    this.canvas.style.height = rect.height + 'px';
  }

  private startRenderLoop() {
    const render = () => {
      this.renderCanvas();
      this.animationId = requestAnimationFrame(render);
    };
    render();
  }

  private renderCanvas() {
    if (!this.ctx || !this.canvas) return;

    const { width, height } = this.canvas.getBoundingClientRect();

    // Clear canvas
    this.ctx.clearRect(0, 0, width, height);

    // Apply pan and zoom transformations
    this.ctx.save();
    this.ctx.translate(this.canvasState.pan.x, this.canvasState.pan.y);
    this.ctx.scale(this.canvasState.zoom, this.canvasState.zoom);

    // Render components
    this.components.forEach(component => {
      this.renderComponent(component);
    });

    this.ctx.restore();
  }

  private renderComponent(component: EditorComponent) {
    if (!this.ctx) return;

    const { bounds } = component;

    // Render component background
    this.ctx.fillStyle = component.properties.backgroundColor || '#ffffff';
    this.ctx.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);

    // Render component border
    this.ctx.strokeStyle = component.properties.borderColor || '#e2e8f0';
    this.ctx.lineWidth = component.properties.borderWidth || 1;
    this.ctx.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);

    // Render component content based on type
    this.renderComponentContent(component);

    // Render selection indicator
    if (this.canvasState.selectedComponents.includes(component.id)) {
      this.renderSelectionIndicator(component);
    }
  }

  private renderComponentContent(component: EditorComponent) {
    if (!this.ctx) return;

    const { bounds, type, properties } = component;

    switch (type) {
      case 'text':
        this.ctx.fillStyle = properties.color || '#000000';
        this.ctx.font = `${properties.fontSize || 16}px ${properties.fontFamily || 'Arial'}`;
        this.ctx.fillText(
          properties.text || 'Text Component',
          bounds.x + 10,
          bounds.y + bounds.height / 2 + 6
        );
        break;

      case 'button':
        // Button background
        this.ctx.fillStyle = properties.backgroundColor || '#3b82f6';
        this.ctx.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);

        // Button text
        this.ctx.fillStyle = properties.color || '#ffffff';
        this.ctx.font = `${properties.fontSize || 14}px ${properties.fontFamily || 'Arial'}`;
        this.ctx.textAlign = 'center';
        this.ctx.fillText(
          properties.text || 'Button',
          bounds.x + bounds.width / 2,
          bounds.y + bounds.height / 2 + 4
        );
        this.ctx.textAlign = 'start';
        break;

      case 'image':
        // Placeholder for image
        this.ctx.fillStyle = '#f3f4f6';
        this.ctx.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);
        this.ctx.strokeStyle = '#d1d5db';
        this.ctx.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);

        // Image icon
        this.ctx.fillStyle = '#9ca3af';
        this.ctx.font = '20px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('🖼️', bounds.x + bounds.width / 2, bounds.y + bounds.height / 2 + 8);
        this.ctx.textAlign = 'start';
        break;
    }
  }

  private renderSelectionIndicator(component: EditorComponent) {
    if (!this.ctx) return;

    const { bounds } = component;

    // Selection border
    this.ctx.strokeStyle = '#3b82f6';
    this.ctx.lineWidth = 2;
    this.ctx.setLineDash([5, 5]);
    this.ctx.strokeRect(bounds.x - 2, bounds.y - 2, bounds.width + 4, bounds.height + 4);
    this.ctx.setLineDash([]);

    // Resize handles
    const handleSize = 8;
    const handles = [
      { x: bounds.x - handleSize / 2, y: bounds.y - handleSize / 2 }, // Top-left
      { x: bounds.x + bounds.width - handleSize / 2, y: bounds.y - handleSize / 2 }, // Top-right
      { x: bounds.x - handleSize / 2, y: bounds.y + bounds.height - handleSize / 2 }, // Bottom-left
      { x: bounds.x + bounds.width - handleSize / 2, y: bounds.y + bounds.height - handleSize / 2 } // Bottom-right
    ];

    handles.forEach(handle => {
      this.ctx!.fillStyle = '#3b82f6';
      this.ctx!.fillRect(handle.x, handle.y, handleSize, handleSize);
      this.ctx!.strokeStyle = '#ffffff';
      this.ctx!.lineWidth = 1;
      this.ctx!.strokeRect(handle.x, handle.y, handleSize, handleSize);
    });
  }

  // Touch event handlers
  private handleTouchStart = (e: TouchEvent) => {
    e.preventDefault();
    this.touchStartTime = Date.now();

    const touch = e.touches[0];
    const point = this.getTouchPoint(touch);

    // Start long press timer for context menu
    this.longPressTimer = window.setTimeout(() => {
      this.handleLongPress(point);
    }, 500);

    // Handle multi-touch for zoom/pan gestures
    if (e.touches.length === 2) {
      this.handlePinchStart(e);
    }
  };

  private handleTouchMove = (e: TouchEvent) => {
    e.preventDefault();

    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
      this.longPressTimer = null;
    }

    if (e.touches.length === 1) {
      this.handlePan(e);
    } else if (e.touches.length === 2) {
      this.handlePinch(e);
    }
  };

  private handleTouchEnd = (e: TouchEvent) => {
    e.preventDefault();

    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
      this.longPressTimer = null;
    }

    const duration = Date.now() - this.touchStartTime;

    // Handle tap if it was a quick touch
    if (duration < 200 && e.changedTouches.length === 1) {
      const touch = e.changedTouches[0];
      const point = this.getTouchPoint(touch);
      this.handleTap(point);
    }

    this.isDragging = false;
    this.isResizing = false;
  };

  private getTouchPoint(touch: Touch): Point {
    const rect = this.canvasContainer.getBoundingClientRect();
    return {
      x: (touch.clientX - rect.left - this.canvasState.pan.x) / this.canvasState.zoom,
      y: (touch.clientY - rect.top - this.canvasState.pan.y) / this.canvasState.zoom
    };
  }

  private handleTap(point: Point) {
    // Find component at touch point
    const component = this.findComponentAtPoint(point);

    if (component) {
      this.selectComponent(component.id);
    } else {
      this.clearSelection();
    }

    // Provide haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
  }

  private handleLongPress(point: Point) {
    // Show context menu or component properties
    this.dispatchEvent(new CustomEvent('context-menu', {
      detail: { point, components: this.findComponentAtPoint(point) }
    }));

    // Provide stronger haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate([20, 10, 20]);
    }
  }

  private handlePan(e: TouchEvent) {
    // Implementation for panning the canvas
    const touch = e.touches[0];
    const point = this.getTouchPoint(touch);

    if (!this.isDragging) {
      this.isDragging = true;
      return;
    }

    // Update pan state
    // Implementation details...
  }

  private handlePinchStart(e: TouchEvent) {
    // Initialize pinch gesture
  }

  private handlePinch(e: TouchEvent) {
    // Handle zoom gesture
  }

  // Keyboard event handlers
  private handleKeyDown = (e: KeyboardEvent) => {
    // Handle keyboard shortcuts for accessibility
    switch (e.key) {
      case 'Delete':
      case 'Backspace':
        this.deleteSelectedComponents();
        break;
      case 'Escape':
        this.clearSelection();
        break;
      case 'a':
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          this.selectAllComponents();
        }
        break;
      case 'c':
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          this.copySelectedComponents();
        }
        break;
      case 'v':
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          this.pasteComponents();
        }
        break;
      case 'z':
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          if (e.shiftKey) {
            this.redo();
          } else {
            this.undo();
          }
        }
        break;
    }
  };

  private handleKeyUp = (_e: KeyboardEvent) => {
    // Handle key up events if needed
  };

  // Utility methods
  private findComponentAtPoint(point: Point): EditorComponent | null {
    for (let i = this.components.length - 1; i >= 0; i--) {
      const component = this.components[i];
      const { bounds } = component;

      if (point.x >= bounds.x && point.x <= bounds.x + bounds.width &&
        point.y >= bounds.y && point.y <= bounds.y + bounds.height) {
        return component;
      }
    }
    return null;
  }

  private selectComponent(id: string) {
    this.canvasState.selectedComponents = [id];
    this.dispatchEvent(new CustomEvent('selection-change', {
      detail: { selectedComponents: this.canvasState.selectedComponents }
    }));
  }

  private clearSelection() {
    this.canvasState.selectedComponents = [];
    this.dispatchEvent(new CustomEvent('selection-change', {
      detail: { selectedComponents: this.canvasState.selectedComponents }
    }));
  }

  private selectAllComponents() {
    this.canvasState.selectedComponents = this.components.map(c => c.id);
    this.dispatchEvent(new CustomEvent('selection-change', {
      detail: { selectedComponents: this.canvasState.selectedComponents }
    }));
  }

  private deleteSelectedComponents() {
    // Implementation for deleting selected components
  }

  private copySelectedComponents() {
    // Implementation for copying components
  }

  private pasteComponents() {
    // Implementation for pasting components
  }

  private undo() {
    // Implementation for undo functionality
  }

  private redo() {
    // Implementation for redo functionality
  }

  private handleWheel = (e: WheelEvent) => {
    e.preventDefault();

    // Handle zoom with mouse wheel
    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    this.canvasState.zoom = Math.max(0.1, Math.min(5, this.canvasState.zoom * zoomFactor));
  };

  override render() {
    return html`
      <div 
        class="canvas-container canvas-background"
        @touchstart=${this.handleTouchStart}
        @touchmove=${this.handleTouchMove}
        @touchend=${this.handleTouchEnd}
        @wheel=${this.handleWheel}
        tabindex="0"
        role="img"
        aria-label="Design Canvas - Use arrow keys to navigate, Space to select">
        
        <canvas 
          class="canvas-layer"
          aria-hidden="true">
        </canvas>
        
        <div class="canvas-overlay">
          <!-- Selection indicators and other overlays will be rendered here -->
        </div>
        
        <div class="canvas-info">
          Zoom: ${Math.round(this.canvasState.zoom * 100)}% | 
          Components: ${this.components.length} | 
          Selected: ${this.canvasState.selectedComponents.length}
        </div>
      </div>
    `;
  }
}
