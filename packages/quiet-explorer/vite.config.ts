import { fileURLToPath, URL } from 'node:url';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import { quietMeta } from './plugins/quiet-meta';

const libraryRoot = fileURLToPath(new URL('../quiet', import.meta.url));

// The explorer runs on the library's source: edit a component and it updates here, API tables included.
export default defineConfig({
  base: process.env.EXPLORER_BASE ?? '/',
  plugins: [vue(), quietMeta({ libraryRoot })],
  resolve: {
    alias: {
      quiet: fileURLToPath(new URL('../quiet/src/index.ts', import.meta.url)),
      '@quiet': `${libraryRoot}`,
    },
  },
  server: { port: 5173, fs: { allow: ['..'] } },
  preview: { port: 4173 },
});
