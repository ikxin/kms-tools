// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  future: {
    compatibilityVersion: 4,
  },
  nitro: {
    experimental: {
      tasks: true,
    },
    scheduledTasks: {
      "0/10 * * * * *": ["monitor"],
    },
  },
  css: ["~/assets/css/main.css"],
  modules: [
    "arco-design-nuxt-module",
    "@nuxt/icon",
    "@nuxtjs/tailwindcss",
    "@nuxtjs/i18n",
    "@nuxtjs/color-mode",
    "@vueuse/nuxt",
  ],
  i18n: {
    defaultLocale: "en",
    langDir: "locales",
    locales: [
      {
        code: "en",
        language: "en-US",
        file: "en.json",
        name: "English",
        icon: "us",
      },
      {
        code: "zh-cn",
        language: "zh-CN",
        file: "zh-cn.json",
        name: "简体中文",
        icon: "cn",
      },
    ],
    strategy: "prefix_except_default",
  },
  icon: {
    customCollections: [
      {
        prefix: "icons",
        dir: "./app/assets/icons",
      },
    ],
  },
});
