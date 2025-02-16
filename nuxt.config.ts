// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  future: {
    compatibilityVersion: 4,
  },
  nitro: {
    experimental: {
      tasks: true,
    },
    scheduledTasks: {
      '0/10 * * * * *': ['monitor'],
    },
  },
  app: {
    head: {
      script: [
        {
          defer: '',
          src: 'https://umami.ikxin.com/script.js',
          'data-website-id': '6c719cb2-4a72-46e6-a4fa-2ee357a38467',
        },
      ],
    },
  },
  runtimeConfig: {
    public: {
      apiUrl: '',
      i18n: {
        baseUrl: 'https://kms.ikxin.com',
      },
    },
  },
  routeRules: {
    '/api/*': {
      cors: true,
    },
  },
  css: ['~/assets/css/main.css'],
  modules: [
    'arco-design-nuxt-module',
    '@nuxt/icon',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/i18n',
    '@nuxtjs/color-mode',
    '@vueuse/nuxt',
  ],
  i18n: {
    defaultLocale: 'en',
    langDir: 'locales',
    strategy: 'prefix_except_default',
    locales: [
      {
        code: 'en',
        language: 'en-US',
        file: 'en.json',
        name: 'English',
        icon: 'us',
      },
      {
        code: 'zh-cn',
        language: 'zh-CN',
        file: 'zh-cn.json',
        name: '简体中文',
        icon: 'cn',
      },
      {
        code: 'zh-tw',
        language: 'zh-TW',
        file: 'zh-tw.json',
        name: '繁体中文',
        icon: 'tw',
      },
    ],
  },
  icon: {
    customCollections: [
      {
        prefix: 'icons',
        dir: './app/assets/icons',
      },
    ],
  },
})
