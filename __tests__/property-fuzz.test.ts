import { validatePropertyValue } from '../src/utils/propertyValidation';

const KEYS = ['text', 'fontSize', 'color', 'opacity', 'visible'] as const;

function randomValue(key: (typeof KEYS)[number]): unknown {
  switch (key) {
    case 'text':
      return ['', '  ', 'Hello', 'A'.repeat(40)][Math.floor(Math.random() * 4)];
    case 'fontSize':
      return [12, 0, -1, Number.NaN, 999, '16'][Math.floor(Math.random() * 6)];
    case 'color':
      return ['#fff', '#3b82f6', 'red', '#gg0000', '#11223344'][
        Math.floor(Math.random() * 5)
      ];
    case 'opacity':
      return [-10, 0, 50, 100, 150][Math.floor(Math.random() * 5)];
    case 'visible':
      return [true, false, 'yes'][Math.floor(Math.random() * 3)];
    default:
      return null;
  }
}

describe('property fuzzing', () => {
  it('never throws for randomized property values', () => {
    for (let i = 0; i < 100; i += 1) {
      const key = KEYS[i % KEYS.length];
      const value = randomValue(key) as never;
      expect(() =>
        validatePropertyValue(key, value, {
          required: key === 'text',
          min: key === 'opacity' ? 0 : undefined,
          max: key === 'opacity' ? 100 : undefined,
          type:
            key === 'fontSize' || key === 'opacity'
              ? 'number'
              : key === 'color'
                ? 'color'
                : key === 'visible'
                  ? 'checkbox'
                  : 'text'
        })
      ).not.toThrow();
    }
  });

  it('always returns a structured validation result', () => {
    for (let i = 0; i < 50; i += 1) {
      const key = KEYS[i % KEYS.length];
      const result = validatePropertyValue(key, randomValue(key) as never);
      expect(result).toEqual(
        expect.objectContaining({
          valid: expect.any(Boolean)
        })
      );
      if (result.valid) {
        expect(result.value).toBeDefined();
      } else {
        expect(result.error).toEqual(expect.any(String));
      }
    }
  });
});
