import { ref } from 'vue'
import { firestore } from '@/firebase'
import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    onSnapshot,
    serverTimestamp
} from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const database = 'topheroes/velaris/members'
const members = ref([])

export function useMembers() {
    const loadMembers = () => {
        const membersRef = collection(firestore, database)
        onSnapshot(membersRef, (snapshot) => {
            members.value = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }))
        })
    }

    const addMember = async (data) => {
        const auth = getAuth()
        const user = auth.currentUser
        const uid = user?.uid || 'system'

        const timestamp = serverTimestamp()

        const newMember = {
            name: data.name,
            role: data.role,
            status: data.status,
            power: data.power ?? 0,
            castle: data.castle ?? 0,
            country: data.country || '',
            discord: data.discord || '',
            server: data.server || '',
            gameUid: data.gameUid || '',
            notes: data.notes || '',
            otherNames: data.otherNames || [],
            locked: data.locked ?? false,

            addedBy: uid,
            addedAt: timestamp,
            joinedAt: timestamp,
            updatedBy: uid,
            updatedAt: timestamp,

            history: []
        }

        await addDoc(collection(firestore, database), newMember)
    }

    const updateMember = async (id, data) => {
        const docRef = doc(firestore, database, id)
        await updateDoc(docRef, data)
    }

    const deleteMemberById = async (id) => {
        const docRef = doc(firestore, database, id)
        await deleteDoc(docRef)
    }

    return {
        members,
        loadMembers,
        addMember,
        updateMember,
        deleteMemberById
    }
}
