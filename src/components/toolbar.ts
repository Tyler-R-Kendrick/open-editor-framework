import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { EditorTheme } from '../types/editor-types';

/**
 * Editor toolbar with actions and theme controls
 */
@customElement('editor-toolbar')
export class EditorToolbar extends LitElement {
  static styles = css`
    :host {
      display: block;
      width: 100%;
      height: 100%;
      background: white;
      border-bottom: 1px solid var(--editor-border, #e2e8f0);
      touch-action: manipulation;
    }

    .toolbar-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 100%;
      padding: 0 16px;
    }

    .toolbar-section {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .logo-section {
      display: flex;
      align-items: center;
      gap: 12px;
      font-weight: 600;
      color: var(--editor-text, #1e293b);
    }

    .logo {
      font-size: 20px;
    }

    .logo-text {
      font-size: 16px;
      color: var(--editor-text, #1e293b);
    }

    .toolbar-button {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 12px;
      border: 1px solid var(--editor-border, #e2e8f0);
      border-radius: 6px;
      background: white;
      color: var(--editor-text, #1e293b);
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      touch-action: manipulation;
      transition: all 0.2s ease;
      min-height: 36px;
      text-decoration: none;
    }

    .toolbar-button:hover {
      background: #f8fafc;
      border-color: var(--editor-primary, #3b82f6);
      color: var(--editor-primary, #3b82f6);
    }

    .toolbar-button:focus {
      outline: 2px solid var(--editor-primary, #3b82f6);
      outline-offset: 2px;
    }

    .toolbar-button:active {
      transform: scale(0.98);
    }

    .toolbar-button.active {
      background: var(--editor-primary, #3b82f6);
      color: white;
      border-color: var(--editor-primary, #3b82f6);
    }

    .toolbar-button.primary {
      background: var(--editor-primary, #3b82f6);
      color: white;
      border-color: var(--editor-primary, #3b82f6);
    }

    .toolbar-button.primary:hover {
      background: #2563eb;
      border-color: #2563eb;
    }

    .toolbar-divider {
      width: 1px;
      height: 24px;
      background: var(--editor-border, #e2e8f0);
      margin: 0 4px;
    }

    .zoom-controls {
      display: flex;
      align-items: center;
      gap: 8px;
      background: #f8fafc;
      padding: 4px 8px;
      border-radius: 6px;
      border: 1px solid var(--editor-border, #e2e8f0);
    }

    .zoom-button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      border: none;
      background: transparent;
      color: var(--editor-text, #1e293b);
      cursor: pointer;
      border-radius: 4px;
      transition: background 0.2s ease;
    }

    .zoom-button:hover {
      background: white;
    }

    .zoom-button:focus {
      outline: 2px solid var(--editor-primary, #3b82f6);
      outline-offset: 1px;
    }

    .zoom-level {
      font-size: 12px;
      font-weight: 500;
      color: var(--editor-text, #1e293b);
      min-width: 40px;
      text-align: center;
      font-family: monospace;
    }

    .theme-toggle {
      position: relative;
      width: 48px;
      height: 24px;
      background: var(--editor-border, #e2e8f0);
      border-radius: 12px;
      cursor: pointer;
      transition: background 0.3s ease;
      border: none;
      outline: none;
    }

    .theme-toggle.dark {
      background: var(--editor-primary, #3b82f6);
    }

    .theme-toggle:focus {
      box-shadow: 0 0 0 2px var(--editor-primary, #3b82f6);
    }

    .theme-toggle::before {
      content: '';
      position: absolute;
      top: 2px;
      left: 2px;
      width: 20px;
      height: 20px;
      background: white;
      border-radius: 50%;
      transition: transform 0.3s ease;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    .theme-toggle.dark::before {
      transform: translateX(24px);
    }

    .theme-toggle::after {
      content: '☀️';
      position: absolute;
      top: 50%;
      left: 6px;
      transform: translateY(-50%);
      font-size: 12px;
      transition: opacity 0.3s ease;
    }

    .theme-toggle.dark::after {
      content: '🌙';
      left: 30px;
    }

    /* Mobile layout */
    @media (max-width: 768px) {
      .toolbar-container {
        padding: 0 12px;
        gap: 8px;
      }

      .toolbar-button {
        padding: 6px 8px;
        font-size: 12px;
        min-height: 32px;
      }

      .logo-text {
        display: none;
      }

      .zoom-controls {
        display: none;
      }

      /* Show undo/redo buttons on mobile, hide other center items */
      .toolbar-section.center .zoom-controls {
        display: none;
      }

      .toolbar-section.center .toolbar-divider {
        display: none;
      }

      /* Ensure undo/redo buttons are visible */
      .toolbar-section.center button[title*="Undo"],
      .toolbar-section.center button[title*="Redo"] {
        display: flex;
      }
    }

    /* Touch-specific styles */
    @media (pointer: coarse) {
      .toolbar-button {
        min-height: 44px;
        padding: 10px 14px;
      }

      .zoom-button {
        width: 36px;
        height: 36px;
      }

      .theme-toggle {
        width: 56px;
        height: 32px;
        border-radius: 16px;
      }

      .theme-toggle::before {
        width: 28px;
        height: 28px;
        top: 2px;
        left: 2px;
      }

      .theme-toggle.dark::before {
        transform: translateX(24px);
      }
    }

    /* High contrast mode */
    @media (prefers-contrast: high) {
      .toolbar-button {
        border-width: 2px;
        border-color: black;
      }

      .zoom-controls {
        border-width: 2px;
        border-color: black;
      }

      .theme-toggle {
        border: 2px solid black;
      }
    }

    /* Dark theme */
    :host([theme="dark"]) {
      background: #1e293b;
      border-color: #475569;
    }

    :host([theme="dark"]) .toolbar-button {
      background: #334155;
      border-color: #475569;
      color: #f1f5f9;
    }

    :host([theme="dark"]) .toolbar-button:hover {
      background: #475569;
      border-color: #3b82f6;
      color: #3b82f6;
    }

    :host([theme="dark"]) .zoom-controls {
      background: #334155;
      border-color: #475569;
    }

    :host([theme="dark"]) .zoom-button:hover {
      background: #475569;
    }
  `;

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

  render() {
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
