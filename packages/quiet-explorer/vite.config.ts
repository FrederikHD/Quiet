import { fileURLToPath, URL } from 'node:url';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import { quietMeta } from './plugins/quiet-meta.ts';

const libraryRoot = fileURLToPath(new URL('../quiet', import.meta.url));

// The explorer runs on the library's source: edit a component and it updates here, API tables included.
// Template comments never render, in development and tests too, exactly as in the published build: a comment before
// a component's root (an eslint directive, a note) would otherwise make it a fragment and drop fallthrough attributes.
export default defineConfig({
  base: process.env.EXPLORER_BASE ?? '/',
  plugins: [vue({ template: { compilerOptions: { comments: false } } }), quietMeta({ libraryRoot })],
  resolve: {
    alias: [
      // The library's source, not its build: edits show up at once. Exact match, so subpaths keep their own resolution.
      { find: /^@frederikhd\/quiet$/, replacement: fileURLToPath(new URL('../quiet/src/index.ts', import.meta.url)) },
      { find: '@quiet', replacement: libraryRoot },
    ],
  },
  build: {
    rolldownOptions: {
      output: {
        // A component's examples (compiled and as source) load together with its page: one chunk per component
        // instead of two per example.
        codeSplitting: {
          // Only the example files themselves; the library code they share stays in shared chunks.
          includeDependenciesRecursively: false,
          groups: [
            {
              name: (id) => {
                const folder = id.match(/\/src\/examples\/(\w+)\//)?.[1];
                return folder ? `examples-${folder}` : null;
              },
            },
          ],
        },
      },
    },
  },
  server: { port: 5173, fs: { allow: ['..'] } },
  preview: { port: 4173 },
});
