# Editor Canvas

An HTML5 Canvas-based editor component for rendering and manipulating components.

## Features

- **Canvas Rendering**: High-performance component rendering using HTML5 Canvas
- **Touch Support**: Full mobile and tablet interaction support including:
  - Single touch: tap to select, pan to move
  - Multi-touch: pinch to zoom
  - Long press: context menu
- **Keyboard Accessible**: Full keyboard navigation and shortcuts
- **Component Manipulation**: Select, move, resize, delete components
- **Zoom & Pan**: Smooth zooming and panning for detailed work
- **High DPI Support**: Crisp rendering on retina displays

## Usage

```typescript
import { EditorCanvas } from './editor-canvas/component.js';

// Use in HTML
<editor-canvas theme="light"></editor-canvas>
```

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `theme` | `EditorTheme` | `'light'` | Visual theme (light/dark) |

## Events

| Event | Detail | Description |
|-------|--------|-------------|
| `selection-change` | `{selectedComponents: string[]}` | Fired when component selection changes |
| `context-menu` | `{point: Point, components: EditorComponent}` | Fired on long press/right click |
| `component-move` | `{component: EditorComponent, position: Point}` | Fired when component is moved |
| `component-resize` | `{component: EditorComponent, bounds: Bounds}` | Fired when component is resized |

## Keyboard Shortcuts

- **Delete/Backspace**: Delete selected components
- **Escape**: Clear selection
- **Ctrl+A**: Select all components
- **Ctrl+C**: Copy selected components
- **Ctrl+V**: Paste components
- **Ctrl+Z**: Undo
- **Ctrl+Shift+Z**: Redo

## Touch Gestures

- **Tap**: Select component
- **Long Press**: Context menu
- **Drag**: Move component (if selected) or pan canvas
- **Pinch**: Zoom canvas
- **Two-finger pan**: Pan canvas

## Accessibility

- Full keyboard navigation support
- Screen reader compatible with ARIA labels
- High contrast mode support
- Touch targets optimized for accessibility (minimum 44px)
- Haptic feedback on supported devices

## Canvas State

The component maintains internal state for:

- **Zoom Level**: 0.1x to 5x zoom
- **Pan Position**: X/Y offset for canvas viewport
- **Selected Components**: Array of selected component IDs
- **Clipboard**: Copied components for paste operations
- **History**: Undo/redo stack for operations

## Rendering Pipeline

1. **Clear Canvas**: Reset canvas for new frame
2. **Apply Transforms**: Apply zoom and pan transformations
3. **Render Components**: Draw each component based on type
4. **Render Selections**: Draw selection indicators and resize handles
5. **Render Overlays**: Draw any additional UI elements

## Performance Considerations

- Uses `requestAnimationFrame` for smooth 60fps rendering
- High DPI display optimization with `devicePixelRatio`
- Efficient hit testing for component selection
- Canvas pooling for complex operations
