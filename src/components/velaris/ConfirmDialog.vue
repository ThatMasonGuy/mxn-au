<template>
    <Teleport to="body">
        <Transition name="modal-fade">
            <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center">
                <!-- Backdrop -->
                <div class="fixed inset-0 bg-black/70 backdrop-blur-sm" @click="handleCancel"></div>

                <!-- Modal -->
                <div class="relative max-w-md w-full bg-background rounded-xl shadow-2xl mx-4 border border-border/60 overflow-hidden backdrop-blur-sm"
                    @click.stop>

                    <!-- Header -->
                    <div class="px-6 py-4 border-b border-border/60 flex items-center justify-between">
                        <div class="flex items-center space-x-3">
                            <div class="w-10 h-10 rounded-full flex items-center justify-center"
                                :class="variantConfig.iconBg">
                                <component :is="variantConfig.icon" :class="['w-5 h-5', variantConfig.iconColor]" />
                            </div>
                            <h3 class="text-xl font-semibold text-foreground">{{ title }}</h3>
                        </div>
                        <button @click="handleCancel"
                            class="text-foreground/50 hover:text-foreground transition-colors p-2 rounded-lg hover:bg-foreground/5">
                            <X class="w-5 h-5" />
                        </button>
                    </div>

                    <!-- Content -->
                    <div class="px-6 py-6">
                        <div v-if="message" class="text-foreground/80 leading-relaxed">
                            {{ message }}
                        </div>
                        <slot></slot>
                    </div>

                    <!-- Footer -->
                    <div class="px-6 py-4 bg-foreground/5 border-t border-border/60 flex justify-end gap-3">
                        <button @click="handleCancel" class="btn-soft-violet">
                            <X class="w-4 h-4 mr-2" />
                            {{ cancelText }}
                        </button>
                        <button :class="variantConfig.buttonClass" @click="handleConfirm">
                            <component :is="variantConfig.icon" class="w-4 h-4 mr-2" />
                            {{ confirmText }}
                        </button>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { X, AlertTriangle, AlertCircle, Info, Trash2 } from 'lucide-vue-next'

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

const variantConfig = computed(() => {
    const configs = {
        danger: {
            icon: Trash2,
            iconBg: 'bg-red-500/15',
            iconColor: 'text-red-400',
            buttonClass: 'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200 inline-flex items-center px-4 py-2 rounded-lg font-medium text-sm'
        },
        warning: {
            icon: AlertTriangle,
            iconBg: 'bg-velaris-amber/15',
            iconColor: 'text-velaris-amber',
            buttonClass: 'bg-gradient-to-r from-velaris-amber to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200 inline-flex items-center px-4 py-2 rounded-lg font-medium text-sm'
        },
        info: {
            icon: Info,
            iconBg: 'bg-velaris-teal/15',
            iconColor: 'text-velaris-teal',
            buttonClass: 'bg-gradient-to-r from-velaris-teal to-velaris-purple hover:from-teal-600 hover:to-purple-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200 inline-flex items-center px-4 py-2 rounded-lg font-medium text-sm'
        }
    }
    return configs[props.variant] || configs.danger
})

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
    if (e.key === 'Enter' && isOpen.value) {
        handleConfirm()
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

.modal-fade-enter-active .bg-background {
    transition: transform 0.2s ease-out;
}

.modal-fade-leave-active .bg-background {
    transition: transform 0.15s ease-in;
}

.modal-fade-enter-from .bg-background,
.modal-fade-leave-to .bg-background {
    transform: scale(0.95);
}

/* Glass morphism effect */
.backdrop-blur-sm {
    backdrop-filter: blur(4px);
}
</style>