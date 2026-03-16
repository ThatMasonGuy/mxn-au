import { ROLES } from '@/shared/constants/roles'

export default [
    {
        path: '/server',
        name: 'Server',
        component: () => import('@/features/server/views/SR_Landing.vue'),
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
      path: '/server/dashboard',
      name: 'Server Terminal',
      component: () => import('@/features/server/views/ServerDashboard.vue'),
      meta: {
        requiresAuth: true, // Important!
        role: null,
        title: 'SSH Dashboard',
        drawerRanking: 1,
        drawerVisible: true,
        layout: 'admin',
      },
    },
    {
      path: '/server/admin',
      name: 'Server Admin',
      component: () => import('@/features/server/views/ServerAdmin.vue'),
      meta: {
        requiresAuth: true, // Important!
        role: ROLES.SERVER_ADMIN,
        title: 'SSH Admin',
        drawerRanking: 1,
        drawerVisible: true,
        layout: 'admin',
      },
    },
    /*
    {
      path: '/server/discord',
      name: 'Discord Server',
      component: () => import('@/features/server/views/DiscordServer.vue'),
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
    {
      path: '/server/old',
      alias: '/Server/Old',
      name: 'Server - Old',
      component: () => import('@/features/server/views/DashboardOLD.vue'),
      meta: {
        requiresAuth: false,
        requiresTHOverlay: false,
        requiresTHAdminOverlay: false,
        title: 'Server - Old',
      },
    },
    */
]
