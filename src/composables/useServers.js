// composables/useServers.js
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where, orderBy } from 'firebase/firestore'
import { firestore } from '@/firebase'
import { useAuth } from '@/composables/useAuth'
import { encryptCredential, decryptCredential } from '@/utils/crypto'

export const useServers = () => {
    const { user } = useAuth()

    const getUserServersRef = () => {
        return collection(firestore, 'users', user.value.uid, 'servers')
    }

    const addServer = async (serverData) => {
        const serversRef = getUserServersRef()

        serverData.createdAt = new Date()
        serverData.updatedAt = new Date()
        serverData.status = 'unknown'

        return await addDoc(serversRef, serverData)
    }

    const updateServer = async (serverId, updates) => {
        const serverRef = doc(firestore, 'users', user.value.uid, 'servers', serverId)
        updates.updatedAt = new Date()
        return await updateDoc(serverRef, updates)
    }

    const deleteServer = async (serverId) => {
        const serverRef = doc(firestore, 'users', user.value.uid, 'servers', serverId)
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