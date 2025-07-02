import React, { useEffect, useMemo, useState } from 'react';
import { updateComponent } from '../../store';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { ComponentPropertyValue } from '../../types/component-base';
import { EditorTheme } from '../../types/editor-types';
import { defaultSections } from './config';
import { defaultFieldRenderers } from './field-renderers';
import { ControlPanelConfig, FieldRendererMap, PropertyField, PropertySection } from './types';

interface ControlPanelProps {
  theme: EditorTheme;
  'aria-label'?: string;
  config?: ControlPanelConfig;
}

/**
 * Control panel for editing component properties
 * Features:
 * - Dynamic property forms based on selected components
 * - Live preview of changes
 * - Grouped property categories
 * - Keyboard navigation support
 * - Touch-friendly controls
 * - Configurable field renderers and sections
 */
export const ControlPanel: React.FC<ControlPanelProps> = ({
  theme,
  'aria-label': ariaLabel,
  config = {}
}) => {
  const dispatch = useAppDispatch();
  const selectedComponents = useAppSelector((state: any) => state.canvas.present.selectedComponents);
  const components = useAppSelector((state: any) => state.canvas.present.components);

  const selectedComponent = useMemo(() => {
    if (selectedComponents.length === 1) {
      return components.find((c: any) => c.id === selectedComponents[0]);
    }
    return null;
  }, [selectedComponents, components]);

  const [properties, setProperties] = useState<PropertyField[]>([]);

  // Update properties when selected component changes
  useEffect(() => {
    if (selectedComponent) {
      // Convert component properties to PropertyField format
      const componentProperties: PropertyField[] = Object.entries(selectedComponent.properties).map(([key, value]) => ({
        key,
        label: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim(),
        type: typeof value === 'string' ? 'text' :
          typeof value === 'number' ? 'number' :
            typeof value === 'boolean' ? 'switch' : 'text',
        value: value as ComponentPropertyValue,
        required: false
      }));
      setProperties(componentProperties);
    } else {
      setProperties([]);
    }
  }, [selectedComponent]);

  // Merge provided config with defaults
  const fieldRenderers: FieldRendererMap = useMemo(() => {
    return {
      ...(defaultFieldRenderers as FieldRendererMap),
      ...(config.fieldRenderers || {})
    };
  }, [config.fieldRenderers]);

  const sections: PropertySection[] = useMemo(() =>
    config.sections || defaultSections,
    [config.sections]
  );

  const handlePropertyChange = (key: string, value: ComponentPropertyValue) => {
    if (selectedComponent) {
      dispatch(updateComponent({
        ...selectedComponent,
        properties: {
          ...selectedComponent.properties,
          [key]: value
        }
      }));
    }
  };

  const renderPropertyField = (property: PropertyField) => {
    const FieldRenderer = fieldRenderers[property.type];

    if (!FieldRenderer) {
      console.warn(`No renderer found for field type: ${property.type}`);
      return null;
    }

    return (
      <FieldRenderer
        property={property}
        theme={theme}
        onChange={handlePropertyChange}
      />
    );
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
        {selectedComponent ? (
          <p
            style={{
              margin: 0,
              fontSize: '14px',
              color: theme === 'dark' ? '#9ca3af' : '#6b7280'
            }}
          >
            {selectedComponent.type.charAt(0).toUpperCase() + selectedComponent.type.slice(1)} Component
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
      {selectedComponent ? (
        <div
          style={{
            flex: 1,
            overflow: 'auto',
            padding: '16px'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {properties.length > 0 ? (
              properties.map(property => (
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
              ))
            ) : (
              <p
                style={{
                  margin: 0,
                  fontSize: '14px',
                  color: theme === 'dark' ? '#9ca3af' : '#6b7280',
                  textAlign: 'center'
                }}
              >
                No editable properties
              </p>
            )}
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
      {selectedComponent && (
        <div
          style={{
            padding: '16px',
            borderTop: `1px solid ${theme === 'dark' ? '#4b5563' : '#e2e8f0'}`,
            background: theme === 'dark' ? '#4b5563' : '#f8fafc'
          }}
        >
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => {
                // Reset properties to default values
                if (selectedComponent) {
                  dispatch(updateComponent({
                    ...selectedComponent,
                    properties: {}
                  }));
                }
              }}
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
              onClick={() => {
                // Delete selected component
                console.log('Delete component:', selectedComponent.id);
              }}
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
