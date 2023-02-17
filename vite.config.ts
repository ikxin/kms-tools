import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import markdown from 'vite-plugin-vue-markdown'
import shiki from 'markdown-it-shiki'
import tailwindcss from 'tailwindcss'
import path from 'path'

export default defineConfig({
  base: './',
  plugins: [
    vue({
      include: [/\.vue$/, /\.md$/],
    }),
    markdown({
      markdownItSetup(md) {
        md.use(shiki, {
          theme: 'nord',
        })
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  css: {
    postcss: {
      plugins: [tailwindcss('./tailwind.config.js'), require('autoprefixer')],
    },
  },
})
