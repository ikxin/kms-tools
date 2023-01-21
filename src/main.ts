import { createApp } from 'vue'
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import App from './App.vue'
import ArcoVue from '@arco-design/web-vue'
import '@arco-design/web-vue/dist/arco.css'
import 'tailwindcss/utilities.css'
import '@icon-park/vue-next/styles/index.css'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/activation',
  },
  {
    name: 'home',
    path: '/home',
    component: () => import('@/pages/HomePage.vue'),
  },
  {
    name: 'activation',
    path: '/activation',
    component: () => import('@/pages/SoftwareActivation.vue'),
  },
  {
    name: 'download',
    path: '/download',
    component: () => import('@/pages/SoftwareDownload.vue'),
  },
  {
    name: 'help',
    path: '/help',
    component: () => import('@/pages/HelpCenter.vue'),
  },
  {
    name: 'service',
    path: '/service',
    component: () => import('@/pages/ServiceMonitor.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

const app = createApp(App)

app.use(ArcoVue)
app.use(router)
app.mount('#app')
