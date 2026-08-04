// @/auth.js
import { auth, firestore } from './firebase'
import {
    signInWithEmailAndPassword,
    onAuthStateChanged,
    createUserWithEmailAndPassword
} from 'firebase/auth'
import { doc, getDoc, collection, addDoc, serverTimestamp, updateDoc } from 'firebase/firestore'
import { useMainStore } from '@/shared/stores/useMainStore'
import { useCreateNewUser } from '@/shared/utils/useCreateNewUser'
import router from './router'

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#%^&/.,><';":])[A-Za-z\d@$!%*?&#%^&/.,><';":]{8,}$/

const isValidEmail = (value) => {
    if (typeof value !== 'string') return false

    const email = value.trim()
    if (email.length === 0 || email.length > 254 || /\s/.test(email)) return false

    const atIndex = email.indexOf('@')
    if (atIndex <= 0 || atIndex !== email.lastIndexOf('@') || atIndex > 64) return false

    const domain = email.slice(atIndex + 1)
    const dotIndex = domain.lastIndexOf('.')
    return dotIndex > 0 && dotIndex < domain.length - 2
}

// --- Login Tracking Helper ---
const trackLogin = async (uid, type = 'login') => {
    try {
        const loginsRef = collection(firestore, `users/${uid}/logins`)
        await addDoc(loginsRef, {
            type,
            timestamp: serverTimestamp(),
            userAgent: navigator.userAgent,
            source: window.location.href.includes('source=extension') ? 'extension' : 'web',
            ipInfo: {
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                locale: navigator.language || 'en-AU'
            }
        })
    } catch (error) {
        console.warn('[trackLogin] Failed to track login:', error)
    }
}

// --- Sign Up ---
export const signUp = async (userData) => {
    const { email, password, confirmPassword, ...profileData } = userData

    if (!email || !password || !confirmPassword) {
        throw new Error('Please fill in all required fields.')
    }
    if (!isValidEmail(email)) {
        throw new Error('Invalid email address.')
    }
    if (password.length > 128) {
        throw new Error('Password must be 128 characters or fewer.')
    }
    if (!passwordRegex.test(password)) {
        throw new Error('Password does not meet complexity requirements.')
    }
    if (password !== confirmPassword) {
        throw new Error('Passwords do not match.')
    }

    try {
        const { user } = await createUserWithEmailAndPassword(auth, email, password)
        await useCreateNewUser(user, profileData)

        void import('@/shared/analytics/analytics')
            .then(({ trackAnalyticsEvent }) => trackAnalyticsEvent('sign_up', { method: 'password' }))
            .catch(error => console.warn('[Analytics] Sign-up event was not recorded:', error))

        return user
    } catch (error) {
        console.error('[signUp] Error:', error)
        throw new Error(error.message || 'Error creating account.')
    }
}

// --- Sign In ---
export const signIn = async (email, password, rememberMe = false) => {
    try {
        const { user } = await signInWithEmailAndPassword(auth, email, password)
        sessionStorage.setItem('auth_remember_me', rememberMe.toString())
        await trackLogin(user.uid, 'login')

        void import('@/shared/analytics/analytics')
            .then(({ trackAnalyticsEvent }) => trackAnalyticsEvent('login', { method: 'password' }))
            .catch(error => console.warn('[Analytics] Login event was not recorded:', error))

        return user
    } catch (error) {
        console.error('[signIn] Error:', error)
        throw error
    }
}

// --- Sign Out ---
export const signOut = async () => {
    const mainStore = useMainStore()
    const uid = mainStore.user?.uid

    try {
        if (uid) {
            await trackLogin(uid, 'logout')
        }
        await auth.signOut()

        router.push('/login')
    } catch (error) {
        console.error('[signOut] Error:', error)
        throw error
    }
}

// --- Single Source of Truth for Auth State ---
let authInitialized = false
let authInitPromise = null
let lastAuthenticatedUid = null

onAuthStateChanged(auth, async (user) => {
    const mainStore = useMainStore()

    if (user) {
        try {
            const userDoc = await getDoc(doc(firestore, 'users', user.uid))

            if (!userDoc.exists()) {
                console.error('[Auth] User profile not found in Firestore')
                await auth.signOut()
                return
            }

            const profile = userDoc.data()
            const token = await user.getIdToken(true)
            const rememberMe = sessionStorage.getItem('auth_remember_me') === 'true'
            sessionStorage.removeItem('auth_remember_me')

            let updatedProfile = profile
            if (lastAuthenticatedUid !== user.uid) {
                updatedProfile = {
                    ...profile,
                    lastLogin: new Date().toISOString(),
                    loginCount: (profile.loginCount || 0) + 1
                }

                try {
                    await updateDoc(doc(firestore, 'users', user.uid), {
                        lastLogin: updatedProfile.lastLogin,
                        loginCount: updatedProfile.loginCount
                    })
                } catch (err) {
                    console.warn('[Auth] Failed to update login info:', err)
                }

                lastAuthenticatedUid = user.uid
            }

            await mainStore.setUser({
                user: {
                    uid: user.uid,
                    email: user.email,
                    ...updatedProfile
                },
                token,
                rememberMe
            })
            if (window.location.href.includes('source=extension')) {
                await sendAuthToExtension()
            }

        } catch (error) {
            console.error('[Auth] Error loading user profile:', error)
            await auth.signOut()
        }
    } else {
        mainStore.clearAuth()
        lastAuthenticatedUid = null
    }

    authInitialized = true
})

export const waitForAuth = () => {
    if (authInitPromise) return authInitPromise

    authInitPromise = new Promise((resolve) => {
        if (authInitialized) {
            resolve()
        } else {
            const unsubscribe = onAuthStateChanged(auth, () => {
                unsubscribe()
                resolve()
            })
        }
    })

    return authInitPromise
}

// Extension helper
const sendAuthToExtension = async () => {
    const EXTENSION_ID = "ppbpipbkkmndolmdbakacjomopaagldo"
    const user = auth.currentUser

    if (!user || !window.chrome?.runtime?.sendMessage) return

    try {
        const token = await user.getIdToken()
        chrome.runtime.sendMessage(EXTENSION_ID, {
            type: "TOKEN_RECEIVED",
            token,
            email: user.email,
            uid: user.uid,
        })
    } catch (error) {
        console.error('[sendAuthToExtension] Failed:', error)
    }
}

// Export utilities
export { isValidEmail, passwordRegex }
