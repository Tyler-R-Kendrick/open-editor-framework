import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { EditorCanvas } from './index.js';

// Ensure component is registered
customElements.get('editor-canvas') || customElements.define('editor-canvas', EditorCanvas);

const meta: Meta<EditorCanvas> = {
  title: 'Components/EditorCanvas',
  component: 'editor-canvas',
  tags: ['autodocs'],
  argTypes: {
    theme: {
      control: { type: 'select' },
      options: ['light', 'dark'],
      description: 'Visual theme for the editor canvas',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'An HTML5 Canvas-based editor component for rendering and manipulating UI components. Supports touch interactions, keyboard shortcuts, and accessibility features.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<EditorCanvas>;

export const Default: Story = {
  args: {
    theme: 'light',
  },
  render: (args) => html`
    <div style="height: 600px; width: 800px; border: 1px solid #e2e8f0;">
      <editor-canvas .theme=${args.theme}></editor-canvas>
    </div>
  `,
};

export const DarkTheme: Story = {
  args: {
    theme: 'dark',
  },
  render: (args) => html`
    <div style="height: 600px; width: 800px; border: 1px solid #475569; background: #1e293b;">
      <editor-canvas .theme=${args.theme}></editor-canvas>
    </div>
  `,
};

export const MobileView: Story = {
  args: {
    theme: 'light',
  },
  render: (args) => html`
    <div style="height: 700px; width: 375px; border: 1px solid #e2e8f0;">
      <editor-canvas .theme=${args.theme}></editor-canvas>
    </div>
  `,
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Editor canvas optimized for mobile devices with touch-friendly interactions.',
      },
    },
  },
};

export const TabletView: Story = {
  args: {
    theme: 'light',
  },
  render: (args) => html`
    <div style="height: 800px; width: 768px; border: 1px solid #e2e8f0;">
      <editor-canvas .theme=${args.theme}></editor-canvas>
    </div>
  `,
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
    docs: {
      description: {
        story: 'Editor canvas on tablet-sized screens with optimized touch interactions.',
      },
    },
  },
};
