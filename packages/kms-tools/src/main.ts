import App from './App.vue'
import { router } from '@/routes/index'
import '@arco-design/web-vue/dist/arco.css'
import 'virtual:uno.css'

const app = createApp(App)

app.use(router)
app.mount('#app')
