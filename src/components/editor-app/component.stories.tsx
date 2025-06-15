import type { Meta, StoryObj } from '@storybook/react';
import { EditorApp } from './component';

const meta: Meta<typeof EditorApp> = {
  title: 'Application/EditorApp',
  component: EditorApp,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Main editor application component that orchestrates the canvas, palette, and control panel with mobile and desktop support.'
      }
    }
  },
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'The complete editor application with all panels. Try switching between light/dark theme and resizing the window to see mobile layout.'
      }
    }
  }
};

export const MobileView: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1'
    },
    docs: {
      description: {
        story: 'Mobile view with tab navigation at the bottom. Tap the tabs to switch between Canvas, Components, and Properties.'
      }
    }
  }
};

export const TabletView: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'tablet'
    },
    docs: {
      description: {
        story: 'Tablet view showing responsive layout adaptation.'
      }
    }
  }
};
