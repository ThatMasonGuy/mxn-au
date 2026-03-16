import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

export const useFirestoreAdminStore = defineStore('firestoreAdmin', () => {
    // 🔥 User session
    const currentUser = ref(null)

    // 🔥 Connection State
    const isConnected = ref(true)
    const connectionDetails = ref('Connected to Firestore')
    const useMockData = ref(true)

    // 🔥 Collections
    const collections = ref([
        { id: 'users', count: 25 },
        { id: 'products', count: 103 },
        { id: 'orders', count: 412 },
        { id: 'settings', count: 7 },
        { id: 'logs', count: 1500 },
    ])
    const collectionSearch = ref('')
    const selectedCollection = ref('')

    // 🔥 Documents
    const data = ref([])
    const loading = ref(false)

    // 🔥 Search and Filters
    const searchTerm = ref('')
    const sortBy = ref('id')
    const sortDirection = ref('asc')

    // 🔥 Pagination
    const currentPage = ref(1)
    const itemsPerPage = ref(10)

    // 🔥 Modals
    const showAddDocumentModal = ref(false)
    const showEditDocumentModal = ref(false)
    const showViewDocumentModal = ref(false)
    const showDeleteConfirmationModal = ref(false)
    const showNewCollectionModal = ref(false)

    // 🔥 Document Editing
    const selectedDocument = ref(null)
    const newDocumentId = ref('')
    const documentJsonData = ref('{}')
    const jsonError = ref('')
    const newCollectionId = ref('')
    const newCollectionIdError = ref('')

    // 🔥 Computed

    const filteredCollections = computed(() => {
        if (!collectionSearch.value) return collections.value
        const search = collectionSearch.value.toLowerCase()
        return collections.value.filter(collection =>
            collection.id.toLowerCase().includes(search)
        )
    })

    const filteredData = computed(() => {
        let result = [...data.value]

        if (searchTerm.value) {
            const search = searchTerm.value.toLowerCase()
            result = result.filter(item => {
                if (item.id.toLowerCase().includes(search)) return true
                const jsonString = JSON.stringify(item.data).toLowerCase()
                return jsonString.includes(search)
            })
        }

        if (sortBy.value) {
            result.sort((a, b) => {
                let valA = sortBy.value === 'id' ? a.id : a.data[sortBy.value] || ''
                let valB = sortBy.value === 'id' ? b.id : b.data[sortBy.value] || ''

                if (typeof valA === 'string' && typeof valB === 'string') {
                    return sortDirection.value === 'asc'
                        ? valA.localeCompare(valB)
                        : valB.localeCompare(valA)
                } else {
                    if (valA < valB) return sortDirection.value === 'asc' ? -1 : 1
                    if (valA > valB) return sortDirection.value === 'asc' ? 1 : -1
                    return 0
                }
            })
        }

        return result
    })

    const paginatedData = computed(() => {
        const start = (currentPage.value - 1) * itemsPerPage.value
        return filteredData.value.slice(start, start + itemsPerPage.value)
    })

    const totalPages = computed(() => {
        return Math.ceil(filteredData.value.length / itemsPerPage.value) || 1
    })

    const paginationStart = computed(() => {
        return ((currentPage.value - 1) * itemsPerPage.value) + 1
    })

    const paginationEnd = computed(() => {
        return Math.min(currentPage.value * itemsPerPage.value, filteredData.value.length)
    })

    const displayedPages = computed(() => {
        const pages = []
        const maxVisible = 5

        if (totalPages.value <= maxVisible) {
            for (let i = 1; i <= totalPages.value; i++) pages.push(i)
        } else {
            let startPage = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
            let endPage = startPage + maxVisible - 1
            if (endPage > totalPages.value) {
                endPage = totalPages.value
                startPage = Math.max(1, endPage - maxVisible + 1)
            }
            for (let i = startPage; i <= endPage; i++) pages.push(i)
        }

        return pages
    })

    const documentPath = computed(() => {
        if (!selectedCollection.value || !selectedDocument.value) return ''
        return `/${selectedCollection.value}/${selectedDocument.value.id}`
    })

    const formattedViewJson = computed(() => {
        if (!selectedDocument.value) return ''
        try {
            return JSON.stringify(selectedDocument.value.data, null, 2)
        } catch {
            return '{}'
        }
    })

    // 🔥 Core Methods

    function selectCollection(collectionId) {
        selectedCollection.value = collectionId
        currentPage.value = 1
        loadData()
    }

    function loadData() {
        if (!selectedCollection.value) return
        loading.value = true

        setTimeout(() => {
            if (useMockData.value) {
                // 🧪 Mock Data Mode
                const mockData = Array.from({ length: 50 }, (_, i) => ({
                    id: `doc-${i + 1}`,
                    data: {
                        createdAt: new Date(Date.now() - Math.random() * 1e9).toISOString(),
                        updatedAt: new Date(Date.now() - Math.random() * 1e6).toISOString(),
                        name: `Mock Document ${i + 1}`,
                        value: Math.floor(Math.random() * 1000),
                    },
                }))
                data.value = mockData
            } else {
                // 🔥 Real Firestore Mode (later on we'll hook this up)
                console.log('[FirestoreAdmin] Fetching real Firestore documents... 🚀')
                data.value = [] // (Temporary blank if no Firestore connected yet)
            }

            loading.value = false
        }, 500)
    }


    function refreshData() {
        loadData()
    }

    function closeModals() {
        showAddDocumentModal.value = false
        showEditDocumentModal.value = false
        showViewDocumentModal.value = false
        showDeleteConfirmationModal.value = false
        showNewCollectionModal.value = false

        selectedDocument.value = null
        newDocumentId.value = ''
        documentJsonData.value = '{}'
        jsonError.value = ''
        newCollectionId.value = ''
        newCollectionIdError.value = ''
    }

    function viewDocument(doc) {
        selectedDocument.value = doc
        showViewDocumentModal.value = true
    }

    function editDocument(doc) {
        selectedDocument.value = doc
        documentJsonData.value = JSON.stringify(doc.data, null, 2)
        showEditDocumentModal.value = true
        showViewDocumentModal.value = false
    }

    function confirmDeleteDocument(doc) {
        selectedDocument.value = doc
        showDeleteConfirmationModal.value = true
    }

    function deleteDocument() {
        data.value = data.value.filter(item => item.id !== selectedDocument.value.id)
        closeModals()
    }

    function saveDocument() {
        try {
            const parsed = JSON.parse(documentJsonData.value)

            if (showEditDocumentModal.value) {
                const idx = data.value.findIndex(item => item.id === selectedDocument.value.id)
                if (idx !== -1) {
                    data.value[idx].data = { ...parsed, updatedAt: new Date().toISOString() }
                }
            } else {
                const id = newDocumentId.value || `doc-${Math.floor(Math.random() * 1000)}`
                data.value.push({
                    id,
                    data: { ...parsed, createdAt: new Date().toISOString() }
                })
            }
            closeModals()
        } catch (e) {
            jsonError.value = `Invalid JSON: ${e.message}`
        }
    }

    function createNewCollection() {
        if (!newCollectionId.value.trim()) {
            newCollectionIdError.value = 'Collection ID is required'
            return
        }

        if (collections.value.some(c => c.id === newCollectionId.value)) {
            newCollectionIdError.value = 'Collection ID already exists'
            return
        }

        collections.value.push({ id: newCollectionId.value, count: 0 })
        selectCollection(newCollectionId.value)
        closeModals()
    }

    function formatJson() {
        try {
            const parsed = JSON.parse(documentJsonData.value)
            documentJsonData.value = JSON.stringify(parsed, null, 2)
            jsonError.value = ''
        } catch (e) {
            jsonError.value = `Invalid JSON: ${e.message}`
        }
    }

    function formatPreview(data) {
        const str = JSON.stringify(data)
        return str.length > 60 ? str.slice(0, 60) + '...' : str
    }

    function formatDate(dateString) {
        if (!dateString) return '-'
        return new Date(dateString).toLocaleString()
    }

    function reconnect() {
        isConnected.value = false
        connectionDetails.value = 'Reconnecting...'
        setTimeout(() => {
            isConnected.value = true
            connectionDetails.value = 'Connected to Firestore'
        }, 1500)
    }

    function copyDocumentPath() {
        navigator.clipboard.writeText(documentPath.value)
    }

    // 🔥 Watchers
    watch([searchTerm, sortBy, sortDirection], () => {
        currentPage.value = 1
    })

    return {
        // State
        currentUser,
        isConnected,
        connectionDetails,
        collections,
        collectionSearch,
        selectedCollection,
        data,
        loading,
        searchTerm,
        sortBy,
        sortDirection,
        currentPage,
        itemsPerPage,

        // Modals
        showAddDocumentModal,
        showEditDocumentModal,
        showViewDocumentModal,
        showDeleteConfirmationModal,
        showNewCollectionModal,

        selectedDocument,
        newDocumentId,
        documentJsonData,
        jsonError,
        newCollectionId,
        newCollectionIdError,

        // Computed
        filteredCollections,
        filteredData,
        paginatedData,
        totalPages,
        paginationStart,
        paginationEnd,
        displayedPages,
        documentPath,
        formattedViewJson,

        // Methods
        selectCollection,
        refreshData,
        viewDocument,
        editDocument,
        confirmDeleteDocument,
        deleteDocument,
        saveDocument,
        createNewCollection,
        closeModals,
        formatJson,
        formatPreview,
        formatDate,
        reconnect,
        copyDocumentPath,
        useMockData,
    }
})
