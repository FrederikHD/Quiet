import { fileURLToPath, URL } from 'node:url';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

// Library build: one ES module and one stylesheet (dist/quiet.css). Vue stays external. Development warnings go
// through Vue's `warn` (src/utils/dom.ts), so the bundle reads no environment variables.
// Template comments never render, in development and tests too, exactly as in the published build: a comment before
// a component's root (an eslint directive, a note) would otherwise make it a fragment and drop fallthrough attributes.
export default defineConfig({
  plugins: [vue({ template: { compilerOptions: { comments: false } } })],
  build: {
    lib: {
      entry: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
      formats: ['es'],
      fileName: () => 'quiet.js',
      cssFileName: 'quiet',
    },
    cssCodeSplit: false,
    // Readable output: the app's bundler minifies it with everything else, and adopters can read what they ship.
    minify: false,
    sourcemap: true,
    rollupOptions: {
      external: ['vue'],
    },
  },
});
