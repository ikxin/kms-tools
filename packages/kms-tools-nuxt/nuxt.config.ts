// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: 'KMS Tools - 生成kms激活脚本的小工具',
      meta: [
        {
          charset: 'utf-8',
        },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1',
        },
        {
          name: 'keywords',
          content: 'kms,kmstools,kms激活,kms服务器,windows激活,office激活',
        },
        {
          name: 'description',
          content: 'KMS Tools是一个用于生成kms激活脚本的小工具',
        },
      ],
    },
  },
  css: ['~/assets/css/style.scss'],
  modules: ['@unocss/nuxt'],
  telemetry: false,
})
