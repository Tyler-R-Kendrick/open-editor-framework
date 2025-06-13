import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { EditorTheme, EditorComponent, PropertySchema } from '../types/editor-types';

/**
 * Control panel for editing component properties with accessibility support
 */
@customElement('control-panel')
export class ControlPanel extends LitElement {
  static override styles = css`
    :host {
      display: block;
      height: 100%;
      overflow: hidden;
      background: white;
      touch-action: manipulation;
    }

    .panel-container {
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .panel-header {
      padding: 16px;
      border-bottom: 1px solid var(--editor-border, #e2e8f0);
      background: #f8fafc;
    }

    .panel-title {
      font-size: 14px;
      font-weight: 600;
      color: var(--editor-text, #1e293b);
      margin: 0;
    }

    .panel-subtitle {
      font-size: 12px;
      color: var(--editor-secondary, #64748b);
      margin: 4px 0 0 0;
    }

    .panel-content {
      flex: 1;
      overflow-y: auto;
      overflow-x: hidden;
    }

    .property-section {
      padding: 16px;
      border-bottom: 1px solid var(--editor-border, #e2e8f0);
    }

    .section-title {
      font-size: 13px;
      font-weight: 600;
      color: var(--editor-text, #1e293b);
      margin: 0 0 12px 0;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .property-group {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .property-field {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .property-label {
      font-size: 12px;
      font-weight: 500;
      color: var(--editor-text, #1e293b);
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .property-description {
      font-size: 11px;
      color: var(--editor-secondary, #64748b);
      line-height: 1.4;
    }

    .property-input {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid var(--editor-border, #e2e8f0);
      border-radius: 6px;
      font-size: 13px;
      background: white;
      transition: all 0.2s ease;
      box-sizing: border-box;
    }

    .property-input:focus {
      outline: none;
      border-color: var(--editor-primary, #3b82f6);
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .property-input:disabled {
      background: #f8fafc;
      color: var(--editor-secondary, #64748b);
      cursor: not-allowed;
    }

    .color-input {
      height: 36px;
      padding: 4px;
      border-radius: 6px;
      cursor: pointer;
    }

    .color-input::-webkit-color-swatch {
      border: none;
      border-radius: 2px;
    }

    .range-input {
      -webkit-appearance: none;
      height: 6px;
      border-radius: 3px;
      background: #e2e8f0;
      outline: none;
    }

    .range-input::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: var(--editor-primary, #3b82f6);
      cursor: pointer;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    .range-input::-moz-range-thumb {
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: var(--editor-primary, #3b82f6);
      cursor: pointer;
      border: none;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    .checkbox-input {
      width: 16px;
      height: 16px;
      accent-color: var(--editor-primary, #3b82f6);
    }

    .select-input {
      cursor: pointer;
    }

    .range-wrapper {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .range-value {
      font-size: 12px;
      color: var(--editor-secondary, #64748b);
      min-width: 40px;
      text-align: right;
      font-family: monospace;
    }

    .empty-state {
      padding: 32px 16px;
      text-align: center;
      color: var(--editor-secondary, #64748b);
    }

    .empty-icon {
      font-size: 32px;
      margin-bottom: 12px;
      opacity: 0.6;
    }

    .empty-title {
      font-size: 14px;
      font-weight: 500;
      margin-bottom: 4px;
    }

    .empty-description {
      font-size: 12px;
      line-height: 1.4;
    }

    .component-info {
      background: #f1f5f9;
      padding: 12px;
      border-radius: 6px;
      margin-bottom: 16px;
    }

    .component-type {
      font-size: 11px;
      font-weight: 600;
      color: var(--editor-primary, #3b82f6);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 4px;
    }

    .component-id {
      font-size: 11px;
      color: var(--editor-secondary, #64748b);
      font-family: monospace;
    }

    .action-buttons {
      padding: 16px;
      border-top: 1px solid var(--editor-border, #e2e8f0);
      display: flex;
      gap: 8px;
    }

    .action-button {
      flex: 1;
      padding: 8px 12px;
      border: 1px solid var(--editor-border, #e2e8f0);
      border-radius: 6px;
      background: white;
      color: var(--editor-text, #1e293b);
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      min-height: 44px;
    }

    .action-button:hover {
      background: #f8fafc;
      border-color: var(--editor-primary, #3b82f6);
    }

    .action-button:focus {
      outline: 2px solid var(--editor-primary, #3b82f6);
      outline-offset: 2px;
    }

    .action-button.danger {
      color: #dc2626;
      border-color: #fca5a5;
    }

    .action-button.danger:hover {
      background: #fef2f2;
      border-color: #dc2626;
    }

    /* Touch-specific styles */
    @media (pointer: coarse) {
      .property-input {
        min-height: 44px;
        padding: 12px;
        font-size: 16px; /* Prevent zoom on iOS */
      }
      
      .color-input {
        height: 44px;
      }
      
      .range-input::-webkit-slider-thumb {
        width: 24px;
        height: 24px;
      }
      
      .checkbox-input {
        width: 20px;
        height: 20px;
      }
    }

    /* High contrast mode */
    @media (prefers-contrast: high) {
      .property-input {
        border-width: 2px;
        border-color: black;
      }
      
      .property-input:focus {
        border-color: black;
        box-shadow: 0 0 0 3px black;
      }
    }

    /* Dark theme */
    :host([theme="dark"]) {
      background: #1e293b;
    }

    :host([theme="dark"]) .panel-header {
      background: #334155;
      border-color: #475569;
    }

    :host([theme="dark"]) .property-section {
      border-color: #475569;
    }

    :host([theme="dark"]) .property-input {
      background: #334155;
      border-color: #475569;
      color: #f1f5f9;
    }

    :host([theme="dark"]) .component-info {
      background: #334155;
    }

    :host([theme="dark"]) .action-button {
      background: #334155;
      border-color: #475569;
      color: #f1f5f9;
    }

    /* Scrollbar styling */
    .panel-content::-webkit-scrollbar {
      width: 8px;
    }

    .panel-content::-webkit-scrollbar-track {
      background: #f1f5f9;
    }

    .panel-content::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 4px;
    }

    .panel-content::-webkit-scrollbar-thumb:hover {
      background: #94a3b8;
    }
  `;

