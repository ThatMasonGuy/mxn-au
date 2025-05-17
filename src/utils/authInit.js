// src/utils/authInit.js
import { onAuthStateChanged, getAuth } from 'firebase/auth'
import { useMainStore } from '@/stores/useMainStore'
import { useHydrateMissingUserFields } from '@/utils/useHydrateMissingUserFields'
import { getDoc, doc, getFirestore } from 'firebase/firestore'

export async function initAuth(router) {
    const auth = getAuth()
    return new Promise((resolve) => {
        onAuthStateChanged(auth, async (user) => {
            const mainStore = useMainStore()

            if (user) {
                const token = await user.getIdToken(true)

                const userDoc = await getDoc(doc(getFirestore(), 'users', user.uid))
                const profile = userDoc.exists() ? userDoc.data() : {}

                mainStore.setUser({
                    user: {
                        uid: user.uid,
                        email: user.email,
                        ...profile
                    },
                    token,
                    rememberMe: true
                })
            } else {
                mainStore.clearAuth()
            }

            resolve()
        })
    })
}
