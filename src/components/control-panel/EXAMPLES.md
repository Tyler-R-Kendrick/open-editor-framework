# Control Panel Usage Examples

This document provides examples of how to use the refactored control panel with custom configurations.

## Basic Usage

```tsx
import { ControlPanel } from './components/control-panel';

function MyEditor() {
  return (
    <ControlPanel
      theme="light"
      aria-label="Properties Panel"
    />
  );
}
```

## Custom Field Renderer

Create a custom renderer for specific field types:

```tsx
import { FieldRenderer, ControlPanel } from './components/control-panel';

const CustomTextRenderer: FieldRenderer = ({ property, theme, onChange }) => (
  <div className="custom-text-field">
    <input
      type="text"
      value={String(property.value ?? '')}
      onChange={(e) => onChange(property.key, e.target.value)}
      placeholder="Enter text..."
      style={{
        padding: '12px',
        border: `2px solid ${theme === 'dark' ? '#6366f1' : '#8b5cf6'}`,
        borderRadius: '8px',
        background: theme === 'dark' ? '#1e1b4b' : '#faf5ff',
      }}
    />
  </div>
);

function EditorWithCustomRenderer() {
  const config = {
    fieldRenderers: {
      text: CustomTextRenderer,
    }
  };

  return (
    <ControlPanel
      theme="light"
      config={config}
    />
  );
}
```

## Custom Sections

Configure custom property groupings:

```tsx
import { ControlPanel } from './components/control-panel';

function EditorWithCustomSections() {
  const config = {
    sections: [
      {
        title: 'Content',
        fields: ['text', 'label', 'placeholder']
      },
      {
        title: 'Styling',
        fields: ['color', 'backgroundColor', 'fontSize']
      },
      {
        title: 'Behavior',
        fields: ['disabled', 'readonly', 'visible']
      }
    ]
  };

  return (
    <ControlPanel
      theme="dark"
      config={config}
    />
  );
}
```

## Complete Custom Configuration

Combine custom renderers with custom sections:

```tsx
import { 
  ControlPanel, 
  defaultFieldRenderers,
  type FieldRenderer 
} from './components/control-panel';

const EnhancedColorRenderer: FieldRenderer = ({ property, theme, onChange }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
    <input
      type="color"
      value={String(property.value ?? '#000000')}
      onChange={(e) => onChange(property.key, e.target.value)}
      style={{ width: '100%', height: '40px', borderRadius: '8px' }}
    />
    <input
      type="text"
      value={String(property.value ?? '#000000')}
      onChange={(e) => onChange(property.key, e.target.value)}
      placeholder="#000000"
      style={{
        padding: '8px 12px',
        border: `1px solid ${theme === 'dark' ? '#6b7280' : '#d1d5db'}`,
        borderRadius: '6px',
        background: theme === 'dark' ? '#4b5563' : '#ffffff',
        color: theme === 'dark' ? '#f8fafc' : '#1e293b',
      }}
    />
  </div>
);

function FullyCustomizedEditor() {
  const config = {
    fieldRenderers: {
      ...defaultFieldRenderers,
      color: EnhancedColorRenderer,
    },
    sections: [
      {
        title: 'Basic Properties',
        fields: ['text', 'label']
      },
      {
        title: 'Colors & Appearance',
        fields: ['color', 'backgroundColor', 'borderColor']
      },
      {
        title: 'Layout & Size',
        fields: ['width', 'height', 'padding', 'margin']
      },
      {
        title: 'State & Behavior',
        fields: ['visible', 'disabled', 'readonly']
      }
    ]
  };

  return (
    <ControlPanel
      theme="dark"
      config={config}
      aria-label="Advanced Properties Panel"
    />
  );
}
```

## Creating Reusable Configurations

You can create reusable configurations for different use cases:

```tsx
import { 
  ControlPanel,
  defaultFieldRenderers,
  type ControlPanelConfig
} from './components/control-panel';

// Configuration for form components
export const formControlConfig: ControlPanelConfig = {
  sections: [
    {
      title: 'Form Properties',
      fields: ['label', 'placeholder', 'required', 'disabled']
    },
    {
      title: 'Validation',
      fields: ['minLength', 'maxLength', 'pattern']
    },
    {
      title: 'Appearance',
      fields: ['color', 'backgroundColor', 'fontSize']
    }
  ]
};

// Configuration for layout components
export const layoutControlConfig: ControlPanelConfig = {
  sections: [
    {
      title: 'Dimensions',
      fields: ['width', 'height', 'minWidth', 'minHeight']
    },
    {
      title: 'Spacing',
      fields: ['padding', 'margin', 'gap']
    },
    {
      title: 'Positioning',
      fields: ['position', 'top', 'left', 'zIndex']
    }
  ]
};

function FormEditor() {
  return <ControlPanel theme="light" config={formControlConfig} />;
}

function LayoutEditor() {
  return <ControlPanel theme="light" config={layoutControlConfig} />;
}
```

## Adding Custom Field Types

The control panel supports any field type through the generic field renderer map:

