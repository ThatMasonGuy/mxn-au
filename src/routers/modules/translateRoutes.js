import { ROLES } from '@/constants/roles'

export default [
    {
        path: '/translate',
        name: 'Translate',
        component: () => import('@/pages/translate/Translate.vue'),
        meta: {
            requiresAuth: false,
            role: null,
            title: 'Translate Dashboard',
            drawerRanking: 1,
            drawerVisible: true,
            layout: 'admin',
            description: 'Use the realtime translation app, powered by Open AI.',
            badge: '',
            requiresOverlay: false,
        },
    },
    {
        path: '/translate/bot',
        name: 'Translate Bot',
        component: () => import('@/pages/translate/TR_Landing.vue'),
        meta: {
            requiresAuth: false,
            role: null,
            title: 'Translate Bot',
            drawerRanking: 2,
            drawerVisible: true,
            layout: 'admin',
            description: 'Manage Discord bot translations and translation services.',
            badge: '',
            requiresOverlay: false,
        },
    },
]
