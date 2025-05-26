<template>
    <div class="border-b border-zinc-200 dark:border-zinc-800 p-4">
        <div class="flex items-center justify-between">

            <!-- 🍔 Hamburger for Mobile -->
            <button class="lg:hidden p-2 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 mr-2"
                @click="$emit('toggle-sidebar')">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>

            <!-- Chat Info -->
            <div v-if="selectedChat">
                <h2 class="font-medium">{{ selectedChat.chatName }}</h2>
                <div class="text-xs text-zinc-500">{{ formattedTime(selectedChat.updatedAt) }}</div>
            </div>
            <div v-else>
                <h2 class="font-medium">New Conversation</h2>
                <div class="text-xs text-zinc-500">{{ formattedTime(Date.now()) }}</div>
            </div>

            <!-- Right-side Buttons -->
            <div class="flex items-center gap-3 ml-auto">
                <!-- 
                <button class="p-2 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="1" />
                        <circle cx="12" cy="5" r="1" />
                        <circle cx="12" cy="19" r="1" />
                    </svg>
                </button>
                -->

                <button @click="toggleTheme" class="p-2 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800">
                    <svg v-if="isDarkMode" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="5" />
                        <line x1="12" y1="1" x2="12" y2="3" />
                        <line x1="12" y1="21" x2="12" y2="23" />
                        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                        <line x1="1" y1="12" x2="3" y2="12" />
                        <line x1="21" y1="12" x2="23" y2="12" />
                        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor" stroke-width="2">
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                    </svg>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    selectedChat: Object,
    isDarkMode: Boolean,
    formattedTime: Function
})

const emit = defineEmits(['toggle-theme', 'toggle-sidebar'])

const toggleTheme = () => {
    emit('toggle-theme')
}
</script>