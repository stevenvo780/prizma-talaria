module.exports = {
  parser: '@typescript-eslint/parser',
  env: {
    browser: false,
    commonjs: true,
    es6: true,
  },
  plugins: ['@typescript-eslint', 'jest'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
  ],
  rules: {
    indent: ['error', 2],
    'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    '@typescript-eslint/no-var-requires': 'off',
    'no-mixed-spaces-and-tabs': [2, 'smart-tabs']
  },
};