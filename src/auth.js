// @/auth.js
import { auth, firestore } from './firebase'
import { signInWithEmailAndPassword, onAuthStateChanged, createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { useMainStore } from '@/stores/useMainStore'
import router from './router'

const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#%^&/.,><';":])[A-Za-z\d@$!%*?&#%^&/.,><';":]{8,}$/

function formatDateToDDMMYYYY(date) {
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
}

export const signUp = async (firstName, lastName, userName, email, phoneNumber, countryCode, rawDateOfBirth, password, confirmPassword) => {
    if (!email || !password || !confirmPassword) {
        throw new Error('Missing required fields')
    }

    if (password !== confirmPassword) {
        throw new Error('Passwords do not match')
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        const { user } = userCredential

        console.log('[signUp] Successfully created user:', user.uid)

        const userRef = doc(firestore, 'users', user.uid)

        await setDoc(userRef, {
            firstName,
            lastName,
            userName,
            emailAddress: email,
            phoneNumber,
            countryCode,
            dateOfBirth: rawDateOfBirth,
            avatarUrl: '',
            createdAt: new Date().toISOString(),
            role: 'user', // default role if you want
        })

        return user
    } catch (error) {
        console.error('[signUp] Error:', error)
        throw error
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
            console.log('[onAuthStateChanged] User is not null. Checking Firestore user doc...')
            const userDoc = doc(firestore, 'users', user.uid)
            const docSnap = await getDoc(userDoc)

            if (!docSnap.exists()) {
                console.log('[onAuthStateChanged] No user doc found. Creating a new user doc...')
                await setDoc(userDoc, {
                    firstName: '',
                    lastName: '',
                    userName: '',
                    emailAddress: user.email,
                    phoneNumber: '',
                    avatarUrl: ''
                })
            }

            // Automatically set the user in Pinia
            const token = await user.getIdToken(true)
            mainStore.setUser({
                user: { uid: user.uid, email: user.email },
                token: token,
                rememberMe: true, // Always true in onAuthStateChanged
            })

        } catch (error) {
            console.error('[onAuthStateChanged] Error fetching/creating user doc:', error)
        }
    } else {
        console.warn('[onAuthStateChanged] User is null (signed out). Clearing auth store.')
        mainStore.clearAuth()

        if (currentRoute.meta?.requiresAuth) {
            console.warn('[onAuthStateChanged] Route requires auth but no user. Redirecting...')
            router.push('/topheroes/admin/login')
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
