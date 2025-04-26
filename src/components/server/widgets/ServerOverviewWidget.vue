<!-- @/components/server/widgets/ServerOverviewWidget.vue -->
<template>
    <BaseWidget :widget-id="widgetId" :title="widgetTitle" :icon="ServerIcon" :icon-color="widgetIconColor"
        :can-remove="widgetId !== 'overview'" @remove="$emit('remove', widgetId)">
        <div class="grid grid-cols-3 gap-4">
            <div v-for="(server, index) in servers" :key="index" class="bg-gray-700 p-3 rounded-lg">
                <div class="flex justify-between items-center">
                    <span>{{ server.name }}</span>
                    <span class="h-2 w-2 rounded-full" :class="statusColor(server.status)"></span>
                </div>
                <div class="mt-2 text-xs text-gray-400">{{ server.ip }}</div>
                <div class="mt-2 text-sm">{{ server.location }}</div>
            </div>
        </div>
    </BaseWidget>
</template>

<script setup>
import { computed } from 'vue'
import { useServerStore } from '@/stores/useServerStore'
import { ServerIcon } from '@heroicons/vue/24/solid'
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
    return serverStore.getComponentById(props.widgetId)?.title || 'Server Overview'
})

const widgetIconColor = computed(() => {
    return serverStore.getComponentById(props.widgetId)?.iconColor || 'text-blue-400'
})

const servers = computed(() => serverStore.servers)

function statusColor(status) {
    switch (status) {
        case 'online':
            return 'bg-green-500'
        case 'offline':
            return 'bg-red-500'
        case 'warning':
            return 'bg-yellow-500'
        default:
            return 'bg-gray-500'
    }
}
</script>