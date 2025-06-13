import { describe, it, expect } from 'vitest';
import { ComponentHelper, AccessibilityHelper, CanvasHelper } from '../src/utils/helpers';

describe('ComponentHelper', () => {
  it('should generate unique IDs', () => {
    const id1 = ComponentHelper.generateId();
    const id2 = ComponentHelper.generateId();
    
    expect(id1).toMatch(/^component-\d+-[a-z0-9]+$/);
    expect(id2).toMatch(/^component-\d+-[a-z0-9]+$/);
    expect(id1).not.toBe(id2);
  });

  it('should create a component with correct structure', () => {
    const component = ComponentHelper.createComponent(
      'text',
      { x: 10, y: 20, width: 100, height: 50 },
      { text: 'Hello World' }
    );

    expect(component).toHaveProperty('id');
    expect(component.type).toBe('text');
    expect(component.name).toBe('Text Component');
    expect(component.bounds).toEqual({ x: 10, y: 20, width: 100, height: 50 });
    expect(component.properties).toEqual({ text: 'Hello World' });
    expect(component.children).toEqual([]);
  });

  it('should check if point is within bounds', () => {
    const bounds = { x: 10, y: 10, width: 100, height: 100 };
    
    expect(ComponentHelper.isPointInBounds({ x: 50, y: 50 }, bounds)).toBe(true);
    expect(ComponentHelper.isPointInBounds({ x: 5, y: 50 }, bounds)).toBe(false);
    expect(ComponentHelper.isPointInBounds({ x: 115, y: 50 }, bounds)).toBe(false);
  });

  it('should calculate bounds center correctly', () => {
    const bounds = { x: 10, y: 20, width: 100, height: 80 };
    const center = ComponentHelper.getBoundsCenter(bounds);
    
    expect(center).toEqual({ x: 60, y: 60 });
  });
});

describe('AccessibilityHelper', () => {
  it('should detect motion preference', () => {
    const motion = AccessibilityHelper.getPreferredMotion();
    expect(['full', 'reduced']).toContain(motion);
  });

  it('should detect contrast preference', () => {
    const contrast = AccessibilityHelper.getPreferredContrast();
    expect(['normal', 'high']).toContain(contrast);
  });
});

describe('CanvasHelper', () => {
  it('should create a mock canvas context', () => {
    // Create a minimal mock canvas for testing
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    
    const ctx = canvas.getContext('2d');
    expect(ctx).toBeTruthy();
  });
});
