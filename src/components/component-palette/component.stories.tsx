import type { Meta, StoryObj } from '@storybook/react-vite';
import { ComponentPalette } from './component';

const meta: Meta<typeof ComponentPalette> = {
  title: 'Components/ComponentPalette',
  component: ComponentPalette,
  tags: ['autodocs'],
  argTypes: {
    theme: {
      control: { type: 'select' },
      options: ['light', 'dark'],
      description: 'Visual theme for the component palette',
    },
    templateUrl: {
      control: { type: 'text' },
      description: 'URL to load component templates from',
    },
    'aria-label': {
      control: { type: 'text' },
      description: 'Accessibility label for the component palette',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'A drag-and-drop component palette with external template loading capabilities. Displays available components for building interfaces with support for touch interactions, keyboard accessibility, and loading states.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ComponentPalette>;

export const Default: Story = {
  args: {
    theme: 'light',
  },
  render: (args) => (
    <div style={{ height: '500px', width: '300px', border: '1px solid #e2e8f0' }}>
      <ComponentPalette {...args} />
    </div>
  ),
};

export const DarkTheme: Story = {
  args: {
    theme: 'dark',
  },
  render: (args) => (
    <div style={{
      height: '500px',
      width: '300px',
      border: '1px solid #475569',
      background: '#1e293b'
    }}>
      <ComponentPalette {...args} />
    </div>
  ),
};

export const WithCustomTemplateUrl: Story = {
  args: {
    theme: 'light',
    templateUrl: '/assets/component-templates.json',
  },
  render: (args) => (
    <div style={{ height: '500px', width: '300px', border: '1px solid #e2e8f0' }}>
      <ComponentPalette {...args} />
    </div>
  ),
};

export const LoadingState: Story = {
  args: {
    theme: 'light',
    templateUrl: '/nonexistent-slow-url.json', // This will trigger loading state briefly
  },
  render: (args) => (
    <div style={{ height: '500px', width: '300px', border: '1px solid #e2e8f0' }}>
      <ComponentPalette {...args} />
    </div>
  ),
};

export const ErrorState: Story = {
  args: {
    theme: 'light',
    templateUrl: '/invalid-url-that-will-fail.json',
  },
  render: (args) => (
    <div style={{ height: '500px', width: '300px', border: '1px solid #e2e8f0' }}>
      <ComponentPalette {...args} />
    </div>
  ),
};

export const WithCustomAriaLabel: Story = {
  args: {
    theme: 'light',
    'aria-label': 'Custom Component Library',
  },
  render: (args) => (
    <div style={{ height: '500px', width: '300px', border: '1px solid #e2e8f0' }}>
      <ComponentPalette {...args} />
    </div>
  ),
};

export const Mobile: Story = {
  args: {
    theme: 'light',
  },
  render: (args) => (
    <div style={{
      height: '600px',
      width: '375px',
      border: '1px solid #e2e8f0',
      margin: '0 auto'
    }}>
      <ComponentPalette {...args} />
    </div>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};
