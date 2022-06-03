import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        redirect: '/activate/windows'
    },
    {
        name: 'activate',
        path: '/activate',
        component: () => import('../views/activate'),
        children: [
            {
                name: 'windows',
                path: 'windows',
                component: () => import('../views/activate/windows')
            }
        ]
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router