<template>
    <div :class="[
        'sidebar transition-all duration-300 ease-in-out border-r border-zinc-200 dark:border-zinc-800 flex flex-col h-full',
        isSidebarOpen ? 'w-80' : 'w-16',
        forceVisible ? '' : 'hidden lg:flex'
    ]">
        <SidebarHeader :is-sidebar-open="isSidebarOpen" @toggle-sidebar="$emit('toggle-sidebar')" />

        <div class="p-3">
            <button @click="$emit('create-chat')"
                class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                <span :class="isSidebarOpen ? 'block' : 'hidden'">New Chat</span>
            </button>
        </div>

        <div class="flex-1 overflow-y-auto">
            <div v-if="isSidebarOpen" class="p-3">
                <SidebarGroup v-for="(group, dateKey) in groupedChats" :key="dateKey" :group="group"
                    :formatted-date="formatDate(dateKey)" :selected-chat-id="selectedChatId"
                    :action-menu-open-id="actionMenuOpenId" :renaming-chat-id="renamingChatId"
                    :is-sidebar-open="isSidebarOpen" @select-chat="$emit('select-chat', $event)"
                    @open-menu="$emit('open-menu', $event)" @close-menu="$emit('close-menu')"
                    @start-rename="$emit('start-rename', $event)"
                    @confirm-rename="($eventChat, newName) => $emit('confirm-rename', $eventChat, newName)"
                    @cancel-rename="$emit('cancel-rename')" @archive-chat="$emit('archive-chat', $event)"
                    @delete-chat="$emit('delete-chat', $event)" />
            </div>
            <div v-else class="py-3 flex flex-col items-center gap-3">
                <template v-for="(group, dateKey) in groupedChats" :key="`condensed-${dateKey}`">
                    <div class="text-xs font-medium text-zinc-500 text-center mb-2 w-full">
                        {{ formatDateShort(dateKey) }}
                    </div>
                    <div v-for="chat in group" :key="chat.id" @click="$emit('select-chat', chat)"
                        :class="['mx-auto mb-3 rounded-lg flex items-center justify-center cursor-pointer w-10 h-10',
                            selectedChatId === chat.id ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700']">
                        <span class="text-sm font-medium">{{ chat.title.charAt(0) }}</span>
                    </div>
                </template>
            </div>
        </div>

        <SidebarFooter :is-sidebar-open="isSidebarOpen" :user-name="userName" :account-type="accountType"
            @open-user-settings="$emit('open-user-settings')" />
    </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import SidebarHeader from '../sidebar/Header.vue';
import SidebarGroup from '../sidebar/Group.vue';
import SidebarFooter from '../sidebar/Footer.vue';

defineProps({
    isSidebarOpen: Boolean,
    forceVisible: Boolean,
    groupedChats: Object,
    selectedChatId: [String, null],
    actionMenuOpenId: [String, null],
    renamingChatId: [String, null],
    userName: String,
    accountType: String,
    formatDate: Function,
    formatDateShort: Function,
});

defineEmits([
    'toggle-sidebar',
    'create-chat',
    'select-chat',
    'open-menu',
    'close-menu',
    'start-rename',
    'confirm-rename',
    'cancel-rename',
    'archive-chat',
    'delete-chat',
    'open-user-settings',
]);
</script>