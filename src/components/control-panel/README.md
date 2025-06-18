# Control Panel Component

A sophisticated control panel component for editing component properties in the Open Editor Framework. Provides an intuitive interface for modifying component attributes with support for various input types, configurable field renderers, and accessibility features.

## Features

- **Property Editing**: Edit component properties with type-appropriate controls
- **Configurable Renderers**: Use custom field renderers for different property types
- **Flexible Sections**: Configure property grouping and sections
- **Accessibility**: Full WAI-ARIA support with keyboard navigation
- **Touch Support**: Optimized for mobile and tablet interactions
- **Dark Theme**: Support for dark and light themes
- **Responsive**: Adapts to different screen sizes
- **Type Safety**: Full TypeScript support

## Usage

### Basic Usage

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

### With Custom Configuration

```tsx
import { 
  ControlPanel, 
  TextFieldRenderer, 
  defaultFieldRenderers,
  type ControlPanelConfig 
} from './components/control-panel';

// Custom field renderer
const CustomTextRenderer: FieldRenderer = ({ property, theme, onChange }) => (
  <input
    type="text"
    value={String(property.value ?? '')}
    onChange={(e) => onChange(property.key, e.target.value)}
    placeholder="Enter text..."
    style={{ /* custom styles */ }}
  />
);

const config: ControlPanelConfig = {
  fieldRenderers: {
    ...defaultFieldRenderers,
    text: CustomTextRenderer, // Override text field renderer
  },
  sections: [
    {
      title: 'Basic Properties',
      fields: ['text', 'color']
    },
    {
      title: 'Advanced',
      fields: ['fontSize', 'opacity']
    }
  ]
};

function MyEditor() {
  return (
    <ControlPanel
      theme="dark"
      config={config}
      aria-label="Custom Properties Panel"
    />
  );
}
```

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `theme` | `EditorTheme` | `'light'` | Visual theme (light/dark) |
| `aria-label` | `string` | `'Properties Panel'` | Accessibility label |
| `config` | `ControlPanelConfig` | `{}` | Configuration for renderers and sections |

## Configuration

### ControlPanelConfig

```tsx
interface ControlPanelConfig {
  fieldRenderers?: FieldRendererMap;
  sections?: PropertySection[];
}
```

### Field Renderers

The field renderer map is completely flexible and accepts any field type as a string key:

```tsx
interface FieldRendererMap {
  [fieldType: string]: FieldRenderer;
}
```

This means you can:
- Override built-in field types (`text`, `number`, `color`, `select`, `checkbox`, `range`)
- Add completely custom field types (`date-picker`, `file-upload`, `rich-text`, etc.)
- Mix and match as needed for your use case

### Built-in Field Types

For convenience and type safety, built-in field types are also available:

```tsx
type BuiltInFieldType = 'text' | 'number' | 'color' | 'select' | 'checkbox' | 'range';

interface BuiltInFieldRendererMap {
  text?: FieldRenderer;
  number?: FieldRenderer;
  color?: FieldRenderer;
  select?: FieldRenderer;
  checkbox?: FieldRenderer;
  range?: FieldRenderer;
}
```

### Custom Field Renderer

```tsx
const MyCustomRenderer: FieldRenderer = ({ property, theme, onChange }) => {
  return (
    <div>
      {/* Your custom field implementation */}
    </div>
  );
};
```

### Property Sections

Configure how properties are grouped:

```tsx
interface PropertySection {
  title: string;
  fields: string[]; // Property keys to include in this section
}
```

## Default Configuration

The component comes with sensible defaults:

- **Default Renderers**: Standard HTML input controls for all supported types
- **Default Sections**: Content, Appearance, and Visibility groupings

## Property Types Supported

- **String**: Text input fields
- **Number**: Numeric input fields with min/max validation
- **Range**: Slider controls with live value display
- **Boolean**: Checkbox controls
- **Color**: Color picker inputs
- **Select**: Dropdown menus with predefined options

## Styling

The component uses CSS custom properties for theming:

```css
--editor-bg: Background color
--editor-border: Border color
--editor-text: Primary text color
--editor-primary: Primary accent color
--editor-secondary: Secondary text color
```

## Accessibility Features

- Semantic HTML structure with proper roles
- Keyboard navigation support
- Screen reader announcements
- High contrast mode support
- Touch-friendly targets (44px minimum)
- Focus management

## Mobile Considerations

- Touch-optimized input controls
- Larger tap targets for mobile devices
- Smooth scrolling for property lists
- Zoom prevention on iOS
- Gesture-friendly interactions

## Architecture

The component follows the modular structure:

- `component.ts`: Main component logic, state management, and embedded styles
- `index.ts`: Public exports
- `README.md`: Documentation
- `*.stories.ts`: Storybook stories (coming soon)

## Development

```bash
# Run in development mode
npm run dev

# Build for production
npm run build

# Run tests
npm run test

# Run Storybook
npm run storybook
```

### Adding Custom Field Types

The field renderer map is completely flexible and supports any field type:

```tsx
import { FieldRenderer, ControlPanel } from './components/control-panel';

// Create a custom renderer for a new field type
const DatePickerRenderer: FieldRenderer = ({ property, theme, onChange }) => (
  <input
    type="date"
    value={String(property.value ?? '')}
    onChange={(e) => onChange(property.key, e.target.value)}
    style={{
      width: '100%',
      padding: '8px 12px',
      border: `1px solid ${theme === 'dark' ? '#6b7280' : '#d1d5db'}`,
      borderRadius: '6px',
      background: theme === 'dark' ? '#4b5563' : '#ffffff',
      color: theme === 'dark' ? '#f8fafc' : '#1e293b',
    }}
  />
);

const MySliderRenderer: FieldRenderer = ({ property, theme, onChange }) => (
  <div>
    <input
      type="range"
      min={property.min || 0}
      max={property.max || 100}
      value={Number(property.value ?? 0)}
      onChange={(e) => onChange(property.key, parseInt(e.target.value))}
      style={{ width: '100%', accentColor: '#3b82f6' }}
    />
    <div style={{ textAlign: 'center', marginTop: '4px' }}>
      {property.value}
    </div>
  </div>
);

function EditorWithCustomTypes() {
  const config = {
    fieldRenderers: {
      // Add custom field types
      'date-picker': DatePickerRenderer,
      'my-slider': MySliderRenderer,
      // You can also override built-in types
      'range': MySliderRenderer,
    },
    sections: [
      {
        title: 'Custom Fields',
        fields: ['date-picker', 'my-slider']
      }
    ]
  };

  return <ControlPanel theme="light" config={config} />;
}
```
