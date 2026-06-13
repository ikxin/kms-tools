import ArcoVue from '@arco-design/web-vue'
import ArcoVueIcon from '@arco-design/web-vue/es/icon'

export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.vueApp.use(ArcoVue)
  nuxtApp.vueApp.use(ArcoVueIcon)

  if (import.meta.client) {
    const colorMode = useColorMode()

    watch(
      () => colorMode.value,
      value => {
        if (value === 'dark') {
          document.body.setAttribute('arco-theme', 'dark')
        } else {
          document.body.removeAttribute('arco-theme')
        }
      },
      { immediate: true }
    )
  }
})
