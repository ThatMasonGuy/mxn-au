<!-- ComparisonChartContainer.vue -->
<template>
    <div class="chart-container mb-8">
        <v-chart :option="option" autoresize id="playerComparisonDailyChart" />
    </div>
</template>

<script setup>
const props = defineProps({
    option: { type: Object, required: true }
})
</script>