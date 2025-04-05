<!-- @/components/server/widgets/FileBrowserWidget.vue -->
<template>
    <BaseWidget :widget-id="widgetId" :title="widgetTitle" :icon="ClipboardIcon" :icon-color="widgetIconColor"
        @remove="$emit('remove', widgetId)">
        <div class="space-y-1 h-full overflow-y-auto">
            <div v-for="(file, index) in files" :key="index" class="flex items-center p-2 rounded hover:bg-gray-700">
                <FolderIcon v-if="file.type === 'folder'" class="h-5 w-5 mr-2 text-yellow-400" />
                <DocumentIcon v-else class="h-5 w-5 mr-2 text-blue-400" />
                <span>{{ file.name }}</span>
                <span class="ml-auto text-xs text-gray-400">{{ file.size }}</span>
            </div>
        </div>
    </BaseWidget>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { ClipboardIcon, FolderIcon, DocumentIcon } from '@heroicons/vue/24/solid'
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
    return store.getters['server/getComponentById'](props.widgetId)?.title || 'File Browser'
})

const widgetIconColor = computed(() => {
    return store.getters['server/getComponentById'](props.widgetId)?.iconColor || 'text-yellow-400'
})

const files = computed(() => store.state.server.files)
</script>