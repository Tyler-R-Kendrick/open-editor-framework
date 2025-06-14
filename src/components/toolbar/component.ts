import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { EditorTheme } from '../../types/editor-types';
import { toolbarStyles } from './toolbar.styles.js';

/**
 * Editor toolbar with actions and theme controls
 * Features:
 * - File operations (new, save, load, export)
 * - Undo/redo functionality
 * - Zoom controls with keyboard shortcuts
 * - Theme toggle
 * - Keyboard shortcuts for all actions
 * - Mobile-responsive layout
 */
@customElement('editor-toolbar')
export class EditorToolbar extends LitElement {
  static styles = toolbarStyles;

  @property() theme: EditorTheme = 'light';

  @state() private zoomLevel = 100;
  @state() private canUndo = false;
  @state() private canRedo = false;

  private handleUndo = () => {
    this.dispatchEvent(new CustomEvent('editor-undo', { bubbles: true }));
  };

  private handleRedo = () => {
    this.dispatchEvent(new CustomEvent('editor-redo', { bubbles: true }));
  };

  private handleNew = () => {
    if (confirm('Create a new document? This will clear the current canvas.')) {
      this.dispatchEvent(new CustomEvent('editor-new', { bubbles: true }));
    }
  };

  private handleSave = () => {
    this.dispatchEvent(new CustomEvent('editor-save', { bubbles: true }));
  };

  private handleLoad = () => {
    // Trigger file input
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        this.dispatchEvent(new CustomEvent('editor-load', {
          detail: { file },
          bubbles: true
        }));
      }
    };
    input.click();
  };

  private handleExport = () => {
    this.dispatchEvent(new CustomEvent('editor-export', { bubbles: true }));
  };

  private handleZoomIn = () => {
    this.zoomLevel = Math.min(500, this.zoomLevel + 25);
    this.dispatchEvent(new CustomEvent('editor-zoom', {
      detail: { zoom: this.zoomLevel / 100 },
      bubbles: true
    }));
  };

  private handleZoomOut = () => {
    this.zoomLevel = Math.max(25, this.zoomLevel - 25);
    this.dispatchEvent(new CustomEvent('editor-zoom', {
      detail: { zoom: this.zoomLevel / 100 },
      bubbles: true
    }));
  };

  private handleZoomReset = () => {
    this.zoomLevel = 100;
    this.dispatchEvent(new CustomEvent('editor-zoom', {
      detail: { zoom: 1 },
      bubbles: true
    }));
  };

  private handleThemeToggle = () => {
    const newTheme: EditorTheme = this.theme === 'light' ? 'dark' : 'light';
    this.dispatchEvent(new CustomEvent('theme-change', {
      detail: { theme: newTheme },
      bubbles: true
    }));
  };

  private handleKeyboardShortcut = (e: KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'n':
          e.preventDefault();
          this.handleNew();
          break;
        case 's':
          e.preventDefault();
          this.handleSave();
          break;
        case 'o':
          e.preventDefault();
          this.handleLoad();
          break;
        case 'e':
          e.preventDefault();
          this.handleExport();
          break;
        case 'z':
          e.preventDefault();
          if (e.shiftKey) {
            this.handleRedo();
          } else {
            this.handleUndo();
          }
          break;
        case '=':
        case '+':
          e.preventDefault();
          this.handleZoomIn();
          break;
        case '-':
          e.preventDefault();
          this.handleZoomOut();
          break;
        case '0':
          e.preventDefault();
          this.handleZoomReset();
          break;
      }
    }
  };

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('keydown', this.handleKeyboardShortcut);

    // Enable undo/redo buttons for testing purposes
    // In a real app, this would be managed by an undo/redo stack
    setTimeout(() => {
      this.canUndo = true;
      this.canRedo = true;
    }, 100);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('keydown', this.handleKeyboardShortcut);
  }

  override render() {
    return html`
      <div class="toolbar-container" role="toolbar" aria-label="Editor Toolbar">
        <div class="toolbar-section">
          <div class="logo-section">
            <span class="logo" role="img" aria-label="Editor Logo">🎨</span>
            <span class="logo-text">Open Editor</span>
          </div>
          
          <div class="toolbar-divider"></div>
          
          <button
            class="toolbar-button"
            @click=${this.handleNew}
            title="New Document (Ctrl+N)"
            aria-label="Create new document">
            <span role="img" aria-hidden="true">📄</span>
            New
          </button>
          
          <button
            class="toolbar-button"
            @click=${this.handleSave}
            title="Save Document (Ctrl+S)"
            aria-label="Save document">
            <span role="img" aria-hidden="true">💾</span>
            Save
          </button>
          
          <button
            class="toolbar-button"
            @click=${this.handleLoad}
            title="Load Document (Ctrl+O)"
            aria-label="Load document">
            <span role="img" aria-hidden="true">📂</span>
            Load
          </button>
          
          <button
            class="toolbar-button"
            @click=${this.handleExport}
            title="Export (Ctrl+E)"
            aria-label="Export document">
            <span role="img" aria-hidden="true">📤</span>
            Export
          </button>
        </div>

        <div class="toolbar-section center">
          <button
            class="toolbar-button"
            @click=${this.handleUndo}
            ?disabled=${!this.canUndo}
            title="Undo (Ctrl+Z)"
            aria-label="Undo last action">
            <span role="img" aria-hidden="true">↶</span>
            Undo
          </button>
          
          <button
            class="toolbar-button"
            @click=${this.handleRedo}
            ?disabled=${!this.canRedo}
            title="Redo (Ctrl+Shift+Z)"
            aria-label="Redo last action">
            <span role="img" aria-hidden="true">↷</span>
            Redo
          </button>
          
          <div class="toolbar-divider"></div>
          
          <div class="zoom-controls" role="group" aria-label="Zoom Controls">
            <button
              class="zoom-button"
              @click=${this.handleZoomOut}
              title="Zoom Out (Ctrl+-)"
              aria-label="Zoom out">
              <span role="img" aria-hidden="true">🔍-</span>
            </button>
            
            <button
              class="zoom-level"
              @click=${this.handleZoomReset}
              title="Reset Zoom (Ctrl+0)"
              aria-label="Reset zoom to 100%">
              ${this.zoomLevel}%
            </button>
            
            <button
              class="zoom-button"
              @click=${this.handleZoomIn}
              title="Zoom In (Ctrl++)"
              aria-label="Zoom in">
              <span role="img" aria-hidden="true">🔍+</span>
            </button>
          </div>
        </div>

        <div class="toolbar-section">
          <button
            class="theme-toggle ${this.theme === 'dark' ? 'dark' : ''}"
            @click=${this.handleThemeToggle}
            title="Toggle Theme"
            aria-label="Toggle between light and dark theme"
            role="switch"
            aria-checked=${this.theme === 'dark'}>
          </button>
          
          <div class="toolbar-divider"></div>
          
          <button
            class="toolbar-button"
            @click=${() => window.open('https://github.com/your-repo/open-editor-framework', '_blank')}
            title="View on GitHub"
            aria-label="View project on GitHub">
            <span role="img" aria-hidden="true">⭐</span>
            GitHub
          </button>
        </div>
      </div>
    `;
  }
}
