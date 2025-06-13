import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { EditorToolbar } from './index.js';

// Ensure component is registered
customElements.get('editor-toolbar') || customElements.define('editor-toolbar', EditorToolbar);

const meta: Meta<EditorToolbar> = {
  title: 'Components/EditorToolbar',
  component: 'editor-toolbar',
  tags: ['autodocs'],
  argTypes: {
    theme: {
      control: { type: 'select' },
      options: ['light', 'dark'],
      description: 'Visual theme for the toolbar',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'A comprehensive toolbar providing file operations, editing controls, zoom management, and theme switching. Includes keyboard shortcuts and mobile-responsive design.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<EditorToolbar>;

export const Default: Story = {
  args: {
    theme: 'light',
  },
  render: (args) => html`
    <div style="height: 60px; width: 100%; border: 1px solid #e2e8f0;">
      <editor-toolbar .theme=${args.theme}></editor-toolbar>
    </div>
  `,
};

export const DarkTheme: Story = {
  args: {
    theme: 'dark',
  },
  render: (args) => html`
    <div style="height: 60px; width: 100%; border: 1px solid #475569; background: #1e293b;">
      <editor-toolbar .theme=${args.theme}></editor-toolbar>
    </div>
  `,
};

export const MobileView: Story = {
  args: {
    theme: 'light',
  },
  render: (args) => html`
    <div style="height: 60px; width: 375px; border: 1px solid #e2e8f0;">
      <editor-toolbar .theme=${args.theme}></editor-toolbar>
    </div>
  `,
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Toolbar on mobile devices with condensed layout and hidden non-essential elements.',
      },
    },
  },
};

export const WithActions: Story = {
  args: {
    theme: 'light',
  },
  render: (args) => html`
    <div style="height: 60px; width: 100%; border: 1px solid #e2e8f0;">
      <editor-toolbar 
        .theme=${args.theme}
        @editor-new=${() => console.log('New document')}
        @editor-save=${() => console.log('Save document')}
        @editor-load=${() => console.log('Load document')}
        @editor-export=${() => console.log('Export document')}
        @editor-undo=${() => console.log('Undo')}
        @editor-redo=${() => console.log('Redo')}
        @editor-zoom=${(e: CustomEvent) => console.log('Zoom:', e.detail.zoom)}
        @theme-change=${(e: CustomEvent) => console.log('Theme changed:', e.detail.theme)}>
      </editor-toolbar>
    </div>
    <p style="margin-top: 16px; font-size: 14px; color: #64748b;">
      Click buttons or use keyboard shortcuts to see actions in console. Try Ctrl+N, Ctrl+S, Ctrl+Z, etc.
    </p>
  `,
  parameters: {
    docs: {
      description: {
        story: 'Toolbar with event handlers attached. Check the console to see events fired by toolbar actions.',
      },
    },
  },
};
