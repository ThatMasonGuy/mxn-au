<template>
    <div class="flex-1 flex flex-col overflow-hidden">
        <MessageList ref="messageListRef" :current-messages="currentMessages" :is-thinking="isThinking"
            :format-time="formatTime" :thinking-dots="thinkingDots" />
        <MessageInput ref="messageInputRef" v-model="newMessage" :is-thinking="isThinking"
            @send-message="handleSendMessage" :is-image-upload-enabled="false" :is-voice-record-enabled="false" />
    </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, watch, nextTick } from 'vue';
import MessageList from './MessageList.vue';
import MessageInput from './MessageInput.vue';

const props = defineProps({
    currentMessages: Array,
    isThinking: Boolean,
    formatTime: Function,
    thinkingDots: String,
    initialNewMessage: String,
});

const emit = defineEmits(['send-message', 'new-message-updated']);

const newMessage = ref(props.initialNewMessage || '');
const messageListRef = ref(null);
const messageInputRef = ref(null);

watch(newMessage, (val) => {
    emit('new-message-updated', val);
});

const handleSendMessage = (messageContent) => {
    emit('send-message', messageContent);
    // Parent should handle clearing the newMessage after successful send
};

const focusInput = () => {
    messageInputRef.value?.focus();
};

const clearInput = () => {
    if (messageInputRef.value) {
        messageInputRef.value.clear();
    }
};


const scrollToBottom = () => {
    messageListRef.value?.scrollToBottom();
};

// Expose methods to parent
defineExpose({
    focusInput,
    scrollToBottom,
    clearInput
});

</script>