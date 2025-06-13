import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { ComponentPalette } from './index.js';

// Ensure component is registered
customElements.get('component-palette') || customElements.define('component-palette', ComponentPalette);

const meta: Meta<ComponentPalette> = {
  title: 'Components/ComponentPalette',
  component: 'component-palette',
  tags: ['autodocs'],
  argTypes: {
    theme: {
      control: { type: 'select' },
      options: ['light', 'dark'],
      description: 'Visual theme for the component palette',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'A drag-and-drop component palette that displays available web components for building interfaces. Supports touch interactions and keyboard accessibility.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<ComponentPalette>;

export const Default: Story = {
  args: {
    theme: 'light',
  },
  render: (args) => html`
    <div style="height: 500px; width: 300px; border: 1px solid #e2e8f0;">
      <component-palette .theme=${args.theme}></component-palette>
    </div>
  `,
};

export const DarkTheme: Story = {
  args: {
    theme: 'dark',
  },
  render: (args) => html`
    <div style="height: 500px; width: 300px; border: 1px solid #475569; background: #1e293b;">
      <component-palette .theme=${args.theme}></component-palette>
    </div>
  `,
};

export const WithSearchExample: Story = {
  args: {
    theme: 'light',
  },
  render: (args) => html`
    <div style="height: 500px; width: 300px; border: 1px solid #e2e8f0;">
      <component-palette .theme=${args.theme}></component-palette>
    </div>
    <p style="margin-top: 16px; font-size: 14px; color: #64748b;">
      Try searching for "button", "text", or "layout" to filter components.
    </p>
  `,
};

export const MobileView: Story = {
  args: {
    theme: 'light',
  },
  render: (args) => html`
    <div style="height: 600px; width: 375px; border: 1px solid #e2e8f0;">
      <component-palette .theme=${args.theme}></component-palette>
    </div>
  `,
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Component palette optimized for mobile interactions with larger touch targets.',
      },
    },
  },
};
