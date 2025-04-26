<template>
    <BaseWidget :widget-id="widgetId" :title="widgetTitle" :icon="CommandLineIcon" :icon-color="widgetIconColor"
        @remove="$emit('remove', widgetId)">
        <div class="bg-black rounded p-2 h-full font-mono text-sm overflow-y-auto">
            <div class="text-green-400">admin@server:~$</div>
            <div class="text-white">
                Welcome to ServerDash Terminal. Type "help" for available commands.
            </div>
            <div class="flex items-center">
                <span class="text-green-400">admin@server:~$</span>
                <span class="ml-1 animate-pulse">|</span>
            </div>
        </div>
    </BaseWidget>
</template>

<script setup>
import { computed } from 'vue'
import { useServerStore } from '@/stores/useServerStore'
import { CommandLineIcon } from '@heroicons/vue/24/solid'
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
    return serverStore.getComponentById(props.widgetId)?.title || 'Terminal'
})

const widgetIconColor = computed(() => {
    return serverStore.getComponentById(props.widgetId)?.iconColor || 'text-green-400'
})
</script>