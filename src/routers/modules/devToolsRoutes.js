import { ROLES } from '@/constants/roles'

export default [
    {
        path: '/devtools',
        name: 'DevTools',
        component: () => import('@/pages/devTools/DT_Landing.vue'),
        meta: {
            requiresAuth: false,
            role: null,
            title: 'Developer Tools',
            drawerRanking: 3,
            drawerVisible: true,
            layout: 'default',
            description: 'Internal utilities and personal project tools.',
            badge: 'Beta',
            requiresOverlay: false,
        },
    },
    {
        path: '/devtools/upload',
        name: 'Upload Firestore Data',
        component: () => import('@/pages/devTools/DT_JSONUpload.vue'),
        meta: {
            requiresAuth: false,
            role: null,
            title: 'Firestore Uploader',
            drawerRanking: null,
            drawerVisible: false,
            layout: 'admin',
            description: 'Upload JSON data to Firestore collections securely.',
            badge: '',
            requiresOverlay: false,
        },
    },
    {
        path: '/devtools/firestore',
        name: 'Explore Firestore',
        component: () => import('@/pages/devTools/DT_FirestoreAdmin.vue'),
        meta: {
            requiresAuth: false,
            role: null,
            title: 'Firestore Explorer',
            drawerRanking: null,
            drawerVisible: false,
            layout: 'admin',
            description: 'View, Edit, Add or Remove data from firestore.',
            badge: '',
            requiresOverlay: false,
        },
    },
]
