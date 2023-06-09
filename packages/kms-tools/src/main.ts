import App from '@/App.vue'
import { router } from '@/router/index'
import { createI18n } from 'vue-i18n'
import messages from '@intlify/unplugin-vue-i18n/messages'

import '@arco-themes/vue-ant-design/css/arco.css'
import 'virtual:uno.css'
import '@/styles/style.css'

const app = createApp(App)

const i18n = createI18n({
  locale: 'en',
  messages,
})

app.use(router)

app.use(i18n)

app.mount('#app')
