<!-- @/components/server/widgets/LogsWidget.vue -->
<template>
    <BaseWidget :widget-id="widgetId" :title="widgetTitle" :icon="ClipboardIcon" :icon-color="widgetIconColor"
        @remove="$emit('remove', widgetId)">
        <div class="space-y-2 overflow-y-auto max-h-full">
            <div v-for="(log, index) in logs" :key="index" class="p-2 text-sm rounded bg-gray-900 border-l-2"
                :class="logTypeColor(log.type)">
                <div class="flex justify-between">
                    <span>{{ log.message }}</span>
                    <span class="text-gray-500 text-xs">{{ log.time }}</span>
                </div>
            </div>
        </div>
    </BaseWidget>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { ClipboardIcon } from '@heroicons/vue/24/solid'
import BaseWidget from './BaseWidget.vue'

const props = defineProps({
    widgetId: {
        type: String,
        required: true,
    },
})

defineEmits(['remove'])

const store = useStore()

const widgetTitle = computed(() => {
    return store.getters['server/getComponentById'](props.widgetId)?.title || 'Recent Logs'
})

const widgetIconColor = computed(() => {
    return store.getters['server/getComponentById'](props.widgetId)?.iconColor || 'text-blue-400'
})

const logs = computed(() => store.state.server.logs)

function logTypeColor(type) {
    switch (type) {
        case 'error':
            return 'border-red-500'
        case 'warning':
            return 'border-yellow-500'
        case 'info':
            return 'border-blue-500'
        default:
            return 'border-gray-500'
    }
}
</script>