// src/routers/modules/mainRoutes.js
import { ROLES } from '@/constants/roles'

import ComingSoon from '@/pages/MXNHome.vue'

export default [
    {
        path: '/',
        name: 'MXNHome',
        component: () => import('@/pages/MXNHome.vue'),
        meta: {
            requiresAuth: false,
            role: null,
            title: 'MXN Home',
            drawerRanking: null,
            drawerVisible: false,
            layout: 'default',
            description: 'Page under construction.',
            badge: '',
            requiresOverlay: false,
        },
    },
    {
        path: '/ext/login',
        name: 'TempestID',
        component: () => import('@/pages/extensions/Login.vue'),
        meta: {
            requiresAuth: false,
            role: null,
            title: 'Tempest ID Login',
            drawerRanking: null,
            drawerVisible: false,
            layout: 'default',
            description: 'Page under construction.',
            badge: '',
            requiresOverlay: false,
        },
    },
    {
        path: '/sites',
        name: 'TempestSites',
        component: () => import('@/pages/TempestSitesLanding.vue'),
        meta: {
            requiresAuth: false,
            role: null,
            title: 'Tempest Sites 1',
            drawerRanking: null,
            drawerVisible: false,
            layout: 'default',
            description: 'Page under construction.',
            badge: '',
            requiresOverlay: false,
        },
    },
    {
        path: '/sites2',
        name: 'TempestSites2',
        component: () => import('@/pages/TempestSitesLanding2.vue'),
        meta: {
            requiresAuth: false,
            role: null,
            title: 'Tempest Sites 2',
            drawerRanking: null,
            drawerVisible: false,
            layout: 'default',
            description: 'Page under construction.',
            badge: '',
            requiresOverlay: false,
        },
    },
    {
        path: '/sites3',
        name: 'TempestSites3',
        component: () => import('@/pages/TempestSitesLanding3.vue'),
        meta: {
            requiresAuth: false,
            role: null,
            title: 'Tempest Sites 3',
            drawerRanking: null,
            drawerVisible: false,
            layout: 'default',
            description: 'Page under construction.',
            badge: '',
            requiresOverlay: false,
        },
    },
    {
        path: '/sites4',
        name: 'TempestSites4',
        component: () => import('@/pages/TempestSitesLanding4.vue'),
        meta: {
            requiresAuth: false,
            role: null,
            title: 'Tempest Sites 4',
            drawerRanking: null,
            drawerVisible: false,
            layout: 'default',
            description: 'Page under construction.',
            badge: '',
            requiresOverlay: false,
        },
    },
    {
        path: '/404',
        name: '404',
        component: () => import('@/pages/system/Error404.vue'),
        meta: {
            requiresAuth: false,
            role: null,
            title: '404 Not Found',
            drawerVisible: false,
            layout: 'default',
            description: 'Page not found.',
            badge: '',
            requiresOverlay: false,
        },
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFoundCatchAll',
        redirect: '/404',
    }
]

