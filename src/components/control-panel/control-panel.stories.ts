import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './index';
import { EditorComponent } from '../../types/editor-types';

const meta: Meta = {
  title: 'Components/ControlPanel',
  component: 'control-panel',
  parameters: {
    docs: {
      description: {
        component: 'A control panel for editing component properties with support for various input types and accessibility features.',
      },
    },
  },
  argTypes: {
    theme: {
      control: { type: 'select' },
      options: ['light', 'dark'],
      description: 'Visual theme of the control panel',
    },
  },
};

export default meta;
type Story = StoryObj;

// Sample component data for stories
const sampleTextComponent: EditorComponent = {
  id: 'text-1',
  type: 'text',
  name: 'Text Component',
  bounds: { x: 100, y: 100, width: 200, height: 50 },
  properties: {
    text: 'Hello World',
    fontSize: 16,
    color: '#000000',
    fontFamily: 'Arial'
  },
  zIndex: 1
};

const sampleButtonComponent: EditorComponent = {
  id: 'button-1',
  type: 'button',
  name: 'Button Component',
  bounds: { x: 150, y: 200, width: 120, height: 40 },
  properties: {
    text: 'Click Me',
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    fontSize: 14
  },
  zIndex: 2
};

export const Default: Story = {
  args: {
    theme: 'light',
  },
  render: (args) => html`
    <div style="height: 600px; width: 350px; border: 1px solid #e2e8f0;">
      <control-panel
        .theme=${args.theme}>
      </control-panel>
    </div>
  `,
};

export const WithTextComponent: Story = {
  args: {
    theme: 'light',
  },
  render: (args) => html`
    <div style="height: 600px; width: 350px; border: 1px solid #e2e8f0;">
      <control-panel
        .theme=${args.theme}
        .selectedComponents=${[sampleTextComponent]}>
      </control-panel>
    </div>
  `,
};

export const WithButtonComponent: Story = {
  args: {
    theme: 'light',
  },
  render: (args) => html`
    <div style="height: 600px; width: 350px; border: 1px solid #e2e8f0;">
      <control-panel
        .theme=${args.theme}
        .selectedComponents=${[sampleButtonComponent]}>
      </control-panel>
    </div>
  `,
};

export const DarkTheme: Story = {
  args: {
    theme: 'dark',
  },
  render: (args) => html`
    <div style="height: 600px; width: 350px; border: 1px solid #475569; background: #1e293b;">
      <control-panel
        .theme=${args.theme}
        .selectedComponents=${[sampleTextComponent]}>
      </control-panel>
    </div>
  `,
};

export const MobileView: Story = {
  args: {
    theme: 'light',
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  render: (args) => html`
    <div style="height: 100vh; width: 100vw;">
      <control-panel
        .theme=${args.theme}
        .selectedComponents=${[sampleButtonComponent]}>
      </control-panel>
    </div>
  `,
};

// Interactive story with event handling
export const Interactive: Story = {
  args: {
    theme: 'light',
  },
  render: (args) => {
    const handlePropertyChange = (e: CustomEvent) => {
      console.log('Property changed:', e.detail);
    };

    const handleComponentAction = (e: CustomEvent) => {
      console.log('Component action:', e.type, e.detail);
    };

    return html`
      <div style="height: 600px; width: 350px; border: 1px solid #e2e8f0;">
        <control-panel
          .theme=${args.theme}
          .selectedComponents=${[sampleTextComponent]}
          @property-change=${handlePropertyChange}
          @component-duplicate=${handleComponentAction}
          @component-delete=${handleComponentAction}
          @component-bring-to-front=${handleComponentAction}>
        </control-panel>
      </div>
      <div style="margin-top: 20px; padding: 16px; background: #f8fafc; border-radius: 8px; font-family: monospace; font-size: 12px;">
        <strong>Events:</strong> Check the browser console to see events fired by the control panel.
      </div>
    `;
  },
};
