<!-- @/pages/topHeroes/velaris/events/layouts/PlayerComparison/ComparisonCardsGrid.vue -->
<template>
    <TransitionGroup name="fade" tag="div" class="grid gap-6 mt-8 md:grid-cols-2">
      <ComparisonPlayerCard
        v-for="player in eventStore.selectedComparisonPlayers"
        :key="player.Player"
        :player="player"
        :fields="eventStore.comparisonFields"
        :color="eventStore.playerColorMap[player.Player]"
        @hover="eventStore.highlightSeries"
        @leave="eventStore.downplaySeries"
      />
    </TransitionGroup>
  </template>

<script setup>
import { useEventDataStore } from '@/stores/useEventDataStore'
import ComparisonPlayerCard from './ComparisonPlayerCard.vue'

const eventStore = useEventDataStore()

defineEmits(['hover', 'leave'])
</script>