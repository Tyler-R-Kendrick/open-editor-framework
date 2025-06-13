import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import './editor-canvas';
import './component-palette';
import './control-panel';
import './toolbar';
import { EditorTheme } from '../types/editor-types';

/**
 * Main editor application component that orchestrates the canvas, palette, and control panel
 * Supports touch interactions and accessibility features
 */
@customElement('editor-app')
export class EditorApp extends LitElement {
  static override styles = css`
    :host {
      display: block;
      height: 100vh;
      width: 100vw;
      overflow: hidden;
      touch-action: manipulation;
      background-color: #f8fafc;
      color: #1e293b;
      --editor-bg: #f8fafc;
      --editor-border: #e2e8f0;
      --editor-text: #1e293b;
      --editor-primary: #3b82f6;
      --editor-secondary: #64748b;
    }

    .editor-container {
      display: grid;
      grid-template-areas: 
        'toolbar toolbar toolbar'
        'palette canvas controls';
      grid-template-columns: 280px 1fr 320px;
      grid-template-rows: 60px 1fr;
      height: 100vh;
      background: var(--editor-bg);
      gap: 1px;
    }

    .toolbar-area {
      grid-area: toolbar;
      border-bottom: 1px solid var(--editor-border);
      background: white;
    }

    .palette-area {
      grid-area: palette;
      background: white;
      border-right: 1px solid var(--editor-border);
      overflow: hidden;
    }

    .canvas-area {
      grid-area: canvas;
      background: var(--editor-bg);
      position: relative;
      overflow: hidden;
    }

    .controls-area {
      grid-area: controls;
      background: white;
      border-left: 1px solid var(--editor-border);
      overflow: hidden;
    }

    /* Mobile layout */
    @media (max-width: 768px) {
      .editor-container {
        grid-template-areas: 
          'toolbar'
          'mobile-content'
          'mobile-tabs';
        grid-template-columns: 1fr;
        grid-template-rows: 60px 1fr 60px;
      }

      .canvas-area {
        grid-area: mobile-content;
      }

      .palette-area,
      .controls-area {
        grid-area: mobile-content;
        display: none;
      }

      .palette-area.mobile-active,
      .controls-area.mobile-active {
        display: block;
      }

      .canvas-area.mobile-active {
        display: block;
      }

      .canvas-area:not(.mobile-active) {
        display: none;
      }

      .mobile-tabs {
        grid-area: mobile-tabs;
        background: white;
        border-top: 1px solid var(--editor-border);
        display: flex;
        justify-content: space-around;
        align-items: center;
      }

    .mobile-tab {
      flex: 1;
      height: 100%;
      border: none;
      background: transparent;
      color: var(--editor-secondary);
      font-size: 14px;
      cursor: pointer;
      touch-action: manipulation;
      transition: all 0.2s ease;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 4px;
    }

      .mobile-tab:hover,
      .mobile-tab.active {
        color: var(--editor-primary);
        background: #f1f5f9;
      }

      .mobile-tab:focus {
        outline: 2px solid var(--editor-primary);
        outline-offset: -2px;
      }
    }

    /* High contrast mode support */
    @media (prefers-contrast: high) {
      :host {
        --editor-border: #000000;
        --editor-text: #000000;
      }
    }

    /* Reduced motion support */
    @media (prefers-reduced-motion: reduce) {
      * {
        transition: none !important;
        animation: none !important;
      }
    }
  `;

  @state()
  private theme: EditorTheme = 'light';

  @state()
  private isMobile = false;

  @state()
  private activeMobileTab: 'palette' | 'canvas' | 'controls' = 'canvas';

  override connectedCallback() {
    super.connectedCallback();
    this.checkMobileLayout();
    window.addEventListener('resize', this.handleResize);

    // Listen for theme preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', this.handleThemeChange);
    this.handleThemeChange(mediaQuery);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('resize', this.handleResize);
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.removeEventListener('change', this.handleThemeChange);
  }

  private handleResize = () => {
    this.checkMobileLayout();
  };

  private checkMobileLayout() {
    this.isMobile = window.innerWidth <= 768;
  }

  private handleThemeChange = (e: MediaQueryListEvent | MediaQueryList) => {
    this.theme = e.matches ? 'dark' : 'light';
  };

  private handleMobileTabClick(tab: 'palette' | 'canvas' | 'controls') {
    this.activeMobileTab = tab;

    // Provide haptic feedback on supported devices
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
  }

  override render() {
    return html`
      <div class="editor-container" role="application" aria-label="Web Component Editor">
        <div class="toolbar-area">
          <editor-toolbar 
            .theme=${this.theme}
            @theme-change=${(e: CustomEvent) => this.theme = e.detail.theme}>
          </editor-toolbar>
        </div>

        <div class="palette-area ${this.isMobile && this.activeMobileTab === 'palette' ? 'mobile-active' : ''}">
          <component-palette 
            .theme=${this.theme}
            aria-label="Component Library">
          </component-palette>
        </div>

        <div class="canvas-area ${!this.isMobile || this.activeMobileTab === 'canvas' ? 'mobile-active' : ''}">
          <editor-canvas 
            .theme=${this.theme}
            aria-label="Design Canvas">
          </editor-canvas>
        </div>

        <div class="controls-area ${this.isMobile && this.activeMobileTab === 'controls' ? 'mobile-active' : ''}">
          <control-panel 
            .theme=${this.theme}
            aria-label="Properties Panel">
          </control-panel>
        </div>

        ${this.isMobile ? html`
          <div class="mobile-tabs" role="tablist" aria-label="Editor Sections">
            <button 
              class="mobile-tab ${this.activeMobileTab === 'palette' ? 'active' : ''}"
              role="tab"
              aria-selected=${this.activeMobileTab === 'palette'}
              aria-controls="palette-panel"
              @click=${() => this.handleMobileTabClick('palette')}
              @touchstart=${this.handleTouchStart}>
              <span aria-hidden="true">🎨</span>
              Components
            </button>
            <button 
              class="mobile-tab ${this.activeMobileTab === 'canvas' ? 'active' : ''}"
              role="tab"
              aria-selected=${this.activeMobileTab === 'canvas'}
              aria-controls="canvas-panel"
              @click=${() => this.handleMobileTabClick('canvas')}
              @touchstart=${this.handleTouchStart}>
              <span aria-hidden="true">🎯</span>
              Canvas
            </button>
            <button 
              class="mobile-tab ${this.activeMobileTab === 'controls' ? 'active' : ''}"
              role="tab"
              aria-selected=${this.activeMobileTab === 'controls'}
              aria-controls="controls-panel"
              @click=${() => this.handleMobileTabClick('controls')}
              @touchstart=${this.handleTouchStart}>
              <span aria-hidden="true">⚙️</span>
              Properties
            </button>
          </div>
        ` : ''}
      </div>
    `;
  }

  private handleTouchStart = (e: TouchEvent) => {
    // Add touch feedback animation
    const target = e.currentTarget as HTMLElement;
    target.style.transform = 'scale(0.95)';
    setTimeout(() => {
      target.style.transform = '';
    }, 100);
  };
}
