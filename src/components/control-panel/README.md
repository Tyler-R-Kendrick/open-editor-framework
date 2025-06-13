# Control Panel Component

A sophisticated control panel component for editing component properties in the Open Editor Framework. Provides an intuitive interface for modifying component attributes with support for various input types and accessibility features.

## Features

- **Property Editing**: Edit component properties with type-appropriate controls
- **Accessibility**: Full WAI-ARIA support with keyboard navigation
- **Touch Support**: Optimized for mobile and tablet interactions
- **Dark Theme**: Support for dark and light themes
- **Responsive**: Adapts to different screen sizes
- **Type Safety**: Full TypeScript support

## Usage

```typescript
import './components/control-panel';

// Use in your HTML
<control-panel
  .selectedComponents=${selectedComponents}
  .theme=${theme}>
</control-panel>
```

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `theme` | `EditorTheme` | `'light'` | Visual theme (light/dark) |
| `selectedComponents` | `EditorComponent[]` | `[]` | Array of selected components |

## Events

### Dispatched Events

- `property-change`: Fired when a component property is modified
- `component-duplicate`: Fired when the duplicate button is clicked
- `component-delete`: Fired when the delete button is clicked
- `component-bring-to-front`: Fired when the bring-to-front button is clicked

### Listened Events

- `selection-change`: Updates the editing component when selection changes

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

- `component.ts`: Main component logic and state management
- `component.tsx`: Template and rendering logic
- `styles.css`: Component-specific styles
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
