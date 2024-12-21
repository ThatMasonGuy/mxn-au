// src/router.js
import { createRouter, createWebHistory } from 'vue-router';
import ComingSoon from '@/pages/ComingSoon.vue';

const comingSoon = true;

const routes = [
  // ------------------- TopHeroes Routes -------------------
  {
    path: '/TopHeroes',
    alias: '/topheroes',
    name: 'TopHeroes',
    component: () => import('@/pages/topHeroes/TH_LandingPage.vue'),
    meta: {
      requiresAuth: false,
      title: 'TopHeroes',
    },
  },
  {
    path: '/TopHeroes/SpeedUps',
    alias: '/topheroes/speedups',
    name: 'TopHeroes - Speed-ups',
    component: () => import('@/pages/topHeroes/TH_SpeedUps.vue'),
    meta: {
      requiresAuth: false,
      title: 'TopHeroes - Speed-ups',
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
    if (to.path.startsWith('/TopHeroes') || to.name === 'ComingSoon') {
      next();
    } else {
      next({ name: 'ComingSoon' });
    }
  } else {
    next();
  }
});

export default router;
