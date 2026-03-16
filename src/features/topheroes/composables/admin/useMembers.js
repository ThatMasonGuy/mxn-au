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

// Predefined tag options with colors and descriptions
export const MEMBER_TAGS = {
    'alt-account': {
        label: 'Alt Account',
        color: 'blue',
        description: 'Secondary account of an existing member'
    },
    'to-be-pruned': {
        label: 'To Be Pruned',
        color: 'red',
        description: 'Member scheduled for removal due to inactivity'
    },
    'new-recruit': {
        label: 'New Recruit',
        color: 'green',
        description: 'Recently joined member requiring attention'
    },
    'under-review': {
        label: 'Under Review',
        color: 'yellow',
        description: 'Member performance or behavior under evaluation'
    },
    'vip': {
        label: 'VIP',
        color: 'purple',
        description: 'High-value or important member'
    },
    'returner': {
        label: 'Returner',
        color: 'teal',
        description: 'Former member who has returned'
    },
    'trial-period': {
        label: 'Trial Period',
        color: 'orange',
        description: 'Member in probationary period'
    },
    'bot-account': {
        label: 'Bot Account',
        color: 'gray',
        description: 'Automated or bot account'
    }
}

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
            tags: data.tags || [], // New: array of tag IDs
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

    // Helper function to get tag statistics
    const getTagStats = () => {
        const tagCounts = {}
        members.value.forEach(member => {
            if (member.tags && Array.isArray(member.tags)) {
                member.tags.forEach(tagId => {
                    tagCounts[tagId] = (tagCounts[tagId] || 0) + 1
                })
            }
        })
        return tagCounts
    }

    // Helper function to get comprehensive member statistics
    const getMemberStats = () => {
        const stats = {
            total: members.value.length,
            active: 0,
            inactive: 0,
            left: 0,
            kicked: 0,
            roles: { R5: 0, R4: 0, R3: 0, R2: 0, R1: 0 },
            totalPower: 0,
            averagePower: 0,
            maxPower: 0,
            minPower: 0,
            averageCastle: 0,
            countries: {},
            servers: {},
            withoutDiscord: 0,
            withoutGameUid: 0,
            tagStats: getTagStats()
        }

        const powers = []
        const castles = []

        // Filter to only active/inactive members for most calculations
        const activeInactiveMembers = members.value.filter(member =>
            member.status === 'active' || member.status === 'inactive'
        )

        members.value.forEach(member => {
            // Status counts (include all for totals)
            stats[member.status] = (stats[member.status] || 0) + 1
        })

        activeInactiveMembers.forEach(member => {
            // Role counts (only active/inactive)
            if (stats.roles[member.role] !== undefined) {
                stats.roles[member.role]++
            }

            // Power stats (only active/inactive)
            if (member.power) {
                stats.totalPower += member.power
                powers.push(member.power)
            }

            // Castle stats (only active/inactive)
            if (member.castle) {
                castles.push(member.castle)
            }

            // Country distribution (only active/inactive)
            if (member.country) {
                stats.countries[member.country] = (stats.countries[member.country] || 0) + 1
            }

            // Server distribution (only active/inactive)
            if (member.server) {
                stats.servers[member.server] = (stats.servers[member.server] || 0) + 1
            }

            // Missing data tracking (only active/inactive)
            if (!member.discord) stats.withoutDiscord++
            if (!member.gameUid) stats.withoutGameUid++
        })

        // Calculate averages and extremes
        if (powers.length > 0) {
            stats.averagePower = Math.round(stats.totalPower / powers.length)
            stats.maxPower = Math.max(...powers)
            stats.minPower = Math.min(...powers)
        }

        if (castles.length > 0) {
            stats.averageCastle = Math.round(castles.reduce((a, b) => a + b, 0) / castles.length)
        }

        return stats
    }

    return {
        members,
        loadMembers,
        addMember,
        updateMember,
        deleteMemberById,
        getTagStats,
        getMemberStats,
        MEMBER_TAGS
    }
}