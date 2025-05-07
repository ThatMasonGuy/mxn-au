<template>
    <div class="flex flex-col md:flex-row justify-between items-center mt-4 gap-4">
        <div class="text-sm text-gray-500">
            Showing {{ paginatedLength > 0 ? (page - 1) * itemsPerPage + 1 : 0 }}-{{ Math.min(page * itemsPerPage,
            totalItems) }} of {{ totalItems }} players
        </div>

        <div class="flex gap-2 items-center">
            <span class="text-sm text-gray-600 mr-2">Items per page:</span>
            <select :value="itemsPerPage" @change="$emit('changeItemsPerPage', Number($event.target.value))"
                class="px-2 py-1 border rounded-md text-sm bg-white">
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
            </select>
        </div>

        <div class="flex gap-2">
            <button @click="$emit('changePage', Math.max(1, page - 1))" :disabled="page === 1"
                class="px-3 py-1 border rounded-md text-sm"
                :class="page === 1 ? 'cursor-not-allowed text-gray-400 bg-gray-100' : 'hover:bg-gray-50 bg-white'">
                Previous
            </button>

            <div class="flex items-center px-2">
                <span class="text-sm text-gray-600">
                    Page {{ page }} of {{ Math.max(1, Math.ceil(totalItems / itemsPerPage)) }}
                </span>
            </div>

            <button @click="$emit('changePage', Math.min(Math.ceil(totalItems / itemsPerPage), page + 1))"
                :disabled="page === Math.ceil(totalItems / itemsPerPage) || totalItems === 0"
                class="px-3 py-1 border rounded-md text-sm"
                :class="page === Math.ceil(totalItems / itemsPerPage) || totalItems === 0 ? 'cursor-not-allowed text-gray-400 bg-gray-100' : 'hover:bg-gray-50 bg-white'">
                Next
            </button>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    page: Number,
    itemsPerPage: Number,
    totalItems: Number,
    paginatedLength: Number
})

const emit = defineEmits(['changePage', 'changeItemsPerPage'])
</script>