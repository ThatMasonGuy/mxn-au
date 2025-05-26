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
        <SidebarItem v-for="chat in group" :key="chat.id" :chat="chat" :is-selected="selectedChatId === chat.id"
            :is-context-menu-open-global="actionMenuOpenId" :renaming-chat-id-global="renamingChatId"
            :is-sidebar-open="isSidebarOpen" @select-chat="$emit('select-chat', $event)"
            @open-menu="$emit('open-menu', $event)" @close-menu="$emit('close-menu')"
            @start-rename="$emit('start-rename', $event)"
            @confirm-rename="($event, newName) => $emit('confirm-rename', $event, newName)"
            @cancel-rename="$emit('cancel-rename')" @archive-chat="$emit('archive-chat', $event)"
            @delete-chat="$emit('delete-chat', $event)" />
    </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import SidebarItem from './Item.vue';

defineProps({
    group: Array,
    formattedDate: String,
    formattedDateShort: String,
    selectedChatId: [String, null],
    actionMenuOpenId: [String, null],
    renamingChatId: [String, null],
    isSidebarOpen: Boolean,
});

defineEmits([
    'select-chat',
    'open-menu',
    'close-menu',
    'start-rename',
    'confirm-rename',
    'cancel-rename',
    'archive-chat',
    'delete-chat',
]);
</script>