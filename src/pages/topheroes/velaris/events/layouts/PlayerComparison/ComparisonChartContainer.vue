<!-- @/pages/topheroes/velaris/events/layouts/PlayerComparison/ComparisonChartContainer.vue -->
<template>
    <div class="chart-container mb-8">
        <v-chart :option="option" autoresize id="playerComparisonDailyChart" />
    </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
    option: { type: Object, required: true }
})
</script>