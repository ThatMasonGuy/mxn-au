// src/routers/modules/minecraftRoutes.js
import { ROLES } from '@/constants/roles'

export default [
    {
        path: '/destiny',
        name: 'Destiny',
        component: () => import('@/pages/destiny/Destiny.vue'),
        meta: {
            requiresAuth: true,
            role: null,
            title: 'Destiny 2',
            drawerRanking: 1,
            drawerVisible: true,
            layout: 'default',
            description: 'View current challenge progession and get recommendations on how to min-max your progression.',
            badge: '',
            requiresOverlay: false,
        },
    },
    {
        path: '/destiny/usage',
        name: 'DestinyUsage',
        component: () => import('@/pages/destiny/DestinyStats.vue'),
        meta: {
            requiresAuth: false,
            role: null,
            title: 'Destiny 2',
            drawerRanking: 1,
            drawerVisible: true,
            layout: 'default',
            description: 'View usage statistics for the MXN Destiny 2 web app.',
            badge: '',
            requiresOverlay: false,
        },
    },
]