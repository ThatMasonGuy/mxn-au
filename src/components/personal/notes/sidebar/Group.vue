<template>
    <div class="mb-4">
        <div v-if="isSidebarOpen" class="flex items-center gap-2 mb-2">
            <div class="h-px flex-grow bg-zinc-200 dark:bg-zinc-800"></div>
            <span class="text-xs font-medium text-zinc-500">{{ formattedDate }}</span>
            <div class="h-px flex-grow bg-zinc-200 dark:bg-zinc-800"></div>
        </div>
        <div v-else class="text-xs font-medium text-zinc-500 text-center mb-2">
            {{ formattedDateShort }}
        </div>
        <SidebarItem v-for="note in group" :key="note.id" :note="note" :is-selected="selectedNoteId === note.id"
            :is-context-menu-open-global="actionMenuOpenId" :renaming-note-id-global="renamingNoteId"
            :is-sidebar-open="isSidebarOpen" @select-note="$emit('select-note', $event)"
            @open-menu="$emit('open-menu', $event)" @close-menu="$emit('close-menu')"
            @start-rename="$emit('start-rename', $event)"
            @confirm-rename="($event, newName) => $emit('confirm-rename', $event, newName)"
            @cancel-rename="$emit('cancel-rename')" @archive-note="$emit('archive-note', $event)"
            @delete-note="$emit('delete-note', $event)" />
    </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import SidebarItem from './Item.vue'

defineProps({
    group: Array,
    formattedDate: String,
    formattedDateShort: String,
    selectedNoteId: [String, null],
    actionMenuOpenId: [String, null],
    renamingNoteId: [String, null],
    isSidebarOpen: Boolean,
})

defineEmits([
    'select-note',
    'open-menu',
    'close-menu',
    'start-rename',
    'confirm-rename',
    'cancel-rename',
    'archive-note',
    'delete-note',
])
</script>
