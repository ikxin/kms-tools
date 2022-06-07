import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/activate/windows'
  },
  {
    name: 'activate',
    path: '/activate',
    component: () => import('../views/activate'),
    meta: {
      title: '系统类型',
      icon: 'system'
    },
    children: [
      {
        name: 'windows',
        path: 'windows',
        component: () => import('../views/activate/Windows'),
        meta: {
          title: 'Windows',
          icon: 'windows'
        }
      },
      {
        name: 'office',
        path: 'office',
        component: () => import('../views/activate/Office'),
        meta: {
          title: 'Office',
          icon: 'word'
        }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export { router, routes }
