import { fileURLToPath, URL } from 'node:url';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

// Library build: one ES module and one stylesheet (dist/quiet.css). Vue stays external.
export default defineConfig({
  plugins: [vue()],
  // Development warnings (missing labels, radios outside a RadioGroup …) are for the app's developers, so they must not
  // be decided here: compiled as process.env.NODE_ENV checks, the app's bundler keeps them in development and drops
  // them from production builds — the same convention Vue's own builds use.
  define: { 'import.meta.env.DEV': "(process.env.NODE_ENV !== 'production')" },
  build: {
    lib: {
      entry: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
      formats: ['es'],
      fileName: () => 'quiet.js',
      cssFileName: 'quiet',
    },
    cssCodeSplit: false,
    sourcemap: true,
    rollupOptions: {
      external: ['vue'],
    },
  },
});
