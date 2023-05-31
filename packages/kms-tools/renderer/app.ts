import { createSSRApp, h } from 'vue'
import PageLayout from './PageLayout.vue'
import '@arco-design/web-vue/dist/arco.css'
import 'virtual:uno.css'

export { createApp }

function createApp(pageContext) {
  const { Page, pageProps } = pageContext
  const PageWithLayout = {
    render() {
      return h(
        PageLayout,
        {},
        {
          default() {
            return h(Page, pageProps || {})
          },
        }
      )
    },
  }
  const app = createSSRApp(PageWithLayout)
  return app
}
