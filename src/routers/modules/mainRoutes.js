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
        path: '/daily',
        name: 'MXNDaily',
        component: () => import('@/pages/MXNDaily.vue'),
        meta: {
            requiresAuth: false,
            role: null,
            title: 'MXN Daily',
            drawerRanking: null,
            drawerVisible: false,
            layout: 'default',
            description: 'Page under construction.',
            badge: '',
            requiresOverlay: false,
        },
    },
    {
        path: '/login',
        name: 'TempestID',
        component: () => import('@/pages/system/Login.vue'),
        meta: {
            requiresAuth: false,
            role: null,
            title: 'Tempest ID Login',
            drawerRanking: null,
            drawerVisible: false,
            layout: 'default',
            description: 'Use your TempestID to login.',
            badge: '',
            requiresOverlay: false,
        },
    },
    {
        path: '/unauth',
        name: 'Unauthorized',
        component: () => import('@/pages/system/Unauthorized.vue'),
        meta: {
            requiresAuth: false,
            role: null,
            title: 'Unauthorized',
            drawerRanking: null,
            drawerVisible: false,
            layout: 'default',
            description: 'You do not have access to view this page.',
            badge: '',
            requiresOverlay: false,
        },
    },
    {
        path: '/ext/login',
        name: 'ExtensionTempestID',
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

