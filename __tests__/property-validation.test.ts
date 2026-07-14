import { validatePropertyValue } from '../src/utils/propertyValidation';

describe('property validation', () => {
  it('accepts valid string values for text fields', () => {
    expect(validatePropertyValue('text', 'Hello')).toEqual({
      valid: true,
      value: 'Hello'
    });
  });

  it('rejects empty required text', () => {
    const result = validatePropertyValue('text', '   ', { required: true });
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/required/i);
  });

  it('accepts finite numbers and rejects NaN', () => {
    expect(validatePropertyValue('fontSize', 16)).toEqual({
      valid: true,
      value: 16
    });
    expect(validatePropertyValue('fontSize', Number.NaN).valid).toBe(false);
  });

  it('validates hex colors', () => {
    expect(validatePropertyValue('color', '#3b82f6').valid).toBe(true);
    expect(validatePropertyValue('color', 'not-a-color').valid).toBe(false);
  });

  it('clamps numeric range values when min/max provided', () => {
    expect(
      validatePropertyValue('opacity', 150, {
        min: 0,
        max: 100,
        type: 'number'
      })
    ).toEqual({ valid: true, value: 100 });
  });
});
