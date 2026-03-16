<template>
    <div class="min-h-screen bg-gray-100 text-gray-900">
        <!-- Header -->
        <header class="bg-indigo-600 shadow-lg">
            <div class="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
                <div class="flex items-center space-x-3">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-9 w-9 text-amber-400" viewBox="0 0 24 24"
                        fill="currentColor">
                        <path
                            d="M3.89 15.673L6.255.461A.542.542 0 0 1 7.27.289L9.813 5.06 3.89 15.673zm16.795 3.691L18.433 5.365a.543.543 0 0 0-.918-.295l-14.2 14.294 7.857 4.428a1.62 1.62 0 0 0 1.587 0l7.926-4.428zM14.3 7.148l-1.82-3.482a.542.542 0 0 0-.96 0L3.53 17.984 14.3 7.148z" />
                    </svg>
                    <h1 class="text-2xl font-semibold text-white">Firebase Admin</h1>
                </div>
                <div class="text-sm text-white opacity-80">
                    <span>{{ currentUser?.email || 'Admin' }}</span>
                </div>
            </div>
        </header>

        <!-- Main Content -->
        <main class="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">

                <!-- Sidebar -->
                <div class="lg:col-span-3">
                    <div class="bg-white rounded-lg shadow-md overflow-hidden">
                        <!-- Collection Selector -->
                        <div class="bg-gray-50 px-4 py-3 border-b border-gray-200">
                            <h2 class="text-lg font-medium text-gray-800">Collections</h2>
                        </div>
                        <div class="p-3">
                            <div class="relative">
                                <input type="text" v-model="collectionSearch" placeholder="Search collections..."
                                    class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20" fill="currentColor">
                                        <path fill-rule="evenodd"
                                            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                            clip-rule="evenodd" />
                                    </svg>
                                </div>
                            </div>

                            <div class="mt-4 space-y-1">
                                <button v-for="collection in filteredCollections" :key="collection.id"
                                    @click="selectCollection(collection.id)"
                                    class="w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors"
                                    :class="selectedCollection === collection.id ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'">
                                    {{ collection.id }}
                                    <span class="ml-1 text-xs text-gray-500">({{ collection.count }})</span>
                                </button>
                            </div>

                            <button @click="showNewCollectionModal = true"
                                class="mt-4 w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                <svg class="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                                    fill="currentColor">
                                    <path fill-rule="evenodd"
                                        d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                                        clip-rule="evenodd" />
                                </svg>
                                New Collection
                            </button>
                        </div>
                    </div>

                    <!-- Connection Status -->
                    <div class="mt-6 bg-white rounded-lg shadow-md overflow-hidden">
                        <div class="bg-gray-50 px-4 py-3 border-b border-gray-200">
                            <h2 class="text-lg font-medium text-gray-800">Connection</h2>
                        </div>
                        <div class="p-4">
                            <div class="flex items-center">
                                <div class="flex-shrink-0">
                                    <div class="h-4 w-4 rounded-full"
                                        :class="isConnected ? 'bg-green-500' : 'bg-red-500'"></div>
                                </div>
                                <div class="ml-3">
                                    <h3 class="text-sm font-medium text-gray-900">{{ isConnected ? 'Connected' :
                                        'Disconnected' }}</h3>
                                    <div class="text-xs text-gray-500">
                                        {{ connectionDetails }}
                                    </div>
                                </div>
                            </div>
                            <div class="mt-4">
                                <button
                                    class="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    @click="reconnect">
                                    Reconnect
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Main Content Area -->
                <div class="lg:col-span-9 space-y-6">
                    <!-- Actions Bar -->
                    <div class="bg-white rounded-lg shadow-md p-4">
                        <div class="sm:flex sm:items-center sm:justify-between">
                            <div>
                                <h3 class="text-lg font-medium text-gray-900">{{ selectedCollection || 'Select a Collection' }}</h3>
                                <p class="mt-1 text-sm text-gray-500"> {{ selectedCollection ? `${data.length} documents found` : 'Choose a collection from the sidebar to start' }}
                                </p>
                            </div>
                            <div class="mt-4 sm:mt-0 flex items-center space-x-3">
                                <button @click="refreshData"
                                    class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                    <svg class="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                                        fill="currentColor">
                                        <path fill-rule="evenodd"
                                            d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                                            clip-rule="evenodd" />
                                    </svg>
                                    Refresh
                                </button>
                                <button @click="showAddDocumentModal = true" :disabled="!selectedCollection"
                                    class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed">
                                    <svg class="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                                        fill="currentColor">
                                        <path fill-rule="evenodd"
                                            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                                            clip-rule="evenodd" />
                                    </svg>
                                    Add Document
                                </button>
                            </div>
                        </div>

                        <!-- Filters & Search -->
                        <div class="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div class="relative rounded-md">
                                <input type="text" v-model="searchTerm" placeholder="Search documents..."
                                    class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20" fill="currentColor">
                                        <path fill-rule="evenodd"
                                            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                            clip-rule="evenodd" />
                                    </svg>
                                </div>
                            </div>

                            <div>
                                <select v-model="sortBy"
                                    class="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md text-sm">
                                    <option value="">Sort by...</option>
                                    <option value="id">Document ID</option>
                                    <option value="createdAt">Created At</option>
                                    <option value="updatedAt">Updated At</option>
                                </select>
                            </div>

                            <div>
                                <select v-model="sortDirection"
                                    class="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md text-sm">
                                    <option value="asc">Ascending</option>
                                    <option value="desc">Descending</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <!-- Data Table -->
                    <div class="bg-white rounded-lg shadow-md overflow-hidden">
                        <div v-if="!selectedCollection" class="p-12 text-center">
                            <svg class="h-16 w-16 text-gray-300 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                            <h3 class="mt-4 text-lg font-medium text-gray-900">No Collection Selected</h3>
                            <p class="mt-1 text-sm text-gray-500">
                                Choose a collection from the sidebar to view its documents
                            </p>
                        </div>

                        <div v-else-if="loading" class="p-12 text-center">
                            <svg class="animate-spin h-12 w-12 text-indigo-600 mx-auto"
                                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                    stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                </path>
                            </svg>
                            <p class="mt-4 text-lg font-medium text-gray-900">Loading...</p>
                        </div>

                        <div v-else-if="data.length === 0" class="p-12 text-center">
                            <svg class="h-16 w-16 text-gray-300 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                            </svg>
                            <h3 class="mt-4 text-lg font-medium text-gray-900">No Documents Found</h3>
                            <p class="mt-1 text-sm text-gray-500">
                                Get started by creating a new document
                            </p>
                            <button @click="showAddDocumentModal = true"
                                class="mt-6 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                <svg class="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                                    fill="currentColor">
                                    <path fill-rule="evenodd"
                                        d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                                        clip-rule="evenodd" />
                                </svg>
                                Add Document
                            </button>
                        </div>

                        <div v-else>
                            <div class="overflow-x-auto">
                                <table class="min-w-full divide-y divide-gray-200">
                                    <thead class="bg-gray-50">
                                        <tr>
                                            <th scope="col"
                                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Document ID
                                            </th>
                                            <th scope="col"
                                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Preview
                                            </th>
                                            <th scope="col"
                                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Last Modified
                                            </th>
                                            <th scope="col"
                                                class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody class="bg-white divide-y divide-gray-200">
                                        <tr v-for="item in filteredData" :key="item.id" class="hover:bg-gray-50">
                                            <td class="px-6 py-4 whitespace-nowrap">
                                                <div class="text-sm font-medium text-gray-900">{{ item.id }}</div>
                                            </td>
                                            <td class="px-6 py-4">
                                                <div class="text-sm text-gray-500 truncate max-w-xs">
                                                    {{ formatPreview(item.data) }}
                                                </div>
                                            </td>
                                            <td class="px-6 py-4 whitespace-nowrap">
                                                <div class="text-sm text-gray-500">
                                                    {{ formatDate(item.data.updatedAt || item.data.createdAt) }}
                                                </div>
                                            </td>
                                            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div class="flex justify-end space-x-2">
                                                    <button @click="viewDocument(item)"
                                                        class="text-indigo-600 hover:text-indigo-900">
                                                        <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 20 20" fill="currentColor">
                                                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                                            <path fill-rule="evenodd"
                                                                d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                                                clip-rule="evenodd" />
                                                        </svg>
                                                    </button>
                                                    <button @click="editDocument(item)"
                                                        class="text-blue-600 hover:text-blue-900">
                                                        <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 20 20" fill="currentColor">
                                                            <path
                                                                d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                        </svg>
                                                    </button>
                                                    <button @click="confirmDeleteDocument(item)"
                                                        class="text-red-600 hover:text-red-900">
                                                        <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 20 20" fill="currentColor">
                                                            <path fill-rule="evenodd"
                                                                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                                                clip-rule="evenodd" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <!-- Pagination -->
                            <div
                                class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                                <div class="flex-1 flex justify-between sm:hidden">
                                    <button @click="currentPage > 1 ? currentPage-- : null"
                                        :disabled="currentPage === 1"
                                        class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                                        Previous
                                    </button>
                                    <button @click="currentPage < totalPages ? currentPage++ : null"
                                        :disabled="currentPage >= totalPages"
                                        class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                                        Next
                                    </button>
                                </div>
                                <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                    <div>
                                        <p class="text-sm text-gray-700">
                                            Showing
                                            <span class="font-medium">{{ paginationStart }}</span>
                                            to
                                            <span class="font-medium">{{ paginationEnd }}</span>
                                            of
                                            <span class="font-medium">{{ filteredData.length }}</span>
                                            results
                                        </p>
                                    </div>
                                    <div>
                                        <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                                            aria-label="Pagination">
                                            <button @click="currentPage > 1 ? currentPage-- : null"
                                                :disabled="currentPage === 1"
                                                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                                                <span class="sr-only">Previous</span>
                                                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                    <path fill-rule="evenodd"
                                                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                                        clip-rule="evenodd" />
                                                </svg>
                                            </button>

                                            <button v-for="page in displayedPages" :key="page"
                                                @click="currentPage = page" :class="[
                                                    currentPage === page
                                                        ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                                                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50',
                                                    'relative inline-flex items-center px-4 py-2 border text-sm font-medium'
                                                ]">
                                                {{ page }}
                                            </button>

                                            <button @click="currentPage < totalPages ? currentPage++ : null"
                                                :disabled="currentPage >= totalPages"
                                                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                                                <span class="sr-only">Next</span>
                                                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                    <path fill-rule="evenodd"
                                                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                                        clip-rule="evenodd" />
                                                </svg>
                                            </button>
                                        </nav>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>

    <!-- Add/Edit Document Modal -->
    <div v-if="showAddDocumentModal || showEditDocumentModal" class="fixed z-10 inset-0 overflow-y-auto"
        aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"
                @click="closeModals"></div>

            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div
                class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div>
                        <div class="mt-3 text-center sm:mt-0 sm:text-left">
                            <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                {{ showEditDocumentModal ? 'Edit Document' : 'Add New Document' }}
                            </h3>
                            <div class="mt-4">
                                <div v-if="!showEditDocumentModal" class="mb-4">
                                    <label for="documentId" class="block text-sm font-medium text-gray-700">Document ID
                                        (optional)</label>
                                    <input type="text" id="documentId" v-model="newDocumentId"
                                        placeholder="Leave empty for auto-generated ID"
                                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                </div>

                                <label for="documentData" class="block text-sm font-medium text-gray-700">Document Data
                                    (JSON)</label>
                                <div class="mt-1">
                                    <textarea id="documentData" rows="10" v-model="documentJsonData"
                                        class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md p-2 font-mono"
                                        :class="{ 'border-red-500': jsonError }"
                                        placeholder='{"key": "value"}'></textarea>
                                    <p v-if="jsonError" class="mt-2 text-sm text-red-600">{{ jsonError }}</p>
                                </div>

                                <div class="mt-4 flex justify-end">
                                    <button @click="formatJson" type="button"
                                        class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                        Format JSON
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button type="button"
                        class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                        @click="saveDocument">
                        Save
                    </button>
                    <button type="button"
                        class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                        @click="closeModals">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- View Document Modal -->
    <div v-if="showViewDocumentModal" class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title"
        role="dialog" aria-modal="true">
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"
                @click="closeModals"></div>

            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div
                class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
                <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div>
                        <div class="mt-3 text-center sm:mt-0 sm:text-left">
                            <div class="flex justify-between items-center">
                                <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                    Document Details
                                </h3>
                                <div class="ml-3 flex">
                                    <button type="button" @click="copyDocumentPath"
                                        class="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                                        <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                                            fill="currentColor">
                                            <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                                            <path
                                                d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <div class="mt-4 bg-gray-50 p-3 rounded-md">
                                <div class="text-sm font-medium text-gray-500">Document Path</div>
                                <div class="mt-1 text-sm font-mono text-gray-900">{{ documentPath }}</div>
                            </div>

                            <div class="mt-4">
                                <div class="flex justify-between items-center">
                                    <div class="text-sm font-medium text-gray-500">Document JSON</div>
                                </div>
                                <pre
                                    class="mt-1 bg-gray-50 p-3 rounded-md overflow-auto max-h-96 text-sm font-mono">{{ formattedViewJson }}</pre>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button type="button"
                        class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                        @click="editDocument(selectedDocument)">
                        Edit
                    </button>
                    <button type="button"
                        class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                        @click="closeModals">
                        Close
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteConfirmationModal" class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title"
        role="dialog" aria-modal="true">
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"
                @click="closeModals"></div>

            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div
                class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div class="sm:flex sm:items-start">
                        <div
                            class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                            <svg class="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                            <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                Delete Document
                            </h3>
                            <div class="mt-2">
                                <p class="text-sm text-gray-500">
                                    Are you sure you want to delete this document? This action cannot be undone.
                                </p>
                                <div class="mt-3 bg-gray-50 p-2 rounded-md">
                                    <p class="text-xs font-mono text-gray-600">{{ documentPath }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button type="button"
                        class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                        @click="deleteDocument">
                        Delete
                    </button>
                    <button type="button"
                        class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                        @click="closeModals">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- New Collection Modal -->
    <div v-if="showNewCollectionModal" class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title"
        role="dialog" aria-modal="true">
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"
                @click="closeModals"></div>

            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div
                class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div>
                        <div class="mt-3 text-center sm:mt-0 sm:text-left">
                            <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                Create New Collection
                            </h3>
                            <div class="mt-4">
                                <label for="newCollectionId" class="block text-sm font-medium text-gray-700">Collection
                                    ID</label>
                                <input type="text" id="newCollectionId" v-model="newCollectionId"
                                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    placeholder="e.g. users, products, settings">
                                <p v-if="newCollectionIdError" class="mt-2 text-sm text-red-600">{{ newCollectionIdError
                                    }}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button type="button"
                        class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                        @click="createNewCollection">
                        Create
                    </button>
                    <button type="button"
                        class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                        @click="closeModals">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Toast Notification -->
    <div v-if="showToast" class="fixed bottom-4 right-4 px-4 py-3 rounded-md shadow-lg transition-all duration-300"
        :class="{
            'bg-green-500': toastType === 'success',
            'bg-red-500': toastType === 'error',
            'bg-blue-500': toastType === 'info'
        }">
        <div class="flex items-center">
            <div class="flex-shrink-0">
                <svg v-if="toastType === 'success'" class="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clip-rule="evenodd" />
                </svg>
                <svg v-if="toastType === 'error'" class="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clip-rule="evenodd" />
                </svg>
                <svg v-if="toastType === 'info'" class="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z"
                        clip-rule="evenodd" />
                </svg>
            </div>
            <div class="ml-3">
                <p class="text-sm text-white">{{ toastMessage }}</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'

