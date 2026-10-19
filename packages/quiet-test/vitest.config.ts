import { fileURLToPath, URL } from 'node:url';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vitest/config';

// Component tests run against the library's source, so they need no build and report the real lines.
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: [{ find: /^@frederikhd\/quiet$/, replacement: fileURLToPath(new URL('../quiet/src/index.ts', import.meta.url)) }],
  },
  test: {
    include: ['unit/**/*.spec.ts'],
    environment: 'jsdom',
    setupFiles: ['./unit/setup.ts'],
    restoreMocks: true,
  },
});
