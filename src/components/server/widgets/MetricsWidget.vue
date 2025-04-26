<!-- @/components/server/widgets/MetricsWidget.vue -->
<template>
    <BaseWidget :widget-id="widgetId" :title="widgetTitle" :icon="ChartBarIcon" :icon-color="widgetIconColor"
        @remove="$emit('remove', widgetId)">
        <div class="h-full w-full flex items-end space-x-1">
            <div v-for="(value, index) in cpuData" :key="index" class="bg-blue-400 w-full rounded-t"
                :style="{ height: `${value}%` }"></div>
        </div>
    </BaseWidget>
</template>

<script setup>
import { computed } from 'vue'
import { useServerStore } from '@/stores/useServerStore'
import { ChartBarIcon } from '@heroicons/vue/24/solid'
import BaseWidget from './BaseWidget.vue'

const props = defineProps({
    widgetId: {
        type: String,
        required: true,
    },
})

defineEmits(['remove'])

const serverStore = useServerStore()

const widgetTitle = computed(() => {
    return serverStore.getComponentById(props.widgetId)?.title || 'CPU Usage'
})

const widgetIconColor = computed(() => {
    return serverStore.getComponentById(props.widgetId)?.iconColor || 'text-blue-400'
})

const cpuData = computed(() => serverStore.cpuData)
</script>