// 🔥 Authentication
const currentUser = ref(null)

// 🔥 Connection state
const isConnected = ref(true)
const connectionDetails = ref('Connected to Firebase')

// 🔥 Collections data
const collections = ref([
    { id: 'users', count: 25 },
    { id: 'products', count: 103 },
    { id: 'orders', count: 412 },
    { id: 'settings', count: 7 },
    { id: 'logs', count: 1500 }
])
const collectionSearch = ref('')
const selectedCollection = ref('')

// 🔥 Document data
const data = ref([])
const loading = ref(false)

// 🔥 Search and filters
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

// 🔥 Document editing
const selectedDocument = ref(null)
const newDocumentId = ref('')
const documentJsonData = ref('{}')
const jsonError = ref('')
const newCollectionId = ref('')
const newCollectionIdError = ref('')

// 🔥 Toast
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref('success')

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
            let valA, valB
            if (sortBy.value === 'id') {
                valA = a.id
                valB = b.id
            } else {
                valA = a.data[sortBy.value] || ''
                valB = b.data[sortBy.value] || ''
            }

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
        for (let i = 1; i <= totalPages.value; i++) {
            pages.push(i)
        }
    } else {
        let startPage = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
        let endPage = startPage + maxVisible - 1

        if (endPage > totalPages.value) {
            endPage = totalPages.value
            startPage = Math.max(1, endPage - maxVisible + 1)
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i)
        }
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
    } catch (e) {
        return '{}'
    }
})

