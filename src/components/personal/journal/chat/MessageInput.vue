<template>
    <div class="border-t border-zinc-200 dark:border-zinc-800 p-4">
        <div
            class="flex items-end bg-white dark:bg-zinc-800 rounded-2xl border border-zinc-200 dark:border-zinc-700 overflow-hidden px-4 py-3">
            <textarea v-model="localNewMessage" @keydown="handleKeydown" placeholder="Send a message..."
                class="flex-grow resize-none bg-transparent outline-none text-zinc-900 dark:text-zinc-100 h-auto" ref="messageInputRef"></textarea>
            <button @click="sendMessage" :disabled="isThinking || !localNewMessage.trim()" :class="[
                'ml-3 p-2 rounded-lg text-white transition-colors shrink-0',
                localNewMessage.trim()
                    ? 'bg-indigo-600 hover:bg-indigo-700'
                    : 'bg-zinc-300 dark:bg-zinc-700 cursor-not-allowed',
            ]">
                <svg xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" width="16" height="16"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
            </button>
        </div>
    </div>
</template>

<script setup>
import { computed, ref, watch, defineProps, defineEmits, nextTick, onMounted } from "vue";

const props = defineProps({
    modelValue: String,
    isThinking: Boolean,
    isImageUploadEnabled: {
        type: Boolean,
        default: false,
    },
    isVoiceRecordEnabled: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(["update:modelValue", "send-message"]);

const localNewMessage = ref(props.modelValue);
const messageInputRef = ref(null);

watch(
    () => props.modelValue,
    (newValue) => {
        localNewMessage.value = newValue;
    }
);

watch(localNewMessage, (newVal) => {
    emit("update:modelValue", newVal);
});

const adjustHeight = () => {
  nextTick(() => {
    const el = messageInputRef.value;
    if (el) {
      el.style.height = 'auto'; // reset height
      const maxHeight = 7 * parseFloat(getComputedStyle(el).lineHeight); // 7 lines max
      el.style.height = Math.min(el.scrollHeight, maxHeight) + 'px';
      el.style.overflowY = el.scrollHeight > maxHeight ? 'auto' : 'hidden';
    }
  });
};

watch(localNewMessage, () => {
  adjustHeight();
});

onMounted(() => {
  adjustHeight();
});

// Allow up to 7 rows now
const textareaRows = computed(() => {
    const lines = localNewMessage.value?.split("\n").length || 1;
    return Math.min(Math.max(1, lines), 7);
});

const sendMessage = () => {
    if (!props.isThinking && localNewMessage.value.trim()) {
        emit("send-message", localNewMessage.value);
    }
};

const handleKeydown = (event) => {
  if (event.key === 'Enter') {
    if (event.shiftKey) {
      // Let Shift+Enter insert new line naturally
      return;
    } else if (event.ctrlKey || !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  }
};

const focus = () => {
    messageInputRef.value?.focus();
};

defineExpose({
    focus,
    clear: () => {
        localNewMessage.value = "";
    },
});
</script>

<style scoped>
textarea {
    padding-top: 0rem;
    padding-bottom: 0.3rem;
    line-height: 1.5;
}
</style>