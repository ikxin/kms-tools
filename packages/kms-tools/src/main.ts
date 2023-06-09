import App from '@/App.vue'
import { router } from '@/router/index'
import '@arco-themes/vue-ant-design/css/arco.css'
import 'virtual:uno.css'
import '@/styles/style.css'

const app = createApp(App)

app.use(router)
app.mount('#app')
