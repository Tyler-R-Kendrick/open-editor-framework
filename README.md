# Open Editor Framework

A generic HTML5-based web component editor built as a PWA (Progressive Web App) with comprehensive accessibility and mobile touch support. This framework provides a reusable canvas-based editor with component palette and property panel.

## ✨ Features

### Core Functionality
- **HTML5 Canvas Editor** - High-performance canvas-based editing with zoom, pan, and multi-selection
- **Component Palette** - Drag-and-drop component library with search and categorization  
- **Property Panel** - Dynamic property editing with type-specific controls
- **PWA Support** - Installable app with offline capabilities and service worker
- **Responsive Design** - Mobile-first design that adapts to desktop and tablet

### Accessibility & Inclusion
- **WCAG 2.1 AA Compliant** - Screen reader support, keyboard navigation, focus management
- **Touch-First Design** - Optimized for touch devices with gesture recognition
- **High Contrast Support** - Automatic adaptation to user contrast preferences
- **Reduced Motion Support** - Respects user motion preferences
- **Keyboard Shortcuts** - Full keyboard accessibility for power users

### Technical Features
- **TypeScript** - Full type safety and excellent developer experience
- **Lit Web Components** - Modern, efficient web components with reactive properties
- **Tailwind CSS** - Utility-first styling with consistent design system
- **Vite Build System** - Fast development server and optimized builds
- **Comprehensive Testing** - Unit tests with Vitest and accessibility testing

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm 8+

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/open-editor-framework.git
cd open-editor-framework

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the editor.

### Building for Production

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 📱 Mobile & Touch Support

The editor is designed mobile-first with comprehensive touch gesture support:

- **Touch Navigation** - Pan, zoom, and select with natural touch gestures
- **Long Press** - Context menus and component selection
- **Pinch to Zoom** - Natural zoom controls on touch devices
- **Haptic Feedback** - Tactile feedback on supported devices
- **Large Touch Targets** - All interactive elements meet 44px minimum size

## ♿ Accessibility Features

### Screen Reader Support
- Semantic HTML structure with proper ARIA labels
- Live regions for dynamic content updates
- Comprehensive keyboard navigation
- Screen reader announcements for user actions

### Keyboard Navigation
- **Tab/Shift+Tab** - Navigate between focusable elements
- **Enter/Space** - Activate buttons and components
- **Arrow Keys** - Navigate within component groups
- **Escape** - Cancel operations and clear selections

### Visual Accessibility
- High contrast mode support
- Customizable color themes (light/dark)
- Scalable fonts and UI elements
- Clear focus indicators

## 🎨 Component Architecture

### Core Components

#### `editor-app`
Main application component that orchestrates the canvas, palette, and control panel.

#### `editor-canvas` 
HTML5 canvas-based editor with touch support, zoom/pan, and component rendering.

#### `component-palette`
Drag-and-drop component library with search, categorization, and keyboard accessibility.

#### `control-panel`
Dynamic property editor with type-specific controls for selected components.

#### `editor-toolbar`
Application toolbar with file operations, undo/redo, zoom controls, and theme toggle.

### Type System

```typescript
interface EditorComponent {
  id: string;
  type: string;
  name: string;
  bounds: Bounds;
  properties: Record<string, any>;
  children?: EditorComponent[];
  parent?: string;
}

interface ComponentDefinition {
  type: string;
  name: string;
  icon: string;
  category: string;
  description: string;
  defaultProperties: Record<string, any>;
  propertySchema: PropertySchema[];
}
```

## 🛠 Development

### Project Structure

```
src/
├── components/          # Lit web components
│   ├── editor-app.ts   # Main application
│   ├── editor-canvas.ts # Canvas editor
│   ├── component-palette.ts
│   ├── control-panel.ts
│   └── toolbar.ts
├── types/              # TypeScript type definitions
├── utils/              # Utility functions and helpers
├── styles/             # Global CSS and Tailwind
└── main.ts            # Application entry point
```

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm run test         # Run unit tests
npm run test:ui      # Run tests with UI
npm run test:coverage # Run tests with coverage
npm run type-check   # TypeScript type checking
```

### Adding New Components

1. **Define Component Type**
```typescript
// Add to component definitions
{
  type: 'my-component',
  name: 'My Component',
  icon: '🎯',
  category: 'Custom',
  description: 'My custom component',
  defaultProperties: {
    // Default properties
  },
  propertySchema: [
    // Property definitions
  ]
}
```

2. **Implement Rendering**
```typescript
// Add to canvas component rendering
case 'my-component':
  // Render component on canvas
  break;
```

3. **Add Property Schema**
```typescript
// Define editable properties
{
  key: 'myProperty',
  type: 'string',
  label: 'My Property',
  default: 'default value'
}
```

### Customizing Themes

The editor supports light and dark themes with CSS custom properties:

```css
:host {
  --editor-bg: #f8fafc;
  --editor-border: #e2e8f0;
  --editor-text: #1e293b;
  --editor-primary: #3b82f6;
  --editor-secondary: #64748b;
}
```

## 🧪 Testing

### Unit Tests
```bash
npm run test          # Run all tests
npm run test:watch    # Run tests in watch mode
npm run test:ui       # Run tests with Vitest UI
```

### Accessibility Testing
The project includes automated accessibility testing and follows WCAG 2.1 AA guidelines.

### Browser Testing
Tested and supported on:
- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📦 Deployment

### Static Hosting
The built application can be deployed to any static hosting service:

```bash
npm run build
# Deploy the dist/ directory
```

### PWA Features
- **Service Worker** - Automatic caching and offline support
- **Web App Manifest** - Installable app experience
- **Background Sync** - Offline operation support

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and add tests
4. Ensure all tests pass: `npm test`
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Code Standards
- **ESLint** - Code linting with TypeScript rules
- **Prettier** - Code formatting
- **Conventional Commits** - Commit message format
- **Type Safety** - Full TypeScript coverage

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Lit](https://lit.dev) - For the excellent web components framework
- [Tailwind CSS](https://tailwindcss.com) - For the utility-first CSS framework
- [Vite](https://vitejs.dev) - For the blazing fast build tool
- [Vitest](https://vitest.dev) - For the fast unit testing framework

## 📞 Support

- **Documentation** - [GitHub Wiki](https://github.com/your-username/open-editor-framework/wiki)
- **Issues** - [GitHub Issues](https://github.com/your-username/open-editor-framework/issues)
- **Discussions** - [GitHub Discussions](https://github.com/your-username/open-editor-framework/discussions)

---

Built with ❤️ for developers who value accessibility and great user experiences.
A generic editor to be rendered as a slide deck editor, a text editor, etc. All with the same user experience.
