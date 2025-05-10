// @/composables/useLogUserEvent.js
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { firestore } from '@/firebase'
import { useMainStore } from '@/stores/useMainStore'

export const logUserEvent = async (eventType, data = {}) => {
    const { user } = useMainStore()
    if (!user?.uid) return

    try {
        await addDoc(collection(firestore, `users/${user.uid}/userEvents`), {
            type: eventType,
            data,
            timestamp: serverTimestamp()
        })
    } catch (err) {
        console.error('[logUserEvent] Failed to log:', err)
    }
}
