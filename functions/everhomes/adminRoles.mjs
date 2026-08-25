export const EVERHOMES_ADMIN_ROLE = 'everhomesAdmin'

export function hasEverhomesAdminRole(roles) {
  return Array.isArray(roles) && roles.includes(EVERHOMES_ADMIN_ROLE)
}
