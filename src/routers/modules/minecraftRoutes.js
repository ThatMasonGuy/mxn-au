// src/routers/modules/minecraftRoutes.js
import { ROLES } from '@/constants/roles'

export default [
    {
        path: '/minecraft',
        name: 'Minecraft',
        component: () => import('@/pages/minecraft/MC_Landing.vue'),
        meta: {
            requiresAuth: false,
            role: null,
            title: 'Minecraft Dashboard',
            drawerRanking: 1,
            drawerVisible: true,
            layout: 'default',
            description: 'Manage Minecraft servers, player stats, and logs.',
            badge: '',
            requiresOverlay: false,
        },
    },
    // Uncomment when needed:
    /*
    {
      path: '/minecraft/logs',
      alias: '/Minecraft/Logs',
      name: 'Minecraft - Logs',
      component: () => import('@/pages/minecraft/MC_LogViewer.vue'),
      meta: {
        requiresAuth: false,
        requiresTHOverlay: false,
        requiresTHAdminOverlay: false,
        title: 'Minecraft - Logs',
      },
    },
    */
]
