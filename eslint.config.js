import js from '@eslint/js';
import globals from 'globals';
import chaiFriendly from 'eslint-plugin-chai-friendly';

export default [
  {
    ignores: [
      'node_modules/**',
      'dist/**',
    ],
  },
  js.configs.recommended,
  {
    files: ['**/*.{js,mjs}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.mocha,
        amd: 'readonly',
        __SUMMERNOTE_NEXT_VERSION__: 'readonly',
      },
    },
    plugins: {
      'chai-friendly': chaiFriendly,
    },
    rules: {
      indent: ['warn', 2, { ArrayExpression: 'off', SwitchCase: 1 }],
      semi: [2, 'always'],
      'space-before-function-paren': ['error', 'never'],
      'no-useless-escape': 0,
      'no-unused-expressions': 0,
      'chai-friendly/no-unused-expressions': 2,
      'comma-dangle': ['error', 'always-multiline'],
    },
  },
];
