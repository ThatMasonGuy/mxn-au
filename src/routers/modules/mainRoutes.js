// src/routers/modules/mainRoutes.js
import { ROLES } from '@/constants/roles'

import ComingSoon from '@/pages/MXNHome.vue'

export default [
    {
        path: '/',
        name: 'MXNHome',
        component: () => import('@/pages/MXNHome.vue'),
        meta: {
            requiresAuth: false,
            role: null,
            title: 'MXN Home',
            drawerRanking: null,
            drawerVisible: false,
            layout: 'default',
            description: 'Page under construction.',
            badge: '',
            requiresOverlay: false,
        },
    },
    {
        path: '/404',
        name: '404',
        component: () => import('@/pages/system/Error404.vue'),
        meta: {
            requiresAuth: false,
            role: null,
            title: '404 Not Found',
            drawerVisible: false,
            layout: 'default',
            description: 'Page not found.',
            badge: '',
            requiresOverlay: false,
        },
    },
]

