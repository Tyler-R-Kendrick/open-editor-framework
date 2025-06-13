export default {
  root: true,
  env: {
    browser: true,
    es2022: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'plugin:lit/recommended',
    'plugin:wc/best-practice',
    'prettier'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint', 'lit', 'wc'],
  rules: {
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    'lit/no-legacy-template-syntax': 'error',
    'lit/no-template-bind': 'error',
    'lit/no-useless-template-literals': 'error',
    'wc/guard-super-call': 'error',
    'wc/no-constructor-attributes': 'error'
  },
  ignorePatterns: ['dist/', 'node_modules/']
};
