export const SITE_ADMIN_ROLE = 'siteAdmin'

export function hasSiteAdminRole(roles) {
  return Array.isArray(roles) && roles.includes(SITE_ADMIN_ROLE)
}
