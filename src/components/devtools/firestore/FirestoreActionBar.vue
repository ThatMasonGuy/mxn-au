<template>
    <div class="bg-gray-900/80 rounded-2xl p-6 border border-gray-800 shadow-sm space-y-6">
        <!-- Title and Actions -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
                <h2 class="text-lg font-semibold text-gray-100">
                    {{ selectedCollection || 'Select a Collection' }}
                </h2>
                <p class="text-sm text-gray-400">
                    {{ selectedCollection ? `${dataLength} documents found` : 'Choose a collection to start.' }}
                </p>
            </div>

            <div class="flex items-center gap-3">
                <!-- Refresh Button -->
                <button @click="$emit('refresh')"
                    class="px-4 py-2 rounded-md bg-gray-800 hover:bg-gray-700 text-sm text-gray-200 flex items-center gap-2">
                    <ArrowPathIcon class="h-4 w-4" />
                    Refresh
                </button>

                <!-- Add Document Button -->
                <button @click="$emit('show-add-modal')" :disabled="!selectedCollection"
                    class="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-500 text-sm text-white flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed">
                    <PlusIcon class="h-4 w-4" />
                    Add Document
                </button>
            </div>
        </div>

        <!-- Filters -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- Search -->
            <div>
                <input type="text" placeholder="Search documents..." :value="searchTerm"
                    @input="$emit('update:search-term', $event.target.value)"
                    class="w-full bg-gray-800 text-gray-200 placeholder-gray-400 border-gray-700 rounded-md px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500" />
            </div>

            <!-- Sort By -->
            <div>
                <select :value="sortBy" @change="$emit('update:sort-by', $event.target.value)"
                    class="w-full bg-gray-800 text-gray-200 border-gray-700 rounded-md px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500">
                    <option value="">Sort by...</option>
                    <option value="id">Document ID</option>
                    <option value="createdAt">Created At</option>
                    <option value="updatedAt">Updated At</option>
                </select>
            </div>

            <!-- Sort Direction -->
            <div>
                <select :value="sortDirection" @change="$emit('update:sort-direction', $event.target.value)"
                    class="w-full bg-gray-800 text-gray-200 border-gray-700 rounded-md px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500">
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                </select>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ArrowPathIcon, PlusIcon } from '@heroicons/vue/24/solid'
import { defineProps } from 'vue'

const props = defineProps({
    selectedCollection: String,
    dataLength: Number,
    searchTerm: String,
    sortBy: String,
    sortDirection: String,
})
</script>