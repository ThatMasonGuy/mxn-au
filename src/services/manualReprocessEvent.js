import { getDocs, collection, doc, getDoc } from 'firebase/firestore'
import { firestore } from '@/firebase'
import { savePlayerToFirestore } from '@/services/firestorePlayerSaver'

export const reprocessEventData = async (eventId) => {
    const eventDocRef = doc(firestore, `topheroes/velaris/events/${eventId}`)
    const eventSnap = await getDoc(eventDocRef)

    if (!eventSnap.exists()) {
        console.warn(`[REPROCESS] Event ${eventId} not found.`)
        return
    }

    const eventData = eventSnap.data()
    const currentEvent = {
        id: eventId,
        endDate: eventData.endDate, // use raw Timestamp from Firestore
        enteredBy: eventData.enteredBy || 'migration-script'
    }

    const membersCol = collection(firestore, 'topheroes/velaris/members')
    const membersSnap = await getDocs(membersCol)

    const allPlayers = membersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    let count = 0

    for (const player of allPlayers) {
        const eventDocRef = doc(firestore, `topheroes/velaris/members/${player.id}/events/${eventId}`)
        const eventSnap = await getDoc(eventDocRef)

        if (!eventSnap.exists()) continue

        const existing = eventSnap.data()

        await savePlayerToFirestore({ ...existing, ...player }, currentEvent)
        count++
    }

    console.log(`[REPROCESS] Updated ${count} players for event ${eventId}.`)
}
