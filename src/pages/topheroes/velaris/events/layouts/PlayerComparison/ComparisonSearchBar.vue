<!-- @/pages/topheroes/velaris/events/layouts/PlayerComparison/ComparisonSearchBar.vue -->
<template>
    <div class="relative w-full md:max-w-sm">
        <input v-model="searchTerm" @input="eventStore.comparisonSearchTerm = searchTerm" @keydown="onKeydown"
            type="text" placeholder="Search players to compare..."
            class="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />

        <ul v-if="eventStore.filteredComparisonSearchResults.length"
            class="absolute z-10 bg-white border border-gray-200 w-full rounded-md mt-1 shadow-lg max-h-48 overflow-y-auto">
            <li v-for="(player, idx) in eventStore.filteredComparisonSearchResults" :key="player.Player"
                @click="eventStore.addPlayerToComparisonFromSearch(player)"
                class="px-4 py-2 cursor-pointer hover:bg-indigo-50 text-sm"
                :class="{ 'bg-indigo-100 text-indigo-700': idx === selectedIndex }">
                {{ player.Player }}
            </li>
        </ul>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useEventDataStore } from '@/stores/useEventDataStore'

const eventStore = useEventDataStore()

const searchTerm = ref('')
const selectedIndex = ref(0)

// Watch search term and reset selection if you type
watch(searchTerm, () => {
    selectedIndex.value = 0
})

// Handle key presses
function onKeydown(event) {
    const results = eventStore.filteredComparisonSearchResults

    if (event.key === 'ArrowDown') {
        event.preventDefault()
        selectedIndex.value = (selectedIndex.value + 1) % results.length
    }
    else if (event.key === 'ArrowUp') {
        event.preventDefault()
        selectedIndex.value = (selectedIndex.value - 1 + results.length) % results.length
    }
    else if (event.key === 'Tab' || event.key === 'Enter') {
        event.preventDefault()
        if (selectedIndex.value >= 0 && selectedIndex.value < results.length) {
            eventStore.addPlayerToComparisonFromSearch(results[selectedIndex.value])
            searchTerm.value = ''
            selectedIndex.value = 0
        }
    }
}
</script>
