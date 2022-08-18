import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [vue()],
  resolve: {
    extensions: ['.vue', '.js']
  },
  build: {
    // chunk 大小警告的限制（以 kbs 为单位）
    chunkSizeWarningLimit: 5000
  }
})
