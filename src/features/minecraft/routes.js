// src/routers/modules/minecraftRoutes.js
import { ROLES } from '@/shared/constants/roles'

export default [
  {
    path: '/minecraft',
    name: 'Minecraft',
    component: () => import('@/features/minecraft/views/MC_Landing.vue'),
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
  {
    path: '/minecraft/setup',
    name: 'MinecraftSetup',
    component: () => import('@/features/minecraft/components/MinecraftSetup.vue'),
    meta: {
      requiresAuth: true,
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
  {
    path: '/minecraft/dashboard',
    name: 'MinecraftDashboard',
    component: () => import('@/features/minecraft/components/MinecraftDashboard.vue'),
    meta: {
      requiresAuth: true,
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
  {
    path: '/minecraft/:id',
    name: 'MinecraftInstance',
    component: () => import('@/features/minecraft/components/MinecraftInstance.vue'),
    meta: {
      requiresAuth: true,
      role: null,
      title: 'Minecraft Dashboard',
      drawerRanking: 1,
      drawerVisible: true,
      layout: 'default',
      description: 'Manage Minecraft servers, player stats, and logs.',
      badge: '',
      requiresOverlay: false,
    },
  }
]
