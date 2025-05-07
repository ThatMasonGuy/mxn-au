<!-- @/pages/topheroes/velaris/events/layouts/PlayerComparison/SelectedPlayersBadges.vue -->
<template>
    <div class="flex flex-wrap gap-2">
        <span v-for="player in eventStore.selectedComparisonPlayers" :key="player.Player"
            class="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium flex items-center gap-1">
            {{ player.Player }}
            <button @click="eventStore.togglePlayerForComparison(player)"
                class="text-indigo-600 hover:text-indigo-900 ml-1">&times;</button>
        </span>
    </div>
</template>

<script setup>
import { useEventDataStore } from '@/stores/useEventDataStore'

const eventStore = useEventDataStore()

defineEmits(['remove'])
</script>