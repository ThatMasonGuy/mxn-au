<template>
    <WorkbenchCard title="Castle Level vs Avg Score">
        <WorkbenchChart :option="castleOption" :theme="theme" />
    </WorkbenchCard>
</template>

<script setup>
import WorkbenchCard from '@/pages/topheroes/velaris/events/layouts/Cards/WorkbenchCard.vue'
import WorkbenchChart from '@/pages/topheroes/velaris/events/layouts/Charts/WorkbenchChart.vue'

defineProps({
    castleOption: Object,
    theme: { type: String, default: 'light' }
})
</script>