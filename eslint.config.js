import js from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier/flat'
import pluginImport from 'eslint-plugin-import'
import { defineConfig } from 'eslint/config'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default defineConfig([
  eslintConfigPrettier,

  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    plugins: { js },
    extends: ['js/recommended'],
  },

  {
    files: ['**/*.{js,mjs,cjs,ts,tsx}'],
    languageOptions: {
      globals: globals.node,
    },
  },

  ...tseslint.configs.recommended,

  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      import: pluginImport,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
        },
      ],
      'import/order': [
        'warn',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            ['parent', 'sibling', 'index'],
          ],
          pathGroups: [
            {
              pattern: 'fastify',
              group: 'external',
              position: 'before',
            },
            {
              pattern: '@fastify/**',
              group: 'external',
              position: 'after',
            },
            {
              pattern: '@/env/**',
              group: 'internal',
              position: 'after',
            },
            {
              pattern: '@/config/**',
              group: 'internal',
              position: 'after',
            },
            {
              pattern: '@/plugins/**',
              group: 'internal',
              position: 'after',
            },

            {
              pattern: '@/modules/**',
              group: 'internal',
              position: 'after',
            },
            {
              pattern: '@/test/**',
              group: 'internal',
              position: 'after',
            },
            {
              pattern: '@/routes/**',
              group: 'internal',
              position: 'after',
            },
            {
              pattern: '@/controllers/**',
              group: 'internal',
              position: 'after',
            },
            {
              pattern: '@/services/**',
              group: 'internal',
              position: 'after',
            },
            {
              pattern: '@/schemas/**',
              group: 'internal',
              position: 'after',
            },
            {
              pattern: '@/utils/**',
              group: 'internal',
              position: 'after',
            },
            {
              pattern: '@/types/**',
              group: 'internal',
              position: 'after',
            },
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
          'newlines-between': 'always',
        },
      ],
    },
  },
])
