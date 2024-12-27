// src/router.js
import { createRouter, createWebHistory } from 'vue-router';
import ComingSoon from '@/pages/ComingSoon.vue';

const comingSoon = true;

const routes = [

  // ------------------- TopHeroes Routes -------------------

  {
    path: '/topheroes',
    alias: '/TopHeroes',
    name: 'TopHeroes',
    component: () => import('@/pages/topHeroes/TH_LandingPage.vue'),
    meta: {
      requiresAuth: false,
      requiresTHOverlay: true,
      requiresTHAdminOverlay: false,
      title: 'TopHeroes',
    },
  },
  {
    path: '/topheroes/speedups',
    alias: '/TopHeroes/SpeedUps',
    name: 'TopHeroes - Speed-ups',
    component: () => import('@/pages/topHeroes/TH_SpeedUps.vue'),
    meta: {
      requiresAuth: false,
      requiresTHOverlay: true,
      requiresTHAdminOverlay: false,
      title: 'TopHeroes - Speed-ups',
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
      title: 'TopHeroes - Events',
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
      title: 'TopHeroes - Events',
    },
  },

  // ------------------- TopHeroes Admin Routes -------------------

  {
    path: '/topheroes/admin',
    alias: '/TopHeroes/Admin',
    name: 'TopHeroes - Admin',
    component: () => import('@/pages/topHeroes/admin/TH_AdminHome.vue'),
    meta: {
      requiresAuth: true,
      requiresTHOverlay: false,
      requiresTHAdminOverlay: true,
      title: 'TopHeroes - Admin',
    },
  },
  {
    path: '/topheroes/admin/signup',
    alias: '/TopHeroes/Admin/SignUp',
    name: 'TopHeroes - Admin Sign-up',
    component: () => import('@/pages/topHeroes/admin/TH_AdminSignUp.vue'),
    meta: {
      requiresAuth: false,
      requiresTHOverlay: false,
      requiresTHAdminOverlay: false,
      title: 'TopHeroes - Admin',
    },
  },
  {
    path: '/topheroes/admin/login',
    alias: '/TopHeroes/Admin/login',
    name: 'TopHeroes - Admin Login',
    component: () => import('@/pages/topHeroes/admin/TH_AdminLogin.vue'),
    meta: {
      requiresAuth: false,
      requiresTHOverlay: false,
      requiresTHAdminOverlay: false,
      title: 'TopHeroes - Admin',
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
  if (comingSoon) {
    // Allow access to TopHeroes routes and ComingSoon route
    if (to.path.startsWith('/TopHeroes') || to.name === 'ComingSoon' || to.path.startsWith('/topheroes')) {
      next();
    } else {
      next({ name: 'ComingSoon' });
    }
  } else {
    next();
  }
});

export default router;
