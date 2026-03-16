// composables/useCommandHistory.js
import { collection, addDoc, query, where, orderBy, limit, getDocs } from 'firebase/firestore'
import { db } from '@/firebase'
import { useAuth } from '@/composables/useAuth'

export const useCommandHistory = () => {
    const { user } = useAuth()

    const saveCommand = async (serverId, command, duration = null, exitCode = null) => {
        const historyRef = collection(db, 'users', user.value.uid, 'commandHistory')

        return await addDoc(historyRef, {
            serverId,
            command,
            executedAt: new Date(),
            duration,
            exitCode
        })
    }

    const getCommandHistory = async (serverId, limitCount = 50) => {
        const historyRef = collection(db, 'users', user.value.uid, 'commandHistory')
        const q = query(
            historyRef,
            where('serverId', '==', serverId),
            orderBy('executedAt', 'desc'),
            limit(limitCount)
        )

        const snapshot = await getDocs(q)
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    }

    return {
        saveCommand,
        getCommandHistory
    }
}