// 🔥 Methods

function selectCollection(collectionId) {
    selectedCollection.value = collectionId
    currentPage.value = 1
    loadData()
}

function loadData() {
    if (!selectedCollection.value) return

    loading.value = true

    setTimeout(() => {
        const mockData = []
        const count = Math.floor(Math.random() * 50) + 10

        for (let i = 0; i < count; i++) {
            const now = new Date()
            const created = new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000)
            const updated = Math.random() > 0.5
                ? new Date(created.getTime() + Math.random() * 10 * 24 * 60 * 60 * 1000)
                : null

            let mockItem = {
                id: `doc-${i + 1}-${Math.random().toString(36).substring(2, 8)}`,
                data: {
                    createdAt: created.toISOString(),
                    updatedAt: updated ? updated.toISOString() : null
                }
            }

            if (selectedCollection.value === 'users') {
                mockItem.data = {
                    ...mockItem.data,
                    name: `User ${i + 1}`,
                    email: `user${i + 1}@example.com`,
                    role: Math.random() > 0.8 ? 'admin' : 'user',
                    active: Math.random() > 0.2
                }
            } else if (selectedCollection.value === 'products') {
                mockItem.data = {
                    ...mockItem.data,
                    name: `Product ${i + 1}`,
                    price: Math.floor(Math.random() * 10000) / 100,
                    stock: Math.floor(Math.random() * 100),
                    categories: ['category-1', 'category-2']
                }
            } else if (selectedCollection.value === 'orders') {
                mockItem.data = {
                    ...mockItem.data,
                    userId: `user-${Math.floor(Math.random() * 50) + 1}`,
                    total: Math.floor(Math.random() * 50000) / 100,
                    status: ['pending', 'processing', 'shipped', 'delivered'][Math.floor(Math.random() * 4)],
                    items: [
                        { productId: `prod-${Math.floor(Math.random() * 100) + 1}`, quantity: Math.floor(Math.random() * 5) + 1 }
                    ]
                }
            } else {
                mockItem.data = {
                    ...mockItem.data,
                    value: Math.random().toString(36).substring(2, 10),
                    active: Math.random() > 0.3,
                    count: Math.floor(Math.random() * 100)
                }
            }

            mockData.push(mockItem)
        }

        data.value = mockData
        loading.value = false
    }, 500)
}

