import { createWebHistory, createRouter } from 'vue-router'
import { routes } from 'vue-router/auto-routes'

for (const route of routes) {
  if (route.name === '/activate') {
    route.redirect = '/activate/windows'
  }
}

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
