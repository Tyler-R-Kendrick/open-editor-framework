import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { EditorTheme, EditorComponent, PropertySchema } from '../../types/editor-types';
import { controlPanelStyles } from './control-panel.styles.js';

/**
 * Control panel for editing component properties with accessibility support
 */
@customElement('control-panel')
export class ControlPanel extends LitElement {
  static styles = controlPanelStyles;

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
}
