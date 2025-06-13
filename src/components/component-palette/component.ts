import { LitElement, html, css, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { EditorTheme, ComponentDefinition } from '../../types/editor-types';

// Import styles
const componentStyles = css`
:host {
  display: block;
  height: 100%;
  overflow: hidden;
  background: white;
  touch-action: manipulation;
}

.palette-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.palette-header {
  padding: 16px;
  border-bottom: 1px solid var(--editor-border, #e2e8f0);
  background: #f8fafc;
}

.palette-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--editor-text, #1e293b);
  margin: 0 0 8px 0;
}

.search-box {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--editor-border, #e2e8f0);
  border-radius: 6px;
  font-size: 14px;
  background: white;
  transition: border-color 0.2s ease;
}

.search-box:focus {
  outline: none;
  border-color: var(--editor-primary, #3b82f6);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.palette-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}

.category-section {
  margin-bottom: 16px;
}

.category-header {
  padding: 12px 16px 8px;
  font-size: 12px;
  font-weight: 600;
  color: var(--editor-secondary, #64748b);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: #f8fafc;
  border-top: 1px solid var(--editor-border, #e2e8f0);
  border-bottom: 1px solid var(--editor-border, #e2e8f0);
  position: sticky;
  top: 0;
  z-index: 1;
}

.component-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 8px;
  padding: 16px;
}

.component-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 8px;
  border: 1px solid var(--editor-border, #e2e8f0);
  border-radius: 8px;
  background: white;
  cursor: grab;
  touch-action: none;
  transition: all 0.2s ease;
  user-select: none;
  min-height: 80px;
  position: relative;
}

.component-card:hover {
  border-color: var(--editor-primary, #3b82f6);
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.15);
  transform: translateY(-1px);
}

.component-card:active {
  cursor: grabbing;
  transform: scale(0.95);
}

.component-card:focus {
  outline: 2px solid var(--editor-primary, #3b82f6);
  outline-offset: 2px;
}

.component-icon {
  font-size: 24px;
  margin-bottom: 8px;
  opacity: 0.8;
}

.component-name {
  font-size: 12px;
  font-weight: 500;
  color: var(--editor-text, #1e293b);
  text-align: center;
  line-height: 1.3;
  word-break: break-word;
}

.component-description {
  font-size: 10px;
  color: var(--editor-secondary, #64748b);
  text-align: center;
  margin-top: 4px;
  line-height: 1.2;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.component-card:hover .component-description {
  opacity: 1;
}

.drag-ghost {
  position: fixed;
  pointer-events: none;
  z-index: 1000;
  opacity: 0.8;
  transform: rotate(3deg);
  background: white;
  border: 2px solid var(--editor-primary, #3b82f6);
  border-radius: 8px;
  padding: 8px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

/* Touch-specific styles */
@media (pointer: coarse) {
  .component-card {
    min-height: 100px;
    padding: 20px 12px;
  }
  
  .component-icon {
    font-size: 28px;
  }
  
  .component-name {
    font-size: 13px;
  }
  
  .component-grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 12px;
  }
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .component-card {
    border-width: 2px;
    border-color: black;
  }
  
  .component-card:hover {
    background: black;
    color: white;
  }
}

/* Dark theme */
:host([theme="dark"]) {
  background: #1e293b;
}

:host([theme="dark"]) .palette-header {
  background: #334155;
  border-color: #475569;
}

:host([theme="dark"]) .category-header {
  background: #334155;
  border-color: #475569;
  color: #cbd5e1;
}

:host([theme="dark"]) .component-card {
  background: #334155;
  border-color: #475569;
  color: #f1f5f9;
}

:host([theme="dark"]) .search-box {
  background: #334155;
  border-color: #475569;
  color: #f1f5f9;
}

/* Scrollbar styling */
.palette-content::-webkit-scrollbar {
  width: 8px;
}

.palette-content::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.palette-content::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.palette-content::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
`;

/**
 * Component palette that displays available web components for drag-and-drop
 * Features:
 * - Touch-friendly drag and drop
 * - Keyboard accessibility
 * - Search functionality
 * - Categorized components
 * - Screen reader support
 */
@customElement('component-palette')
export class ComponentPalette extends LitElement {
  static styles = componentStyles;

  @property() theme: EditorTheme = 'light';

  @state() private searchQuery = '';
  @state() private isDragging = false;

  private componentDefinitions: ComponentDefinition[] = [
    {
      type: 'text',
      name: 'Text',
      icon: '📝',
      category: 'Basic',
      description: 'Simple text element',
      defaultProperties: {
        text: 'Hello World',
        fontSize: 16,
        fontFamily: 'Arial',
        color: '#000000',
        backgroundColor: 'transparent'
      },
      propertySchema: [
        { key: 'text', type: 'string', label: 'Text Content', default: 'Hello World' },
        { key: 'fontSize', type: 'number', label: 'Font Size', default: 16, min: 8, max: 72 },
        { key: 'fontFamily', type: 'select', label: 'Font Family', default: 'Arial', options: ['Arial', 'Helvetica', 'Georgia', 'Times New Roman'] },
        { key: 'color', type: 'color', label: 'Text Color', default: '#000000' }
      ]
    },
    {
      type: 'button',
      name: 'Button',
      icon: '🔘',
      category: 'Basic',
      description: 'Interactive button element',
      defaultProperties: {
        text: 'Click Me',
        backgroundColor: '#3b82f6',
        color: '#ffffff',
        fontSize: 14,
        borderRadius: 6
      },
      propertySchema: [
        { key: 'text', type: 'string', label: 'Button Text', default: 'Click Me' },
        { key: 'backgroundColor', type: 'color', label: 'Background Color', default: '#3b82f6' },
        { key: 'color', type: 'color', label: 'Text Color', default: '#ffffff' },
        { key: 'fontSize', type: 'number', label: 'Font Size', default: 14, min: 8, max: 24 }
      ]
    },
    {
      type: 'image',
      name: 'Image',
      icon: '🖼️',
      category: 'Media',
      description: 'Image placeholder',
      defaultProperties: {
        src: '',
        alt: 'Image description',
        objectFit: 'cover'
      },
      propertySchema: [
        { key: 'src', type: 'string', label: 'Image URL', default: '' },
        { key: 'alt', type: 'string', label: 'Alt Text', default: 'Image description' },
        { key: 'objectFit', type: 'select', label: 'Object Fit', default: 'cover', options: ['cover', 'contain', 'fill', 'scale-down'] }
      ]
    },
    {
      type: 'container',
      name: 'Container',
      icon: '📦',
      category: 'Layout',
      description: 'Generic container element',
      defaultProperties: {
        backgroundColor: '#f8fafc',
        borderColor: '#e2e8f0',
        borderWidth: 1,
        borderRadius: 8,
        padding: 16
      },
      propertySchema: [
        { key: 'backgroundColor', type: 'color', label: 'Background Color', default: '#f8fafc' },
        { key: 'borderColor', type: 'color', label: 'Border Color', default: '#e2e8f0' },
        { key: 'borderWidth', type: 'number', label: 'Border Width', default: 1, min: 0, max: 10 },
        { key: 'borderRadius', type: 'number', label: 'Border Radius', default: 8, min: 0, max: 50 }
      ]
    },
    {
      type: 'input',
      name: 'Input',
      icon: '📝',
      category: 'Forms',
      description: 'Text input field',
      defaultProperties: {
        placeholder: 'Enter text...',
        type: 'text',
        borderColor: '#e2e8f0',
        borderWidth: 1,
        borderRadius: 6,
        padding: 8
      },
      propertySchema: [
        { key: 'placeholder', type: 'string', label: 'Placeholder', default: 'Enter text...' },
        { key: 'type', type: 'select', label: 'Input Type', default: 'text', options: ['text', 'email', 'password', 'number', 'tel'] }
      ]
    }
  ];

  private get filteredComponents() {
    if (!this.searchQuery.trim()) {
      return this.componentDefinitions;
    }

    const query = this.searchQuery.toLowerCase().trim();
    return this.componentDefinitions.filter(component =>
      component.name.toLowerCase().includes(query) ||
      component.category.toLowerCase().includes(query) ||
      component.description.toLowerCase().includes(query)
    );
  }

  private get categorizedComponents() {
    const categories = new Map<string, ComponentDefinition[]>();

    this.filteredComponents.forEach(component => {
      const category = component.category;
      if (!categories.has(category)) {
        categories.set(category, []);
      }
      categories.get(category)!.push(component);
    });

    return Array.from(categories.entries()).sort(([a], [b]) => a.localeCompare(b));
  }

  private handleSearch(e: Event) {
    const input = e.target as HTMLInputElement;
    this.searchQuery = input.value;
  }

  private handleDragStart = (e: DragEvent | TouchEvent, component: ComponentDefinition) => {
    this.isDragging = true;

    // Create drag data
    const dragData = {
      type: 'component',
      componentType: component.type,
      definition: component
    };

    if (e instanceof DragEvent) {
      e.dataTransfer!.setData('application/json', JSON.stringify(dragData));
      e.dataTransfer!.effectAllowed = 'copy';
    }

    // Create visual drag ghost
    this.createDragGhost(component, e);

    // Dispatch custom event for canvas to handle
    this.dispatchEvent(new CustomEvent('component-drag-start', {
      detail: dragData,
      bubbles: true
    }));
  };

  private handleTouchStart = (e: TouchEvent, component: ComponentDefinition) => {
    e.preventDefault();

    const touch = e.touches[0];
    if (!touch) return;

    // Add touch move listeners
    document.addEventListener('touchmove', this.handleTouchMove);
    document.addEventListener('touchend', this.handleTouchEnd);

    this.handleDragStart(e, component);
  };

  private handleTouchMove = (e: TouchEvent) => {
    if (!this.isDragging) return;

    e.preventDefault();
    const touch = e.touches[0];
    if (!touch) return;

    // Update drag ghost position
    this.updateDragGhostPosition(touch.clientX, touch.clientY);

    // Check if over canvas drop zone
    const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
    if (elementBelow?.closest('editor-canvas')) {
      // Provide visual feedback for valid drop zone
      this.dispatchEvent(new CustomEvent('component-drag-over', {
        detail: { x: touch.clientX, y: touch.clientY },
        bubbles: true
      }));
    }
  };

  private handleTouchEnd = (e: TouchEvent) => {
    e.preventDefault();

    document.removeEventListener('touchmove', this.handleTouchMove);
    document.removeEventListener('touchend', this.handleTouchEnd);

    if (!this.isDragging) return;

    const touch = e.changedTouches[0];
    if (!touch) return;

    const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);

    if (elementBelow?.closest('editor-canvas')) {
      // Complete the drop
      this.dispatchEvent(new CustomEvent('component-drop', {
        detail: { x: touch.clientX, y: touch.clientY },
        bubbles: true
      }));
    }

    this.cleanup();
  };

  private createDragGhost(component: ComponentDefinition, e: DragEvent | TouchEvent) {
    const ghost = document.createElement('div');
    ghost.className = 'drag-ghost';
    ghost.innerHTML = `
      <div style="font-size: 20px; margin-bottom: 4px;">${component.icon}</div>
      <div style="font-size: 11px; font-weight: 500;">${component.name}</div>
    `;

    document.body.appendChild(ghost);

    const startX = e instanceof DragEvent ? e.clientX : e.touches[0].clientX;
    const startY = e instanceof DragEvent ? e.clientY : e.touches[0].clientY;

    this.updateDragGhostPosition(startX, startY);
  }

  private updateDragGhostPosition(x: number, y: number) {
    const ghost = document.querySelector('.drag-ghost') as HTMLElement | null;
    if (ghost) {
      ghost.style.left = `${x - 30}px`;
      ghost.style.top = `${y - 30}px`;
    }
  }

  private cleanup() {
    this.isDragging = false;
    const ghost = document.querySelector('.drag-ghost');
    if (ghost) {
      ghost.remove();
    }
  }

  private handleKeyDown = (e: KeyboardEvent, component: ComponentDefinition) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();

      // Simulate drop on canvas center
      this.dispatchEvent(new CustomEvent('component-keyboard-add', {
        detail: { component },
        bubbles: true
      }));

      // Provide screen reader feedback
      this.announceToScreenReader(`Added ${component.name} component to canvas`);
    }
  };

  private announceToScreenReader(message: string) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.style.position = 'absolute';
    announcement.style.left = '-10000px';
    announcement.style.width = '1px';
    announcement.style.height = '1px';
    announcement.style.overflow = 'hidden';
    announcement.textContent = message;

    document.body.appendChild(announcement);
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }

  override render() {
    return html`
      <div class="palette-container">
        <div class="palette-header">
          <h2 class="palette-title">Components</h2>
          <input
            type="text"
            class="search-box"
            placeholder="Search components..."
            .value=${this.searchQuery}
            @input=${this.handleSearch}
            aria-label="Search components">
        </div>
        
        <div class="palette-content" role="region" aria-label="Component Library">
          ${this.categorizedComponents.map(([category, components]) => html`
            <div class="category-section">
              <div class="category-header" role="heading" aria-level="3">
                ${category}
              </div>
              <div class="component-grid" role="group" aria-label="${category} components">
                ${components.map(component => html`
                  <div
                    class="component-card"
                    draggable="true"
                    tabindex="0"
                    role="button"
                    aria-label="Add ${component.name} component. ${component.description}. Press Enter or Space to add to canvas."
                    @dragstart=${(e: DragEvent) => this.handleDragStart(e, component)}
                    @touchstart=${(e: TouchEvent) => this.handleTouchStart(e, component)}
                    @keydown=${(e: KeyboardEvent) => this.handleKeyDown(e, component)}>
                    
                    <div class="component-icon" aria-hidden="true">
                      ${component.icon}
                    </div>
                    <div class="component-name">
                      ${component.name}
                    </div>
                    <div class="component-description">
                      ${component.description}
                    </div>
                  </div>
                `)}
              </div>
            </div>
          `)}
          
          ${this.filteredComponents.length === 0 ? html`
            <div style="padding: 32px; text-align: center; color: var(--editor-secondary, #64748b);">
              <div style="font-size: 24px; margin-bottom: 8px;">🔍</div>
              <div>No components found</div>
              <div style="font-size: 12px; margin-top: 4px;">Try a different search term</div>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }
}
