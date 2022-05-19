import { createApp } from 'vue'
import App from './App.vue'
// 引入ant-design-vue
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';

const app = createApp(App)

app.use(Antd)
app.mount('#app')
