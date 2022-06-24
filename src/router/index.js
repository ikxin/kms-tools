import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/activation/windows'
  },
  {
    name: 'activation',
    path: '/activation',
    component: () => import('../views/activation'),
    meta: {
      title: '系统类型',
      icon: 'system'
    },
    children: [
      {
        name: 'windows',
        path: 'windows',
        component: () => import('../views/activation/windows'),
        meta: {
          title: 'Windows',
          icon: 'windows'
        }
      },
      {
        name: 'office',
        path: 'office',
        component: () => import('../views/activation/office'),
        meta: {
          title: 'Office',
          icon: 'word'
        }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export { router, routes }
