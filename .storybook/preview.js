import React from 'react';
import '../src/styles/global.css';

/** @type { import('@storybook/react').Preview } */
const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/
      }
    },
    layout: 'centered'
  },
  decorators: [
    (Story) => React.createElement('div', { style: { margin: '3em' } }, React.createElement(Story))
  ],
  tags: ['autodocs']
};

export default preview;
