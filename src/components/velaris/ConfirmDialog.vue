<template>
    <Teleport to="body">
        <Transition name="modal-fade">
            <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center">
                <!-- Backdrop -->
                <div class="fixed inset-0 bg-black/70" @click="handleCancel"></div>

                <!-- Modal -->
                <div class="relative max-w-md w-full bg-gray-800 rounded-lg shadow-xl mx-4 border border-gray-700 overflow-hidden"
                    @click.stop>
                    <!-- Header -->
                    <div class="px-6 py-4 border-b border-gray-700 flex items-center justify-between">
                        <h3 class="text-xl font-medium text-white">{{ title }}</h3>
                        <button @click="handleCancel"
                            class="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-gray-700">
                            <span class="i-lucide-x text-lg"></span>
                        </button>
                    </div>

                    <!-- Content -->
                    <div class="px-6 py-4">
                        <div v-if="message" class="text-gray-300 my-2">
                            {{ message }}
                        </div>
                        <slot></slot>
                    </div>

                    <!-- Footer -->
                    <div class="px-6 py-4 bg-gray-900/50 flex justify-end gap-3">
                        <Button variant="ghost" @click="handleCancel" class="text-gray-300 hover:text-white">
                            {{ cancelText }}
                        </Button>
                        <Button class="bg-red-600 hover:bg-red-700 text-white" @click="handleConfirm">
                            {{ confirmText }}
                        </Button>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watchEffect } from 'vue'
import { Button } from '@/components/ui/button'

const props = defineProps({
    title: {
        type: String,
        default: 'Confirm Action'
    },
    message: {
        type: String,
        default: ''
    },
    confirmText: {
        type: String,
        default: 'Confirm'
    },
    cancelText: {
        type: String,
        default: 'Cancel'
    },
    variant: {
        type: String,
        default: 'danger',
        validator: (value) => ['danger', 'warning', 'info'].includes(value)
    }
})

const emit = defineEmits(['confirm', 'cancel'])

const isOpen = ref(true)

const handleConfirm = () => {
    isOpen.value = false
    emit('confirm')
}

const handleCancel = () => {
    isOpen.value = false
    emit('cancel')
}

// Handle keyboard events (Escape to cancel)
const handleKeyDown = (e) => {
    if (e.key === 'Escape' && isOpen.value) {
        handleCancel()
    }
}

onMounted(() => {
    document.addEventListener('keydown', handleKeyDown)
})

onBeforeUnmount(() => {
    document.removeEventListener('keydown', handleKeyDown)
})
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
    transition: opacity 0.2s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
    opacity: 0;
}

.modal-fade-enter-active .bg-gray-800 {
    transition: transform 0.2s ease-out;
}

.modal-fade-leave-active .bg-gray-800 {
    transition: transform 0.15s ease-in;
}

.modal-fade-enter-from .bg-gray-800,
.modal-fade-leave-to .bg-gray-800 {
    transform: scale(0.95);
}
</style>