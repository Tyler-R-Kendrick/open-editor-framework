/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
  stories: ['../src/**/*.@(mdx|stories.@(js|jsx|ts|tsx))'],
  addons: [
    '@chromatic-com/storybook'
  ],

  framework: {
    name: '@storybook/react-vite',
    options: {}
  },

  staticDirs: ['../public'],

  typescript: {
    check: false
  },

  viteFinal: async (config) => {
    // Configure for GitHub Codespaces and fix WebSocket issues
    config.server = {
      ...config.server,
      hmr: false, // Completely disable HMR WebSockets
      host: '0.0.0.0'
    };

    return config;
  }
};
export default config;
