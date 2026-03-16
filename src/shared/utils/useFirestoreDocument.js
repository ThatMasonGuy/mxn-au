import { ref } from 'vue'
import { getFirestore, doc, getDoc, collection, listCollections } from 'firebase/firestore'

export function useFirestoreDocument() {
    const loading = ref(false)
    const error = ref(null)
    const document = ref(null)
    const subcollections = ref([])

    /**
     * Fetch a single Firestore document and list subcollections
     * @param {string} collectionPath Path to the parent collection (e.g. 'users')
     * @param {string} documentId ID of the document to fetch
     */
    async function fetchDocument(collectionPath, documentId) {
        loading.value = true
        error.value = null
        document.value = null
        subcollections.value = []

        try {
            const db = getFirestore()
            const docRef = doc(db, collectionPath, documentId)

            // Fetch the document data
            const docSnap = await getDoc(docRef)

            if (!docSnap.exists()) {
                throw new Error('Document does not exist')
            }

            document.value = {
                id: docSnap.id,
                data: docSnap.data(),
            }

            // Fetch subcollections (only names, not contents)
            const colRefs = await listCollections(docRef)
            subcollections.value = colRefs.map(col => col.id)

        } catch (err) {
            console.error('[useFirestoreDocument] Failed to fetch document:', err)
            error.value = err.message || 'Unknown Firestore error'
        } finally {
            loading.value = false
        }
    }

    return {
        loading,
        error,
        document,
        subcollections,
        fetchDocument,
    }
}
