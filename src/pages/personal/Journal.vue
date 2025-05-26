<template>
  <div class="flex h-screen bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
    <!-- Proper layout container -->
    <div class="flex flex-1 h-full">
      <SidebarLayout :is-sidebar-open="isSidebarOpen" :grouped-chats="groupedChats" :selected-chat-id="selectedChatId"
        :action-menu-open-id="actionMenuOpenId" :renaming-chat-id="renamingChatId" :user-name="userName"
        :account-type="accountType" :format-date="formatDate" :format-date-short="formatDateShort"
        @toggle-sidebar="toggleSidebar" @create-chat="handleCreateChat" @select-chat="handleSelectChat"
        @open-menu="handleOpenMenu" @close-menu="handleCloseMenu" @start-rename="handleStartRename"
        @confirm-rename="handleConfirmRename" @cancel-rename="handleCancelRename" @archive-chat="handleArchiveChat"
        @delete-chat="handleDeleteChat" @open-user-settings="openUserSettingsModalHandler" />

      <ChatLayout class="flex-1 flex flex-col h-full" ref="chatLayoutRef" :selected-chat="selectedChat"
        :is-dark-mode="isDarkMode" :format-time="formatTime" :current-messages="currentMessages"
        :is-thinking="isThinking" :thinking-dots="thinkingDots" :new-message="newMessage" @toggle-theme="toggleTheme"
        @send-message="handleSendMessage" @toggle-sidebar="toggleSidebar"
        @update:new-message="newValue => newMessage = newValue" />
    </div>

    <div :class="[
      'fixed inset-0 z-40 backdrop-blur-sm transition-opacity duration-300 lg:hidden',
      isSidebarOpen ? 'bg-black/40 opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
    ]" @click="toggleSidebar" />
    <transition name="slide">
      <div v-if="isSidebarOpen"
        class="fixed top-0 left-0 bottom-0 w-80 bg-zinc-900 z-50 shadow-lg overflow-y-auto lg:hidden">
        <SidebarLayout :is-sidebar-open="true" :force-visible="true" :grouped-chats="groupedChats"
          :selected-chat-id="selectedChatId" :action-menu-open-id="actionMenuOpenId" :renaming-chat-id="renamingChatId"
          :user-name="userName" :account-type="accountType" :format-date="formatDate"
          :format-date-short="formatDateShort" @toggle-sidebar="toggleSidebar" @create-chat="handleCreateChat"
          @open-menu="handleOpenMenu" @close-menu="handleCloseMenu" @start-rename="handleStartRename"
          @confirm-rename="handleConfirmRename" @cancel-rename="handleCancelRename" @archive-chat="handleArchiveChat"
          @delete-chat="handleDeleteChat" @open-user-settings="openUserSettingsModalHandler"
          @select-chat="handleSelectChat" />
      </div>
    </transition>

    <UserSettingsModal :show="showUserSettingsModal" @close="showUserSettingsModal = false" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, onBeforeUnmount, nextTick } from 'vue';
import { useJournalChatStore } from '@/stores/useJournalChatStore';
import { useMainStore } from '@/stores/useMainStore';
import { getFunctions, httpsCallable } from 'firebase/functions';

import SidebarLayout from '@/components/personal/journal/layouts/Sidebar.vue';
import ChatLayout from '@/components/personal/journal/layouts/Chat.vue';
import UserSettingsModal from '@/components/personal/journal/JournalProfileModal.vue';
import { useJournalChatCreator } from '@/composables/useJournalChatCreator';
import { useSendJournalMessage } from '@/composables/useSendJournalMessage'

const functions = getFunctions(undefined, 'australia-southeast1');
const handleJournalChat = httpsCallable(functions, 'handleJournalChat');

const chatStore = useJournalChatStore();
const mainStore = useMainStore();
const { createNewChat } = useJournalChatCreator()

const isSidebarOpen = ref(true);
const isDarkMode = ref(false);
const showUserSettingsModal = ref(false);

const selectedChatId = ref(null);
const newMessage = ref('');
const isThinking = ref(false);
const thinkingDots = ref('');
let thinkingInterval = null;

