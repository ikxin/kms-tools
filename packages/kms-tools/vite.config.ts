import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ArcoResolver } from 'unplugin-vue-components/resolvers'
import Markdown from 'vite-plugin-md'

export default defineConfig({
  plugins: [
    Vue({
      include: [/\.vue$/, /\.md$/],
    }),
    Markdown(),
    UnoCSS(),
    AutoImport({
      dts: './src/types/auto-imports.d.ts',
      imports: ['vue', 'vue-router', '@vueuse/core'],
      resolvers: [ArcoResolver()],
    }),
    Components({
      dts: './src/types/components.d.ts',
      resolvers: [ArcoResolver()],
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
})
