import { ref } from 'vue'
import { collection, getDocs } from 'firebase/firestore'
import { firestore } from '@/firebase'

const members = ref([])

export function useMemberPrefill() {
    const prefilledMembers = ref([])

    const loadPrefilledMembers = async () => {
        const snapshot = await getDocs(collection(firestore, 'topheroes/velaris/members'))
        members.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))

        prefilledMembers.value = members.value
            .filter(m => m.status === 'active' || m.status === 'inactive')
            .map(m => ({
                id: m.id,
                name: m.name,
                discord: m.discord || '',
                power: m.power || 0,
                castle: m.castle || '',
                role: m.role || '',
                rank: '',
                score: '',
                scoreD1: '',
                scoreD2: '',
                scoreD3: '',
                scoreD4: '',
                scoreD5: '',
                scoreD6: '',
                notes: ''
            }))
    }

    return { prefilledMembers, loadPrefilledMembers }
}