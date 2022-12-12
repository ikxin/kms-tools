import { createApp } from 'vue'
import App from './App.vue'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import 'tailwindcss/utilities.css'
import '@icon-park/vue-next/styles/index.css'

const app = createApp(App)

app.use(Antd)
app.mount('#app')
