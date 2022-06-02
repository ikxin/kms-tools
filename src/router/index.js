import { createRouter, createWebHashHistory } from 'vue-router'

import Content from '../components/Content.vue'

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