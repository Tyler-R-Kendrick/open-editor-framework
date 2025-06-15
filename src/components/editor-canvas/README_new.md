# EditorCanvas Component

A React-based HTML5 Canvas editor component with touch and accessibility support.

## Features

- Touch-optimized interactions (pan, zoom, tap, long press)
- Keyboard accessibility and shortcuts
- Component selection and manipulation
- Canvas rendering with zoom/pan
- Multi-touch gesture support
- High DPI display support

## Usage

```tsx
import { EditorCanvas } from './components/editor-canvas';

function MyEditor() {
  return (
    <EditorCanvas 
      theme="light" 
      aria-label="Design Canvas"
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `theme` | `EditorTheme` | - | Current theme (light/dark) |
| `aria-label` | `string` | `"Design Canvas"` | Accessibility label |

## Interactions

### Mouse/Touch
- **Click/Tap**: Select components
- **Drag**: Move selected components
- **Pinch**: Zoom in/out (touch devices)
- **Pan**: Move canvas view

### Keyboard
- **Delete/Backspace**: Delete selected components
- **Escape**: Clear selection
- **Ctrl+A**: Select all components

## Canvas Controls

Built-in zoom controls are provided in the bottom-right corner:
- Zoom in/out buttons
- Current zoom percentage display
- Reset button to return to 100% zoom and center view

## State Management

Uses React hooks to manage:
- Canvas state (zoom, pan, selections)
- Component list
- Interaction states (dragging, resizing)
- Touch gesture handling

## Performance

- Uses `requestAnimationFrame` for smooth rendering
- High DPI display support for crisp graphics
- Efficient re-rendering only when needed
