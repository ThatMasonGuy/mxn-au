import { ref } from 'vue'
import { getFirestore, collection, getDocs } from 'firebase/firestore'

export function useFirestoreCollection() {
    const loading = ref(false)
    const error = ref(null)
    const documents = ref([])

    /**
     * Fetch a collection from Firestore.
     * @param {string} collectionPath The path to the Firestore collection (e.g. "users", "products")
     */
    async function fetchCollection(collectionPath) {
        loading.value = true
        error.value = null
        documents.value = []

        try {
            const db = getFirestore()
            const colRef = collection(db, collectionPath)
            const snapshot = await getDocs(colRef)

            documents.value = snapshot.docs.map(doc => ({
                id: doc.id,
                data: doc.data(),
            }))
        } catch (err) {
            console.error('[useFirestoreCollection] Failed to fetch:', err)
            error.value = err.message || 'Unknown Firestore Error'
        } finally {
            loading.value = false
        }
    }

    return {
        loading,
        error,
        documents,
        fetchCollection,
    }
}
