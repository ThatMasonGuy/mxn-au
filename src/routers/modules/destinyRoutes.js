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
]