export default [
  {
    path: '/ai-journal',
    name: 'AiJournal',
    component: () => import('./views/AiJournalHome.vue'),
    meta: {
      title: 'AI Journal',
      requiresAuth: false,
      loadingMessage: 'Initializing AI Journal...',
    },
  },
  {
    path: '/ai-journal/terms-of-service',
    name: 'AiJournalTermsOfService',
    component: () => import('./views/TermsOfService.vue'),
    meta: {
      title: 'Terms of Service - AI Journal',
      requiresAuth: false,
    },
  },
  {
    path: '/ai-journal/privacy-policy',
    name: 'AiJournalPrivacyPolicy',
    component: () => import('./views/PrivacyPolicy.vue'),
    meta: {
      title: 'Privacy Policy - AI Journal',
      requiresAuth: false,
    },
  },
]
