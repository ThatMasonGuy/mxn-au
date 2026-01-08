// composables/useServers.js
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy } from 'firebase/firestore'
import { firestore } from '@/firebase'
import { useMainStore } from '@/stores/useMainStore'
import { encryptCredential, decryptCredential } from '@/utils/crypto'

export const useServers = () => {
    const mainStore = useMainStore()

    const getUserServersRef = () => {
        if (!mainStore.user?.uid) {
            throw new Error('User not authenticated')
        }
        return collection(firestore, 'users', mainStore.user.uid, 'servers')
    }

    const addServer = async (serverData) => {
        const serversRef = getUserServersRef()

        serverData.createdAt = new Date()
        serverData.updatedAt = new Date()
        serverData.status = 'unknown'

        return await addDoc(serversRef, serverData)
    }

    const updateServer = async (serverId, updates) => {
        if (!mainStore.user?.uid) {
            throw new Error('User not authenticated')
        }
        const serverRef = doc(firestore, 'users', mainStore.user.uid, 'servers', serverId)
        updates.updatedAt = new Date()
        return await updateDoc(serverRef, updates)
    }

    const deleteServer = async (serverId) => {
        if (!mainStore.user?.uid) {
            throw new Error('User not authenticated')
        }
        const serverRef = doc(firestore, 'users', mainStore.user.uid, 'servers', serverId)
        return await deleteDoc(serverRef)
    }

    const getServers = async () => {
        const serversRef = getUserServersRef()
        const q = query(serversRef, orderBy('name'))
        const snapshot = await getDocs(q)
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    }

    const getDecryptedCredentials = (server) => {
        if (server.authMethod === 'password') {
            return {
                password: decryptCredential(server.encryptedPassword)
            }
        } else {
            return {
                privateKey: decryptCredential(server.encryptedKey)
            }
        }
    }

    return {
        addServer,
        updateServer,
        deleteServer,
        getServers,
        getDecryptedCredentials
    }
}