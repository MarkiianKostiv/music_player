/* eslint-env node */
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: [
      'node_modules',
      'dist',
      'build',
      '.expo',
      '.expo-shared',
      'android',
      'ios',
      'coverage',
      '*.tsbuildinfo',
      '.turbo',
      '.cache',
      '.env',
      '.env.*',
      '.DS_Store',
      'Thumbs.db',
      '*.config.js',
      '*.config.cjs',
      '*.config.mjs',
      '*.config.ts',
      'babel.config.*',
      'metro.config.*',
      'jest.config.*',
      'postcss.config.*',
      'tailwind.config.*',
      '.vscode',
      '.idea',
      '.husky',
      '.git',
      '.gitignore',
      '.eslintcache',
      'tmp',
      'temp',
      '*.log',
    ],
  },
  {
    rules: {
      'react/display-name': 'off',
    },
  },
]);
