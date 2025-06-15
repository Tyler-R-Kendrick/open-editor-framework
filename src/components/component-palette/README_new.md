# Component Palette

A drag-and-drop component palette with external template loading capabilities.

## Features

- **External Template Loading**: Load component templates from external JSON files
- **Fallback Support**: Automatically falls back to default templates if loading fails
- **Categorized Components**: Organize components by categories (Basic, Layout, Form, Media)
- **Search and Filter**: Find components quickly with search and category filters
- **Drag and Drop**: Drag components directly to the canvas
- **Touch Support**: Touch-friendly interface for mobile devices
- **Keyboard Navigation**: Full keyboard accessibility support
- **Loading States**: Visual feedback during template loading
- **Error Handling**: Graceful error handling with retry functionality

## Usage

### Basic Usage

```tsx
import { ComponentPalette } from './component-palette';

// Use with default templates from /assets/component-templates.json
<ComponentPalette theme="light" />
```

### Custom Template URL

```tsx
// Load templates from a custom URL
<ComponentPalette 
  theme="dark" 
  templateUrl="/api/templates.json"
  aria-label="Custom Component Library"
/>
```

## Template JSON Format

The component palette expects templates in the following JSON format:

```json
{
  "templates": [
    {
      "id": "unique-id",
      "name": "Component Name",
      "icon": "📝",
      "description": "Component description",
      "category": "Basic",
      "template": {
        "type": "component-type",
        "defaultSize": { "width": 200, "height": 40 },
        "properties": {
          "key": "value"
        }
      }
    }
  ],
  "categories": ["All", "Basic", "Layout", "Form", "Media"]
}
```

### Template Properties

- **id**: Unique identifier for the component
- **name**: Display name shown in the palette
- **icon**: Emoji or icon to display (supports Unicode emojis)
- **description**: Brief description of the component
- **category**: Category for filtering (must match one in categories array)
- **template**: The actual component template data
  - **type**: Component type identifier
  - **defaultSize**: Default width and height when added to canvas
  - **properties**: Component-specific properties and default values

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `theme` | `'light' \| 'dark'` | Required | Theme for styling the palette |
| `aria-label` | `string` | `'Component Palette'` | Accessibility label |
| `templateUrl` | `string` | `'/assets/component-templates.json'` | URL to load templates from |

## Error Handling

The component palette includes robust error handling:

1. **Network Errors**: If the template URL is unreachable, shows error message with retry button
2. **Invalid JSON**: If the JSON is malformed, shows validation error
3. **Missing Fields**: If required template fields are missing, shows validation error
4. **Fallback Templates**: Always falls back to built-in default templates to ensure functionality

## Accessibility

- Full keyboard navigation support
- ARIA labels and roles for screen readers
- High contrast support for both light and dark themes
- Touch-friendly targets for mobile devices
- Focus management and visual indicators

## Loading States

The palette shows appropriate loading states:

- **Loading**: Animated loading indicator while fetching templates
- **Error**: Error message with retry button if loading fails
- **Success**: Normal palette interface with loaded templates

## Default Templates

The component includes these default templates as fallbacks:

- **Text**: Basic text component
- **Button**: Interactive button component
- **Image**: Media image component  
- **Container**: Layout container component
- **Input**: Form input field

## Customization

### Adding New Templates

Create a custom JSON file with additional templates:

```json
{
  "templates": [
    {
      "id": "chart",
      "name": "Chart",
      "icon": "📊",
      "description": "Data visualization chart",
      "category": "Data",
      "template": {
        "type": "chart",
        "defaultSize": { "width": 400, "height": 300 },
        "properties": {
          "chartType": "bar",
          "data": []
        }
      }
    }
  ],
  "categories": ["All", "Basic", "Layout", "Form", "Media", "Data"]
}
```

### Custom Styling

The component uses inline styles that respect the theme prop. For custom styling, you can wrap the component and apply additional CSS classes or styles.

## Structure

The component follows the modular structure:

- `component.tsx`: Main React component with template loading logic
- `useComponentTemplates.ts`: Custom hook for loading external templates
- `component-palette.styles.ts`: Component-specific styles
- `index.ts`: Public exports
- `README.md`: Documentation
- `component-palette.stories.ts`: Storybook stories

## Dependencies

- React 18+
- Custom `useComponentTemplates` hook
- Editor types from `../../types/editor-types`

## Mobile Considerations

- Touch-optimized card sizes and spacing
- Proper touch-action handling for smooth interactions
- Visual feedback during touch interactions
- Accessible touch targets (minimum 44px)
- Loading states optimized for mobile networks
