// @/composables/useTrackingSession.js
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { firestore } from '@/firebase'

export const startTrackingSession = async (uid) => {
    if (!uid) return

    try {
        const session = {
            startedAt: serverTimestamp(),
            userAgent: navigator.userAgent,
            screen: {
                width: window.innerWidth,
                height: window.innerHeight
            },
            locale: navigator.language || 'en-AU',
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            page: window.location.pathname
        }

        const sessionRef = collection(firestore, `users/${uid}/tracking`)
        await addDoc(sessionRef, session)
    } catch (err) {
        console.error('[startTrackingSession] Failed to start session:', err)
    }
}
