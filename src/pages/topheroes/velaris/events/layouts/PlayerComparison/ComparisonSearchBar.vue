<!-- @/pages/topheroes/velaris/events/layouts/PlayerComparison/ComparisonSearchBar.vue -->
<template>
    <div class="relative w-full md:max-w-sm">
        <input v-model="searchTerm" @input="eventStore.comparisonSearchTerm = searchTerm" @keydown="onKeydown"
            type="text" placeholder="Search players to compare..."
            class="w-full px-4 py-2 rounded-md shadow-sm bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:border-[hsl(var(--ring))] focus:ring-[hsl(var(--ring))]" />

        <ul v-if="eventStore.filteredComparisonSearchResults.length"
            class="absolute z-10 w-full mt-1 max-h-48 overflow-y-auto rounded-md border border-border bg-popover text-popover-foreground shadow-lg">
            <li v-for="(player, idx) in eventStore.filteredComparisonSearchResults" :key="player.Player"
                @click="eventStore.addPlayerToComparisonFromSearch(player)"
                class="px-4 py-2 cursor-pointer text-sm hover:bg-muted"
                :class="{ 'bg-accent text-accent-foreground': idx === selectedIndex }">
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

watch(searchTerm, () => { selectedIndex.value = 0 })

function onKeydown(event) {
    const results = eventStore.filteredComparisonSearchResults
    if (event.key === 'ArrowDown') {
        event.preventDefault()
        selectedIndex.value = (selectedIndex.value + 1) % results.length
    } else if (event.key === 'ArrowUp') {
        event.preventDefault()
        selectedIndex.value = (selectedIndex.value - 1 + results.length) % results.length
    } else if (event.key === 'Tab' || event.key === 'Enter') {
        event.preventDefault()
        if (selectedIndex.value >= 0 && selectedIndex.value < results.length) {
            eventStore.addPlayerToComparisonFromSearch(results[selectedIndex.value])
            searchTerm.value = ''
            selectedIndex.value = 0
        }
    }
}
</script>