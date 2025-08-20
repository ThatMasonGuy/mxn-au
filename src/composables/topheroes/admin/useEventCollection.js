// useEventCollection.js
import { collection, onSnapshot, doc, deleteDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { firestore } from '@/firebase'
import { ref } from 'vue'

export function useEventCollection() {
    const events = ref([])
    const loading = ref(false)
    const error = ref(null)

    function toJSDate(v) {
        if (!v) return null;
        if (v instanceof Date) return v;
        if (typeof v === 'number') return new Date(v);            // ms since epoch
        if (typeof v === 'string') return new Date(v);            // ISO/string
        if (typeof v.toDate === 'function') return v.toDate();    // Firestore Timestamp
        if (typeof v.seconds === 'number' && typeof v.nanoseconds === 'number') {
            return new Date(v.seconds * 1000 + Math.floor(v.nanoseconds / 1e6)); // plain object form
        }
        return null; // unknown shape
    }

    const loadEvents = () =>
        new Promise((resolve, reject) => {
            loading.value = true; error.value = null;

            try {
                const refCol = collection(firestore, 'topheroes/velaris/events');
                const unsubscribe = onSnapshot(refCol, (snap) => {
                    const items = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                    items.sort((a, b) => {
                        const A = toJSDate(a.startDate) || toJSDate(a.endDate) || new Date(0);
                        const B = toJSDate(b.startDate) || toJSDate(b.endDate) || new Date(0);
                        return B.getTime() - A.getTime();
                    });

                    events.value = items;
                    loading.value = false;
                    resolve(unsubscribe);
                }, (err) => {
                    console.error('Error loading events:', err);
                    error.value = err; loading.value = false; reject(err);
                });
            } catch (err) {
                console.error('Error setting up events listener:', err);
                error.value = err; loading.value = false; reject(err);
            }
        });

    const deleteEventById = async (eventId) => {
        try {
            loading.value = true
            error.value = null

            const eventRef = doc(firestore, 'topheroes/velaris/events', eventId)
            await deleteDoc(eventRef)

            // Note: The onSnapshot listener will automatically update the events array
            return true
        } catch (err) {
            console.error('Error deleting event:', err)
            error.value = err
            throw err
        } finally {
            loading.value = false
        }
    }

    const updateEvent = async (eventId, updates) => {
        try {
            loading.value = true
            error.value = null

            const eventRef = doc(firestore, 'topheroes/velaris/events', eventId)
            await updateDoc(eventRef, {
                ...updates,
                updatedAt: serverTimestamp()
            })

            return true
        } catch (err) {
            console.error('Error updating event:', err)
            error.value = err
            throw err
        } finally {
            loading.value = false
        }
    }

    const getEventById = (eventId) => {
        return events.value.find(event => event.id === eventId)
    }

    const getEventsByStatus = (status) => {
        return events.value.filter(event => event.status === status)
    }

    const getEventsByType = (type) => {
        return events.value.filter(event => event.type === type)
    }

    const getActiveEvents = () => {
        return getEventsByStatus('active')
    }

    const getUpcomingEvents = () => {
        return getEventsByStatus('upcoming')
    }

    const getCompletedEvents = () => {
        return getEventsByStatus('completed')
    }

    return {
        // State
        events,
        loading,
        error,

        // Methods
        loadEvents,
        deleteEventById,
        updateEvent,

        // Getters
        getEventById,
        getEventsByStatus,
        getEventsByType,
        getActiveEvents,
        getUpcomingEvents,
        getCompletedEvents
    }
}