import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import sass from 'sass';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'build'
  },
  css: {
    preprocessorOptions: {
      scss: {
        implementation: sass
      }
    }
  }
})
