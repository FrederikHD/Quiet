// Lint for the whole monorepo: correctness (JS, TypeScript, Vue) and accessibility in templates. Formatting is
// Prettier's job, so eslint-config-prettier turns off every rule that would argue with it.
import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import vue from 'eslint-plugin-vue';
import a11y from 'eslint-plugin-vuejs-accessibility';
import globals from 'globals';
import ts from 'typescript-eslint';

export default ts.config(
  {
    ignores: [
      'site/**',
      '**/dist/**',
      '**/node_modules/**',
      '**/test-results/**',
      '**/playwright-report/**',
      '**/coverage/**',
      '**/.nuxt/**',
      '**/.output/**',
    ],
  },
  js.configs.recommended,
  ...ts.configs.recommended,
  ...vue.configs['flat/recommended'],
  ...a11y.configs['flat/recommended'],
  {
    files: ['**/*.vue'],
    languageOptions: { parserOptions: { parser: ts.parser } },
  },
  {
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    rules: {
      // Unused things are errors, except the ones named to be ignored (_event, _name).
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrors: 'none' },
      ],
      // Q-prefixed single-word components are the system's naming (QButton, QCard).
      'vue/multi-word-component-names': 'off',
      // Rendered from the library's own Markdown with HTML disabled (MarkdownView).
      'vue/no-v-html': 'off',
      // A label either wraps its control or points at it with for=; HTML needs only one of the two.
      'vuejs-accessibility/label-has-for': ['error', { required: { some: ['nesting', 'id'] } }],
    },
  },
  {
    // Tests mount small inline components next to the ones under test.
    files: ['packages/quiet-test/**'],
    rules: { 'vue/one-component-per-file': 'off' },
  },
  {
    // Nuxt imports ref, computed, useHead and the app's own composables by itself; `nuxt typecheck` checks they exist.
    files: ['examples/**'],
    rules: { 'no-undef': 'off' },
  },
  prettier,
);
