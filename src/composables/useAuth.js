// @/composables/useAuth.js
import { computed } from 'vue'
import { useMainStore } from '@/stores/useMainStore'

/**
 * Auth composable that wraps the Pinia store
 * Provides a simple interface for authentication
 */
export const useAuth = () => {
  const mainStore = useMainStore()

  // Return user info and helpers
  return {
    user: computed(() => mainStore.user),
    token: computed(() => mainStore.token),
    isAuthenticated: computed(() => mainStore.isAuthenticated),
    hasRole: (role) => mainStore.hasRole(role),
    hasPermission: (permission) => mainStore.hasPermission(permission),
    
    // Actions
    setUser: mainStore.setUser,
    updateUser: mainStore.updateUser,
    logout: mainStore.clearAuth,
  }
}
