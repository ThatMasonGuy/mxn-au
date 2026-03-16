import { ROLES } from '@/shared/constants/roles'

export default [
    {
        path: '/discord',
        name: 'DiscordBots',
        component: () => import('@/features/discord/views/DiscordBotsLanding.vue'),
        meta: {
            requiresAuth: false,
            role: null,
            title: 'Discord Bots',
            drawerRanking: 3,
            drawerVisible: true,
            layout: 'default',
            description: 'Discord bots created by Mason for no good reason.',
            badge: 'Beta',
            requiresOverlay: false,
        },
    },
]