// useEventCollection.js
import { collection, onSnapshot } from 'firebase/firestore'
import { firestore } from '@/firebase'
import { ref } from 'vue'

export function useEventCollection() {
    const events = ref([])

    const loadEvents = () => {
        const refCol = collection(firestore, 'topheroes/velaris/events')
        onSnapshot(refCol, (snap) => {
            events.value = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        })
    }

    return { events, loadEvents }
}
