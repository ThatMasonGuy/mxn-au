// @/auth.js
import { auth, firestore } from './firebase'
import { signInWithEmailAndPassword, onAuthStateChanged, createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { useMainStore } from '@/stores/useMainStore'
import { useCreateNewUser } from '@/utils/useCreateNewUser'
import { useHydrateMissingUserFields } from '@/utils/useHydrateMissingUserFields'
import router from './router'

const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#%^&/.,><';":])[A-Za-z\d@$!%*?&#%^&/.,><';":]{8,}$/

function formatDateToDDMMYYYY(date) {
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
}

export const signUp = async (
    firstName,
    lastName,
    userName,
    email,
    phoneNumber,
    countryCode,
    country,
    rawDateOfBirth,
    password,
    confirmPassword
) => {
    if (!email || !password || !confirmPassword) {
        throw new Error('Please fill in all required fields.')
    }

    if (!emailRegex.test(email)) {
        throw new Error('Invalid email address.')
    }

    if (!passwordRegex.test(password)) {
        throw new Error('Password does not meet complexity requirements.')
    }

    if (password !== confirmPassword) {
        throw new Error('Passwords do not match.')
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        const { user } = userCredential

        console.log('[signUp] Firebase Auth user created:', user.uid)

        await useCreateNewUser(user, {
            firstName,
            lastName,
            userName,
            email,
            phoneNumber,
            countryCode,
            country,
            dateOfBirth: rawDateOfBirth
        })

        return user
    } catch (error) {
        console.error('[signUp] Error:', error)
        throw new Error(error.message || 'Error creating account.')
    }
}

// --- Auth State Watcher ---
onAuthStateChanged(auth, async (user) => {
    const mainStore = useMainStore()
    console.log('[onAuthStateChanged] Fired. user:', user)

    const currentRoute = router.currentRoute.value
    console.log('[onAuthStateChanged] Current route:', currentRoute.fullPath)

    if (user) {
        try {
            const token = await user.getIdToken(true)
            await useHydrateMissingUserFields(user.uid, user.email)

            mainStore.setUser({
                user: { uid: user.uid, email: user.email },
                token,
                rememberMe: true
            })

            console.log('[onAuthStateChanged] User profile hydrated and stored.')

        } catch (error) {
            console.error('[onAuthStateChanged] Error during user hydration:', error)
        }

    } else {
        console.warn('[onAuthStateChanged] User is null (signed out). Clearing auth store.')
        mainStore.clearAuth()

        if (currentRoute.meta?.requiresAuth) {
            console.warn('[onAuthStateChanged] Route requires auth but no user. Reloading to let router guard handle it...')
            router.replace({
                path: router.currentRoute.value.fullPath,
                query: {
                    redirectFrom: router.currentRoute.value.fullPath
                }
            })
        }
    }
})

// --- Sign In ---
export const signIn = async (email, password, rememberMe = false) => {
    console.log('[signIn] Attempting sign-in:', { email, rememberMe })
    const mainStore = useMainStore()

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        const { user } = userCredential
        console.log('[signIn] Success. User:', user)

        const token = await user.getIdToken(true)

        mainStore.setUser({
            user: { uid: user.uid, email: user.email },
            token,
            rememberMe
        })

        console.log('[signIn] User data saved to Pinia store. All good.')
        return user
    } catch (error) {
        console.error('[signIn] Error during login:', error)
        throw error
    }
}

export const getCurrentUser = () => {
    return new Promise((resolve, reject) => {
        const unsubscribe = onAuthStateChanged(auth, user => {
            unsubscribe()
            resolve(user)
        }, reject)
    })
}

// --- Sign Out ---
export const signOut = async () => {
    const mainStore = useMainStore()

    try {
        await auth.signOut()
        mainStore.clearAuth()
        router.push('/topheroes/admin/login')
        console.log('[signOut] Signed out and cleared auth.')
    } catch (error) {
        console.error('[signOut] Error signing out:', error)
        throw error
    }
}

// --- Export any needed utils
export { emailRegex, passwordRegex, formatDateToDDMMYYYY }
