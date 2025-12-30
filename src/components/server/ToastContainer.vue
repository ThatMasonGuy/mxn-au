<template>
    <Teleport to="body">
        <div class="toast-container">
            <TransitionGroup name="toast">
                <div v-for="toast in toasts" :key="toast.id" class="toast" :class="`toast-${toast.type}`">

                    <div class="toast-icon">
                        <CheckCircleIcon v-if="toast.type === 'success'" class="w-5 h-5" />
                        <XCircleIcon v-else-if="toast.type === 'error'" class="w-5 h-5" />
                        <ExclamationCircleIcon v-else-if="toast.type === 'warning'" class="w-5 h-5" />
                        <InformationCircleIcon v-else class="w-5 h-5" />
                    </div>

                    <div class="toast-message">
                        {{ toast.message }}
                    </div>
                </div>
            </TransitionGroup>
        </div>
    </Teleport>
</template>

<script setup>
import {
    CheckCircleIcon,
    XCircleIcon,
    ExclamationCircleIcon,
    InformationCircleIcon
} from '@heroicons/vue/24/outline'
import { useToast } from '@/composables/useToast'

const { toasts } = useToast()
</script>

<style scoped>
.toast-container {
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    gap: 12px;
    pointer-events: none;
}

.toast {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    background: rgba(22, 27, 34, 0.95);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    min-width: 250px;
    max-width: 400px;
    pointer-events: auto;
    backdrop-filter: blur(10px);
}

.toast-icon {
    flex-shrink: 0;
}

.toast-message {
    flex: 1;
    font-size: 0.875rem;
    color: #e5e7eb;
    font-family: monospace;
}

.toast-success {
    border-color: rgba(16, 185, 129, 0.3);
}

.toast-success .toast-icon {
    color: #10b981;
}

.toast-error {
    border-color: rgba(239, 68, 68, 0.3);
}

.toast-error .toast-icon {
    color: #ef4444;
}

.toast-warning {
    border-color: rgba(245, 158, 11, 0.3);
}

.toast-warning .toast-icon {
    color: #f59e0b;
}

.toast-info {
    border-color: rgba(59, 130, 246, 0.3);
}

.toast-info .toast-icon {
    color: #3b82f6;
}

/* Toast transitions */
.toast-enter-active,
.toast-leave-active {
    transition: all 0.3s ease;
}

.toast-enter-from {
    opacity: 0;
    transform: translateX(100px);
}

.toast-leave-to {
    opacity: 0;
    transform: translateX(100px) scale(0.8);
}
</style>