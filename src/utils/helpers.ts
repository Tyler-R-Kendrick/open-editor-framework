import { Point } from '../types/editor-types';
import { BaseComponent, ComponentProperties } from '../types/component-base';

/**
 * Utility functions for accessibility
 */
export class AccessibilityHelper {
  static announceToScreenReader(
    message: string,
    priority: 'polite' | 'assertive' = 'polite'
  ): void {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.style.position = 'absolute';
    announcement.style.left = '-10000px';
    announcement.style.width = '1px';
    announcement.style.height = '1px';
    announcement.style.overflow = 'hidden';
    announcement.textContent = message;

    document.body.appendChild(announcement);
    setTimeout(() => {
      if (document.body.contains(announcement)) {
        document.body.removeChild(announcement);
      }
    }, 1000);
  }

  static makeElementFocusable(element: HTMLElement, tabIndex = 0): void {
    element.tabIndex = tabIndex;
    if (!element.getAttribute('role')) {
      element.setAttribute('role', 'button');
    }
  }

  static addKeyboardNavigation(
    element: HTMLElement,
    handler: (e: KeyboardEvent) => void
  ): void {
    element.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handler(e);
      }
    });
  }

  static getPreferredMotion(): 'full' | 'reduced' {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? 'reduced'
      : 'full';
  }

  static getPreferredContrast(): 'normal' | 'high' {
    return window.matchMedia('(prefers-contrast: high)').matches
      ? 'high'
      : 'normal';
  }

  static isUsingScreenReader(): boolean {
    // Basic heuristic - not 100% accurate but covers most cases
    return (
      window.navigator.userAgent.includes('NVDA') ||
      window.navigator.userAgent.includes('JAWS') ||
      window.speechSynthesis?.speaking === false
    );
  }
}

/**
 * Utility functions for component management
 */
export class ComponentHelper {
  static generateId(): string {
    return `component-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  static createComponent(
    type: string,
    bounds: { x: number; y: number; width: number; height: number },
    properties: ComponentProperties = {}
  ): BaseComponent {
    return new BaseComponent({
      id: this.generateId(),
      type,
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} Component`,
      bounds,
      properties,
      children: [],
      parent: undefined
    });
  }

  static duplicateComponent(
    component: BaseComponent,
    offset: Point = { x: 20, y: 20 }
  ): BaseComponent {
    const newId = this.generateId();
    const children = component.children?.map((child) => {
      const dupChild = this.duplicateComponent(child, offset);
      dupChild.parent = newId;
      return dupChild;
    });

    return new BaseComponent({
      ...component,
      id: newId,
      bounds: {
        ...component.bounds,
        x: component.bounds.x + offset.x,
        y: component.bounds.y + offset.y
      },
      properties: { ...component.properties },
      children
    });
  }

  static isPointInBounds(
    point: Point,
    bounds: { x: number; y: number; width: number; height: number }
  ): boolean {
    return (
      point.x >= bounds.x &&
      point.x <= bounds.x + bounds.width &&
      point.y >= bounds.y &&
      point.y <= bounds.y + bounds.height
    );
  }

  static getBoundsCenter(bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  }): Point {
    return {
      x: bounds.x + bounds.width / 2,
      y: bounds.y + bounds.height / 2
    };
  }

  static expandBounds(
    bounds: { x: number; y: number; width: number; height: number },
    padding: number
  ) {
    return {
      x: bounds.x - padding,
      y: bounds.y - padding,
      width: bounds.width + padding * 2,
      height: bounds.height + padding * 2
    };
  }
}

/**
 * Utility functions for canvas operations
 */
export class CanvasHelper {
  static getHighDPIContext(
    canvas: HTMLCanvasElement
  ): CanvasRenderingContext2D | null {
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const devicePixelRatio = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * devicePixelRatio;
    canvas.height = rect.height * devicePixelRatio;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';

    ctx.scale(devicePixelRatio, devicePixelRatio);
    return ctx;
  }

  static drawGrid(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    gridSize: number = 20,
    color: string = '#e2e8f0'
  ): void {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.5;

    // Vertical lines
    for (let x = 0; x <= width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Horizontal lines
    for (let y = 0; y <= height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    ctx.restore();
  }

  static drawSelectionBorder(
    ctx: CanvasRenderingContext2D,
    bounds: { x: number; y: number; width: number; height: number },
    color: string = '#3b82f6'
  ): void {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.strokeRect(
      bounds.x - 2,
      bounds.y - 2,
      bounds.width + 4,
      bounds.height + 4
    );
    ctx.restore();
  }

  static drawResizeHandles(
    ctx: CanvasRenderingContext2D,
    bounds: { x: number; y: number; width: number; height: number },
    handleSize: number = 8,
    color: string = '#3b82f6'
  ): void {
    ctx.save();
    ctx.fillStyle = color;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;

    const handles = [
      { x: bounds.x - handleSize / 2, y: bounds.y - handleSize / 2 }, // Top-left
      {
        x: bounds.x + bounds.width - handleSize / 2,
        y: bounds.y - handleSize / 2
      }, // Top-right
      {
        x: bounds.x - handleSize / 2,
        y: bounds.y + bounds.height - handleSize / 2
      }, // Bottom-left
      {
        x: bounds.x + bounds.width - handleSize / 2,
        y: bounds.y + bounds.height - handleSize / 2
      } // Bottom-right
    ];

    handles.forEach((handle) => {
      ctx.fillRect(handle.x, handle.y, handleSize, handleSize);
      ctx.strokeRect(handle.x, handle.y, handleSize, handleSize);
    });

    ctx.restore();
  }
}

/**
 * Utility functions for data persistence
 */
export class DataHelper {
  static saveToLocalStorage(key: string, data: unknown): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
    }
  }

  static loadFromLocalStorage<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.warn('Failed to load from localStorage:', error);
      return defaultValue;
    }
  }

  static exportToJSON(data: unknown, filename: string): void {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  static importFromFile(file: File): Promise<unknown> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          resolve(data);
        } catch (_error) {
          reject(new Error('Invalid JSON file'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }
}
