import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import markdown from 'vite-plugin-vue-markdown'
import shiki from 'markdown-it-shiki'
import path from 'path'
import UnoCSS from 'unocss/vite'
import ssr from 'vite-plugin-ssr/plugin'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ArcoResolver } from 'unplugin-vue-components/resolvers'
import Markdown from 'vite-plugin-md'

export default defineConfig({
  build: {
    chunkSizeWarningLimit: 2048,
  },
  plugins: [
    vue({
      include: [/\.vue$/, /\.md$/],
    }),
    ssr(),
    Markdown(),
    markdown({
      markdownItSetup(md) {
        md.use(shiki, {
          theme: 'nord',
        })
      },
    }),
    UnoCSS(),
    AutoImport({
      dts: './types/auto-imports.d.ts',
      resolvers: [ArcoResolver()],
    }),
    Components({
      dts: './types/components.d.ts',
      resolvers: [
        ArcoResolver({
          sideEffect: false,
        }),
      ],
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
