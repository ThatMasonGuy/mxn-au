import { ROLES } from '@/constants/roles'

export default [
    {
        path: '/server',
        name: 'Server',
        component: () => import('@/pages/server/SR_Landing.vue'),
        meta: {
            requiresAuth: false,
            role: null,
            title: 'Server Control',
            drawerRanking: 2,
            drawerVisible: true,
            layout: 'admin',
            description: 'Manage backend servers, deployments, and files.',
            badge: '',
            requiresOverlay: false,
        },
    },
    {
      path: '/server/discord',
      name: 'Discord Server',
      component: () => import('@/pages/server/DiscordServer.vue'),
      meta: {
          requiresAuth: true,
          role: ROLES.SERVER_ADMIN,
          title: 'Discord Server',
          drawerRanking: 2,
          drawerVisible: true,
          layout: 'admin',
          description: 'View, search and filter discord data.',
          badge: '',
          requiresOverlay: false,
      },
  },
    /*
    {
      path: '/server/old',
      alias: '/Server/Old',
      name: 'Server - Old',
      component: () => import('@/pages/server/DashboardOLD.vue'),
      meta: {
        requiresAuth: false,
        requiresTHOverlay: false,
        requiresTHAdminOverlay: false,
        title: 'Server - Old',
      },
    },
    */
]
