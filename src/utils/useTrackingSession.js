// @/composables/useTrackingSession.js
import { collection, addDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { firestore } from '@/firebase'

let currentSessionId = null

export const startTrackingSession = async (uid) => {
    if (!uid) return

    try {
        const session = {
            startedAt: serverTimestamp(),
            userAgent: navigator.userAgent,
            screen: {
                width: window.screen.width,
                height: window.screen.height,
                availWidth: window.screen.availWidth,
                availHeight: window.screen.availHeight,
                colorDepth: window.screen.colorDepth,
                pixelDepth: window.screen.pixelDepth
            },
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight
            },
            locale: navigator.language || 'en-AU',
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            referrer: document.referrer || 'direct',
            entryPage: window.location.pathname,
            platform: navigator.platform,
            vendor: navigator.vendor
        }

        const sessionRef = collection(firestore, `users/${uid}/tracking`)
        const docRef = await addDoc(sessionRef, session)
        currentSessionId = docRef.id

        // Set up beforeunload to mark session end
        window.addEventListener('beforeunload', () => {
            if (currentSessionId) {
                // Use sendBeacon for reliability
                const data = JSON.stringify({
                    endedAt: new Date().toISOString(),
                    duration: Date.now() - session.startedAt
                })
                navigator.sendBeacon(`/api/end-session/${uid}/${currentSessionId}`, data)
            }
        })

        return currentSessionId
    } catch (err) {
        console.error('[startTrackingSession] Failed to start session:', err)
    }
}

export const endTrackingSession = async (uid) => {
    if (!uid || !currentSessionId) return

    try {
        const sessionRef = doc(firestore, `users/${uid}/tracking/${currentSessionId}`)
        await updateDoc(sessionRef, {
            endedAt: serverTimestamp()
        })
        currentSessionId = null
    } catch (err) {
        console.error('[endTrackingSession] Failed to end session:', err)
    }
}