// https://nuxt.com/docs/api/configuration/nuxt-config

const getMonitorCron = () => {
  const raw = parseInt(
    process.env.NUXT_MONITOR_INTERVAL || process.env.MONITOR_INTERVAL || '10',
    60,
  )
  const seconds = isNaN(raw) || raw <= 0 ? 10 : raw
  if (seconds < 60) {
    return `*/${seconds} * * * * *`
  }
  const minutes = Math.floor(seconds / 60)
  return `0 */${minutes} * * * *`
}

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
      [getMonitorCron()]: ['monitor'],
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
  vite: {
    optimizeDeps: {
      include: ['@vue/devtools-core', '@vue/devtools-kit'],
    },
  },
  runtimeConfig: {
    monitorList: '',
    monitorInterval: '10',
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
    'motion-v/nuxt',
    'nuxt-echarts',
  ],
  colorMode: {
    classSuffix: '-mode',
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
        icon: 'cn',
      },
      {
        code: 'en',
        language: 'en-US',
        file: 'en.json',
        name: 'English',
        icon: 'us',
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
  echarts: {
    charts: ['BarChart'],
    components: ['TooltipComponent', 'GridComponent'],
  },
})
