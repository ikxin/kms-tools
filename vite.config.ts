import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ArcoResolver } from 'unplugin-vue-components/resolvers'
import Markdown from 'vite-plugin-vue-markdown'
import Shiki from 'markdown-it-shiki'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import VueRouter from 'unplugin-vue-router/vite'
import { VueRouterAutoImports } from 'unplugin-vue-router'

export default defineConfig({
  plugins: [
    VueRouter({
      dts: './src/typings/router.d.ts',
      extensions: ['.vue'],
      routesFolder: './src/views'
    }),
    Vue({
      include: [/\.vue$/, /\.md$/]
    }),
    Markdown({
      markdownItSetup(md) {
        md.use(Shiki)
      }
    }),
    UnoCSS(),
    AutoImport({
      eslintrc: {
        enabled: true,
        filepath: './src/typings/.eslintrc.json'
      },
      dts: './src/typings/imports.d.ts',
      imports: ['@vueuse/core', 'pinia', 'vue-i18n', 'vue', VueRouterAutoImports],
      resolvers: [ArcoResolver()]
    }),
    Components({
      dts: './src/typings/components.d.ts',
      resolvers: [
        ArcoResolver({
          sideEffect: false
        })
      ]
    }),
    VueI18nPlugin({
      include: [resolve(__dirname, './src/locales/**')]
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  }
})
