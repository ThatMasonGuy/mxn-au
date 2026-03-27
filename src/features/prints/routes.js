export default [
    {
        path: '/prints',
        name: 'Prints',
        component: () => import('@/features/prints/views/PrintsHome.vue'),
        meta: {
            requiresAuth: false,
            role: null,
            title: 'Prints | Mason Bartholomai',
            drawerRanking: 4,
            drawerVisible: false,
            layout: 'default',
            description: 'Fine art landscape and nature photography prints by Mason Bartholomai.',
            requiresOverlay: false,
        },
    },
]
