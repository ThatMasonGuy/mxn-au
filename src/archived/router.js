// src/router.js
import { createRouter, createWebHistory } from 'vue-router';
import ComingSoon from '@/pages/MXNHome.vue';

const comingSoon = true;

const routes = [
  // ------------------- Testing Routes -------------------

  {
    path: '/minecraft',
    alias: '/Minecraft',
    name: 'Minecraft',
    component: () => import('@/pages/minecraft/MC_Landing.vue'),
    meta: {
      requiresAuth: false,
      requiresTHOverlay: false,
      requiresTHAdminOverlay: false,
      title: 'Minecraft',
    },
  },

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
  {
    path: '/server',
    alias: '/Servers',
    name: 'Server',
    component: () => import('@/pages/server/Dashboard.vue'),
    meta: {
      requiresAuth: false,
      requiresTHOverlay: false,
      requiresTHAdminOverlay: false,
      title: 'Server',
    },
  },
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
  // ------------------- TopHeroes Routes -------------------

  {
    path: '/topheroes',
    alias: '/TopHeroes',
    name: 'TopHeroes',
    component: () => import('@/pages/topHeroes/TH_Landing.vue'),
    meta: {
      requiresAuth: false,
      requiresTHOverlay: true,
      requiresTHAdminOverlay: false,
      title: 'Home',
      drawerRanking: '1',
    },
  },
  {
    path: '/topheroes/tools',
    alias: '/TopHeroes/tool',
    name: 'TopHeroes - Tools',
    component: () => import('@/pages/topHeroes/TH_Tools.vue'),
    meta: {
      requiresAuth: false,
      requiresTHOverlay: true,
      requiresTHAdminOverlay: false,
      title: 'Tools',
      drawerRanking: '2',
    },
  },
  {
    path: '/topheroes/events',
    alias: '/TopHeroes/Events',
    name: 'TopHeroes - Events',
    component: () => import('@/pages/topHeroes/TH_EventGuides.vue'),
    meta: {
      requiresAuth: false,
      requiresTHOverlay: true,
      requiresTHAdminOverlay: false,
      title: 'Guides',
      drawerRanking: '3',
    },
  },
  {
    path: '/topheroes/velaris',
    alias: '/TopHeroes/vlr',
    name: 'TopHeroes - Velaris',
    component: () => import('@/pages/topHeroes/velaris/TH_VelarisHome.vue'),
    meta: {
      requiresAuth: false,
      requiresTHOverlay: true,
      requiresTHAdminOverlay: false,
      title: 'Velaris',
      drawerRanking: '4',
    },
  },
  {
    path: '/topheroes/admin',
    alias: ['/topheroes/admin/', '/topheroes/admin/home', '/topheroes/admin/home/'],
    name: 'TopHeroes - Admin',
    component: () => import('@/pages/topHeroes/admin/TH_AdminHome.vue'),
    meta: {
      requiresAuth: true,
      requiresTHOverlay: false,
      requiresTHAdminOverlay: true,
      title: 'Admin',
      drawerRanking: '5',
    },
  },

  // ------------------- TopHeroes Tools -------------------

  {
    path: '/topheroes/tools/speedups',
    alias: '/TopHeroes/SpeedUps',
    name: 'TopHeroes - Speed-ups',
    component: () => import('@/pages/topHeroes/TH_SpeedUps.vue'),
    meta: {
      requiresAuth: false,
      requiresTHOverlay: true,
      requiresTHAdminOverlay: false,
      title: 'Speed Up Calculator',
      drawerRanking: '1',
    },
  },
  {
    path: '/topheroes/tools/resources',
    alias: '/TopHeroes/Resources',
    name: 'TopHeroes - Resources',
    component: () => import('@/pages/topHeroes/TH_ResourceCalculator.vue'),
    meta: {
      requiresAuth: false,
      requiresTHOverlay: true,
      requiresTHAdminOverlay: false,
      title: 'Resource Calculator',
      drawerRanking: '2',
    },
  },

  // ------------------- TopHeroes Velaris Routes -------------------

  {
    path: '/topheroes/velaris/events',
    alias: '/TopHeroes/vlr/events/',
    name: 'Velaris Events',
    component: () => import('@/pages/topHeroes/velaris/TH_VLR_Events.vue'),
    meta: {
      requiresAuth: false,
      requiresTHOverlay: true,
      requiresTHAdminOverlay: false,
      title: 'Events',
      drawerRanking: '1',
    },
  },
  {
    path: '/topheroes/velaris/events/gvg',
    alias: '/TopHeroes/vlr/events/gvg',
    name: 'Velaris Event',
    component: () => import('@/pages/topHeroes/velaris/TH_VLR_Event.vue'),
    meta: {
      requiresAuth: false,
      requiresTHOverlay: true,
      requiresTHAdminOverlay: false,
      title: 'GvG Stats - 14/04/25',
      drawerRanking: '1',
    },
  },

  // ------------------- TopHeroes Events Routes -------------------

  {
    path: '/topheroes/events/dark-empire-invasion',
    alias: '/TopHeroes/Events/Dark-Empire-Invasion',
    name: 'TopHeroes - Dark Empire Invasion',
    component: () => import('@/pages/topHeroes/events/TH_DarkEmpireInvasion.vue'),
    meta: {
      requiresAuth: false,
      requiresTHOverlay: true,
      requiresTHAdminOverlay: false,
      title: 'Dark Empire Invasion',
      drawerRanking: '3',
    },
  },
  {
    path: '/topheroes/events/kingdom-vs-kingdom',
    alias: '/TopHeroes/Events/kvk',
    name: 'TopHeroes - Kingdom vs. Kingdom',
    component: () => import('@/pages/topHeroes/events/TH_KingdomVsKingdom.vue'),
    meta: {
      requiresAuth: false,
      requiresTHOverlay: true,
      requiresTHAdminOverlay: false,
      title: 'Kingdom vs. Kingdom',
      drawerRanking: '2',
    },
  },
  {
    path: '/topheroes/events/guild-race',
    alias: '/TopHeroes/Events/gr',
    name: 'TopHeroes - Guild Race',
    component: () => import('@/pages/topHeroes/events/TH_GuildRace.vue'),
    meta: {
      requiresAuth: false,
      requiresTHOverlay: true,
      requiresTHAdminOverlay: false,
      title: 'Guild Race',
      drawerRanking: '1',
    },
  },

  // ------------------- TopHeroes Admin Routes -------------------

  {
    path: '/topheroes/admin/signup',
    alias: '/TopHeroes/Admin/SignUp',
    name: 'TopHeroes - Admin Sign-up',
    component: () => import('@/pages/topHeroes/admin/TH_AdminSignUp.vue'),
    meta: {
      requiresAuth: false,
      requiresTHOverlay: false,
      requiresTHAdminOverlay: false,
      title: 'Sign up',
      drawerVisible: 'false',
    },
  },
  {
    path: '/topheroes/admin/castledata',
    alias: ['/TopHeroes/Admin/CastleData', '/topheroes/admin/castle-data'],
    name: 'TopHeroes - Admin Castle Data',
    component: () => import('@/pages/topHeroes/admin/TH_AdminCastleData.vue'),
    meta: {
      requiresAuth: true,
      requiresTHOverlay: false,
      requiresTHAdminOverlay: true,
      title: 'Castle Data Input',
      drawerRanking: '2',
    },
  },
  {
    path: '/topheroes/admin/login',
    alias: ['/topheroes/admin/login', '/topheroes/admin/signin', '/topheroes/admin/sign-in'],
    name: 'TopHeroes - Admin Login',
    component: () => import('@/pages/topHeroes/admin/TH_AdminLogin.vue'),
    meta: {
      requiresAuth: false,
      requiresTHOverlay: false,
      requiresTHAdminOverlay: false,
      title: 'Sign in',
      drawerRanking: '1',
    },
  },

  // ------------------- DevTools -------------------

  {
    path: '/devtools',
    name: 'DevTools',
    component: () => import('@/pages/devTools/DT_Landing.vue'),
    meta: {
      requiresAuth: false,
      title: 'DevTools',
    },
  },
  {
    path: '/devtools/upload',
    alias: '/devtools/uploads',
    name: 'Upload',
    component: () => import('@/pages/devTools/UploadFirestoreData.vue'),
    meta: {
      requiresAuth: false,
      requiresTHOverlay: false,
      requiresTHAdminOverlay: false,
      title: 'Upload',
    },
  },

  // ------------------- Server -------------------

  {
    path: '/server',
    name: 'Server',
    component: () => import('@/pages/server/SR_Landing.vue'),
    meta: {
      requiresAuth: false,
      title: 'Server',
    },
  },

  // ------------------- Translate -------------------

  {
    path: '/translate',
    name: 'Translate',
    component: () => import('@/pages/translate/TR_Landing.vue'),
    meta: {
      requiresAuth: false,
      title: 'Translate',
    },
  },

  // ------------------- Coming Soon Route -------------------

  {
    path: '/coming-soon',
    name: 'ComingSoon',
    component: ComingSoon,
    meta: {
      requiresAuth: false,
      title: 'Coming Soon',
    },
  },

  // ------------------- Catch-All Route -------------------

  {
    path: '/:pathMatch(.*)*',
    name: '404',
    component: ComingSoon,
    meta: {
      requiresAuth: false,
      title: 'Coming Soon',
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
    return next();
});

export default router;