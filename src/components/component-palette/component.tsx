import React, { useState } from 'react';
import { EditorTheme } from '../../types/editor-types';

interface ComponentPaletteProps {
  theme: EditorTheme;
  'aria-label'?: string;
}

interface ComponentTemplate {
  id: string;
  name: string;
  icon: string;
  description: string;
  category: string;
  template: {
    type: string;
    defaultSize: { width: number; height: number };
    properties: Record<string, any>;
  };
}

const componentTemplates: ComponentTemplate[] = [
  {
    id: 'text',
    name: 'Text',
    icon: '📝',
    description: 'Text component for labels and content',
    category: 'Basic',
    template: {
      type: 'text',
      defaultSize: { width: 200, height: 40 },
      properties: {
        text: 'Sample Text',
        fontSize: 16,
        fontFamily: 'Arial',
        color: '#000000'
      }
    }
  },
  {
    id: 'button',
    name: 'Button',
    icon: '🔘',
    description: 'Interactive button component',
    category: 'Basic',
    template: {
      type: 'button',
      defaultSize: { width: 120, height: 40 },
      properties: {
        text: 'Button',
        backgroundColor: '#3b82f6',
        color: '#ffffff',
        borderRadius: 6
      }
    }
  },
  {
    id: 'image',
    name: 'Image',
    icon: '🖼️',
    description: 'Image component for media content',
    category: 'Media',
    template: {
      type: 'image',
      defaultSize: { width: 200, height: 150 },
      properties: {
        src: '',
        alt: 'Image description'
      }
    }
  },
  {
    id: 'container',
    name: 'Container',
    icon: '📦',
    description: 'Container for grouping components',
    category: 'Layout',
    template: {
      type: 'container',
      defaultSize: { width: 300, height: 200 },
      properties: {
        backgroundColor: '#f8fafc',
        borderColor: '#e2e8f0',
        borderWidth: 1
      }
    }
  },
  {
    id: 'input',
    name: 'Input',
    icon: '📝',
    description: 'Text input field',
    category: 'Form',
    template: {
      type: 'input',
      defaultSize: { width: 200, height: 40 },
      properties: {
        placeholder: 'Enter text...',
        type: 'text'
      }
    }
  }
];

const categories = ['All', 'Basic', 'Layout', 'Form', 'Media'];

/**
 * Component palette with drag-and-drop component templates
 * Features:
 * - Categorized component library
 * - Search and filter functionality
 * - Drag-and-drop to canvas
 * - Touch-friendly interface
 * - Keyboard navigation support
 */
export const ComponentPalette: React.FC<ComponentPaletteProps> = ({ theme, 'aria-label': ariaLabel }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredComponents = componentTemplates.filter(component => {
    const matchesCategory = selectedCategory === 'All' || component.category === selectedCategory;
    const matchesSearch = component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         component.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, component: ComponentTemplate) => {
    e.dataTransfer.setData('application/json', JSON.stringify(component.template));
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleComponentClick = (component: ComponentTemplate) => {
    // For touch devices, clicking will add the component to the canvas
    console.log('Add component to canvas:', component);
  };

  const categoryButtonStyle = (isActive: boolean) => ({
    padding: '8px 12px',
    border: 'none',
    borderRadius: '6px',
    background: isActive 
      ? (theme === 'dark' ? '#3b82f6' : '#3b82f6')
      : (theme === 'dark' ? '#4b5563' : '#f3f4f6'),
    color: isActive 
      ? '#ffffff'
      : (theme === 'dark' ? '#d1d5db' : '#374151'),
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap' as const
  });

  const componentItemStyle = {
    padding: '12px',
    borderRadius: '8px',
    background: theme === 'dark' ? '#4b5563' : '#ffffff',
    border: `1px solid ${theme === 'dark' ? '#6b7280' : '#e2e8f0'}`,
    cursor: 'grab',
    transition: 'all 0.2s ease',
    userSelect: 'none' as const,
    touchAction: 'manipulation' as const
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
      aria-label={ariaLabel || 'Component Palette'}
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
            margin: '0 0 12px 0',
            fontSize: '18px',
            fontWeight: '600',
            color: theme === 'dark' ? '#f8fafc' : '#1e293b'
          }}
        >
          Components
        </h2>

        {/* Search */}
        <input
          type="text"
          placeholder="Search components..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '8px 12px',
            border: `1px solid ${theme === 'dark' ? '#6b7280' : '#d1d5db'}`,
            borderRadius: '6px',
            background: theme === 'dark' ? '#4b5563' : '#ffffff',
            color: theme === 'dark' ? '#f8fafc' : '#1e293b',
            fontSize: '14px',
            outline: 'none',
            transition: 'border-color 0.2s ease'
          }}
          onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
          onBlur={(e) => e.target.style.borderColor = theme === 'dark' ? '#6b7280' : '#d1d5db'}
        />
      </div>

      {/* Categories */}
      <div
        style={{
          padding: '12px 16px',
          borderBottom: `1px solid ${theme === 'dark' ? '#4b5563' : '#e2e8f0'}`
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            paddingBottom: '4px'
          }}
        >
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              style={categoryButtonStyle(selectedCategory === category)}
              onMouseEnter={(e) => {
                if (selectedCategory !== category) {
                  e.currentTarget.style.background = theme === 'dark' ? '#6b7280' : '#e5e7eb';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedCategory !== category) {
                  e.currentTarget.style.background = theme === 'dark' ? '#4b5563' : '#f3f4f6';
                }
              }}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Component list */}
      <div
        style={{
          flex: 1,
          overflow: 'auto',
          padding: '16px'
        }}
      >
        {filteredComponents.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '32px 16px',
              color: theme === 'dark' ? '#9ca3af' : '#6b7280'
            }}
          >
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
            <p>No components found</p>
            <p style={{ fontSize: '14px', marginTop: '8px' }}>
              Try adjusting your search or category filter
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredComponents.map(component => (
              <div
                key={component.id}
                draggable
                onDragStart={(e) => handleDragStart(e, component)}
                onClick={() => handleComponentClick(component)}
                style={componentItemStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                role="button"
                tabIndex={0}
                aria-label={`Add ${component.name} component`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleComponentClick(component);
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      fontSize: '24px',
                      minWidth: '32px',
                      textAlign: 'center'
                    }}
                    aria-hidden="true"
                  >
                    {component.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontWeight: '500',
                        marginBottom: '4px',
                        color: theme === 'dark' ? '#f8fafc' : '#1e293b'
                      }}
                    >
                      {component.name}
                    </div>
                    <div
                      style={{
                        fontSize: '12px',
                        color: theme === 'dark' ? '#9ca3af' : '#6b7280',
                        lineHeight: '1.4'
                      }}
                    >
                      {component.description}
                    </div>
                  </div>
                  <div
                    style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      background: theme === 'dark' ? '#6b7280' : '#f1f5f9',
                      color: theme === 'dark' ? '#d1d5db' : '#64748b',
                      fontSize: '11px',
                      fontWeight: '500'
                    }}
                  >
                    {component.category}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Instructions */}
      <div
        style={{
          padding: '12px 16px',
          borderTop: `1px solid ${theme === 'dark' ? '#4b5563' : '#e2e8f0'}`,
          background: theme === 'dark' ? '#4b5563' : '#f8fafc'
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: '12px',
            color: theme === 'dark' ? '#9ca3af' : '#6b7280',
            textAlign: 'center'
          }}
        >
          Drag components to canvas or tap to add
        </p>
      </div>
    </div>
  );
};
