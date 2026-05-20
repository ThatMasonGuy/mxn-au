import { ROLES } from '@/shared/constants/roles'

export default [
    {
        path: '/tweet-share',
        name: 'TweetShare',
        component: () => import('@/features/tweet-share/views/TweetShare.vue'),
        meta: {
            requiresAuth: true,
            role: ROLES.SITE_ADMIN,
            title: 'Tweet to Video',
            drawerRanking: -1,
            drawerVisible: false,
            layout: 'default',
            description: 'Convert X.com tweets into shareable 9:16 videos or images.',
            badge: '',
            requiresOverlay: false,
        },
    },
]
