import { doc, setDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { firestore } from '@/firebase'
import { generateUserProfile } from '@/utils/useGenerateUserProfile'
import { logUserEvent } from '@/utils/useLogUserEvent'
import { startTrackingSession } from '@/utils/useTrackingSession'

export const SUPPORTED_AREAS = ['personal', 'topheroes', 'translate']

export const initializeFullUser = async (user, profileInput = {}) => {
    if (!user?.uid || !user?.email) throw new Error('User UID and email are required')

    const uid = user.uid
    const email = user.email
    const provider = user.providerId || 'password'

    // 🧠 Generate the complete profile
    const profile = generateUserProfile({
        uid,
        email,
        provider,
        areas: SUPPORTED_AREAS.reduce((acc, area) => {
            acc[area] = true
            return acc
        }, {}),
        ...profileInput
    })

    // 📝 1. Write root profile doc
    const userRef = doc(firestore, `users/${uid}`)
    await setDoc(userRef, profile)

    // ⚙️ 2. Initialize settings for each declared area
    if (profile._structure?.settings) {
        for (const area of ['general', ...Object.keys(profile.areas)]) {
            const settingsRef = doc(firestore, `users/${uid}/settings/${area}`)
            await setDoc(settingsRef, {
                emailNotifications: true,
                pushNotifications: false,
                MFAEnabled: false,
                theme: 'system'
            })
        }
    }

    // 📂 3. Initialize area-level meta docs
    for (const area of Object.keys(profile.areas)) {
        if (profile.areas[area]) {
            const metaRef = doc(firestore, `users/${uid}/${area}/meta`)
            await setDoc(metaRef, {
                initializedAt: serverTimestamp(),
                onboardingComplete: false,
                dataVersion: 1
            })
        }
    }

    // 📘 4. Add login audit entry
    if (profile._structure?.logins) {
        const loginsRef = collection(firestore, `users/${uid}/logins`)
        await addDoc(loginsRef, {
            type: 'signup',
            timestamp: serverTimestamp(),
            userAgent: navigator.userAgent,
            source: 'web'
        })
    }

    // 📈 5. Start session & event logging
    if (profile._structure?.userEvents) {
        await logUserEvent('signup', {
            device: navigator.userAgent,
            locale: profile.locale,
            timezone: profile.timezone
        })
    }

    if (profile._structure?.tracking) {
        await startTrackingSession(uid)
    }
}
