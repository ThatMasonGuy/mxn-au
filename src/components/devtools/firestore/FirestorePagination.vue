<template>
    <div v-if="totalPages > 1"
        class="flex items-center justify-between bg-gray-900/80 px-4 py-3 rounded-b-2xl border-t">
        <div class="text-sm text-gray-400">
            Showing
            <span class="font-semibold text-indigo-400">{{ paginationStart }}</span>
            to
            <span class="font-semibold text-indigo-400">{{ paginationEnd }}</span>
            of
            <span class="font-semibold text-indigo-400">{{ filteredDataLength }}</span>
            results
        </div>

        <div class="flex items-center gap-2">
            <!-- Previous -->
            <button @click="prevPage" :disabled="currentPage <= 1"
                class="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition">
                Previous
            </button>

            <!-- Pages -->
            <div class="flex items-center gap-1">
                <button v-for="page in displayedPages" :key="page" @click="goToPage(page)" :class="[
                    'px-3 py-2 rounded-md text-sm font-medium',
                    page === currentPage
                        ? 'bg-indigo-600 text-white'
                        : 'text-gray-300 hover:bg-gray-800'
                ]">
                    {{ page }}
                </button>
            </div>

            <!-- Next -->
            <button @click="nextPage" :disabled="currentPage >= totalPages"
                class="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition">
                Next
            </button>
        </div>
    </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
    currentPage: Number,
    totalPages: Number,
    paginationStart: Number,
    paginationEnd: Number,
    filteredDataLength: Number,
    displayedPages: Array,
    goToPage: Function,
    nextPage: Function,
    prevPage: Function,
})
</script>