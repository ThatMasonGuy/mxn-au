<template>
  <div class="flex-1 flex flex-col">
    <ChatHeader :selected-chat="selectedChat" :is-dark-mode="isDarkMode" :formatted-time="formatTime"
      @toggle-theme="$emit('toggle-theme')" @toggle-sidebar="$emit('toggle-sidebar')" />
    <ChatMainWindow ref="chatMainWindowRef" :current-messages="currentMessages" :is-thinking="isThinking"
      :format-time="formatTime" :thinking-dots="thinkingDots" :initial-new-message="newMessage"
      @send-message="handleSendMessage" @new-message-updated="handleNewMessageUpdate" />
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, watch } from 'vue';
import ChatHeader from '../chat/Header.vue';
import ChatMainWindow from '../chat/MainWindow.vue';

const props = defineProps({
  selectedChat: Object,
  isDarkMode: Boolean,
  formatTime: Function,
  currentMessages: Array,
  isThinking: Boolean,
  thinkingDots: String,
  newMessage: String,
});

const emit = defineEmits(['toggle-theme', 'send-message', 'update:newMessage', 'toggle-sidebar']);

const chatMainWindowRef = ref(null);

const handleSendMessage = (messageContent) => {
  emit('send-message', messageContent);
};

const handleNewMessageUpdate = (updatedMessage) => {
  emit('update:newMessage', updatedMessage);
}

const focusInput = () => {
  chatMainWindowRef.value?.focusInput();
};

const clearInput = () => {
  chatMainWindowRef.value?.clearInput();
};

const scrollToBottom = () => {
  chatMainWindowRef.value?.scrollToBottom();
};

defineExpose({
  focusInput,
  clearInput,
  scrollToBottom
});

watch(() => props.newMessage, (newVal) => {
  if (newVal === '' && chatMainWindowRef.value) {
  }
});

</script>