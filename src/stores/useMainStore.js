// @/stores/useMainStore.js
import { ref } from 'vue'
import { defineStore } from 'pinia'
import { doc, getDoc } from 'firebase/firestore'
import { firestore } from '@/firebase'

export const useMainStore = defineStore('main', () => {
    const user = ref(null)
    const token = ref(null)
    const rememberMe = ref(false)

    async function setUser({ user: authUser, token: userToken, rememberMe: remember }) {
      
        const userDocRef = doc(firestore, 'users', authUser.uid)
        const userSnap = await getDoc(userDocRef)
      
        let profileData = {}
        if (userSnap.exists()) {
          profileData = userSnap.data()
        }
      
        user.value = {
          uid: authUser.uid,
          email: authUser.email,
          displayName: authUser.displayName,
          userName: authUser.userName,
          ...profileData
        }
      
        token.value = userToken
        rememberMe.value = remember
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