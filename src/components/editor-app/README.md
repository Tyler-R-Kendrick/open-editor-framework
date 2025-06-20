# EditorApp Panel

A React-based main editor application panel that orchestrates the canvas panel, palette panel, and control panel.

## Features

- Touch interactions and accessibility features
- Responsive design with mobile and desktop layouts
- Theme support (light/dark mode)
- Mobile tab navigation for small screens
- React Hooks for state management
- Collapsible side panels for more canvas space
- Full-width layout without outer margins

## Usage

```tsx
import { EditorApp } from './components/editor-app';

function App() {
  return <EditorApp />;
}
```

## Props

This component doesn't accept any props as it manages its own state internally.

## State Management

The component uses React hooks to manage:

- Theme preferences (light/dark)
- Mobile layout detection
- Active mobile tab selection

## Accessibility

- ARIA labels and roles for screen readers
- Keyboard navigation support
- Touch-friendly interface for mobile devices
- High contrast mode support

## Mobile Support

On mobile devices (< 768px width), the layout switches to a stacked view with tabs at the bottom for:

- Component Palette
- Canvas
- Control Panel

## Theme Support

Automatically detects system theme preference and provides manual theme toggle functionality.
