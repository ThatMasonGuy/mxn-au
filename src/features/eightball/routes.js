export default [
  {
    path: '/8ball',
    name: 'EightBall',
    component: () => import('@/features/eightball/views/EightBall.vue'),
    meta: {
      requiresAuth: false,
      role: null,
      title: 'Magic 8 Ball',
      drawerRanking: null,
      drawerVisible: false,
      layout: 'default',
      description: 'Ask the Magic 8 Ball a question and let fate make the call.',
      badge: '',
      requiresOverlay: false,
    },
  },
]
