import { createApp } from 'vue'
import App from './App.vue'
import ArcoVue from '@arco-design/web-vue'
import ArcoVueIcon from '@arco-design/web-vue/es/icon';
import '@arco-design/web-vue/dist/arco.css'
import 'tailwindcss/utilities.css'

const app = createApp(App)

app.use(ArcoVue).use(ArcoVueIcon)
app.mount('#app')
