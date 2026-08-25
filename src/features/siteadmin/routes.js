import { ROLES } from '@/shared/constants/roles'

export default [
  {
    path: '/admin',
    name: 'MXN Admin Centre',
    component: () => import('@/features/siteadmin/views/SiteAdminCentre.vue'),
    meta: {
      requiresAuth: true,
      role: ROLES.SITE_ADMIN,
      title: 'Admin Centre',
      drawerVisible: false,
      layout: 'admin',
      description: 'Read-only operational oversight for MXN.au site administrators.',
      requiresOverlay: false,
    },
  },
]
