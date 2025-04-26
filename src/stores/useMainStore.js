// @/stores/useMainStore.js
import { defineStore } from 'pinia'

export const useMainStore = defineStore('main', {
    state: () => ({
        user: null,
        token: null,
        rememberMe: false,
    }),

    actions: {
        setUser({ user, token, rememberMe }) {
            console.log('[Pinia setUser] user:', user, 'token:', token, 'rememberMe:', rememberMe)
            this.user = user
            this.token = token
            this.rememberMe = rememberMe
        },

        clearAuth() {
            console.log('[Pinia clearAuth] Clearing auth from store...')
            this.user = null
            this.token = null
            this.rememberMe = false
        }
    },

    persist: {
        storage: localStorage, // Persist into localStorage
        paths: ['user', 'token', 'rememberMe'], // Only save these fields
    },
})
