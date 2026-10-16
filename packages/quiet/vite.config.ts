import { fileURLToPath, URL } from 'node:url';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

// Library build: one ES module and one stylesheet (dist/quiet.css). Vue stays external.
export default defineConfig({
  plugins: [vue()],
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