const actionMenuOpenId = ref(null);
const renamingChatId = ref(null);
const renameInput = ref('');

const chatLayoutRef = ref(null);

const userProfile = computed(() => chatStore.userProfile);
const userName = computed(() => userProfile.value?.displayName || mainStore.user?.userName || mainStore.user?.email || 'Guest User');
const accountType = computed(() => userProfile.value?.accountType || 'Free Account'); // Assuming accountType is part of userProfile

const activeChats = computed(() => chatStore.activeChats);
const { handleSendMessage } = useSendJournalMessage(chatLayoutRef, selectedChatId, newMessage, isThinking)

const groupedChats = computed(() => {
  const chats = activeChats.value;
  const grouped = {};
  chats.forEach(chat => {

    const dateObj = chat.updatedAt?.toDate ? chat.updatedAt.toDate() : (chat.updatedAt instanceof Date ? chat.updatedAt : new Date(chat.updatedAt || Date.now()));
    const dateKey = dateObj.toLocaleDateString();

    if (!Array.isArray(grouped[dateKey])) {
      grouped[dateKey] = [];
    }
    grouped[dateKey].push({
      id: chat.chatId,
      title: chat.chatName,
      preview: chat.lastMessage,
      raw: chat,
    });
  });

  const sortedGroupKeys = Object.keys(grouped).sort((a, b) => new Date(b) - new Date(a));
  const sortedGroupedChats = {};
  for (const key of sortedGroupKeys) {
    grouped[key].sort((a, b) => {
      const aTime = a.raw.updatedAt?.toDate?.().getTime?.() || new Date(a.raw.updatedAt || 0).getTime();
      const bTime = b.raw.updatedAt?.toDate?.().getTime?.() || new Date(b.raw.updatedAt || 0).getTime();
      return bTime - aTime;
    });
    sortedGroupedChats[key] = grouped[key];
  }
  return sortedGroupedChats;
});

const selectedChat = computed(() => {
  if (!selectedChatId.value) return null;
  return activeChats.value.find(c => c.chatId === selectedChatId.value);
});

const currentMessages = computed(() => {
  if (!selectedChatId.value) return [];
  return chatStore.messages[selectedChatId.value] || [];
});

// --- METHODS ---

// UI Methods
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

const openUserSettingsModalHandler = async () => {
  if (mainStore.user?.uid) {
    await chatStore.loadUserProfile(mainStore.user.uid);
  }
  showUserSettingsModal.value = true;
};

const handleCreateChat = async () => {
  if (isThinking.value) return
  isThinking.value = true

  try {
    const result = await createNewChat()

    if (!result?.chatId) throw new Error('Chat creation failed')

    selectedChatId.value = result.chatId
    newMessage.value = ''
    if (chatLayoutRef.value) {
      chatLayoutRef.value.clearInput()
      chatLayoutRef.value.focusInput()
    }
  } catch (e) {
    console.error('Error during chat setup:', e)
  } finally {
    isThinking.value = false
  }
}

function getUserTimezone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
}

const handleSelectChat = (chat) => {
  if (chat && chat.id) {
    selectedChatId.value = chat.id;
    actionMenuOpenId.value = null;
    renamingChatId.value = null;
    nextTick(() => {
      chatLayoutRef.value?.scrollToBottom();
      chatLayoutRef.value?.focusInput();
    });
  }
};

const handleOpenMenu = (chatId) => {
  actionMenuOpenId.value = chatId;
  renamingChatId.value = null;
};

const handleCloseMenu = () => {
  actionMenuOpenId.value = null;
};

const handleStartRename = (chat) => {
  renamingChatId.value = chat.id;
  renameInput.value = chat.title;
  actionMenuOpenId.value = null;
};

const handleConfirmRename = async (chatToRename, newName) => {
  const trimmedNewName = newName.trim();
  if (trimmedNewName && chatToRename?.id && mainStore.user?.uid) {
    try {
      await chatStore.updateChatName(mainStore.user.uid, chatToRename.id, trimmedNewName);
    } catch (error) {
      console.error("Error renaming chat:", error);
    }
  }
  renamingChatId.value = null;
  renameInput.value = '';
};

