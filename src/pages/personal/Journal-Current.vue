<template>
    <div class="flex h-screen bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
        <!-- Sidebar -->
        <div :class="['sidebar transition-all duration-300 ease-in-out border-r border-zinc-200 dark:border-zinc-800',
            isSidebarOpen ? 'w-80' : 'w-16']">
            <div class="flex flex-col h-full">
                <!-- Sidebar Header -->
                <div class="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center"
                    :class="isSidebarOpen ? 'justify-between' : 'justify-center'">
                    <h1 :class="['font-medium transition-opacity', isSidebarOpen ? 'opacity-100' : 'opacity-0 w-0']">
                        Journal<span class="text-indigo-500">.Goblin</span>
                    </h1>
                    <button @click="toggleSidebar" class="p-1 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-800">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path v-if="isSidebarOpen" d="M15 18l-6-6 6-6" />
                            <path v-else d="M9 18l6-6-6-6" />
                        </svg>
                    </button>
                </div>

                <!-- New Chat Button -->
                <div class="p-3">
                    <button @click="createChat"
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
                    <div class="p-3" v-if="isSidebarOpen">
                        <div v-for="(group, date) in groupedChats" :key="date" class="mb-4">
                            <div class="flex items-center gap-2 mb-2">
                                <div class="h-px flex-grow bg-zinc-200 dark:bg-zinc-800"></div>
                                <span class="text-xs font-medium text-zinc-500">{{ formatDate(date) }}</span>
                                <div class="h-px flex-grow bg-zinc-200 dark:bg-zinc-800"></div>
                            </div>

                            <div v-for="chat in group" :key="chat.id" class="relative group">
                                <div @click="selectChat(chat)" :class="[
                                    'p-2 rounded-lg mb-1 cursor-pointer flex items-center gap-2 transition-colors',
                                    selectedChatId === chat.id
                                        ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                                        : 'hover:bg-zinc-200 dark:hover:bg-zinc-800'
                                ]" tabindex="0" @keydown.enter.prevent="selectChat(chat)"
                                    @contextmenu.prevent="openMenu(chat.id)">
                                    <div
                                        class="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-200 via-indigo-300 to-purple-200 dark:from-indigo-900 dark:to-purple-900 flex items-center justify-center flex-shrink-0 shadow-sm">
                                        <svg xmlns="http://www.w3.org/2000/svg"
                                            class="h-5 w-5 text-indigo-500 dark:text-indigo-300" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M8 10h.01M12 10h.01M16 10h.01M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                                        </svg>
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        <div v-if="renamingChatId === chat.id" class="flex items-center gap-2">
                                            <input v-model="renameInput" @keyup.enter="confirmRename(chat)"
                                                @blur="cancelRename"
                                                class="text-sm px-2 py-1 rounded border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 w-32 focus:ring-2 focus:ring-indigo-400"
                                                autofocus />
                                            <button @click="confirmRename(chat)"
                                                class="text-xs flex items-center gap-1 text-indigo-600 font-bold hover:underline">
                                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none"
                                                    viewBox="0 0 24 24" stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        stroke-width="2" d="M5 13l4 4L19 7" />
                                                </svg>
                                                Save
                                            </button>
                                            <button @click="cancelRename"
                                                class="text-xs flex items-center gap-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">
                                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none"
                                                    viewBox="0 0 24 24" stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                                Cancel
                                            </button>
                                        </div>
                                        <template v-else>
                                            <div class="font-medium truncate">{{ chat.title }}</div>
                                            <div class="text-xs text-zinc-500 truncate">{{ chat.preview }}</div>
                                        </template>
                                    </div>
                                    <button
                                        class="ml-2 opacity-50 group-hover:opacity-100 focus:opacity-100 transition p-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700"
                                        @click.stop="openMenu(chat.id)" tabindex="-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor">
                                            <circle cx="12" cy="6" r="1.5" />
                                            <circle cx="12" cy="12" r="1.5" />
                                            <circle cx="12" cy="18" r="1.5" />
                                        </svg>
                                    </button>

                                    <transition name="fade">
                                        <div v-if="actionMenuOpen === chat.id"
                                            class="absolute right-2 top-12 z-50 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 shadow-2xl rounded-xl min-w-[150px] py-2 flex flex-col space-y-1 animate-pop"
                                            @click.stop>
                                            <button @click="startRename(chat)"
                                                class="flex items-center gap-2 w-full text-left px-4 py-2 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-sm transition">
                                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none"
                                                    viewBox="0 0 24 24" stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        stroke-width="2"
                                                        d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-2.828 0L5 11l4-4z" />
                                                </svg>
                                                Rename
                                            </button>
                                            <button @click="archiveChat(chat)"
                                                class="flex items-center gap-2 w-full text-left px-4 py-2 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-sm transition">
                                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none"
                                                    viewBox="0 0 24 24" stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        stroke-width="2"
                                                        d="M20 13V7a2 2 0 00-2-2H6a2 2 0 00-2 2v6m16 0v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6m16 0h-4M4 13h16" />
                                                </svg>
                                                Archive
                                            </button>
                                            <button @click="deleteChat(chat)"
                                                class="flex items-center gap-2 w-full text-left px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 text-sm transition">
                                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none"
                                                    viewBox="0 0 24 24" stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                                Delete
                                            </button>
                                        </div>
                                    </transition>
                                    <div v-if="actionMenuOpen === chat.id" class="fixed inset-0 z-40" @click="closeMenu"
                                        style="pointer-events: auto; background: transparent"></div>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div v-else class="py-3 flex flex-col items-center gap-3">
                        <div v-for="(group, date) in groupedChats" :key="date" class="w-full">
                            <div class="text-xs font-medium text-zinc-500 text-center mb-2">
                                {{ formatDateShort(date) }}
                            </div>

                            <div v-for="chat in group" :key="chat.id" @click="selectChat(chat)" :class="['mx-auto mb-3 rounded-lg flex items-center justify-center cursor-pointer w-10 h-10',
                                selectedChatId === chat.id
                                    ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                                    : 'bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700']">
                                <span class="text-sm font-medium">{{ chat.title.charAt(0) }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- User Settings -->
                <div class="p-3 border-t border-zinc-200 dark:border-zinc-800">
                    <div @click="openModal" :class="['flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-800',
                        isSidebarOpen ? '' : 'justify-center']">
                        <div
                            class="w-8 h-8 flex-shrink-0 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-medium">
                            {{ userName.charAt(0) }}
                        </div>
                        <div v-if="isSidebarOpen" class="flex-1">
                            <div class="font-medium">{{ userName }}</div>
                            <div class="text-xs text-zinc-500">{{ accountType }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Main Content -->
        <div class="flex-1 flex flex-col">
            <!-- Chat Header -->
            <div class="border-b border-zinc-200 dark:border-zinc-800 p-4">
                <div class="flex items-center justify-between">
                    <div v-if="selectedChat">
                        <h2 class="font-medium">{{ selectedChat.chatName }}</h2>
                        <div class="text-xs text-zinc-500">{{ formatTime(selectedChat.updatedAt) }}</div>
                    </div>
                    <div v-else>
                        <h2 class="font-medium">New Conversation</h2>
                        <div class="text-xs text-zinc-500">{{ formatTime(Date.now()) }}</div>
                    </div>

                    <div class="flex items-center gap-3">
                        <button class="p-2 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round">
                                <circle cx="12" cy="12" r="1"></circle>
                                <circle cx="12" cy="5" r="1"></circle>
                                <circle cx="12" cy="19" r="1"></circle>
                            </svg>
                        </button>
                        <button @click="toggleTheme" class="p-2 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800">
                            <svg v-if="isDarkMode" xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="12" cy="12" r="5"></circle>
                                <line x1="12" y1="1" x2="12" y2="3"></line>
                                <line x1="12" y1="21" x2="12" y2="23"></line>
                                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                                <line x1="1" y1="12" x2="3" y2="12"></line>
                                <line x1="21" y1="12" x2="23" y2="12"></line>
                                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                            </svg>
                            <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round">
                                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Chat Messages -->
            <div class="flex-1 overflow-y-auto p-4" ref="messagesContainer">
                <Transition name="fade">
                    <div v-if="!currentMessages.length && !isThinking">
                        <div class="h-full flex flex-col items-center justify-center text-center p-4">
                            <div
                                class="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round" class="text-indigo-600 dark:text-indigo-400">
                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                                </svg>
                            </div>
                            <h3 class="text-xl font-medium mb-2">Welcome to Journal.AI</h3>
                            <p class="text-zinc-500 max-w-md">
                                Your AI-powered journal assistant. Start typing below to begin your conversation.
                            </p>
                        </div>
                    </div>
                    <div v-else>
                        <div v-for="(message, index) in currentMessages || []" :key="message.messageId || index"
                            class="mb-6">
                            <div :class="['flex gap-4', message.sender === 'ai' ? '' : 'flex-row-reverse']">
                                <div
                                    :class="['flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
                                        message.sender === 'ai' ? 'bg-indigo-100 dark:bg-indigo-900/30' : 'bg-gradient-to-br from-indigo-500 to-purple-600']">
                                    <span v-if="message.sender === 'user'"
                                        class="text-white text-sm font-medium">U</span>
                                    <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                        stroke-linecap="round" stroke-linejoin="round"
                                        class="text-indigo-600 dark:text-indigo-400">
                                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z">
                                        </path>
                                    </svg>
                                </div>

                                <div :class="['max-w-3xl p-4 rounded-2xl',
                                    message.sender === 'ai'
                                        ? 'bg-white dark:bg-zinc-800 rounded-tl-none'
                                        : 'bg-indigo-600 text-white rounded-tr-none']">
                                    <MarkdownText :content="message.content" />
                                    <div
                                        :class="['text-xs mt-2', message.sender === 'ai' ? 'text-zinc-400' : 'text-indigo-200']">
                                        {{ formatTime(message.createdAt) }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Transition>

                <!-- AI is thinking bubble (animated dots) -->
                <div v-if="isThinking" class="mb-6">
                    <div class="flex gap-4">
                        <div
                            class="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                            <!-- AI avatar SVG -->
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round" class="text-indigo-600 dark:text-indigo-400">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                            </svg>
                        </div>
                        <div
                            class="max-w-3xl p-4 rounded-2xl bg-white dark:bg-zinc-800 rounded-tl-none animate-pulse flex items-center gap-2">
                            <span class="text-zinc-500 dark:text-zinc-300 font-medium">Goblin AI is thinking</span>
                            <span class="inline-block w-5 text-indigo-600 dark:text-indigo-400 tracking-widest">{{
                                thinkingDots
                                }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Input Area -->
            <div class="border-t border-zinc-200 dark:border-zinc-800 p-4">
                <div
                    class="flex-1 bg-white dark:bg-zinc-800 rounded-2xl border border-zinc-200 dark:border-zinc-700 overflow-hidden">
                    <textarea v-model="newMessage" @keydown.enter.prevent="sendMessage" placeholder="Send a message..."
                        class="w-full px-4 pt-3 pb-2 outline-none bg-transparent resize-none" :rows="textareaRows"
                        ref="messageInput"></textarea>
                    <div class="px-4 pb-3 flex justify-between items-center">
                        <div class="text-xs text-zinc-400"></div>
                        <button @click="sendMessage" :disabled="isThinking || !newMessage.trim()"
                            :class="['p-1.5 rounded-lg text-white transition-colors',
                                newMessage.trim() ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-zinc-300 dark:bg-zinc-700 cursor-not-allowed']">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round">
                                <line x1="22" y1="2" x2="11" y2="13"></line>
                                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <UserSettingsModal :show="showModal" @close="showModal = false" />
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, onBeforeUnmount, nextTick } from 'vue'
import { useJournalChatStore } from '@/stores/useJournalChatStore'
import { useMainStore } from '@/stores/useMainStore'
import UserSettingsModal from '@/components/personal/journal/JournalProfileModal.vue'
import { getFunctions, httpsCallable } from 'firebase/functions'
import MarkdownText from '@/components/personal/journal/MarkdownText.vue'

const functions = getFunctions(undefined, 'australia-southeast1')
const handleJournalChat = httpsCallable(functions, 'handleJournalChat')

const chatStore = useJournalChatStore()
const mainStore = useMainStore()
const actionMenuOpen = ref(null)
const renamingChatId = ref(null)
const renameInput = ref('')
const userName = ref('Guest User')
const accountType = ref('Free Account')
const errorMsg = ref('')
const showModal = ref(false)
const isThinking = ref(false)

async function openModal() {
    errorMsg.value = ''
    if (mainStore.user.uid) {
        await chatStore.loadUserProfile(mainStore.user.uid)
    }
    showModal.value = true
}

function openMenu(chatId) {
    actionMenuOpen.value = chatId
}
function closeMenu() {
    actionMenuOpen.value = null
}
function startRename(chat) {
    renamingChatId.value = chat.id
    renameInput.value = chat.title
    closeMenu()
}
async function confirmRename(chat) {
    if (renameInput.value.trim() && chat.id) {
        await chatStore.updateChatName(mainStore.user.uid, chat.id, renameInput.value.trim())
        renamingChatId.value = null
        renameInput.value = ''
    }
}
function cancelRename() {
    renamingChatId.value = null
    renameInput.value = ''
}
async function archiveChat(chat) {
    await chatStore.updateChatStatus(mainStore.user.uid, chat.id, 'archived')
    closeMenu()
}
async function deleteChat(chat) {
    await chatStore.updateChatStatus(mainStore.user.uid, chat.id, 'deleted')
    closeMenu()
}

const selectedChatId = ref(null)
const selectedChat = computed(() =>
    chatStore.activeChats.find(c => c.chatId === selectedChatId.value)
)

onMounted(() => {
    if (mainStore.user.uid) {
        chatStore.loadChats(mainStore.user.uid, 'active')
    }
})

watch(selectedChatId, (newId, oldId) => {
    if (oldId) chatStore.unsubscribeFromMessages(oldId)
    if (newId && mainStore.user.uid) {
        chatStore.subscribeToMessages(mainStore.user.uid, newId)
    }
})
onBeforeUnmount(() => {
    if (selectedChatId.value) chatStore.unsubscribeFromMessages(selectedChatId.value)
})

const currentMessages = computed(() =>
    chatStore.messages[selectedChatId.value] || []
)

async function sendMessage() {
    if (isThinking.value) return;
    console.log('Triggered sendMessage')
    const message = newMessage.value
    newMessage.value = ''
    if (!message.trim()) {
        console.warn('Blocked send: missing message content')
        return
    }
    if (!mainStore.user?.uid) return

    let chatId = selectedChatId.value

    if (!chatId) {
        await createChat()
        chatId = selectedChatId.value
        if (!chatId) {
            console.error('Could not create/select chat')
            return
        }
    }
    isThinking.value = true
    try {

        await chatStore.sendMessage(mainStore.user.uid, chatId, {
            content: message,
            sender: mainStore.user.userName || mainStore.user.email || 'Goblin',
        })

        const history = (chatStore.messages[chatId] || []).slice(-15)
        const openAIMessages = history.map(m => ({
            role: m.sender === 'ai' ? 'assistant' : 'user',
            content: m.content
        }))

        let aiMessage = ''
        try {
            const { data } = await handleJournalChat({
                packageCode: 'message',
                messages: openAIMessages
            })
            aiMessage = data?.aiMessage || ''
        } catch (err) {
            console.error('AI failed to respond:', err)
        }

        if (aiMessage) {
            await chatStore.sendMessage(mainStore.user.uid, chatId, {
                content: aiMessage,
                sender: 'ai',
            })
        }

        console.log('Message sent and AI response received')
    } finally {
        isThinking.value = false
    }
}

const showNewChat = ref(false)
const newChatName = ref('')
async function createChat() {
    if (!mainStore.user?.uid) return
    isThinking.value = true;

    await chatStore.loadUserProfile(mainStore.user.uid)
    const userProfile = chatStore.userProfile
    const userName = userProfile.displayName || mainStore.user.userName || mainStore.user.email || 'Goblin'
    console.log('DEBUG newChat:', { userName, profile: userProfile.profile })

    let aiData
    try {
        const { data } = await handleJournalChat({
            packageCode: 'newChat',
            userName,
            profile: userProfile.profile || 'No user profile set.'
        })
        aiData = data
    } catch (err) {
        console.error('AI failed to create chat:', err)
        return
    }

    let chatId
    try {
        chatId = await chatStore.createChat(mainStore.user.uid, aiData.chatTitle)
    } catch (err) {
        console.error('Failed to create Firestore chat:', err)
        return
    }

    await chatStore.sendMessage(mainStore.user.uid, chatId, {
        content: aiData.welcomeMessage,
        sender: 'ai',
    })

    selectedChatId.value = chatId
    newChatName.value = ''
    showNewChat.value = false
    isThinking.value = false;
}

const isSidebarOpen = ref(true);
const isDarkMode = ref(false);
const newMessage = ref('');
const messagesContainer = ref(null);
const messageInput = ref(null);
const messages = ref([]);

const textareaRows = computed(() => {
    const lines = newMessage.value.split('\n').length;
    return Math.min(Math.max(1, lines), 5);
});

const groupedChats = computed(() => {
    const chats = chatStore.activeChats;
    const grouped = {};
    chats.forEach(chat => {
        const dateObj = chat.updatedAt?.toDate?.() || new Date();
        const date = dateObj.toLocaleDateString();
        if (!Array.isArray(grouped[date])) grouped[date] = [];
        grouped[date].push({
            id: chat.chatId,
            title: chat.chatName,
            preview: chat.lastMessage,
            raw: chat
        });
    });
    Object.keys(grouped).forEach(date => {
        grouped[date].sort((a, b) => {
            const aTime = a.raw.updatedAt?.toDate?.().getTime?.() || 0;
            const bTime = b.raw.updatedAt?.toDate?.().getTime?.() || 0;
            return bTime - aTime;
        });
    });
    return grouped;
});

// Methods
const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value;
};

