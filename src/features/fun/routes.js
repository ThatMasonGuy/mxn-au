export default [
  {
    path: '/coin',
    name: 'CoinFlip',
    component: () => import('@/features/fun/views/CoinFlip.vue'),
    meta: {
      requiresAuth: false,
      role: null,
      title: 'Flip a Coin',
      drawerRanking: null,
      drawerVisible: false,
      layout: 'default',
      description: 'Flip a beautifully over-engineered virtual coin.',
      badge: '',
      requiresOverlay: false,
    },
  },
  {
    path: '/dice',
    name: 'DiceRoller',
    component: () => import('@/features/fun/views/DiceRoller.vue'),
    meta: {
      requiresAuth: false,
      role: null,
      title: 'Dice Roller',
      drawerRanking: null,
      drawerVisible: false,
      layout: 'default',
      description: 'Roll a d4, d6, d8, d10, d12, d20, or d100.',
      badge: '',
      requiresOverlay: false,
    },
  },
]
