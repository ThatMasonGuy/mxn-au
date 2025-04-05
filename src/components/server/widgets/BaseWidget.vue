<!-- @/components/server/widgets/BaseWidget.vue -->
<template>
    <div class="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden h-full">
        <div class="flex justify-between items-center p-3 border-b border-gray-700 drag-handle">
            <div class="flex items-center cursor-move">
                <component :is="icon" class="h-5 w-5 mr-2" :class="iconColor" />
                <span v-if="!isEditing">{{ title }}</span>
                <input v-else v-model="editableTitle" @blur="finishEditingTitle" @keyup.enter="finishEditingTitle"
                    ref="titleInput" class="bg-gray-700 px-2 rounded text-white" @click.stop />
                <button v-if="!isEditing && isHovered" @click.stop="startEditingTitle"
                    class="ml-2 text-gray-400 hover:text-blue-400">
                    <PencilIcon class="h-4 w-4" />
                </button>
            </div>

            <div class="flex items-center gap-2">
                <button v-if="canRemove" @click="$emit('remove', widgetId)" class="text-gray-500 hover:text-red-400">
                    <XCircleIcon class="h-5 w-5" />
                </button>
            </div>
        </div>

        <div class="p-3 overflow-auto" style="height: calc(100% - 50px)">
            <slot></slot>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useStore } from 'vuex'
import { PencilIcon, XCircleIcon } from '@heroicons/vue/24/solid'

const props = defineProps({
    widgetId: { type: String, required: true },
    title: { type: String, default: 'Widget' },
    icon: { type: [Object, Function], required: true },
    iconColor: { type: String, default: 'text-blue-400' },
    canRemove: { type: Boolean, default: true },
})

const emit = defineEmits(['remove'])

const isEditing = ref(false)
const isHovered = ref(false)
const editableTitle = ref(props.title)
const titleInput = ref(null)

const store = useStore()
const updateWidgetTitle = (payload) =>
    store.dispatch('server/updateWidgetTitle', payload)

const startEditingTitle = () => {
    isEditing.value = true
    editableTitle.value = props.title

    nextTick(() => {
        if (titleInput.value) {
            titleInput.value.focus()
        }
    })
}

const finishEditingTitle = () => {
    if (isEditing.value) {
        updateWidgetTitle({
            id: props.widgetId,
            title: editableTitle.value,
        })
    }
    isEditing.value = false
}

onMounted(() => {
    const widget = document.querySelector(`[i="${props.widgetId}"]`)
    if (!widget) return

    widget.addEventListener('mouseenter', () => {
        isHovered.value = true
    })

    widget.addEventListener('mouseleave', () => {
        isHovered.value = false
    })
})
</script>

<style scoped>
.resize-handle {
    cursor: se-resize;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    border-radius: 4px;
    transition: background-color 0.2s;
}

.resize-handle:hover {
    background-color: rgba(59, 130, 246, 0.1);
}

.drag-handle {
    cursor: move;
}
</style>