import App from '@/App.vue'
import { router } from '@/router'
import { createI18n } from 'vue-i18n'
// import messages from '@intlify/unplugin-vue-i18n/messages'

import locales from '@/locales'

console.log(locales)

import '@/styles/custom.less'
import 'virtual:uno.css'
import '@/styles/style.css'

const app = createApp(App)

const pinia = createPinia()

const i18n = createI18n({ locale: 'en', messages: locales })

app.use(pinia).use(i18n).use(router).mount('#app')
