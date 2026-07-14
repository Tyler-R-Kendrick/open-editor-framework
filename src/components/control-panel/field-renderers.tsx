import React from 'react';
import { FieldRenderer, BuiltInFieldRendererMap } from './types';

// Shared base input style for consistent styling across field renderers
export const getBaseInputStyle = (theme: 'light' | 'dark') => ({
  width: '100%',
  padding: '8px 12px',
  border: `1px solid ${theme === 'dark' ? '#6b7280' : '#d1d5db'}`,
  borderRadius: '6px',
  background: theme === 'dark' ? '#4b5563' : '#ffffff',
  color: theme === 'dark' ? '#f8fafc' : '#1e293b',
  fontSize: '14px',
  outline: 'none',
  transition: 'border-color 0.2s ease'
});

function FieldError({
  error,
  theme
}: {
  error?: string;
  theme: 'light' | 'dark';
}) {
  if (!error) return null;
  return (
    <div
      role="alert"
      style={{
        marginTop: '4px',
        fontSize: '12px',
        color: theme === 'dark' ? '#fca5a5' : '#dc2626'
      }}
    >
      {error}
    </div>
  );
}

export const TextFieldRenderer: FieldRenderer = ({
  property,
  theme,
  onChange,
  onCommit,
  error
}) => {
  const baseInputStyle = getBaseInputStyle(theme);

  return (
    <div>
      <input
        type="text"
        value={String(property.value ?? '')}
        onChange={(e) => onChange(property.key, e.target.value)}
        onBlur={(e) => {
          e.target.style.borderColor = theme === 'dark' ? '#6b7280' : '#d1d5db';
          onCommit?.(property.key, e.target.value);
        }}
        style={{
          ...baseInputStyle,
          borderColor: error
            ? theme === 'dark'
              ? '#f87171'
              : '#dc2626'
            : baseInputStyle.border
        }}
        onFocus={(e) => (e.target.style.borderColor = '#3b82f6')}
        aria-invalid={Boolean(error)}
      />
      <FieldError error={error} theme={theme} />
    </div>
  );
};

export const NumberFieldRenderer: FieldRenderer = ({
  property,
  theme,
  onChange,
  onCommit,
  error
}) => {
  const baseInputStyle = getBaseInputStyle(theme);

  return (
    <div>
      <input
        type="number"
        value={Number(property.value ?? 0)}
        onChange={(e) => onChange(property.key, parseInt(e.target.value, 10))}
        onBlur={(e) => {
          e.target.style.borderColor = theme === 'dark' ? '#6b7280' : '#d1d5db';
          onCommit?.(property.key, parseInt(e.target.value, 10));
        }}
        style={baseInputStyle}
        onFocus={(e) => (e.target.style.borderColor = '#3b82f6')}
        aria-invalid={Boolean(error)}
      />
      <FieldError error={error} theme={theme} />
    </div>
  );
};

export const ColorFieldRenderer: FieldRenderer = ({
  property,
  theme,
  onChange,
  onCommit,
  error
}) => {
  const baseInputStyle = getBaseInputStyle(theme);

  return (
    <div>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <input
          type="color"
          value={String(property.value ?? '#000000')}
          onChange={(e) => onChange(property.key, e.target.value)}
          onBlur={(e) => onCommit?.(property.key, e.target.value)}
          style={{
            width: '40px',
            height: '40px',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        />
        <input
          type="text"
          value={String(property.value ?? '#000000')}
          onChange={(e) => onChange(property.key, e.target.value)}
          onBlur={(e) => {
            e.target.style.borderColor =
              theme === 'dark' ? '#6b7280' : '#d1d5db';
            onCommit?.(property.key, e.target.value);
          }}
          style={{ ...baseInputStyle, flex: 1 }}
          onFocus={(e) => (e.target.style.borderColor = '#3b82f6')}
          aria-invalid={Boolean(error)}
        />
      </div>
      <FieldError error={error} theme={theme} />
    </div>
  );
};

export const SelectFieldRenderer: FieldRenderer = ({
  property,
  theme,
  onChange,
  onCommit,
  error
}) => {
  const baseInputStyle = getBaseInputStyle(theme);

  return (
    <div>
      <select
        value={String(property.value ?? '')}
        onChange={(e) => {
          onChange(property.key, e.target.value);
          onCommit?.(property.key, e.target.value);
        }}
        style={baseInputStyle}
        onFocus={(e) => (e.target.style.borderColor = '#3b82f6')}
        onBlur={(e) =>
          (e.target.style.borderColor =
            theme === 'dark' ? '#6b7280' : '#d1d5db')
        }
        aria-invalid={Boolean(error)}
      >
        {property.options?.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <FieldError error={error} theme={theme} />
    </div>
  );
};

export const CheckboxFieldRenderer: FieldRenderer = ({
  property,
  theme,
  onChange,
  onCommit,
  error
}) => {
  return (
    <div>
      <label
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer'
        }}
      >
        <input
          type="checkbox"
          checked={Boolean(property.value)}
          onChange={(e) => {
            onChange(property.key, e.target.checked);
            onCommit?.(property.key, e.target.checked);
          }}
          style={{
            width: '16px',
            height: '16px',
            accentColor: '#3b82f6'
          }}
        />
        <span
          style={{
            fontSize: '14px',
            color: theme === 'dark' ? '#d1d5db' : '#374151'
          }}
        >
          {property.value ? 'Enabled' : 'Disabled'}
        </span>
      </label>
      <FieldError error={error} theme={theme} />
    </div>
  );
};

export const RangeFieldRenderer: FieldRenderer = ({
  property,
  theme,
  onChange,
  onCommit,
  error
}) => {
  return (
    <div>
      <input
        type="range"
        min={property.min}
        max={property.max}
        step={property.step}
        value={Number(property.value ?? 0)}
        onChange={(e) => onChange(property.key, parseInt(e.target.value, 10))}
        onMouseUp={(e) =>
          onCommit?.(
            property.key,
            parseInt((e.target as HTMLInputElement).value, 10)
          )
        }
        onTouchEnd={(e) =>
          onCommit?.(
            property.key,
            parseInt((e.target as HTMLInputElement).value, 10)
          )
        }
        style={{
          width: '100%',
          height: '6px',
          borderRadius: '3px',
          background: theme === 'dark' ? '#4b5563' : '#e5e7eb',
          outline: 'none',
          accentColor: '#3b82f6'
        }}
      />
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '4px',
          fontSize: '12px',
          color: theme === 'dark' ? '#9ca3af' : '#6b7280'
        }}
      >
        <span>{property.min}</span>
        <span
          style={{
            fontWeight: '500',
            color: theme === 'dark' ? '#f8fafc' : '#1e293b'
          }}
        >
          {Number(property.value ?? 0)}
        </span>
        <span>{property.max}</span>
      </div>
      <FieldError error={error} theme={theme} />
    </div>
  );
};

export const defaultFieldRenderers: BuiltInFieldRendererMap = {
  text: TextFieldRenderer,
  number: NumberFieldRenderer,
  color: ColorFieldRenderer,
  select: SelectFieldRenderer,
  checkbox: CheckboxFieldRenderer,
  range: RangeFieldRenderer
};
