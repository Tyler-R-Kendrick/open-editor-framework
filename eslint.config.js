import js from '@eslint/js';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import storybook from 'eslint-plugin-storybook';
import prettierConfig from 'eslint-config-prettier';

export default [
  // Base configuration for all files
  js.configs.recommended,

  // Configuration for TypeScript and React files
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: typescriptParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      },
      globals: {
        // Browser globals
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        console: 'readonly',
        alert: 'readonly',
        confirm: 'readonly',
        fetch: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly',
        clearTimeout: 'readonly',
        setTimeout: 'readonly',
        clearInterval: 'readonly',
        setInterval: 'readonly',
        requestAnimationFrame: 'readonly',
        cancelAnimationFrame: 'readonly',

        // DOM globals
        HTMLElement: 'readonly',
        HTMLDivElement: 'readonly',
        HTMLCanvasElement: 'readonly',
        HTMLInputElement: 'readonly',
        CanvasRenderingContext2D: 'readonly',
        MediaQueryList: 'readonly',
        MediaQueryListEvent: 'readonly',
        KeyboardEvent: 'readonly',
        ResizeObserver: 'readonly',
        Touch: 'readonly',
        FileReader: 'readonly',
        File: 'readonly',
        Blob: 'readonly',
        URL: 'readonly',

        // Node.js globals
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        global: 'readonly',
        module: 'readonly',
        require: 'readonly',
        exports: 'readonly',

        // ES2022 globals
        globalThis: 'readonly'
      }
    },
    plugins: {
      '@typescript-eslint': typescriptEslint,
      'react': react,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
      'storybook': storybook
    },
    settings: {
      react: {
        version: '18.2'
      }
    },
    rules: {
      // TypeScript ESLint recommended rules
      ...typescriptEslint.configs.recommended.rules,

      // React recommended rules
      ...react.configs.recommended.rules,

      // React Hooks rules
      ...reactHooks.configs.recommended.rules,

      // JSX A11y recommended rules
      ...jsxA11y.configs.recommended.rules,

      // Storybook recommended rules
      ...storybook.configs.recommended.rules,

      // Custom rules
      '@typescript-eslint/no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_'
      }],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn'
    }
  },

  // Test files configuration (Jest environment)
  {
    files: ['**/*.test.{ts,tsx,js,jsx}', '**/jest.setup.ts'],
    languageOptions: {
      globals: {
        // Jest globals
        jest: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',

        // Browser globals for tests
        window: 'readonly',
        document: 'readonly',
        HTMLCanvasElement: 'readonly'
      }
    }
  },

  // Storybook specific configuration
  {
    files: ['**/*.stories.{ts,tsx,js,jsx}'],
    rules: {
      ...storybook.configs.recommended.rules
    }
  },

  // Prettier configuration (must be last)
  prettierConfig,

  // Ignore patterns
  {
    ignores: ['dist/', 'node_modules/', 'coverage/', 'storybook-static/']
  }
];