const handleCancelRename = () => {
  renamingChatId.value = null;
  renameInput.value = '';
};

const handleArchiveChat = async (chat) => {
  if (chat?.id && mainStore.user?.uid) {
    try {
      await chatStore.updateChatStatus(mainStore.user.uid, chat.id, 'archived');
      if (selectedChatId.value === chat.id) {
        selectedChatId.value = null;
      }
    } catch (error) {
      console.error("Error archiving chat:", error);
    }
  }
  actionMenuOpenId.value = null;
};

const handleDeleteChat = async (chat) => {
  if (chat?.id && mainStore.user?.uid) {

    try {
      await chatStore.updateChatStatus(mainStore.user.uid, chat.id, 'deleted');
      if (selectedChatId.value === chat.id) {
        selectedChatId.value = null;
      }
    } catch (error) {
      console.error("Error deleting chat:", error);
    }
  }
  actionMenuOpenId.value = null;
};

const asDate = (val) => {
  if (!val) return null;
  if (typeof val.toDate === 'function') return val.toDate();
  if (val instanceof Date) return val;
  const d = new Date(val);
  return isNaN(d.getTime()) ? null : d;
};

const formatDate = (dateInput) => {
  const date = asDate(dateInput);
  if (!date) return 'Invalid Date';

  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
};

const formatDateShort = (dateInput) => {
  const date = asDate(dateInput);
  if (!date) return '';
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === yesterday.toDateString()) return 'Yst';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const formatTime = (timeInput) => {
  const date = asDate(timeInput);
  if (!date) return '';
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

watch(selectedChatId, (newId, oldId) => {
  if (oldId && mainStore.user?.uid) {
    chatStore.unsubscribeFromMessages(oldId);
  }
  if (newId && mainStore.user?.uid) {
    chatStore.subscribeToMessages(mainStore.user.uid, newId);
    nextTick(() => {
      chatLayoutRef.value?.scrollToBottom();
      chatLayoutRef.value?.focusInput();
    });
  } else if (!newId) {

  }
});

watch(isThinking, (thinking) => {
  if (thinking) {
    let dotCount = 0;
    thinkingInterval = setInterval(() => {
      thinkingDots.value = '.'.repeat((dotCount % 4));
      dotCount++;
    }, 300);
  } else {
    if (thinkingInterval) {
      clearInterval(thinkingInterval);
      thinkingInterval = null;
    }
    thinkingDots.value = '';
  }
});

watch(currentMessages, () => {
  if (chatLayoutRef.value) {
    chatLayoutRef.value.scrollToBottom();
  }
}, { deep: true });


onMounted(async () => {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    isDarkMode.value = true;
    document.documentElement.classList.add('dark');
  } else {
    isDarkMode.value = false;
    document.documentElement.classList.remove('dark');
  }

  if (mainStore.user?.uid) {
    await chatStore.loadUserProfile(mainStore.user.uid);
    await chatStore.loadChats(mainStore.user.uid, 'active');

    if (activeChats.value.length > 0) {
      const mostRecentChat = activeChats.value.sort((a, b) => (b.updatedAt?.toDate() || 0) - (a.updatedAt?.toDate() || 0))[0];
      if (mostRecentChat) {

      }
    }
  } else {
    console.log("User not available on mount, waiting for auth state change.");
  }

  nextTick(() => {
    if (chatLayoutRef.value) {
      chatLayoutRef.value.focusInput();
    }
  });
});

onBeforeUnmount(() => {
  if (selectedChatId.value && mainStore.user?.uid) {
    chatStore.unsubscribeFromMessages(selectedChatId.value);
  }
  if (thinkingInterval) {
    clearInterval(thinkingInterval);
  }
});

</script>

<style scoped>
body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* Backdrop fade */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Sidebar slide in */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from {
  transform: translateX(-100%);
}

.slide-leave-to {
  transform: translateX(-100%);
}
</style>