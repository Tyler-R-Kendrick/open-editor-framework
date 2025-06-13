/** @type { import('@storybook/web-components').StorybookConfig } */
const config = {
  stories: ['../src/**/*.@(mdx|stories.@(js|jsx|ts|tsx))'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-actions',
    '@storybook/addon-controls',
    '@chromatic-com/storybook'
  ],
  framework: {
    name: '@storybook/web-components-vite',
    options: {},
  },
  staticDirs: ['../public'],
  typescript: {
    check: true,
  },
  docs: {},
};
export default config;