  @property() theme: EditorTheme = 'light';
  @property() selectedComponents: EditorComponent[] = [];

  @state() private editingComponent: EditorComponent | null = null;

  override connectedCallback() {
    super.connectedCallback();
    // Listen for selection changes from the canvas
    this.addEventListener('selection-change', this.handleSelectionChange as EventListener);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('selection-change', this.handleSelectionChange as EventListener);
  }

  private handleSelectionChange = (e: CustomEvent) => {
    const { selectedComponents } = e.detail;
    if (selectedComponents.length === 1) {
      this.editingComponent = selectedComponents[0];
    } else {
      this.editingComponent = null;
    }
  };

  private handlePropertyChange = (property: string, value: any) => {
    if (!this.editingComponent) return;

    // Update the component property
    this.editingComponent.properties[property] = value;

    // Dispatch property change event for the canvas to update
    this.dispatchEvent(new CustomEvent('property-change', {
      detail: {
        componentId: this.editingComponent.id,
        property,
        value
      },
      bubbles: true
    }));

    // Force re-render
    this.requestUpdate();
  };

  private renderPropertyField(property: PropertySchema, currentValue: any) {
    const value = currentValue ?? property.default;
    const fieldId = `property-${property.key}`;

    switch (property.type) {
      case 'string':
        return html`
          <div class="property-field">
            <label class="property-label" for="${fieldId}">
              ${property.label}
              ${property.description ? html`
                <span class="property-description" title="${property.description}">ℹ️</span>
              ` : ''}
            </label>
            ${property.description ? html`
              <div class="property-description">${property.description}</div>
            ` : ''}
            <input
              id="${fieldId}"
              type="text"
              class="property-input"
              .value=${value}
              @input=${(e: Event) => {
            const input = e.target as HTMLInputElement;
            this.handlePropertyChange(property.key, input.value);
          }}
              aria-describedby="${property.description ? `${fieldId}-desc` : ''}">
          </div>
        `;

      case 'number':
        return html`
          <div class="property-field">
            <label class="property-label" for="${fieldId}">
              ${property.label}
            </label>
            ${property.description ? html`
              <div class="property-description">${property.description}</div>
            ` : ''}
            <input
              id="${fieldId}"
              type="number"
              class="property-input"
              .value=${value}
              min=${property.min ?? ''}
              max=${property.max ?? ''}
              step=${property.step ?? '1'}
              @input=${(e: Event) => {
            const input = e.target as HTMLInputElement;
            this.handlePropertyChange(property.key, parseFloat(input.value) || 0);
          }}>
          </div>
        `;

      case 'range':
        return html`
          <div class="property-field">
            <label class="property-label" for="${fieldId}">
              ${property.label}
            </label>
            ${property.description ? html`
              <div class="property-description">${property.description}</div>
            ` : ''}
            <div class="range-wrapper">
              <input
                id="${fieldId}"
                type="range"
                class="property-input range-input"
                .value=${value}
                min=${property.min ?? 0}
                max=${property.max ?? 100}
                step=${property.step ?? 1}
                @input=${(e: Event) => {
            const input = e.target as HTMLInputElement;
            this.handlePropertyChange(property.key, parseFloat(input.value));
          }}
                aria-label="${property.label}: ${value}">
              <span class="range-value">${value}</span>
            </div>
          </div>
        `;

      case 'boolean':
        return html`
          <div class="property-field">
            <label class="property-label">
              <input
                id="${fieldId}"
                type="checkbox"
                class="checkbox-input"
                .checked=${value}
                @change=${(e: Event) => {
            const input = e.target as HTMLInputElement;
            this.handlePropertyChange(property.key, input.checked);
          }}>
              ${property.label}
            </label>
            ${property.description ? html`
              <div class="property-description">${property.description}</div>
            ` : ''}
          </div>
        `;

      case 'color':
        return html`
          <div class="property-field">
            <label class="property-label" for="${fieldId}">
              ${property.label}
            </label>
            ${property.description ? html`
              <div class="property-description">${property.description}</div>
            ` : ''}
            <input
              id="${fieldId}"
              type="color"
              class="property-input color-input"
              .value=${value}
              @input=${(e: Event) => {
            const input = e.target as HTMLInputElement;
            this.handlePropertyChange(property.key, input.value);
          }}>
          </div>
        `;

      case 'select':
        return html`
          <div class="property-field">
            <label class="property-label" for="${fieldId}">
              ${property.label}
            </label>
            ${property.description ? html`
              <div class="property-description">${property.description}</div>
            ` : ''}
            <select
              id="${fieldId}"
              class="property-input select-input"
              @change=${(e: Event) => {
            const select = e.target as HTMLSelectElement;
            this.handlePropertyChange(property.key, select.value);
          }}>
              ${property.options?.map(option => html`
                <option value="${option}" ?selected=${value === option}>
                  ${option}
                </option>
              `)}
            </select>
          </div>
        `;

      default:
        return html`
          <div class="property-field">
            <div class="property-label">Unsupported property type: ${property.type}</div>
          </div>
        `;
    }
  }

