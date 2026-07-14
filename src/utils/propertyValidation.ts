import type { ComponentPropertyValue } from '../types/component-base';

export interface ValidationOptions {
  required?: boolean;
  min?: number;
  max?: number;
  type?: 'text' | 'number' | 'color' | 'checkbox' | 'select' | 'range';
}

export interface ValidationResult {
  valid: boolean;
  value?: ComponentPropertyValue;
  error?: string;
}

const HEX_COLOR = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;

function inferType(
  key: string,
  value: ComponentPropertyValue,
  explicit?: ValidationOptions['type']
): NonNullable<ValidationOptions['type']> {
  if (explicit) return explicit;
  if (typeof value === 'number') return 'number';
  if (typeof value === 'boolean') return 'checkbox';
  if (key.toLowerCase().includes('color')) return 'color';
  return 'text';
}

export function validatePropertyValue(
  key: string,
  value: ComponentPropertyValue,
  options: ValidationOptions = {}
): ValidationResult {
  const type = inferType(key, value, options.type);

  if (options.required) {
    if (value === null || value === undefined) {
      return { valid: false, error: `${key} is required` };
    }
    if (typeof value === 'string' && value.trim() === '') {
      return { valid: false, error: `${key} is required` };
    }
  }

  if (type === 'text' || type === 'select') {
    return { valid: true, value: value == null ? '' : String(value) };
  }

  if (type === 'checkbox') {
    return { valid: true, value: Boolean(value) };
  }

  if (type === 'number' || type === 'range') {
    const numeric =
      typeof value === 'number' ? value : Number.parseFloat(String(value));
    if (!Number.isFinite(numeric)) {
      return { valid: false, error: `${key} must be a number` };
    }
    let next = numeric;
    if (typeof options.min === 'number') next = Math.max(options.min, next);
    if (typeof options.max === 'number') next = Math.min(options.max, next);
    return { valid: true, value: next };
  }

  if (type === 'color') {
    const color = String(value ?? '');
    if (!HEX_COLOR.test(color)) {
      return { valid: false, error: `${key} must be a hex color` };
    }
    return { valid: true, value: color };
  }

  return { valid: true, value };
}
