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
    path: '/topheroes/resources',
    alias: '/TopHeroes/Resources',
    name: 'TopHeroes - Resources',
    component: () => import('@/pages/topHeroes/TH_ResourceCalculator.vue'),
    meta: {
      requiresAuth: false,
      requiresTHOverlay: true,
      requiresTHAdminOverlay: false,
      title: 'TopHeroes - Resources',
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
    alias: ['/topheroes/admin/', '/topheroes/admin/home', '/topheroes/admin/home/'],
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
    path: '/topheroes/admin/castleinput',
    alias: '/TopHeroes/Admin/CastleInput',
    name: 'TopHeroes - Admin Castle Input',
    component: () => import('@/pages/topHeroes/admin/TH_AdminCastleInput.vue'),
    meta: {
      requiresAuth: false,
      requiresTHOverlay: false,
      requiresTHAdminOverlay: false,
      title: 'TopHeroes - Admin',
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
  // 1. If they’re already heading to ComingSoon, let them go.
  if (to.name === 'ComingSoon') {
    return next();
  }

  // 2. If it's not the ComingSoon route, then it must start with /topheroes or we redirect.
  if (!to.path.toLowerCase().startsWith('/topheroes')) {
    return next({ name: 'ComingSoon' });
  }

  // 3. If the route does NOT require authentication, proceed.
  if (!to.matched.some(record => record.meta.requiresAuth)) {
    return next();
  }

  // 4. If it DOES require auth, check for the auth key.
  const authKey = localStorage.getItem('authKey');
  if (authKey) {
    // Auth token present, so let them continue.
    return next();
  }

  // 5. If no auth token, redirect to sign-in.
  console.warn('Auth Key missing: Redirecting to /topheroes/admin/signin');
  return next({ path: '/topheroes/admin/signin' });
});

export default router;