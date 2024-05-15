import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import sass from 'sass';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [svgr(), react()],
  build: {
    outDir: 'build',
  },
  css: {
    preprocessorOptions: {
      scss: {
        implementation: sass,
      },
    },
  },
});