```tsx
import { FieldRenderer, ControlPanel } from './components/control-panel';
import { ButtonToggle, useButtonStyles } from '../button-toggle';

// Create renderers for completely new field types
const FileUploadRenderer: FieldRenderer = ({ property, theme, onChange }) => (
  <div>
    <input
      type="file"
      onChange={(e) => {
        const file = e.target.files?.[0];
        onChange(property.key, file ? file.name : '');
      }}
      style={{
        width: '100%',
        padding: '8px',
        border: `1px solid ${theme === 'dark' ? '#6b7280' : '#d1d5db'}`,
        borderRadius: '6px',
        background: theme === 'dark' ? '#4b5563' : '#ffffff',
        color: theme === 'dark' ? '#f8fafc' : '#1e293b',
      }}
    />
    {property.value && (
      <div style={{ 
        marginTop: '4px', 
        fontSize: '12px', 
        color: theme === 'dark' ? '#9ca3af' : '#6b7280' 
      }}>
        Selected: {property.value}
      </div>
    )}
  </div>
);

const RichTextRenderer: FieldRenderer = ({ property, theme, onChange }) => (
  <div>
    <textarea
      value={String(property.value ?? '')}
      onChange={(e) => onChange(property.key, e.target.value)}
      placeholder="Enter rich text..."
      rows={4}
      style={{
        width: '100%',
        padding: '12px',
        border: `2px solid ${theme === 'dark' ? '#6366f1' : '#8b5cf6'}`,
        borderRadius: '8px',
        background: theme === 'dark' ? '#1e1b4b' : '#faf5ff',
        color: theme === 'dark' ? '#e0e7ff' : '#581c87',
        fontSize: '14px',
        resize: 'vertical',
        outline: 'none',
      }}
    />
  </div>
);

const ToggleRenderer: FieldRenderer = ({ property, theme, onChange }) => (
  <ButtonToggle
    isActive={!!property.value}
    onToggle={() => onChange(property.key, !property.value)}
    theme={theme}
    aria-label={`Toggle ${property.key}`}
  >
    {property.value ? '✓ Enabled' : '✗ Disabled'}
  </ButtonToggle>
);

function EditorWithCustomFieldTypes() {
  const config = {
    fieldRenderers: {
      // Custom field types
      'file-upload': FileUploadRenderer,
      'rich-text': RichTextRenderer,
      'toggle': ToggleRenderer,
      // You can still use built-in types
      'text': /* custom text renderer or default */,
      'color': /* custom color renderer or default */,
    },
    sections: [
      {
        title: 'Media & Content',
        fields: ['file-upload', 'rich-text']
      },
      {
        title: 'Settings',
        fields: ['toggle', 'text', 'color']
      }
    ]
  };

  return <ControlPanel theme="light" config={config} />;
}
```

## Advanced Field Type Examples

```tsx
// Location picker
const LocationRenderer: FieldRenderer = ({ property, theme, onChange }) => {
  const [lat, lng] = String(property.value ?? '0,0').split(',');
  
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
      <input
        type="number"
        placeholder="Latitude"
        value={lat}
        onChange={(e) => onChange(property.key, `${e.target.value},${lng}`)}
        style={{
          padding: '8px',
          border: `1px solid ${theme === 'dark' ? '#6b7280' : '#d1d5db'}`,
          borderRadius: '4px',
          background: theme === 'dark' ? '#4b5563' : '#ffffff',
          color: theme === 'dark' ? '#f8fafc' : '#1e293b',
        }}
      />
      <input
        type="number"
        placeholder="Longitude"
        value={lng}
        onChange={(e) => onChange(property.key, `${lat},${e.target.value}`)}
        style={{
          padding: '8px',
          border: `1px solid ${theme === 'dark' ? '#6b7280' : '#d1d5db'}`,
          borderRadius: '4px',
          background: theme === 'dark' ? '#4b5563' : '#ffffff',
          color: theme === 'dark' ? '#f8fafc' : '#1e293b',
        }}
      />
    </div>
  );
};

// Multi-select with tags
const TagsRenderer: FieldRenderer = ({ property, theme, onChange }) => {
  const tags = String(property.value ?? '').split(',').filter(Boolean);
  const [inputValue, setInputValue] = React.useState('');
  const buttonStyles = useButtonStyles(theme);
  
  const addTag = () => {
    if (inputValue.trim() && !tags.includes(inputValue.trim())) {
      const newTags = [...tags, inputValue.trim()];
      onChange(property.key, newTags.join(','));
      setInputValue('');
    }
  };
  
  const removeTag = (tagToRemove: string) => {
    const newTags = tags.filter(tag => tag !== tagToRemove);
    onChange(property.key, newTags.join(','));
  };
  
  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '8px' }}>
        {tags.map(tag => (
          <span
            key={tag}
            style={{
              padding: '4px 8px',
              background: theme === 'dark' ? '#6366f1' : '#8b5cf6',
              color: '#ffffff',
              borderRadius: '4px',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            {tag}
            <button
              onClick={() => removeTag(tag)}
              style={buttonStyles.destructive}
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTag()}
          placeholder="Add tag..."
          style={{
            flex: 1,
            padding: '8px',
            border: `1px solid ${theme === 'dark' ? '#6b7280' : '#d1d5db'}`,
            borderRadius: '4px',
            background: theme === 'dark' ? '#4b5563' : '#ffffff',
            color: theme === 'dark' ? '#f8fafc' : '#1e293b',
          }}
        />
        <button
          onClick={addTag}
          style={buttonStyles.primary}
        >
          Add
        </button>
      </div>
    </div>
  );
};

function EditorWithAdvancedFields() {
  const config = {
    fieldRenderers: {
      'location': LocationRenderer,
      'tags': TagsRenderer,
    },
    sections: [
      {
        title: 'Location & Tags',
        fields: ['location', 'tags']
      }
    ]
  };

  return <ControlPanel theme="dark" config={config} />;
}
```
