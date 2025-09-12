<!-- @/pages/topheroes/velaris/events/layouts/PlayerComparison/SelectedPlayersBadges.vue -->
<template>
    <div class="flex flex-wrap gap-2">
        <span v-for="player in eventStore.selectedComparisonPlayers" :key="player.Player"
            class="px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 border"
            :style="badgeStyle(player.Player)">
            {{ player.Player }}
            <button @click="eventStore.togglePlayerForComparison(player)" class="ml-1 hover:opacity-80"
                :style="{ color: eventStore.playerColorMap[player.Player] || 'hsl(var(--accent))' }">
                &times;
            </button>
        </span>
    </div>
</template>

<script setup>
import { useEventDataStore } from '@/stores/useEventDataStore'

const eventStore = useEventDataStore()

const badgeStyle = (name) => {
    const c = eventStore.playerColorMap[name] || 'hsl(var(--accent))'
    return {
        borderColor: c,
        color: 'hsl(var(--foreground))',
        background: `color-mix(in srgb, hsl(var(--card)) 88%, ${c} 12%)`,
    }
}
</script>