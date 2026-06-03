// https://nuxt.com/docs/api/configuration/nuxt-config

const storage =
  process.env.CLOUDFLARE_ACCOUNT_ID &&
  process.env.CLOUDFLARE_KV_NAMESPACE_ID &&
  process.env.CLOUDFLARE_API_TOKEN
    ? {
        data: {
          driver: 'cloudflare-kv-http',
          accountId: process.env.CLOUDFLARE_ACCOUNT_ID,
          namespaceId: process.env.CLOUDFLARE_KV_NAMESPACE_ID,
          apiToken: process.env.CLOUDFLARE_API_TOKEN
        }
      }
    : {}

export default defineNuxtConfig({
  compatibilityDate: '2026-05-31',
  devtools: { enabled: true },
  future: {
    compatibilityVersion: 4
  },
  nitro: {
    experimental: {
      tasks: true
    },
    scheduledTasks: {
      '*/10 * * * *': ['monitor']
    },
    storage,
    cloudflare: {
      deployConfig: true,
      wrangler: {
        observability: {
          logs: {
            enabled: true,
            invocation_logs: true
          }
        }
      }
    }
  },
  app: {
    head: {
      script: [
        {
          defer: '',
          src: 'https://umami.ikxin.com/script.js',
          'data-website-id': '6c719cb2-4a72-46e6-a4fa-2ee357a38467'
        }
      ]
    }
  },
  vite: {
    optimizeDeps: {
      include: ['@vue/devtools-core', '@vue/devtools-kit', 'vue-echarts']
    }
  },
  runtimeConfig: {
    monitorList: '',
    monitorInterval: '5',
    public: {
      apiUrl: '',
      i18n: {
        baseUrl: 'https://kms.ikxin.com'
      }
    }
  },
  routeRules: {
    '/api/*': {
      cors: true
    }
  },
  css: ['@arco-design/web-vue/dist/arco.css', '~/assets/css/main.css'],
  modules: [
    '@nuxt/icon',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/i18n',
    '@nuxtjs/color-mode',
    '@vueuse/nuxt',
    'nuxt-echarts'
  ],
  colorMode: {
    classSuffix: '-mode'
  },
  i18n: {
    defaultLocale: 'zh-cn',
    langDir: 'locales',
    strategy: 'prefix_and_default',
    locales: [
      {
        code: 'zh-cn',
        language: 'zh-CN',
        file: 'zh-cn.json',
        name: '简体中文',
        icon: 'cn'
      },
      {
        code: 'zh-tw',
        language: 'zh-TW',
        file: 'zh-tw.json',
        name: '繁體中文',
        icon: 'tw'
      },
      {
        code: 'en',
        language: 'en-US',
        file: 'en.json',
        name: 'English',
        icon: 'us'
      },
      {
        code: 'ja',
        language: 'ja-JP',
        file: 'ja.json',
        name: '日本語',
        icon: 'jp'
      },
      {
        code: 'ko',
        language: 'ko-KR',
        file: 'ko.json',
        name: '한국어',
        icon: 'kr'
      },
      {
        code: 'de',
        language: 'de-DE',
        file: 'de.json',
        name: 'Deutsch',
        icon: 'de'
      },
      {
        code: 'es',
        language: 'es-ES',
        file: 'es.json',
        name: 'Español',
        icon: 'es'
      },
      {
        code: 'fr',
        language: 'fr-FR',
        file: 'fr.json',
        name: 'Français',
        icon: 'fr'
      },
      {
        code: 'ru',
        language: 'ru-RU',
        file: 'ru.json',
        name: 'Русский',
        icon: 'ru'
      },
      {
        code: 'pt',
        language: 'pt-PT',
        file: 'pt.json',
        name: 'Português',
        icon: 'pt'
      },
      {
        code: 'ar',
        language: 'ar-SA',
        file: 'ar.json',
        name: 'العربية',
        icon: 'sa',
        dir: 'rtl'
      }
    ]
  },
  icon: {
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