  private handleDuplicate = () => {
    if (!this.editingComponent) return;

    this.dispatchEvent(new CustomEvent('component-duplicate', {
      detail: { componentId: this.editingComponent.id },
      bubbles: true
    }));
  };

  private handleDelete = () => {
    if (!this.editingComponent) return;

    if (confirm(`Are you sure you want to delete the ${this.editingComponent.type} component?`)) {
      this.dispatchEvent(new CustomEvent('component-delete', {
        detail: { componentId: this.editingComponent.id },
        bubbles: true
      }));
    }
  };

  private handleBringToFront = () => {
    if (!this.editingComponent) return;

    this.dispatchEvent(new CustomEvent('component-bring-to-front', {
      detail: { componentId: this.editingComponent.id },
      bubbles: true
    }));
  };

  override render() {
    if (!this.editingComponent) {
      return html`
        <div class="panel-container">
          <div class="panel-header">
            <h2 class="panel-title">Properties</h2>
            <p class="panel-subtitle">Select a component to edit its properties</p>
          </div>
          
          <div class="empty-state">
            <div class="empty-icon">⚙️</div>
            <div class="empty-title">No Component Selected</div>
            <div class="empty-description">
              Click on a component in the canvas to view and edit its properties.
            </div>
          </div>

          <!-- Sample controls for testing purposes -->
          <div class="property-section">
            <h3 class="section-title">
              <span>📋</span>
              General Settings
            </h3>
            <div class="property-group">
              <div class="property-field">
                <label class="property-label">Canvas Background</label>
                <input
                  type="color"
                  class="property-input color-input"
                  value="#ffffff"
                  disabled>
              </div>
              <div class="property-field">
                <label class="property-label">Grid Size</label>
                <input
                  type="range"
                  class="property-input range-input"
                  min="10"
                  max="50"
                  value="20"
                  disabled>
              </div>
              <div class="property-field">
                <label class="property-label">Snap to Grid</label>
                <input
                  type="checkbox"
                  class="property-input checkbox-input"
                  checked
                  disabled>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    // Get property schema for the component type
    const propertySchema = this.getPropertySchema(this.editingComponent.type);

    return html`
      <div class="panel-container" role="region" aria-label="Component Properties">
        <div class="panel-header">
          <h2 class="panel-title">Properties</h2>
          <p class="panel-subtitle">Edit component settings</p>
        </div>
        
        <div class="panel-content">
          <div class="property-section">
            <div class="component-info">
              <div class="component-type">${this.editingComponent.type}</div>
              <div class="component-id">ID: ${this.editingComponent.id}</div>
            </div>
          </div>

          <div class="property-section">
            <h3 class="section-title">
              <span>📐</span>
              Dimensions & Position
            </h3>
            <div class="property-group">
              <div class="property-field">
                <label class="property-label">X Position</label>
                <input
                  type="number"
                  class="property-input"
                  .value=${this.editingComponent.bounds.x}
                  @input=${(e: Event) => {
        const input = e.target as HTMLInputElement;
        const newBounds = { ...this.editingComponent!.bounds, x: parseFloat(input.value) || 0 };
        this.handlePropertyChange('bounds', newBounds);
      }}>
              </div>
              <div class="property-field">
                <label class="property-label">Y Position</label>
                <input
                  type="number"
                  class="property-input"
                  .value=${this.editingComponent.bounds.y}
                  @input=${(e: Event) => {
        const input = e.target as HTMLInputElement;
        const newBounds = { ...this.editingComponent!.bounds, y: parseFloat(input.value) || 0 };
        this.handlePropertyChange('bounds', newBounds);
      }}>
              </div>
              <div class="property-field">
                <label class="property-label">Width</label>
                <input
                  type="number"
                  class="property-input"
                  .value=${this.editingComponent.bounds.width}
                  min="1"
                  @input=${(e: Event) => {
        const input = e.target as HTMLInputElement;
        const newBounds = { ...this.editingComponent!.bounds, width: Math.max(1, parseFloat(input.value) || 1) };
        this.handlePropertyChange('bounds', newBounds);
      }}>
              </div>
              <div class="property-field">
                <label class="property-label">Height</label>
                <input
                  type="number"
                  class="property-input"
                  .value=${this.editingComponent.bounds.height}
                  min="1"
                  @input=${(e: Event) => {
        const input = e.target as HTMLInputElement;
        const newBounds = { ...this.editingComponent!.bounds, height: Math.max(1, parseFloat(input.value) || 1) };
        this.handlePropertyChange('bounds', newBounds);
      }}>
              </div>
            </div>
          </div>

          ${propertySchema.length > 0 ? html`
            <div class="property-section">
              <h3 class="section-title">
                <span>🎨</span>
                Appearance
              </h3>
              <div class="property-group">
                ${propertySchema.map(property =>
        this.renderPropertyField(property, this.editingComponent!.properties[property.key])
      )}
              </div>
            </div>
          ` : ''}
        </div>
        
        <div class="action-buttons">
          <button
            class="action-button"
            @click=${this.handleDuplicate}
            title="Duplicate this component"
            aria-label="Duplicate component">
            📋 Duplicate
          </button>
          <button
            class="action-button"
            @click=${this.handleBringToFront}
            title="Bring this component to front"
            aria-label="Bring to front">
            ⬆️ To Front
          </button>
          <button
            class="action-button danger"
            @click=${this.handleDelete}
            title="Delete this component"
            aria-label="Delete component">
            🗑️ Delete
          </button>
        </div>
      </div>
    `;
  }

  private getPropertySchema(componentType: string): PropertySchema[] {
    // This would normally come from a component registry
    // For now, return basic schema based on component type
    switch (componentType) {
      case 'text':
        return [
          { key: 'text', type: 'string', label: 'Text Content', default: 'Hello World' },
          { key: 'fontSize', type: 'range', label: 'Font Size', default: 16, min: 8, max: 72 },
          { key: 'color', type: 'color', label: 'Text Color', default: '#000000' },
          { key: 'fontFamily', type: 'select', label: 'Font Family', default: 'Arial', options: ['Arial', 'Helvetica', 'Georgia', 'Times New Roman'] }
        ];
      case 'button':
        return [
          { key: 'text', type: 'string', label: 'Button Text', default: 'Click Me' },
          { key: 'backgroundColor', type: 'color', label: 'Background Color', default: '#3b82f6' },
          { key: 'color', type: 'color', label: 'Text Color', default: '#ffffff' },
          { key: 'fontSize', type: 'range', label: 'Font Size', default: 14, min: 8, max: 24 }
        ];
      default:
        return [];
    }
  }
}
