import { getDoc, doc, setDoc, updateDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { firestore } from '@/firebase'
import { generateUserProfile } from './useGenerateUserProfile'
import { SUPPORTED_AREAS } from './useInitializeFullUser'

export const useHydrateMissingUserFields = async (uid, email) => {
    if (!uid || !email) throw new Error('User UID and email are required')

    const userRef = doc(firestore, `users/${uid}`)
    const snapshot = await getDoc(userRef)

    if (!snapshot.exists()) {
        throw new Error('[hydrateMissingUserFields] User document does not exist')
    }

    const existing = snapshot.data()
    const expected = generateUserProfile({ uid, email }) // default only

    const updates = {}

    // 🌱 Check and fill top-level fields
    for (const key of Object.keys(expected)) {
        if (!(key in existing)) {
            updates[key] = expected[key]
        }
    }

    // 🧠 Ensure `flags.profileComplete` is correct
    if (existing.flags && typeof existing.flags.profileComplete === 'undefined') {
        updates['flags.profileComplete'] = !!(
            existing.firstName &&
            existing.lastName &&
            existing.userName &&
            existing.dateOfBirth
        )
    }

    // 🧪 Patch root doc if needed
    if (Object.keys(updates).length > 0) {
        await updateDoc(userRef, updates)
        console.log('[hydrateMissingUserFields] Patched missing fields:', updates)
    }

    const structure = expected._structure || {}

    if (structure.settings) {
        for (const area of ['general', ...Object.keys(expected.areas)]) {
            const settingsRef = doc(firestore, `users/${uid}/settings/${area}`)
            await setDoc(settingsRef, {
                emailNotifications: true,
                pushNotifications: false,
                MFAEnabled: false,
                theme: 'system'
            }, { merge: true })
        }
    }

    if (structure.logins) {
        const loginsRef = collection(firestore, `users/${uid}/logins`)
        await addDoc(loginsRef, {
            type: 'hydrate-missing',
            timestamp: serverTimestamp(),
            source: 'self-heal'
        })
    }

    if (structure.tracking) {
        const metaRef = doc(firestore, `users/${uid}/personal/meta`)
        await setDoc(metaRef, {
            initializedAt: serverTimestamp(),
            onboardingComplete: false,
            dataVersion: 1
        }, { merge: true })
    }

    if (structure.userEvents) {
        const userEventsRef = collection(firestore, `users/${uid}/userEvents`)
        await addDoc(userEventsRef, {
            type: 'hydrate-start',
            timestamp: serverTimestamp()
        })
    }

    if (structure.moderatorActions) {
        const modActionsRef = collection(firestore, `users/${uid}/moderatorActions`)
        await addDoc(modActionsRef, {
            type: 'hydrate',
            timestamp: serverTimestamp()
        })
    }

}
