# Editor Toolbar

A comprehensive toolbar component providing file operations, editing controls, and settings.

## Features

- **File Operations**: New, Save, Open functionality
- **Editing Controls**: Undo/redo with visual feedback
- **Zoom Controls**: Zoom in/out/reset with live percentage display
- **Theme Toggle**: Switch between light and dark themes
- **Keyboard Shortcuts**: Full keyboard support for all actions
- **Mobile Responsive**: Adaptive layout for different screen sizes
- **Touch Optimized**: Larger touch targets for mobile devices

## Usage

```typescript
import { EditorToolbar } from './toolbar/component.js';

// Use in HTML
<editor-toolbar theme="light"></editor-toolbar>
```

## Properties

| Property     | Type          | Default      | Description                             |
| ------------ | ------------- | ------------ | --------------------------------------- |
| `theme`      | `EditorTheme` | `'light'`    | Visual theme (light/dark)               |
| `canvasSize` | `CanvasSize`  | `'infinite'` | Selected canvas size or infinite canvas |

## Events

| Event          | Detail                 | Description                          |
| -------------- | ---------------------- | ------------------------------------ |
| `editor-new`   | `{}`                   | Fired when new document is requested |
| `editor-save`  | `{canvas: object}`     | Fired when save is requested         |
| `editor-open`  | `{canvas: object}`     | Fired when a file is opened          |
| `editor-undo`  | `{}`                   | Fired when undo is requested         |
| `editor-redo`  | `{}`                   | Fired when redo is requested         |
| `editor-zoom`  | `{zoom: number}`       | Fired when zoom level changes        |
| `theme-change` | `{theme: EditorTheme}` | Fired when theme toggle is clicked   |

## Keyboard Shortcuts

| Shortcut       | Action             |
| -------------- | ------------------ |
| `Ctrl+N`       | New document       |
| `Ctrl+S`       | Save document      |
| `Ctrl+O`       | Open document      |
| `Ctrl+Z`       | Undo               |
| `Ctrl+Shift+Z` | Redo               |
| `Ctrl++`       | Zoom in            |
| `Ctrl+-`       | Zoom out           |
| `Ctrl+0`       | Reset zoom to 100% |

## Sections

The toolbar is divided into three sections:

### Left Section (File Operations)

- Logo and branding
- File operations (New, Save, Open)

### Center Section (Editing)

- Undo/Redo buttons
- Zoom controls with percentage display

### Right Section (Settings)

- Theme toggle switch
- External links (GitHub)

## Mobile Behavior

On mobile devices (≤768px):

- Logo text is hidden to save space
- Zoom controls are hidden
- Button sizes are reduced
- Touch targets remain accessible (44px minimum)

## Accessibility

- Full keyboard navigation with Tab/Enter/Space
- ARIA labels and roles for all interactive elements
- Screen reader compatible button descriptions
- High contrast mode support
- Proper focus management and visual indicators

## Structure

The component follows the modular structure:

- `component.ts`: Main component logic, state management, and template
- `toolbar.styles.ts`: Component-specific styles with responsive design and theme support
- `index.ts`: Public exports
- `README.md`: Documentation
- `toolbar.stories.ts`: Storybook stories

## Styling

Uses CSS custom properties for theming:

```css
--editor-bg: #f8fafc;
--editor-border: #e2e8f0;
--editor-text: #1e293b;
--editor-primary: #3b82f6;
--editor-secondary: #64748b;
```

## Theme Toggle

The theme toggle provides a smooth animated switch between light and dark modes with:

- Animated slider transition
- Sun/moon icons for visual feedback
- ARIA switch role for accessibility
- Keyboard activation support
