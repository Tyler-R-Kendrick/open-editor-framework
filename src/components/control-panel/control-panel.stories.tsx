import type { Meta, StoryObj } from '@storybook/react-vite';
import { ControlPanel } from './component';
import {
  defaultFieldRenderers,
  type FieldRenderer
} from './index';

// Custom field renderer example
const CustomTextRenderer: FieldRenderer = ({ property, theme, onChange }) => (
  <div style={{ position: 'relative' }}>
    <input
      type="text"
      value={String(property.value ?? '')}
      onChange={(e) => onChange(property.key, e.target.value)}
      placeholder="Enter text..."
      style={{
        width: '100%',
        padding: '12px 16px',
        border: `2px solid ${theme === 'dark' ? '#6366f1' : '#8b5cf6'}`,
        borderRadius: '12px',
        background: theme === 'dark' ? '#1e1b4b' : '#faf5ff',
        color: theme === 'dark' ? '#e0e7ff' : '#581c87',
        fontSize: '14px',
        outline: 'none',
        transition: 'all 0.3s ease',
      }}
    />
    <div style={{
      position: 'absolute',
      right: '12px',
      top: '50%',
      transform: 'translateY(-50%)',
      fontSize: '12px',
      color: theme === 'dark' ? '#a5b4fc' : '#8b5cf6',
      pointerEvents: 'none'
    }}>
      ✨
    </div>
  </div>
);

// Example of completely custom field type
const CustomSliderRenderer: FieldRenderer = ({ property, theme, onChange }) => (
  <div style={{
    padding: '16px',
    background: theme === 'dark' ? '#2d1b69' : '#f0f4ff',
    borderRadius: '8px',
    border: `1px solid ${theme === 'dark' ? '#5b21b6' : '#c7d2fe'}`
  }}>
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '8px',
      fontSize: '12px',
      fontWeight: '600',
      color: theme === 'dark' ? '#a5b4fc' : '#5b21b6'
    }}>
      <span>Custom Slider</span>
      <span>{String(property.value)}</span>
    </div>
    <input
      type="range"
      min={property.min || 0}
      max={property.max || 100}
      step={property.step || 1}
      value={Number(property.value ?? 0)}
      onChange={(e) => onChange(property.key, parseInt(e.target.value))}
      style={{
        width: '100%',
        height: '8px',
        borderRadius: '4px',
        background: `linear-gradient(90deg, ${theme === 'dark' ? '#6366f1' : '#8b5cf6'} 0%, ${theme === 'dark' ? '#3730a3' : '#7c3aed'} 100%)`,
        outline: 'none',
        accentColor: theme === 'dark' ? '#6366f1' : '#8b5cf6'
      }}
    />
  </div>
);

// Example of a completely custom field type that doesn't exist in built-ins
const DatePickerRenderer: FieldRenderer = ({ property, theme, onChange }) => (
  <div>
    <input
      type="date"
      value={String(property.value ?? '')}
      onChange={(e) => onChange(property.key, e.target.value)}
      style={{
        width: '100%',
        padding: '8px 12px',
        border: `1px solid ${theme === 'dark' ? '#6b7280' : '#d1d5db'}`,
        borderRadius: '6px',
        background: theme === 'dark' ? '#4b5563' : '#ffffff',
        color: theme === 'dark' ? '#f8fafc' : '#1e293b',
        fontSize: '14px',
        outline: 'none',
      }}
    />
  </div>
);

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
    config: {
      control: { type: 'object' },
      description: 'Configuration for field renderers and sections',
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

export const WithCustomRenderer: Story = {
  args: {
    theme: 'light',
    config: {
      fieldRenderers: {
        ...defaultFieldRenderers,
        text: CustomTextRenderer,
      }
    }
  },
  render: (args) => (
    <div style={{ height: '600px', width: '350px', border: '1px solid #e2e8f0' }}>
      <ControlPanel {...args} />
      <div style={{
        marginTop: '20px',
        padding: '16px',
        background: '#faf5ff',
        borderRadius: '8px',
        border: '1px solid #e9d5ff'
      }}>
        <strong>Custom Text Renderer:</strong> This story demonstrates a custom text field renderer with enhanced styling.
      </div>
    </div>
  ),
};

export const CustomSections: Story = {
  args: {
    theme: 'light',
    config: {
      sections: [
        {
          title: 'Basic Properties',
          fields: ['text', 'color']
        },
        {
          title: 'Typography',
          fields: ['fontSize', 'fontFamily']
        },
        {
          title: 'Layout & Effects',
          fields: ['backgroundColor', 'borderRadius', 'opacity', 'visible']
        }
      ]
    } satisfies Parameters<typeof ControlPanel>[0]['config']
  },
  render: (args) => (
    <div style={{ height: '600px', width: '350px', border: '1px solid #e2e8f0' }}>
      <ControlPanel {...args} />
      <div style={{
        marginTop: '20px',
        padding: '16px',
        background: '#f0f9ff',
        borderRadius: '8px',
        border: '1px solid #bae6fd'
      }}>
        <strong>Custom Sections:</strong> Properties are grouped into custom sections with different field groupings.
      </div>
    </div>
  ),
};

export const FullyCustomized: Story = {
  args: {
    theme: 'dark',
    config: {
      fieldRenderers: {
        ...defaultFieldRenderers,
        text: CustomTextRenderer,
      },
      sections: [
        {
          title: 'Content & Style',
          fields: ['text', 'color', 'fontSize']
        },
        {
          title: 'Visual Effects',
          fields: ['backgroundColor', 'opacity']
        }
      ]
    } satisfies Parameters<typeof ControlPanel>[0]['config']
  },
  render: (args) => (
    <div style={{
      height: '600px',
      width: '350px',
      border: '1px solid #475569',
      background: '#1e293b'
    }}>
      <ControlPanel {...args} />
      <div style={{
        marginTop: '20px',
        padding: '16px',
        background: '#1e1b4b',
        borderRadius: '8px',
        border: '1px solid #3730a3',
        color: '#e0e7ff'
      }}>
        <strong>Fully Customized:</strong> Combines custom renderers with custom sections in dark theme.
      </div>
    </div>
  ),
};

export const CustomFieldTypes: Story = {
  args: {
    theme: 'light',
    config: {
      fieldRenderers: {
        // Override built-in types
        ...defaultFieldRenderers,
        range: CustomSliderRenderer,
        // Add completely custom types
        'custom-date': DatePickerRenderer,
        'enhanced-text': CustomTextRenderer,
      },
      sections: [
        {
          title: 'Built-in Types (Enhanced)',
          fields: ['text', 'range', 'color']
        },
        {
          title: 'Custom Field Types',
          fields: ['custom-date', 'enhanced-text']
        }
      ]
    }
  },
  render: (args) => (
    <div style={{ height: '600px', width: '350px', border: '1px solid #e2e8f0' }}>
      <ControlPanel {...args} />
      <div style={{
        marginTop: '20px',
        padding: '16px',
        background: '#f0f9ff',
        borderRadius: '8px',
        border: '1px solid #bae6fd'
      }}>
        <strong>Custom Field Types:</strong> This demonstrates the flexible field renderer system.
        You can override built-in types and add completely new field types like 'custom-date' and 'enhanced-text'.
      </div>
    </div>
  ),
};
