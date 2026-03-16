<!-- src/components/personal/notes/main/NoteMain.vue -->
<template>
    <div class="flex-1 flex flex-col overflow-hidden">
        <!-- If no note is selected, show a placeholder -->
        <div v-if="!currentNote" class="flex-1 flex items-center justify-center text-gray-500 italic">
            Select (or create) a note to begin.
        </div>

        <!-- Once currentNote is defined, render title/input and editor/preview -->
        <div v-else class="flex-1 flex flex-col">
            <!-- Title Bar -->
            <div class="flex items-center justify-between px-4 py-2 border-b border-zinc-700 bg-zinc-900">
                <input v-model="localTitle" @blur="updateTitle"
                    class="text-lg font-semibold bg-transparent text-white outline-none w-full"
                    placeholder="Untitled Note" />
            </div>

            <!-- Editor + Preview -->
            <div class="flex-1 flex overflow-hidden">
                <!-- Markdown Editor -->
                <textarea ref="textareaRef" v-model="localContent" @input="updateContent"
                    class="w-1/2 p-4 bg-zinc-950 text-zinc-100 border-r border-zinc-800 resize-none outline-none"
                    placeholder="Write your markdown here..."></textarea>

                <!-- Live Preview -->
                <div class="w-1/2 p-4 overflow-auto prose dark:prose-invert bg-zinc-900 text-white"
                    v-html="renderedMarkdown"></div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import MarkdownIt from 'markdown-it'

/**
 * Props:
 *   selectedNote: { id, title, content, ... } or null
 *   isSaving: boolean
 *   noteContent: string
 */
const props = defineProps({
    selectedNote: {
        type: Object,
        default: null
    },
    isSaving: {
        type: Boolean,
        default: false
    },
    noteContent: {
        type: String,
        default: ''
    }
})

const emit = defineEmits(['update-note'])

// Initialize Markdown-it
const md = new MarkdownIt({ html: true, breaks: true })

// currentNote is either an object or null
const currentNote = computed(() => (props.selectedNote === null ? null : props.selectedNote))

// Local refs for title + content so v-model won’t mutate props directly
const localTitle = ref(currentNote.value?.title ?? '')
const localContent = ref(props.noteContent)

// Whenever selectedNote changes, sync localTitle + localContent
watch(
    () => props.selectedNote,
    (newNote) => {
        if (!newNote) {
            localTitle.value = ''
            localContent.value = ''
            return
        }
        localTitle.value = newNote.title ?? ''
        localContent.value = newNote.content ?? ''
    },
    { immediate: true }
)

// If parent’s noteContent prop changes out-of-band, keep localContent in sync
watch(
    () => props.noteContent,
    (newContent) => {
        if (newContent !== localContent.value) {
            localContent.value = newContent ?? ''
        }
    }
)

// Computed HTML preview for the markdown editor
const renderedMarkdown = computed(() => md.render(localContent.value))

// Called when user blurs the title input
const updateTitle = () => {
    if (!currentNote.value) return
    emit('update-note', {
        id: currentNote.value.id,
        title: localTitle.value,
        content: localContent.value
    })
}

// Called on each input event in the textarea
const updateContent = () => {
    if (!currentNote.value) return
    emit('update-note', {
        id: currentNote.value.id,
        title: localTitle.value,
        content: localContent.value
    })
}

/**
 * Expose a method that lets the parent focus the <textarea> programmatically.
 */
const textareaRef = ref(null)
function focusEditor() {
    textareaRef.value?.focus()
}
defineExpose({ focusEditor })
</script>

<style scoped>
textarea::-webkit-scrollbar {
    width: 6px;
}

textarea::-webkit-scrollbar-thumb {
    background-color: #555;
    border-radius: 4px;
}
</style>