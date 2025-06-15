import type { Meta, StoryObj } from '@storybook/react';
import { ControlPanel } from './component';

const meta: Meta<typeof ControlPanel> = {
  title: 'Components/ControlPanel',
  component: ControlPanel,
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
    'aria-label': {
      control: { type: 'text' },
      description: 'Accessibility label for the control panel',
    },
  },
};

export default meta;
type Story = StoryObj<typeof ControlPanel>;

export const Default: Story = {
  args: {
    theme: 'light',
  },
  render: (args) => (
    <div style={{ height: '600px', width: '350px', border: '1px solid #e2e8f0' }}>
      <ControlPanel {...args} />
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
      width: '350px',
      border: '1px solid #475569',
      background: '#1e293b'
    }}>
      <ControlPanel {...args} />
    </div>
  ),
};

export const WithCustomLabel: Story = {
  args: {
    theme: 'light',
    'aria-label': 'Custom Properties Panel',
  },
  render: (args) => (
    <div style={{ height: '600px', width: '350px', border: '1px solid #e2e8f0' }}>
      <ControlPanel {...args} />
    </div>
  ),
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
  render: (args) => (
    <div style={{ height: '100vh', width: '100vw' }}>
      <ControlPanel {...args} />
    </div>
  ),
};

export const Interactive: Story = {
  args: {
    theme: 'light',
  },
  render: (args) => (
    <div style={{ height: '600px', width: '350px', border: '1px solid #e2e8f0' }}>
      <ControlPanel {...args} />
      <div style={{
        marginTop: '20px',
        padding: '16px',
        background: '#f8fafc',
        borderRadius: '8px',
        fontFamily: 'monospace',
        fontSize: '12px'
      }}>
        <strong>Events:</strong> Check the browser console to see events fired by the control panel.
      </div>
    </div>
  ),
};

export const Compact: Story = {
  args: {
    theme: 'light',
  },
  render: (args) => (
    <div style={{ height: '400px', width: '280px', border: '1px solid #e2e8f0' }}>
      <ControlPanel {...args} />
    </div>
  ),
};

export const FullHeight: Story = {
  args: {
    theme: 'light',
  },
  render: (args) => (
    <div style={{ height: '100vh', width: '350px', border: '1px solid #e2e8f0' }}>
      <ControlPanel {...args} />
    </div>
  ),
};
