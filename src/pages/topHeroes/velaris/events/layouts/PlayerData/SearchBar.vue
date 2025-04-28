<template>
    <div class="relative flex-grow">
        <input :value="searchTerm" @input="$emit('update:searchTerm', $event.target.value)"
            placeholder="Search players..."
            class="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 pr-10" />
        <span class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
            <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clip-rule="evenodd"></path>
            </svg>
        </span>
    </div>
</template>

<script setup>
const props = defineProps({
    searchTerm: String
})

const emit = defineEmits(['update:searchTerm'])
</script>