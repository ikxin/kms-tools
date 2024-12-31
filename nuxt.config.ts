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
  css: ['~/assets/css/main.css'],
  modules: [
    'arco-design-nuxt-module',
    '@nuxt/icon',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/i18n',
    '@nuxtjs/color-mode',
  ],
  i18n: {
    defaultLocale: 'zh-cn',
    langDir: 'locales',
    locales: [
      { code: 'zh-cn', file: 'zh-cn.json', name: '简体中文', icon: 'cn' },
      { code: 'zh-tw', file: 'zh-tw.json', name: '繁體中文', icon: 'tw' },
    ],
    strategy: 'no_prefix',
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
