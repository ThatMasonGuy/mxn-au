import { ROLES } from '@/constants/roles'

export default [
    {
        path: '/translate',
        name: 'Translate',
        component: () => import('@/pages/translate/TR_Landing.vue'),
        meta: {
            requiresAuth: true,
            role: ROLES.TRANSLATE_ADMIN,
            title: 'Translate Dashboard',
            drawerRanking: 4,
            drawerVisible: true,
            layout: 'admin',
            description: 'Manage Discord bot translations and translation services.',
            badge: '',
            requiresOverlay: false,
        },
    },
]
