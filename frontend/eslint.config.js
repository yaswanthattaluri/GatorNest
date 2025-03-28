import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import cypressPlugin from 'eslint-plugin-cypress';

export default [
  {
    ignores: ['dist', 'node_modules'], // ✅ Combine ignores
  },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser, // ✅ Browser globals
        ...globals.node, // ✅ Node.js globals
        cy: 'readonly', // ✅ Cypress global
        Cypress: 'readonly', // ✅ Cypress global
        describe: 'readonly', // ✅ Mocha test global
        it: 'readonly', // ✅ Mocha test global
        beforeEach: 'readonly', // ✅ Mocha test global
        afterEach: 'readonly', // ✅ Mocha test global
      },
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    settings: {
      react: { version: '18.3' },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      cypress: cypressPlugin,
    },
    rules: {
      ...js.configs.recommended.rules, // ✅ Replaces `extends: "eslint:recommended"`
      ...react.configs.recommended.rules, // ✅ Replaces `extends: "plugin:react/recommended"`
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      ...cypressPlugin.configs.recommended.rules, // ✅ Replaces `extends: "plugin:cypress/recommended"`
      'no-unused-vars': 'warn',
      'react/react-in-jsx-scope': 'off',
      'react/jsx-no-target-blank': 'off',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },
];
