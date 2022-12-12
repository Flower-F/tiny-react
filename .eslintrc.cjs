module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier', 'plugin:prettier/recommended'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'prettier', 'react-refresh'],
  rules: {
    '@typescript-eslint/no-var-requires': 'off',
    'no-constant-condition': 'off',
    'react-refresh/only-export-components': 'warn',
  },
};
