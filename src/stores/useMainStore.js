// @/stores/useMainStore.js
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useMainStore = defineStore('main', () => {
  const user = ref(null)
  const token = ref(null)
  const rememberMe = ref(false)

  // Computed helpers
  const isAuthenticated = computed(() => !!user.value)
  const userRoles = computed(() => user.value?.roles || [])
  const hasRole = computed(() => (role) => userRoles.value.includes(role))
  const hasPermission = computed(() => (permission) => user.value?.permissions?.[permission] || false)

  async function setUser({ user: authUser, token: userToken, rememberMe: remember }) {
    user.value = authUser
    token.value = userToken
    rememberMe.value = remember
  }

  function updateUser(updates) {
    if (user.value) {
      user.value = { ...user.value, ...updates }
    }
  }

  function clearAuth() {
    user.value = null
    token.value = null
    rememberMe.value = false
  }

  return {
    // State
    user,
    token,
    rememberMe,
    // Computed
    isAuthenticated,
    userRoles,
    hasRole,
    hasPermission,
    // Actions
    setUser,
    updateUser,
    clearAuth
  }
}, {
  persist: {
    storage: localStorage,
    paths: ['user', 'token', 'rememberMe']
  }
})