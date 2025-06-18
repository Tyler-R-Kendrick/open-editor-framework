import React, { useState } from 'react';
import { EditorTheme } from '../../types/editor-types';

interface ControlPanelProps {
  theme: EditorTheme;
  'aria-label'?: string;
}

interface PropertyField {
  key: string;
  label: string;
  type: 'text' | 'number' | 'color' | 'select' | 'checkbox' | 'range';
  value: any;
  options?: string[];
  min?: number;
  max?: number;
  step?: number;
}

/**
 * Control panel for editing component properties
 * Features:
 * - Dynamic property forms based on selected components
 * - Live preview of changes
 * - Grouped property categories
 * - Keyboard navigation support
 * - Touch-friendly controls
 */
export const ControlPanel: React.FC<ControlPanelProps> = ({ theme, 'aria-label': ariaLabel }) => {
  const [selectedComponentId] = useState<string | null>(null);
  const [properties, setProperties] = useState<PropertyField[]>([]);

  const handlePropertyChange = (key: string, value: any) => {
    setProperties(prev => prev.map(prop =>
      prop.key === key ? { ...prop, value } : prop
    ));
    console.log(`Property changed: ${key} = ${value}`);
  };

  const renderPropertyField = (property: PropertyField) => {
    const baseInputStyle = {
      width: '100%',
      padding: '8px 12px',
      border: `1px solid ${theme === 'dark' ? '#6b7280' : '#d1d5db'}`,
      borderRadius: '6px',
      background: theme === 'dark' ? '#4b5563' : '#ffffff',
      color: theme === 'dark' ? '#f8fafc' : '#1e293b',
      fontSize: '14px',
      outline: 'none',
      transition: 'border-color 0.2s ease'
    };

    switch (property.type) {
      case 'text':
        return (
          <input
            type="text"
            value={property.value}
            onChange={(e) => handlePropertyChange(property.key, e.target.value)}
            style={baseInputStyle}
            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.target.style.borderColor = theme === 'dark' ? '#6b7280' : '#d1d5db'}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            value={property.value}
            onChange={(e) => handlePropertyChange(property.key, parseInt(e.target.value))}
            style={baseInputStyle}
            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.target.style.borderColor = theme === 'dark' ? '#6b7280' : '#d1d5db'}
          />
        );

      case 'color':
        return (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input
              type="color"
              value={property.value}
              onChange={(e) => handlePropertyChange(property.key, e.target.value)}
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
              value={property.value}
              onChange={(e) => handlePropertyChange(property.key, e.target.value)}
              style={{ ...baseInputStyle, flex: 1 }}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = theme === 'dark' ? '#6b7280' : '#d1d5db'}
            />
          </div>
        );

      case 'select':
        return (
          <select
            value={property.value}
            onChange={(e) => handlePropertyChange(property.key, e.target.value)}
            style={baseInputStyle}
            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.target.style.borderColor = theme === 'dark' ? '#6b7280' : '#d1d5db'}
          >
            {property.options?.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case 'checkbox':
        return (
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={property.value}
              onChange={(e) => handlePropertyChange(property.key, e.target.checked)}
              style={{
                width: '16px',
                height: '16px',
                accentColor: '#3b82f6'
              }}
            />
            <span style={{ fontSize: '14px', color: theme === 'dark' ? '#d1d5db' : '#374151' }}>
              {property.value ? 'Enabled' : 'Disabled'}
            </span>
          </label>
        );

      case 'range':
        return (
          <div>
            <input
              type="range"
              min={property.min}
              max={property.max}
              step={property.step}
              value={property.value}
              onChange={(e) => handlePropertyChange(property.key, parseInt(e.target.value))}
              style={{
                width: '100%',
                height: '6px',
                borderRadius: '3px',
                background: theme === 'dark' ? '#4b5563' : '#e5e7eb',
                outline: 'none',
                accentColor: '#3b82f6'
              }}
            />
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '4px',
              fontSize: '12px',
              color: theme === 'dark' ? '#9ca3af' : '#6b7280'
            }}>
              <span>{property.min}</span>
              <span style={{ fontWeight: '500', color: theme === 'dark' ? '#f8fafc' : '#1e293b' }}>
                {property.value}
              </span>
              <span>{property.max}</span>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: theme === 'dark' ? '#374151' : 'white',
        overflow: 'hidden'
      }}
      aria-label={ariaLabel || 'Properties Panel'}
    >
      {/* Header */}
      <div
        style={{
          padding: '16px',
          borderBottom: `1px solid ${theme === 'dark' ? '#4b5563' : '#e2e8f0'}`
        }}
      >
        <h2
          style={{
            margin: '0 0 8px 0',
            fontSize: '18px',
            fontWeight: '600',
            color: theme === 'dark' ? '#f8fafc' : '#1e293b'
          }}
        >
          Properties
        </h2>
        {selectedComponentId ? (
          <p
            style={{
              margin: 0,
              fontSize: '14px',
              color: theme === 'dark' ? '#9ca3af' : '#6b7280'
            }}
          >
            Component ID: {selectedComponentId}
          </p>
        ) : (
          <p
            style={{
              margin: 0,
              fontSize: '14px',
              color: theme === 'dark' ? '#9ca3af' : '#6b7280'
            }}
          >
            No component selected
          </p>
        )}
      </div>

      {/* Properties form */}
      {selectedComponentId ? (
        <div
          style={{
            flex: 1,
            overflow: 'auto',
            padding: '16px'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Content Section */}
            <section>
              <h3
                style={{
                  margin: '0 0 12px 0',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: theme === 'dark' ? '#d1d5db' : '#374151',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
              >
                Content
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {properties.filter(p => ['text', 'fontSize', 'fontFamily', 'color'].includes(p.key)).map(property => (
                  <div key={property.key}>
                    <label
                      style={{
                        display: 'block',
                        marginBottom: '6px',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: theme === 'dark' ? '#f8fafc' : '#1e293b'
                      }}
                    >
                      {property.label}
                    </label>
                    {renderPropertyField(property)}
                  </div>
                ))}
              </div>
            </section>

            {/* Appearance Section */}
            <section>
              <h3
                style={{
                  margin: '0 0 12px 0',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: theme === 'dark' ? '#d1d5db' : '#374151',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
              >
                Appearance
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {properties.filter(p => ['backgroundColor', 'borderRadius', 'opacity'].includes(p.key)).map(property => (
                  <div key={property.key}>
                    <label
                      style={{
                        display: 'block',
                        marginBottom: '6px',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: theme === 'dark' ? '#f8fafc' : '#1e293b'
                      }}
                    >
                      {property.label}
                    </label>
                    {renderPropertyField(property)}
                  </div>
                ))}
              </div>
            </section>

            {/* Visibility Section */}
            <section>
              <h3
                style={{
                  margin: '0 0 12px 0',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: theme === 'dark' ? '#d1d5db' : '#374151',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
              >
                Visibility
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {properties.filter(p => ['visible'].includes(p.key)).map(property => (
                  <div key={property.key}>
                    <label
                      style={{
                        display: 'block',
                        marginBottom: '6px',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: theme === 'dark' ? '#f8fafc' : '#1e293b'
                      }}
                    >
                      {property.label}
                    </label>
                    {renderPropertyField(property)}
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      ) : (
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '32px',
            textAlign: 'center',
            color: theme === 'dark' ? '#9ca3af' : '#6b7280'
          }}
        >
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎯</div>
          <h3
            style={{
              margin: '0 0 8px 0',
              fontSize: '18px',
              fontWeight: '600',
              color: theme === 'dark' ? '#d1d5db' : '#374151'
            }}
          >
            No Component Selected
          </h3>
          <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.5' }}>
            Select a component on the canvas to edit its properties
          </p>
        </div>
      )}

      {/* Actions */}
      {selectedComponentId && (
        <div
          style={{
            padding: '16px',
            borderTop: `1px solid ${theme === 'dark' ? '#4b5563' : '#e2e8f0'}`,
            background: theme === 'dark' ? '#4b5563' : '#f8fafc'
          }}
        >
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => console.log('Reset properties')}
              style={{
                flex: 1,
                padding: '8px 16px',
                border: `1px solid ${theme === 'dark' ? '#6b7280' : '#d1d5db'}`,
                borderRadius: '6px',
                background: 'transparent',
                color: theme === 'dark' ? '#d1d5db' : '#374151',
                cursor: 'pointer',
                fontSize: '14px',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = theme === 'dark' ? '#6b7280' : '#f3f4f6';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              Reset
            </button>
            <button
              onClick={() => console.log('Delete component')}
              style={{
                flex: 1,
                padding: '8px 16px',
                border: '1px solid #dc2626',
                borderRadius: '6px',
                background: '#dc2626',
                color: '#ffffff',
                cursor: 'pointer',
                fontSize: '14px',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#b91c1c';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#dc2626';
              }}
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
