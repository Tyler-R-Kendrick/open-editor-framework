import React, { useState, useMemo, useEffect } from 'react';
import { EditorTheme } from '../../types/editor-types';
import {
  BaseComponent,
  ComponentPropertyValue
} from '../../types/component-base';
import { useAppDispatch, useAppSelector, updateComponent } from '../../store';
import {
  PropertyField,
  ControlPanelConfig,
  FieldRendererMap,
  PropertySection
} from './types';
import { defaultFieldRenderers } from './field-renderers';
import { defaultSections } from './config';

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
  const components = useAppSelector((state) => state.canvas.present.components);
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(
    null
  );
  const [properties, setProperties] = useState<PropertyField[]>([]);

  // Merge provided config with defaults
  const fieldRenderers: FieldRendererMap = useMemo(() => {
    return {
      ...(defaultFieldRenderers as FieldRendererMap),
      ...(config.fieldRenderers || {})
    };
  }, [config.fieldRenderers]);

  const baseSections = useMemo(
    () => config.sections || defaultSections,
    [config.sections]
  );

  const sections: PropertySection[] = useMemo(() => {
    const known = new Set(baseSections.flatMap((s) => s.fields));
    const extras = properties
      .map((p) => p.key)
      .filter((k) => !known.has(k));
    return extras.length > 0
      ? [...baseSections, { title: 'Other', fields: extras }]
      : baseSections;
  }, [baseSections, properties]);

  const loadComponentProperties = (component: BaseComponent | undefined) => {
    if (!component) {
      setProperties([]);
      return;
    }
    const fields: PropertyField[] = Object.entries(component.properties).map(
      ([key, value]) => {
        let type: string = 'text';
        if (typeof value === 'number') type = 'number';
        else if (typeof value === 'boolean') type = 'checkbox';
        else if (key.toLowerCase().includes('color')) type = 'color';
        return {
          key,
          label: key
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, (s) => s.toUpperCase()),
          type,
          value
        };
      }
    );
    setProperties(fields);
  };

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleSelection = (e: any) => {
      const id = e.detail.selectedComponents[0] ?? null;
      setSelectedComponentId(id);
    };
    window.addEventListener('selection-change', handleSelection as any);
    return () =>
      window.removeEventListener('selection-change', handleSelection as any);
  }, []);

  useEffect(() => {
    if (selectedComponentId) {
      loadComponentProperties(
        components.find((c) => c.id === selectedComponentId)
      );
    }
  }, [components, selectedComponentId]);

  const handlePropertyChange = (key: string, value: ComponentPropertyValue) => {
    setProperties((prev) =>
      prev.map((prop) => (prop.key === key ? { ...prop, value } : prop))
    );
    if (!selectedComponentId) return;
    const component = components.find((c) => c.id === selectedComponentId);
    if (!component) return;
    const updated = new BaseComponent({
      ...component,
      properties: { ...component.properties, [key]: value }
    });
    dispatch(updateComponent(updated));
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
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
          >
            {sections.map((section) => {
              const sectionFields = properties.filter((p) =>
                section.fields.includes(p.key)
              );

              if (sectionFields.length === 0) {
                return null;
              }

              return (
                <section key={section.title}>
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
                    {section.title}
                  </h3>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '16px'
                    }}
                  >
                    {sectionFields.map((property) => (
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
              );
            })}
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
                e.currentTarget.style.background =
                  theme === 'dark' ? '#6b7280' : '#f3f4f6';
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
