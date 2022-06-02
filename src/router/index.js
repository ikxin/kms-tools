import { createRouter, createWebHashHistory } from 'vue-router'

import Content from '../views/activate/windows'

const routes = [
    {
        name: 'home',
        path: '/',
        component: Content
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router