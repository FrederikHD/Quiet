import { fileURLToPath, URL } from 'node:url';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vitest/config';

// Component tests run against the library's source, so they need no build and report the real lines.
// Template comments never render, in development and tests too, exactly as in the published build: a comment before
// a component's root (an eslint directive, a note) would otherwise make it a fragment and drop fallthrough attributes.
export default defineConfig({
  plugins: [vue({ template: { compilerOptions: { comments: false } } })],
  resolve: {
    alias: [
      { find: /^@frederikhd\/quiet$/, replacement: fileURLToPath(new URL('../quiet/src/index.ts', import.meta.url)) },
    ],
  },
  test: {
    include: ['unit/**/*.spec.ts'],
    environment: 'jsdom',
    setupFiles: ['./unit/setup.ts'],
    restoreMocks: true,
  },
});
