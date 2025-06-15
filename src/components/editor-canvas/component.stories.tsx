import type { Meta, StoryObj } from '@storybook/react';
import { EditorCanvas } from './component';

const meta: Meta<typeof EditorCanvas> = {
  title: 'Components/EditorCanvas',
  component: EditorCanvas,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A React-based HTML5 Canvas editor component with touch and accessibility support.'
      }
    }
  },
  argTypes: {
    theme: {
      control: { type: 'radio' },
      options: ['light', 'dark'],
      description: 'Visual theme for the canvas'
    },
    'aria-label': {
      control: { type: 'text' },
      description: 'Accessibility label for the canvas'
    }
  },
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Light: Story = {
  args: {
    theme: 'light',
    'aria-label': 'Design Canvas'
  }
};

export const Dark: Story = {
  args: {
    theme: 'dark',
    'aria-label': 'Design Canvas'
  }
};

export const Interactive: Story = {
  args: {
    theme: 'light',
    'aria-label': 'Interactive Design Canvas'
  },
  parameters: {
    docs: {
      description: {
        story: 'Try selecting, dragging, and using the zoom controls on the canvas.'
      }
    }
  }
};
