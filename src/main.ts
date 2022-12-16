import { createApp } from 'vue'
import App from './App.vue'
import ArcoVue from '@arco-design/web-vue'
import '@arco-design/web-vue/dist/arco.css'
import 'tailwindcss/utilities.css'
import '@icon-park/vue-next/styles/index.css'

const app = createApp(App)

app.use(ArcoVue)
app.mount('#app')
