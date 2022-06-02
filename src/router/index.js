import { createRouter, createWebHashHistory } from 'vue-router'

import Content from '../views/activate/windows'

const routes = [
    {
        path: '/',
        redirect: '/activate'
    },
    {
        name: 'activate',
        path: '/activate',
        component: () => import('../views/activate/windows')
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router