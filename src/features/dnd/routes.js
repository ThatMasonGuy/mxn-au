import { ROLES } from '@/shared/constants/roles'

export default [
    {
        path: '/dnd',
        name: 'DungeonsAndDragons',
        component: () => import('@/features/dnd/views/UserPage.vue'),
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
        component: () => import('@/features/dnd/views/UserPage2.vue'),
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
        path: '/dm',
        name: 'DMDashboard',
        component: () => import('@/features/dnd/views/DMDashboard.vue'),
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