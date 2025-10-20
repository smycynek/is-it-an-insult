import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  { files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'], plugins: { js }, extends: ['js/recommended'], 
    languageOptions: { globals: globals.browser },
    rules: {
      semi: ['error', 'always'],
      quotes: ['error', 'single', { 'avoidEscape': true }],
      indent: ['error', 2]
    },
  },
  tseslint.configs.recommended,
]);
