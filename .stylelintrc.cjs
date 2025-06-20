module.exports = {
  extends: ['stylelint-config-standard', 'stylelint-config-tailwindcss'],
  rules: {
    'block-no-empty': [true, { severity: 'warning' }],
    'no-descending-specificity': null,
    'keyframes-name-pattern': null,
    'media-feature-name-value-no-unknown': null
  }
};
