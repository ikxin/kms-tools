import {
  IconCaretRight,
  IconCheckCircleFill,
  IconCloseCircleFill,
  IconInfoCircleFill,
  IconMenu
} from '@arco-design/web-vue/es/icon'

export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.vueApp.component('IconCaretRight', IconCaretRight)
  nuxtApp.vueApp.component('IconCheckCircleFill', IconCheckCircleFill)
  nuxtApp.vueApp.component('IconCloseCircleFill', IconCloseCircleFill)
  nuxtApp.vueApp.component('IconInfoCircleFill', IconInfoCircleFill)
  nuxtApp.vueApp.component('IconMenu', IconMenu)

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
