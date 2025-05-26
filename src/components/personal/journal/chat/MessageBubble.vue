<template>
    <!-- MessageBubble.vue -->
    <div class="mb-6 w-full flex flex-col" :class="message.sender === 'ai' ? 'items-start' : 'items-end'">
        <div :class="['flex gap-4 min-w-0', message.sender === 'ai' ? '' : 'flex-row-reverse']">
            <!-- optional icon avatar here -->
            <div v-if="showIcons" :class="[
                'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
                message.sender === 'ai'
                    ? 'bg-indigo-100 dark:bg-indigo-900/30'
                    : 'bg-gradient-to-br from-indigo-500 to-purple-600'
            ]">
                <span v-if="message.sender === 'user'" class="text-white text-sm font-medium">U</span>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    class="text-indigo-600 dark:text-indigo-400">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
            </div>

            <div :class="[
                'w-full max-w-3xl overflow-hidden',
                message.sender === 'ai'
                    ? 'bg-white dark:bg-zinc-800 rounded-tl-none'
                    : 'bg-indigo-600 text-white rounded-tr-none',
                'p-4 pt-1 rounded-2xl'
            ]">
                <div class="w-full overflow-x-auto">
                    <MarkdownText :content="message.content" />
                </div>
                <div :class="['text-xs mt-2', message.sender === 'ai' ? 'text-zinc-400' : 'text-indigo-200']">
                    {{ formattedTime(message.createdAt) }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineProps } from 'vue';
import MarkdownText from '@/components/personal/journal/MarkdownText.vue';


defineProps({
  message: Object,
  formattedTime: Function,
  showIcons: {
    type: Boolean,
    default: true,
  },
});
</script>