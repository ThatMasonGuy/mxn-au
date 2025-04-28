<template>
    <div class="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-gray-100 p-6">
        <div class="max-w-7xl mx-auto space-y-6">

            <!-- Header -->
            <FirestoreHeader :current-user="currentUser" :use-mock-data="useMockData" />

            <!-- Layout -->
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <!-- Sidebar -->
                <div class="lg:col-span-3">
                    <FirestoreSidebar :filtered-collections="filteredCollections" :collection-search="collectionSearch"
                        :selected-collection="selectedCollection" :is-connected="isConnected"
                        :connection-details="connectionDetails" @select-collection="selectCollection"
                        @reconnect="reconnect" @show-new-collection-modal="() => showNewCollectionModal = true" />
                </div>

                <!-- Main Content -->
                <div class="lg:col-span-9 space-y-6">
                    <!-- Action Bar -->
                    <FirestoreActionBar :selected-collection="selectedCollection" :data-length="data.length"
                        :search-term="searchTerm" :sort-by="sortBy" :sort-direction="sortDirection"
                        @update:search-term="(v) => searchTerm = v" @update:sort-by="(v) => sortBy = v"
                        @update:sort-direction="(v) => sortDirection = v" @refresh="refreshData"
                        @show-add-modal="() => showAddDocumentModal = true" />

                    <!-- Table -->
                    <div class="bg-gray-900/80 rounded-xl shadow-md overflow-hidden">
                        <FirestoreTable :selected-collection="selectedCollection" :loading="loading"
                            :filtered-data="paginatedData" :view-document="viewDocument" :edit-document="editDocument"
                            :confirm-delete-document="confirmDeleteDocument" :format-preview="formatPreview"
                            :format-date="formatDate" :sort-by="sortBy" :sort-direction="sortDirection"
                            @sort="handleSort" />


                        <!-- Pagination -->
                        <FirestorePagination :current-page="currentPage" :total-pages="totalPages"
                            :pagination-start="paginationStart" :pagination-end="paginationEnd"
                            :filtered-data-length="filteredData.length" :displayed-pages="displayedPages"
                            :go-to-page="(page) => currentPage = page"
                            :next-page="() => { if (currentPage < totalPages) currentPage++ }"
                            :prev-page="() => { if (currentPage > 1) currentPage-- }" />
                    </div>
                </div>
            </div>
        </div>

        <!-- Dialogs -->
        <AddEditDocumentDialog :is-open="showAddDocumentModal || showEditDocumentModal" :is-edit="showEditDocumentModal"
            :new-document-id="newDocumentId" :document-json-data="documentJsonData" :json-error="jsonError"
            @close="closeModals" @save="saveDocument" @format-json="formatJson" />

        <ViewDocumentDialog :is-open="showViewDocumentModal" :document-path="documentPath"
            :formatted-json="formattedViewJson" @close="closeModals" @edit="editSelectedDocument"
            @copy-document-path="copyDocumentPath" />

        <DeleteConfirmationDialog :is-open="showDeleteConfirmationModal" :document-path="documentPath"
            @close="closeModals" @confirm="deleteDocument" />

        <NewCollectionDialog :is-open="showNewCollectionModal" :new-collection-id="newCollectionId"
            :new-collection-id-error="newCollectionIdError" @close="closeModals" @confirm="createNewCollection"
            @update:newCollectionId="(v) => newCollectionId = v" />
    </div>
</template>

<script setup>
import { ref } from 'vue';
// 🔥 Import the store
import { useFirestoreAdminStore } from '@/stores/useFirestoreAdminStore'
import { storeToRefs } from 'pinia'

// 🔥 Import components
import FirestoreHeader from '@/components/devtools/firestore/FirestoreHeader.vue'
import FirestoreSidebar from '@/components/devtools/firestore/FirestoreSidebar.vue'
import FirestoreActionBar from '@/components/devtools/firestore/FirestoreActionBar.vue'
import FirestoreTable from '@/components/devtools/firestore/FirestoreTable.vue'
import FirestorePagination from '@/components/devtools/firestore/FirestorePagination.vue'

import AddEditDocumentDialog from '@/components/devtools/firestore/dialogs/AddEditDocumentDialog.vue'
import ViewDocumentDialog from '@/components/devtools/firestore/dialogs/ViewDocumentDialog.vue'
import DeleteConfirmationDialog from '@/components/devtools/firestore/dialogs/DeleteConfirmationDialog.vue'
import NewCollectionDialog from '@/components/devtools/firestore/dialogs/NewCollectionDialog.vue'

// 🔥 Set up store
const firestoreStore = useFirestoreAdminStore()
const {
    currentUser,
    filteredCollections,
    collectionSearch,
    selectedCollection,
    isConnected,
    connectionDetails,
    data,
    loading,
    searchTerm,
    sortBy,
    sortDirection,
    currentPage,
    totalPages,
    paginationStart,
    paginationEnd,
    displayedPages,
    paginatedData,
    filteredData,
    showAddDocumentModal,
    showEditDocumentModal,
    showViewDocumentModal,
    showDeleteConfirmationModal,
    showNewCollectionModal,
    newDocumentId,
    documentJsonData,
    jsonError,
    documentPath,
    formattedViewJson,
    newCollectionId,
    newCollectionIdError,
    useMockData
} = storeToRefs(firestoreStore)

const {
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
} = firestoreStore

// Special bridge to switch from View to Edit
function editSelectedDocument() {
    showEditDocumentModal.value = true
    showViewDocumentModal.value = false
}

function handleSort(column) {
  if (sortBy.value === column) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = column
    sortDirection.value = 'asc'
  }
}

</script>