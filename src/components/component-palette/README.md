# Component Palette

A drag-and-drop component palette for the Open Editor Framework.

## Features

- **Drag & Drop**: Mouse and touch-based component dragging to canvas
- **Touch Support**: Full mobile and tablet interaction support  
- **Keyboard Accessible**: Navigate and add components using keyboard
- **Search**: Filter components by name, category, or description
- **Categorized**: Components organized by logical groups
- **Screen Reader Support**: Full accessibility with ARIA labels and announcements

## Usage

```typescript
import { ComponentPalette } from './component-palette/component.js';

// Use in HTML
<component-palette theme="light"></component-palette>
```

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `theme` | `EditorTheme` | `'light'` | Visual theme (light/dark) |

## Events

| Event | Detail | Description |
|-------|--------|-------------|
| `component-drag-start` | `{type, componentType, definition}` | Fired when drag starts |
| `component-drag-over` | `{x, y}` | Fired during drag over canvas |
| `component-drop` | `{x, y}` | Fired on drop completion |
| `component-keyboard-add` | `{component}` | Fired when component added via keyboard |

## Accessibility

- Full keyboard navigation with Tab/Enter/Space
- Screen reader announcements for component additions
- ARIA labels and roles for all interactive elements
- High contrast mode support
- Touch-friendly sizing for mobile devices

## Component Types

The palette includes these component categories:

- **Basic**: Text, Button
- **Media**: Image
- **Layout**: Container
- **Forms**: Input

## Styling

Uses CSS custom properties for theming:

```css
--editor-bg: #f8fafc;
--editor-border: #e2e8f0;
--editor-text: #1e293b;
--editor-primary: #3b82f6;
--editor-secondary: #64748b;
```

## Mobile Considerations

- Touch-optimized card sizes and spacing
- Proper touch-action handling for smooth interactions
- Visual feedback during touch interactions
- Accessible touch targets (minimum 44px)
