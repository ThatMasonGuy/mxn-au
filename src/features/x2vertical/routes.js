import { ROLES } from '@/shared/constants/roles'

export default [
    {
        path: '/x2vertical',
        name: 'X2Vertical',
        component: () => import('@/features/x2vertical/views/X2Vertical.vue'),
        meta: {
            requiresAuth: true,
            role: ROLES.SITE_ADMIN,
            title: 'X2Vertical',
            drawerRanking: -1,
            drawerVisible: false,
            layout: 'default',
            description: 'Convert X.com tweets into shareable 9:16 videos or images.',
            badge: '',
            requiresOverlay: false,
        },
    },
]
