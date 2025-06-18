/** @type { import('@storybook/react').StorybookConfig } */
const config = {
  stories: ['../src/**/*.@(mdx|stories.@(js|jsx|ts|tsx))'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-actions',
    '@storybook/addon-controls',
    '@chromatic-com/storybook'
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  staticDirs: ['../public'],
  typescript: {
    check: true,
  },
  docs: {},
  viteFinal(config) {
    config.plugins = (config.plugins || []).filter(
      (plugin) => !plugin.name?.startsWith('vite-plugin-pwa')
    );
    return config;
  },
};
export default config;
