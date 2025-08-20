<template>
    <Teleport to="body">
        <Transition name="modal-fade">
            <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center">
                <!-- Backdrop -->
                <div class="fixed inset-0 bg-black/70 backdrop-blur-sm" @click="handleCancel"></div>

                <!-- Modal -->
                <div class="relative max-w-md w-full bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl shadow-2xl mx-4 border border-slate-700/50 overflow-hidden backdrop-blur-sm"
                    @click.stop>

                    <!-- Header -->
                    <div class="px-6 py-4 border-b border-slate-700/50 flex items-center justify-between">
                        <div class="flex items-center space-x-3">
                            <div class="w-10 h-10 rounded-full flex items-center justify-center"
                                :class="variantConfig.iconBg">
                                <component :is="variantConfig.icon" :class="['w-5 h-5', variantConfig.iconColor]" />
                            </div>
                            <h3 class="text-xl font-semibold text-white">{{ title }}</h3>
                        </div>
                        <button @click="handleCancel"
                            class="text-slate-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-700/50">
                            <X class="w-5 h-5" />
                        </button>
                    </div>

                    <!-- Content -->
                    <div class="px-6 py-6">
                        <div v-if="message" class="text-slate-300 leading-relaxed">
                            {{ message }}
                        </div>
                        <slot></slot>
                    </div>

                    <!-- Footer -->
                    <div
                        class="px-6 py-4 bg-gradient-to-r from-slate-900/50 to-slate-800/50 border-t border-slate-700/50 flex justify-end gap-3">
                        <Button variant="outline" @click="handleCancel"
                            class="bg-transparent border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white hover:border-slate-500 transition-all duration-200">
                            <X class="w-4 h-4 mr-2" />
                            {{ cancelText }}
                        </Button>
                        <Button :class="variantConfig.buttonClass" @click="handleConfirm">
                            <component :is="variantConfig.icon" class="w-4 h-4 mr-2" />
                            {{ confirmText }}
                        </Button>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { Button } from '@/components/ui/button'
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
            iconBg: 'bg-gradient-to-r from-red-500/20 to-pink-500/20',
            iconColor: 'text-red-400',
            buttonClass: 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200'
        },
        warning: {
            icon: AlertTriangle,
            iconBg: 'bg-gradient-to-r from-amber-500/20 to-orange-500/20',
            iconColor: 'text-amber-400',
            buttonClass: 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200'
        },
        info: {
            icon: Info,
            iconBg: 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20',
            iconColor: 'text-blue-400',
            buttonClass: 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200'
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

.modal-fade-enter-active .bg-gradient-to-br {
    transition: transform 0.2s ease-out;
}

.modal-fade-leave-active .bg-gradient-to-br {
    transition: transform 0.15s ease-in;
}

.modal-fade-enter-from .bg-gradient-to-br,
.modal-fade-leave-to .bg-gradient-to-br {
    transform: scale(0.95);
}

/* Glass morphism effect */
.backdrop-blur-sm {
    backdrop-filter: blur(4px);
}
</style>