function refreshData() {
    loadData()
    triggerToast('Data refreshed successfully', 'success')
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
    triggerToast(`Document ${selectedDocument.value.id} deleted successfully`, 'success')
    closeModals()
}

function saveDocument() {
    try {
        const parsedData = JSON.parse(documentJsonData.value)

        if (showEditDocumentModal.value) {
            const index = data.value.findIndex(item => item.id === selectedDocument.value.id)
            if (index >= 0) {
                data.value[index].data = {
                    ...parsedData,
                    updatedAt: new Date().toISOString()
                }
                triggerToast(`Document ${selectedDocument.value.id} updated successfully`, 'success')
            }
        } else {
            const id = newDocumentId.value || `doc-${Math.floor(Math.random() * 1000)}-${Math.random().toString(36).substring(2, 8)}`
            data.value.push({
                id,
                data: {
                    ...parsedData,
                    createdAt: new Date().toISOString()
                }
            })
            triggerToast(`Document ${id} created successfully`, 'success')
        }

        closeModals()
    } catch (e) {
        jsonError.value = `Invalid JSON: ${e.message}`
    }
}

function formatJson() {
    try {
        const parsedData = JSON.parse(documentJsonData.value)
        documentJsonData.value = JSON.stringify(parsedData, null, 2)
        jsonError.value = ''
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
    triggerToast(`Collection '${newCollectionId.value}' created successfully`, 'success')
    closeModals()
}

function copyDocumentPath() {
    navigator.clipboard.writeText(documentPath.value).then(() => {
        triggerToast('Document path copied to clipboard', 'info')
    })
}

function reconnect() {
    isConnected.value = false
    connectionDetails.value = 'Reconnecting...'

    setTimeout(() => {
        isConnected.value = true
        connectionDetails.value = 'Connected to Firebase'
        triggerToast('Successfully reconnected to Firebase', 'success')
    }, 1500)
}

function triggerToast(message, type = 'success') {
    toastMessage.value = message
    toastType.value = type
    showToast.value = true

    setTimeout(() => {
        showToast.value = false
    }, 3000)
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

function formatPreview(data) {
    const str = JSON.stringify(data)
    return str.length > 60 ? str.substring(0, 60) + '...' : str
}

function formatDate(dateString) {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleString()
}

// 🔥 Watchers
watch([searchTerm, sortBy, sortDirection], () => {
    currentPage.value = 1
})

// 🔥 Mounted
onMounted(() => {
    currentUser.value = {
        email: 'admin@example.com',
        role: 'admin'
    }

    selectCollection('users')
})
</script>
