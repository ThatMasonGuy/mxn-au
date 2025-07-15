// @/composables/topheroes/admin/useMemberEvents.js
import { ref } from 'vue'
import { collection, doc, onSnapshot, updateDoc } from 'firebase/firestore'
import { firestore } from '@/firebase'

export function useMemberEvents(memberId) {
    const events = ref([])

    const loadEvents = () => {
        const eventsRef = collection(firestore, `topheroes/velaris/members/${memberId}/events`)
        onSnapshot(eventsRef, (snapshot) => {
            events.value = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }))
        })
    }

    const updateEvent = async (eventId, updates) => {
        const eventRef = doc(firestore, `topheroes/velaris/members/${memberId}/events/${eventId}`)
        await updateDoc(eventRef, updates)
    }

    return { events, loadEvents, updateEvent }
}
