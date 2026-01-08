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
  {
    path: '/minecraft/setup',
    name: 'MinecraftSetup',
    component: () => import('@/components/minecraft/MinecraftSetup.vue'),
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
    component: () => import('@/components/minecraft/MinecraftDashboard.vue'),
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
    component: () => import('@/components/minecraft/MinecraftInstance.vue'),
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
