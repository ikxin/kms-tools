export { render }

import { createApp } from '@/main'

export const clientRouting = true
export const prefetchStaticAssets = 'viewport'

let app
async function render(pageContext) {
  if (!app) {
    app = createApp(pageContext)
    app.mount('#app')
  } else {
    app.changePage(pageContext)
  }
}
