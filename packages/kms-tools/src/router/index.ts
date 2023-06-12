import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    name: 'home',
    path: '/',
    component: () => import('@/views/home/index.vue')
  },
  {
    name: 'activate',
    path: '/activate',
    redirect: '/activate/windows',
    component: () => import('@/views/activate/index.vue'),
    children: [
      {
        name: 'windows',
        path: 'windows',
        component: () => import('@/views/activate/windows.vue')
      },
      {
        name: 'office',
        path: 'office',
        component: () => import('@/views/activate/office.vue')
      }
    ]
  },
  {
    name: 'check',
    path: '/check',
    component: () => import('@/views/check/index.vue')
  },
  {
    name: 'download',
    path: '/download',
    component: () => import('@/views/download/index.vue')
  },
  {
    name: 'guide',
    path: '/guide',
    component: () => import('@/views/guide/index.vue')
  },
  {
    name: 'monitor',
    path: '/monitor',
    component: () => import('@/views/monitor/index.vue')
  }
]

export const router = createRouter({ history: createWebHistory(), routes })
