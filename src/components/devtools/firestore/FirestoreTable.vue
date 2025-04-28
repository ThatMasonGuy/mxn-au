<template>
    <div class="bg-gray-900/80 shadow-md overflow-hidden">
        <div v-if="!selectedCollection" class="p-12 text-center text-gray-400">
            <div class="flex flex-col items-center gap-4">
                <svg class="h-16 w-16 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <h3 class="text-lg font-medium">No Collection Selected</h3>
                <p class="text-sm text-gray-500">Choose a collection to view documents</p>
            </div>
        </div>

        <div v-else-if="loading" class="p-12 text-center">
            <svg class="animate-spin h-12 w-12 text-indigo-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
            </svg>
            <p class="mt-4 text-gray-400 text-sm">Loading documents...</p>
        </div>

        <div v-else-if="filteredData.length === 0" class="p-12 text-center">
            <div class="flex flex-col items-center gap-4">
                <svg class="h-16 w-16 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                </svg>
                <h3 class="text-lg font-medium">No Documents Found</h3>
                <p class="text-sm text-gray-500">Start by creating a new document.</p>
            </div>
        </div>

        <div v-else>
            <Table>
                <TableHeader>
                    <TableRow class="bg-gray-900/100 hover:bg-gray-900/80">
                        <!-- Sortable: Document ID -->
                        <TableHead class="px-6 py-4 text-gray-400 font-semibold">
                            <button @click="$emit('sort', 'id')"
                                class="flex min-w-14 items-center gap-1 text-left w-full hover:text-indigo-400 transition">
                                Doc ID
                                <ChevronDownIcon v-if="sortBy === 'id' && sortDirection === 'asc'" class="h-4 w-4" />
                                <ChevronUpIcon v-if="sortBy === 'id' && sortDirection === 'desc'" class="h-4 w-4" />
                            </button>
                        </TableHead>

                        <!-- Normal: Preview -->
                        <TableHead class="px-6 py-4 text-gray-400 font-semibold">Preview</TableHead>

                        <!-- Sortable: Last Modified -->
                        <TableHead class="px-6 py-4 min-w-36 text-gray-400 font-semibold">
                            <button @click="$emit('sort', 'updatedAt')"
                                class="flex items-center gap-1 text-left w-full hover:text-indigo-400 transition">
                                Last Modified
                                <ChevronDownIcon v-if="sortBy === 'updatedAt' && sortDirection === 'asc'"
                                    class="h-4 w-4" />
                                <ChevronUpIcon v-if="sortBy === 'updatedAt' && sortDirection === 'desc'"
                                    class="h-4 w-4" />
                            </button>
                        </TableHead>

                        <TableHead class="text-right px-6 py-4 text-gray-400 font-semibold">Actions</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    <TableRow v-for="doc in filteredData" :key="doc.id" class="hover:bg-gray-800 transition">
                        <TableCell class="font-mono pl-6 text-indigo-300">{{ doc.id }}</TableCell>
                        <TableCell class="text-gray-400 truncate max-w-xs">{{ formatPreview(doc.data) }}</TableCell>
                        <TableCell class="text-gray-400">{{ formatDate(doc.data.updatedAt || doc.data.createdAt) }}
                        </TableCell>
                        <TableCell class="text-right">
                            <div class="flex justify-end gap-0">
                                <!-- View -->
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger as-child>
                                            <button @click="viewDocument(doc)"
                                                class="p-2 rounded-full hover:bg-gray-800 transition">
                                                <EyeIcon class="h-5 w-5 text-indigo-400 hover:text-indigo-300" />
                                            </button>
                                        </TooltipTrigger>
                                        <TooltipContent side="top">View Document</TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>

                                <!-- Edit -->
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger as-child>
                                            <button @click="editDocument(doc)"
                                                class="p-2 rounded-full hover:bg-gray-800 transition">
                                                <PencilIcon class="h-5 w-5 text-blue-400 hover:text-blue-300" />
                                            </button>
                                        </TooltipTrigger>
                                        <TooltipContent side="top">Edit Document</TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>

                                <!-- Delete -->
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger as-child>
                                            <button @click="confirmDeleteDocument(doc)"
                                                class="p-2 rounded-full hover:bg-gray-800 transition">
                                                <TrashIcon class="h-5 w-5 text-red-400 hover:text-red-300" />
                                            </button>
                                        </TooltipTrigger>
                                        <TooltipContent side="top">Delete Document</TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    </div>
</template>

<script setup>
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { EyeIcon, PencilIcon, TrashIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/vue/24/solid'
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
    selectedCollection: String,
    loading: Boolean,
    filteredData: Array,
    viewDocument: Function,
    editDocument: Function,
    confirmDeleteDocument: Function,
    formatPreview: Function,
    formatDate: Function,
    sortBy: String,
    sortDirection: String,
})

const emit = defineEmits(['sort'])
</script>