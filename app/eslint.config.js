import js from '@eslint/js';
import eslintPluginImport from 'eslint-plugin-import';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import { globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config([
  // Global ignores
  globalIgnores(['dist', 'node_modules']),

  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
      'plugin:jsx-a11y/recommended', // accessibility
      'plugin:prettier/recommended', // prettier formatting
    ],

    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
      parserOptions: {
        project: './tsconfig.json',
      },
    },

    plugins: {
      'simple-import-sort': simpleImportSort,
      import: eslintPluginImport,
      prettier: eslintPluginPrettier,
      'jsx-a11y': jsxA11y,
    },

    rules: {
      // --- Prettier ---
      'prettier/prettier': 'warn',

      // --- Imports ---
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'import/order': 'off', // disable default import order
      'import/no-unresolved': 'error',

      // Force alias instead of relative paths
      'no-restricted-imports': [
        'error',
        {
          patterns: ['../*', './../*', '../../*'],
        },
      ],

      // --- React Hooks ---
      ...reactHooks.configs['recommended-latest'].rules,

      // --- General ---
      'no-unused-vars': 'warn',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
]);
