import type { Meta, StoryObj } from '@storybook/react';
import { EditorCanvas } from './component';

const meta: Meta<typeof EditorCanvas> = {
  title: 'Components/EditorCanvas',
  component: EditorCanvas,
  tags: ['autodocs'],
  argTypes: {
    theme: {
      control: { type: 'select' },
      options: ['light', 'dark'],
      description: 'Visual theme for the editor canvas',
    },
    'aria-label': {
      control: { type: 'text' },
      description: 'Accessibility label for the canvas',
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
type Story = StoryObj<typeof EditorCanvas>;

export const Default: Story = {
  args: {
    theme: 'light',
  },
  render: (args) => (
    <div style={{ height: '600px', width: '800px', border: '1px solid #e2e8f0' }}>
      <EditorCanvas {...args} />
    </div>
  ),
};

export const DarkTheme: Story = {
  args: {
    theme: 'dark',
  },
  render: (args) => (
    <div style={{
      height: '600px',
      width: '800px',
      border: '1px solid #475569',
      background: '#1e293b'
    }}>
      <EditorCanvas {...args} />
    </div>
  ),
};

export const MobileView: Story = {
  args: {
    theme: 'light',
  },
  render: (args) => (
    <div style={{ height: '700px', width: '375px', border: '1px solid #e2e8f0' }}>
      <EditorCanvas {...args} />
    </div>
  ),
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
  render: (args) => (
    <div style={{ height: '800px', width: '768px', border: '1px solid #e2e8f0' }}>
      <EditorCanvas {...args} />
    </div>
  ),
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

export const WithCustomLabel: Story = {
  args: {
    theme: 'light',
    'aria-label': 'Design Canvas - Create and edit UI components',
  },
  render: (args) => (
    <div style={{ height: '600px', width: '800px', border: '1px solid #e2e8f0' }}>
      <EditorCanvas {...args} />
    </div>
  ),
};
