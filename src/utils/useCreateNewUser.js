import { doc, setDoc } from 'firebase/firestore'
import { firestore } from '@/firebase'
import { generateUserProfile } from './useGenerateUserProfile'
import { initializeFullUser } from './useInitializeFullUser'

/**
 * Creates a new user account in Firestore with full scaffolding.
 * Call this AFTER Firebase Auth user has been created.
 */
export const useCreateNewUser = async (authUser, profileInput = {}) => {
    if (!authUser?.uid || !authUser?.email) {
        throw new Error('[useCreateNewUser] Missing required user info')
    }

    const uid = authUser.uid
    const email = authUser.email
    const provider = authUser.providerId || 'password'

    // 💡 Generate root profile doc
    const profile = generateUserProfile({
        uid,
        email,
        provider,
        ...profileInput
    })

    // ✅ Write the root user profile to Firestore
    const userRef = doc(firestore, `users/${uid}`)
    await setDoc(userRef, profile)

    // 🛠 Scaffold subcollections (settings, logins, tracking, etc.)
    await initializeFullUser(authUser, profileInput)

    return profile
}
