import tailwindcss from '@tailwindcss/vite'
import Components from 'unplugin-vue-components/vite'
import { ArcoResolver } from 'unplugin-vue-components/resolvers'

export default defineNuxtConfig({
  compatibilityDate: '2026-05-31',
  devtools: { enabled: true },
  site: {
    url: 'https://kms.ikxin.com',
    name: 'KMS Tools',
    description:
      '简洁稳定的 KMS 在线工具，覆盖激活、检测与监控场景，提供一致、可靠的操作体验。'
  },
  future: {
    compatibilityVersion: 4
  },
  nitro: {
    preset: 'cloudflare_module',
    experimental: {
      tasks: true
    },
    scheduledTasks: {
      '*/10 * * * *': ['monitor']
    },
    cloudflare: {
      deployConfig: true,
      nodeCompat: true
    }
  },
  app: {
    head: {
      titleTemplate: '%s',
      script: [
        {
          tagPosition: 'bodyOpen',
          innerHTML: `(() => {
            const body = document.body
            const colorMode = window.__NUXT_COLOR_MODE__?.value

            if (colorMode === 'dark') {
              body.setAttribute('arco-theme', 'dark')
            } else {
              body.removeAttribute('arco-theme')
            }
          })()`
        },
        {
          defer: '',
          src: 'https://umami.ikxin.com/script.js',
          'data-website-id': '6c719cb2-4a72-46e6-a4fa-2ee357a38467'
        }
      ]
    }
  },
  vite: {
    plugins: [
      tailwindcss(),
      Components({
        resolvers: [
          ArcoResolver({
            sideEffect: false
          })
        ]
      })
    ],
    optimizeDeps: {
      include: ['@arco-design/web-vue']
    }
  },
  routeRules: {
    '/api/*': {
      cors: true
    }
  },
  css: ['~/assets/css/main.css'],
  modules: [
    '@nuxt/icon',
    '@nuxtjs/i18n',
    '@nuxtjs/seo',
    '@nuxtjs/color-mode',
    'nuxt-echarts'
  ],
  ogImage: {
    enabled: false
  },
  colorMode: {
    classSuffix: '-mode'
  },
  i18n: {
    baseUrl: 'https://kms.ikxin.com',
    defaultLocale: 'zh-cn',
    langDir: 'locales',
    strategy: 'prefix_and_default',
    // prettier-ignore
    locales: [
      { code: 'zh-cn', language: 'zh-CN', file: 'zh-cn.json', name: '简体中文', icon: 'cn' },
      { code: 'zh-tw', language: 'zh-TW', file: 'zh-tw.json', name: '繁體中文', icon: 'tw' },
      { code: 'en', language: 'en-US', file: 'en.json', name: 'English', icon: 'us' },
      { code: 'fr', language: 'fr-FR', file: 'fr.json', name: 'Français', icon: 'fr' },
      { code: 'ja', language: 'ja-JP', file: 'ja.json', name: '日本語', icon: 'jp' },
      { code: 'pt', language: 'pt-PT', file: 'pt.json', name: 'Português', icon: 'pt' },
      { code: 'ko', language: 'ko-KR', file: 'ko.json', name: '한국어', icon: 'kr' },
      { code: 'it', language: 'it-IT', file: 'it.json', name: 'Italiano', icon: 'it' },
      { code: 'es', language: 'es-ES', file: 'es.json', name: 'Español', icon: 'es' },
      { code: 'nl', language: 'nl-NL', file: 'nl.json', name: 'Nederlands', icon: 'nl' },
      { code: 'ru', language: 'ru-RU', file: 'ru.json', name: 'Русский', icon: 'ru' },
      { code: 'id', language: 'id-ID', file: 'id.json', name: 'Bahasa Indonesia', icon: 'id' },
      { code: 'de', language: 'de-DE', file: 'de.json', name: 'Deutsch', icon: 'de' },
      { code: 'ms', language: 'ms-MY', file: 'ms.json', name: 'Bahasa Melayu', icon: 'my' },
      { code: 'vi', language: 'vi-VN', file: 'vi.json', name: 'Tiếng Việt', icon: 'vn' },
      { code: 'km', language: 'km-KH', file: 'km.json', name: 'ខ្មែរ', icon: 'kh' },
      { code: 'ar', language: 'ar-EG', file: 'ar.json', name: 'العربية', icon: 'eg', dir: 'rtl' },
      { code: 'th', language: 'th-TH', file: 'th.json', name: 'ไทย', icon: 'th' },
    ]
  },
  icon: {
    clientBundle: {
      scan: true
    },
    customCollections: [
      {
        prefix: 'local',
        dir: './app/assets/icons'
      }
    ]
  },
  echarts: {
    charts: ['BarChart'],
    components: ['TooltipComponent', 'GridComponent']
  }
})
