<template>
    <div class="flex-1 flex flex-col">
        <NoteHeader :selected-note="selectedNote" :is-dark-mode="isDarkMode" :formatted-time="formatTime"
            @toggle-theme="$emit('toggle-theme')" @toggle-sidebar="$emit('toggle-sidebar')" />

        <NoteMain ref="noteMainRef" :note-content="noteContent" :is-saving="isSaving"
            @update-content="handleContentUpdate" />
    </div>
</template>

<script setup>
import { defineProps, defineEmits, ref } from 'vue';
import NoteHeader from '../main/NoteHeader.vue';
import NoteMain from '../main/NoteMain.vue';

const props = defineProps({
    selectedNote: Object,
    isDarkMode: Boolean,
    formatTime: Function,
    noteContent: String,
    isSaving: Boolean
});

const emit = defineEmits([
    'toggle-theme',
    'toggle-sidebar',
    'update:noteContent'
]);

const noteMainRef = ref(null);

const handleContentUpdate = (updatedContent) => {
    emit('update:noteContent', updatedContent);
};

const focusEditor = () => {
    noteMainRef.value?.focusEditor();
};

defineExpose({
    focusEditor
});
</script>