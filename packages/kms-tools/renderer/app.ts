import { createSSRApp, defineComponent, h, markRaw, reactive } from 'vue'
import PageLayout from './PageLayout.vue'
import '@arco-design/web-vue/dist/arco.css'
import 'virtual:uno.css'

export { createApp }

function createApp(pageContext) {
  let rootComponent
  const PageWithWrapper = defineComponent({
    data: () => ({
      Page: markRaw(pageContext.Page),
      pageProps: markRaw(pageContext.pageProps || {}),
    }),
    created() {
      rootComponent = this
    },
    render() {
      return h(PageLayout, {}, { default: () => h(this.Page, this.pageProps) })
    },
  })

  const app = createSSRApp(PageWithWrapper)

  const pageContextReactive = reactive(pageContext)

  Object.assign(app, {
    changePage: (pageContext) => {
      Object.assign(pageContextReactive, pageContext)
      rootComponent.Page = markRaw(pageContext.Page)
      rootComponent.pageProps = markRaw(pageContext.pageProps || {})
    },
  })

  return app
}
