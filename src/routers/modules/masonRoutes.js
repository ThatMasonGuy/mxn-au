import { ROLES } from '@/constants/roles'

export default [
    {
        path: '/mason/tracker',
        name: 'Tracker',
        component: () => import('@/pages/mason/Tracker.vue'),
        meta: {
            requiresAuth: false,
            role: null,
            title: 'Eating Tracker',
            drawerRanking: 2,
            drawerVisible: true,
            layout: 'default',
            description: 'Track food, drinks, and other items you eat.',
            badge: '',
            requiresOverlay: false,
        },
    },
]