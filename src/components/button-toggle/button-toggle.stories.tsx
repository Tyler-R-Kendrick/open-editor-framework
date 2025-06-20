import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { ButtonToggle } from './component';
import { EditorTheme } from '../../types/editor-types';

const meta: Meta<typeof ButtonToggle> = {
  title: 'Components/ButtonToggle',
  component: ButtonToggle,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A reusable toggle button component with theme-aware styling and accessibility support.'
      }
    }
  },
  argTypes: {
    theme: {
      control: { type: 'select' },
      options: ['light', 'dark'],
      description: 'Theme for styling'
    },
    isActive: {
      control: { type: 'boolean' },
      description: 'Whether the toggle is currently active'
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Whether the button is disabled'
    },
    children: {
      control: { type: 'text' },
      description: 'Content to display inside the button'
    }
  },
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<typeof ButtonToggle>;

// Interactive toggle story with state management
export const Interactive: Story = {
  render: (args) => {
    const [isActive, setIsActive] = useState(args.isActive);
    
    return (
      <div style={{ width: '200px' }}>
        <ButtonToggle
          {...args}
          isActive={isActive}
          onToggle={() => setIsActive(!isActive)}
        >
          {isActive ? '✓ Enabled' : '✗ Disabled'}
        </ButtonToggle>
      </div>
    );
  },
  args: {
    theme: 'light',
    isActive: false,
    'aria-label': 'Toggle feature',
    disabled: false
  }
};

// Light theme variants
export const LightTheme: Story = {
  render: () => {
    const [toggle1, setToggle1] = useState(false);
    const [toggle2, setToggle2] = useState(true);
    
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '200px' }}>
        <ButtonToggle
          theme="light"
          isActive={toggle1}
          onToggle={() => setToggle1(!toggle1)}
          aria-label="Feature toggle 1"
        >
          {toggle1 ? '✓ Feature On' : '✗ Feature Off'}
        </ButtonToggle>
        
        <ButtonToggle
          theme="light"
          isActive={toggle2}
          onToggle={() => setToggle2(!toggle2)}
          aria-label="Feature toggle 2"
        >
          {toggle2 ? '🔊 Sound On' : '🔇 Sound Off'}
        </ButtonToggle>
      </div>
    );
  }
};

// Dark theme variants
export const DarkTheme: Story = {
  render: () => {
    const [toggle1, setToggle1] = useState(false);
    const [toggle2, setToggle2] = useState(true);
    
    return (
      <div 
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '16px', 
          width: '200px',
          padding: '24px',
          backgroundColor: '#1f2937',
          borderRadius: '8px'
        }}
      >
        <ButtonToggle
          theme="dark"
          isActive={toggle1}
          onToggle={() => setToggle1(!toggle1)}
          aria-label="Feature toggle 1"
        >
          {toggle1 ? '✓ Feature On' : '✗ Feature Off'}
        </ButtonToggle>
        
        <ButtonToggle
          theme="dark"
          isActive={toggle2}
          onToggle={() => setToggle2(!toggle2)}
          aria-label="Feature toggle 2"
        >
          {toggle2 ? '🔊 Sound On' : '🔇 Sound Off'}
        </ButtonToggle>
      </div>
    );
  }
};

// Disabled state
export const Disabled: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '200px' }}>
      <ButtonToggle
        theme="light"
        isActive={false}
        onToggle={() => {}}
        disabled={true}
        aria-label="Disabled inactive toggle"
      >
        ✗ Disabled (Off)
      </ButtonToggle>
      
      <ButtonToggle
        theme="light"
        isActive={true}
        onToggle={() => {}}
        disabled={true}
        aria-label="Disabled active toggle"
      >
        ✓ Disabled (On)
      </ButtonToggle>
    </div>
  )
};

// Custom content examples
export const CustomContent: Story = {
  render: () => {
    const [notifications, setNotifications] = useState(true);
    const [autoSave, setAutoSave] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '250px' }}>
        <ButtonToggle
          theme="light"
          isActive={notifications}
          onToggle={() => setNotifications(!notifications)}
          aria-label="Toggle notifications"
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            🔔 Notifications {notifications ? 'On' : 'Off'}
          </span>
        </ButtonToggle>
        
        <ButtonToggle
          theme="light"
          isActive={autoSave}
          onToggle={() => setAutoSave(!autoSave)}
          aria-label="Toggle auto-save"
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            💾 Auto-save {autoSave ? 'Enabled' : 'Disabled'}
          </span>
        </ButtonToggle>
        
        <ButtonToggle
          theme={darkMode ? 'dark' : 'light'}
          isActive={darkMode}
          onToggle={() => setDarkMode(!darkMode)}
          aria-label="Toggle dark mode"
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {darkMode ? '🌙' : '☀️'} {darkMode ? 'Dark' : 'Light'} Mode
          </span>
        </ButtonToggle>
      </div>
    );
  }
};