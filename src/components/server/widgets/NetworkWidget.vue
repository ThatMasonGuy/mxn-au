<!-- @/components/server/widgets/NetworkWidget.vue -->
<template>
    <BaseWidget :widget-id="widgetId" :title="widgetTitle" :icon="ServerIcon" :icon-color="widgetIconColor"
        @remove="$emit('remove', widgetId)">
        <div class="space-y-2 h-full overflow-y-auto">
            <div v-for="(connection, index) in connections" :key="index"
                class="bg-gray-700 p-2 rounded flex items-center justify-between">
                <div class="flex items-center">
                    <ArrowPathIcon class="h-4 w-4 mr-2 text-green-400" />
                    <span>{{ connection.source }} → {{ connection.target }}</span>
                </div>
                <div class="flex items-center">
                    <span class="text-xs text-gray-400 mr-2">{{ connection.protocol }}</span>
                    <span class="text-xs text-green-400">{{ connection.status }}</span>
                </div>
            </div>
        </div>
    </BaseWidget>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { ServerIcon, ArrowPathIcon } from '@heroicons/vue/24/solid'
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
    return store.getters['server/getComponentById'](props.widgetId)?.title || 'Network'
})

const widgetIconColor = computed(() => {
    return store.getters['server/getComponentById'](props.widgetId)?.iconColor || 'text-purple-400'
})

const connections = computed(() => store.state.server.connections)
</script>