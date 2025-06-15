import type { Meta, StoryObj } from '@storybook/react';
import { EditorToolbar } from './component';

const meta: Meta<typeof EditorToolbar> = {
  title: 'Components/EditorToolbar',
  component: EditorToolbar,
  tags: ['autodocs'],
  argTypes: {
    theme: {
      control: { type: 'select' },
      options: ['light', 'dark'],
      description: 'Visual theme for the toolbar',
    },
    onThemeChange: {
      action: 'onThemeChange',
      description: 'Callback when theme is changed',
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
type Story = StoryObj<typeof EditorToolbar>;

export const Default: Story = {
  args: {
    theme: 'light',
    onThemeChange: (theme) => console.log('Theme changed to:', theme),
  },
  render: (args) => (
    <div style={{ height: '60px', width: '100%', border: '1px solid #e2e8f0' }}>
      <EditorToolbar {...args} />
    </div>
  ),
};

export const DarkTheme: Story = {
  args: {
    theme: 'dark',
    onThemeChange: (theme) => console.log('Theme changed to:', theme),
  },
  render: (args) => (
    <div style={{
      height: '60px',
      width: '100%',
      border: '1px solid #475569',
      background: '#1e293b'
    }}>
      <EditorToolbar {...args} />
    </div>
  ),
};

export const MobileView: Story = {
  args: {
    theme: 'light',
    onThemeChange: (theme) => console.log('Theme changed to:', theme),
  },
  render: (args) => (
    <div style={{ height: '60px', width: '375px', border: '1px solid #e2e8f0' }}>
      <EditorToolbar {...args} />
    </div>
  ),
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
    onThemeChange: (theme) => console.log('Theme changed to:', theme),
  },
  render: (args) => (
    <div>
      <div style={{ height: '60px', width: '100%', border: '1px solid #e2e8f0' }}>
        <EditorToolbar {...args} />
      </div>
      <p style={{
        marginTop: '16px',
        fontSize: '14px',
        color: '#64748b',
        fontFamily: 'system-ui, sans-serif'
      }}>
        Click buttons or use keyboard shortcuts to see actions in console. Try Ctrl+N, Ctrl+S, Ctrl+Z, etc.
      </p>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Toolbar with event handlers attached. Check the console to see events fired by toolbar actions.',
      },
    },
  },
};
