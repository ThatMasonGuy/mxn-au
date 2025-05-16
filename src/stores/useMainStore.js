// @/stores/useMainStore.js
import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useMainStore = defineStore('main', () => {
    const user = ref(null)
    const token = ref(null)
    const rememberMe = ref(false)

    function setUser({ user: userData, token: userToken, rememberMe: rememberMeValue }) {
        console.log('[Pinia setUser] user:', userData, 'token:', userToken, 'rememberMe:', rememberMeValue)
        user.value = userData
        token.value = userToken
        rememberMe.value = rememberMeValue
    }

    function clearAuth() {
        console.log('[Pinia clearAuth] Clearing auth from store...')
        user.value = null
        token.value = null
        rememberMe.value = false
    }

    return {
        user,
        token,
        rememberMe,
        setUser,
        clearAuth
    }
}, {
    persist: {
        storage: localStorage,
        paths: ['user', 'token', 'rememberMe']
    }
})