const toggleTheme = () => {
    isDarkMode.value = !isDarkMode.value;
    if (isDarkMode.value) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
};

const formatDate = (input) => {
    const date = asDate(input)
    if (!date) return ''
    const today = new Date()
    const yesterday = new Date()
    yesterday.setDate(today.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
        return 'Today'
    } else if (date.toDateString() === yesterday.toDateString()) {
        return 'Yesterday'
    } else {
        return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })
    }
}

const formatDateShort = (input) => {
    const date = asDate(input)
    if (!date) return ''
    const today = new Date()
    const yesterday = new Date()
    yesterday.setDate(today.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
        return 'Today'
    } else if (date.toDateString() === yesterday.toDateString()) {
        return 'Yst'
    } else {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
}

const formatTime = (input) => {
    const date = asDate(input)
    if (!date) return ''
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

function asDate(val) {
    if (!val) return null
    if (typeof val.toDate === 'function') return val.toDate()
    if (val instanceof Date) return val
    const d = new Date(val)
    return isNaN(d) ? null : d
}

const selectChat = (chat) => {
    selectedChatId.value = chat.id || chat.chatId
    chatStore.subscribeToMessages(mainStore.user.uid, selectedChatId.value)
    scrollToBottom()
}

const scrollToBottom = () => {
    nextTick(() => {
        if (messagesContainer.value) {
            messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
        }
    });
};

const formatMessage = (content) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return content.replace(urlRegex, '<a href="$1" target="_blank" class="underline">$1</a>')
        .replace(/\n/g, '<br>');
};

onMounted(() => {

    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        isDarkMode.value = true;
        document.documentElement.classList.add('dark');
    }

    messageInput.value.focus();

    messageInput.value.addEventListener('keydown', (event) => {
        if (event.ctrlKey && event.key === 'Enter') {
            event.preventDefault();
            sendMessage();
        }
    });
});

watch(messages, () => {
    scrollToBottom();
}, { deep: true });
const thinkingDots = ref('')
let thinkingInterval = null

watch(isThinking, (val) => {
    if (val) {
        let i = 0
        thinkingInterval = setInterval(() => {
            thinkingDots.value = '.'.repeat((i++ % 4))
        }, 400)
    } else {
        thinkingDots.value = ''
        if (thinkingInterval) clearInterval(thinkingInterval)
    }
})
</script>

<style scoped>
body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity .16s cubic-bezier(.4, 0, .2, 1);
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.animate-pop {
    animation: pop-in .18s cubic-bezier(.2, 0, .6, 1);
}

@keyframes pop-in {
    0% {
        transform: scale(.94);
        opacity: 0;
    }

    80% {
        transform: scale(1.02);
        opacity: 1;
    }

    100% {
        transform: scale(1);
    }
}
</style>