<template>
    <div class="flex-1 overflow-y-auto p-4 w-full min-w-0" ref="messagesContainerRef">
        <Transition name="fade">
            <WelcomeScreen v-if="!currentMessages.length && !isThinking" />
            <div v-else>
                <div class="flex flex-col w-full max-w-full">
                    <MessageBubble v-for="(message, index) in currentMessages || []" :key="message.messageId || index"
                        :message="message" :formattedTime="formatTime" :show-icons="false" />
                </div>
            </div>
        </Transition>
        <LoadingScreen v-if="isThinking" :thinking-dots="thinkingDots" />
    </div>
</template>

<script setup>
import { defineProps, ref, watch, nextTick } from 'vue';
import WelcomeScreen from './WelcomeScreen.vue';
import MessageBubble from './MessageBubble.vue';
import LoadingScreen from './LoadingScreen.vue';

const props = defineProps({
    currentMessages: Array,
    isThinking: Boolean,
    formatTime: Function,
    thinkingDots: String,
});

const messagesContainerRef = ref(null);

const scrollToBottom = () => {
    nextTick(() => {
        if (messagesContainerRef.value) {
            messagesContainerRef.value.scrollTop = messagesContainerRef.value.scrollHeight;
        }
    });
};

watch(() => props.currentMessages, () => {
    scrollToBottom();
}, { deep: true });

defineExpose({
    scrollToBottom
});

</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity .16s cubic-bezier(.4, 0, .2, 1);
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>