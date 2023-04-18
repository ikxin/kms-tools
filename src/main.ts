import { createApp } from 'vue'
import App from './App.vue'
import ArcoVue from '@arco-design/web-vue'
import { router } from '@/router/index'
import '@arco-design/web-vue/dist/arco.css'
import '@icon-park/vue-next/styles/index.css'
import 'virtual:uno.css'

const app = createApp(App)

app.use(ArcoVue)
app.use(router)
app.mount('#app')
