<template>
    <div :style="{ height }" class="relative">
        <template v-if="isReady">
            <v-chart :option="option" autoresize :theme="theme" class="w-full h-full" ref="chartRef" />
        </template>
        <template v-else>
            <WorkbenchChartLoader :error="loadError" />
        </template>
    </div>
</template>

<script setup>
import { ref, watchEffect, watch } from 'vue'
import WorkbenchChartLoader from './WorkbenchChartLoader.vue'

const props = defineProps({
    option: { type: Object, required: true },
    height: { type: String, default: '400px' },
    theme: { type: String, default: 'light' }
})

const isReady = ref(false)
const loadError = ref(false)
const chartRef = ref(null)

watchEffect(() => {
    if (!props.option) {
        isReady.value = false
        loadError.value = true
    } else {
        isReady.value = true
        loadError.value = false
    }
})

// Watch for theme changes and force chart update
watch(() => props.theme, (newTheme) => {
    setTimeout(() => {
        if (chartRef.value && chartRef.value.chart) {
            chartRef.value.chart.setOption(props.option, true)
        }
    }, 50)
})
</script>