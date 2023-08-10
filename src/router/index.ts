import { createRouter, createWebHistory } from 'vue-router/auto'

export const router = createRouter({
  history: createWebHistory(),
  extendRoutes: routes => {
    routes.find(route => {
      return route.name === '/activate'
    }).redirect = '/activate/windows'
    return routes
  },
})
