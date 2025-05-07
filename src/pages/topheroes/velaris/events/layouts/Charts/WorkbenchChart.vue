<template>
    <div :style="{ height }" class="relative">
        <template v-if="isReady">
            <v-chart :option="styledOption" autoresize :theme="theme" class="w-full h-full" />
        </template>
        <template v-else>
            <WorkbenchChartLoader :error="loadError" />
        </template>
    </div>
</template>

<script setup>
import { ref, watchEffect, computed, watch } from 'vue'
import WorkbenchChartLoader from './WorkbenchChartLoader.vue'
import { useChartTheme } from './useChartTheme.js'

const props = defineProps({
    option: { type: Object, required: true },
    height: { type: String, default: '400px' },
    theme: { type: String, default: 'light' }
})

const isReady = ref(false)
const loadError = ref(false)

watchEffect(() => {
    if (!props.option || !props.option.baseOption) {
        isReady.value = false
        loadError.value = true
    } else {
        isReady.value = true
        loadError.value = false
    }
})

const chartRef = ref(null)

// Watch for theme changes and force update
watch(() => props.theme, (newTheme) => {
    setTimeout(() => {
        if (chartRef.value && chartRef.value.chart) {
            chartRef.value.chart.setOption(styledOption.value, true)
        }
    }, 50)
})

// Inject theme colors
const { applyTheme, roleColorsGradient, roleColorsStatic, playerGradients, dayTasks, comparisonColours } = useChartTheme()
const styledOption = computed(() => applyTheme(props.option, props.theme))
</script>