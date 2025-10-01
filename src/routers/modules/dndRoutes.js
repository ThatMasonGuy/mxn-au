import { ROLES } from '@/constants/roles'

export default [
    {
        path: '/dnd',
        name: 'DungeonsAndDragons',
        component: () => import('@/pages/dnd/UserPage.vue'),
        meta: {
            requiresAuth: false,
            role: null,
            title: 'Dungeons & Dragons',
            drawerRanking: 3,
            drawerVisible: true,
            layout: 'default',
            description: 'A dungeons and dragons player app.',
            badge: 'Beta',
            requiresOverlay: false,
        },
    },
    {
        path: '/dnd2',
        name: 'DungeonsAndDragons2',
        component: () => import('@/pages/dnd/UserPage2.vue'),
        meta: {
            requiresAuth: false,
            role: null,
            title: 'Dungeons & Dragons',
            drawerRanking: 3,
            drawerVisible: true,
            layout: 'default',
            description: 'A dungeons and dragons player app.',
            badge: 'Beta',
            requiresOverlay: false,
        },
    },
]