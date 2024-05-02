import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import sass from 'sass';
import envPlugin from "vite-plugin-environment"

export default defineConfig({
  plugins: [react(), envPlugin('all')],
  css: {
    preprocessorOptions: {
      scss: {
        implementation: sass
      }
    }
  }
})
