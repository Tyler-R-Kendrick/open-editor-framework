import type { BaseComponent, ComponentProperties, ComponentPropertyValue } from "./component-base";
export type EditorTheme = 'light' | 'dark';

export interface Point {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Bounds extends Point, Size { }

export interface EditorComponent {
  id: string;
  type: string;
  name: string;
  bounds: Bounds;
  properties: ComponentProperties;
  zIndex?: number;
  children?: EditorComponent[];
  parent?: string;
}

export interface ComponentDefinition {
  type: string;
  name: string;
  icon: string;
  category: string;
  description: string;
  defaultProperties: ComponentProperties;
  propertySchema: PropertySchema[];
}

export interface PropertySchema {
  key: string;
  type: 'string' | 'number' | 'boolean' | 'color' | 'select' | 'range';
  label: string;
  description?: string;
  default: ComponentPropertyValue;
  options?: string[]; // For select type
  min?: number; // For number/range type
  max?: number; // For number/range type
  step?: number; // For number/range type
}

export interface TouchGesture {
  type: 'tap' | 'longpress' | 'pan' | 'pinch' | 'swipe';
  startPoint: Point;
  currentPoint: Point;
  deltaX: number;
  deltaY: number;
  scale?: number;
  velocity?: Point;
  duration: number;
  startDistance?: number; // For pinch gestures
  startZoom?: number; // For zoom scaling
}

export interface CanvasState {
  zoom: number;
  pan: Point;
  selectedComponents: string[];
  clipboard: BaseComponent[];
  history: BaseComponent[][];
  historyIndex: number;
}

export interface AccessibilityOptions {
  highContrast: boolean;
  reducedMotion: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
}
