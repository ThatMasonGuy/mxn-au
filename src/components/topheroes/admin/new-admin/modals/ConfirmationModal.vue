<!-- ConfirmationModal.vue - Reusable confirmation dialog -->
<template>
    <teleport to="body">
        <transition name="modal">
            <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
                @click="handleBackdropClick">
                <div class="bg-card rounded-xl ring-1 ring-border/70 p-6 max-w-md w-full shadow-2xl" @click.stop>
                    <!-- Header -->
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center gap-3">
                            <div class="h-10 w-10 rounded-full flex items-center justify-center" :class="iconBgClass">
                                <component :is="icon" class="h-5 w-5" :class="iconColorClass" />
                            </div>
                            <h3 class="text-lg font-semibold">{{ title }}</h3>
                        </div>
                        <button @click="close" class="p-2 hover:bg-foreground/5 rounded-lg transition">
                            <X class="h-4 w-4 text-foreground/60" />
                        </button>
                    </div>

                    <!-- Content -->
                    <div class="mb-6">
                        <p class="text-foreground/80">{{ message }}</p>
                        <div v-if="details" class="mt-3 p-3 bg-foreground/5 rounded-lg text-sm text-foreground/70">
                            {{ details }}
                        </div>
                    </div>

                    <!-- Actions -->
                    <div class="flex items-center justify-end gap-3">
                        <button @click="close" class="btn-secondary">
                            {{ cancelText }}
                        </button>
                        <button @click="confirm" :disabled="loading" :class="[
                            'btn-primary',
                            variant === 'danger' ? 'btn-danger' : 'btn-primary'
                        ]">
                            <component v-if="loading" :is="LoaderIcon" class="h-4 w-4 animate-spin" />
                            <component v-else-if="confirmIcon" :is="confirmIcon" class="h-4 w-4" />
                            {{ confirmText }}
                        </button>
                    </div>
                </div>
            </div>
        </transition>
    </teleport>
</template>

<script setup>
import { computed } from 'vue'
import { X, AlertTriangle, Info, CheckCircle, Loader2 } from 'lucide-vue-next'

const props = defineProps({
    isOpen: {
        type: Boolean,
        default: false
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    details: {
        type: String,
        default: null
    },
    variant: {
        type: String,
        default: 'default', // 'default', 'danger', 'warning', 'success'
        validator: (value) => ['default', 'danger', 'warning', 'success'].includes(value)
    },
    confirmText: {
        type: String,
        default: 'Confirm'
    },
    cancelText: {
        type: String,
        default: 'Cancel'
    },
    confirmIcon: {
        type: [Object, Function],
        default: null
    },
    loading: {
        type: Boolean,
        default: false
    },
    closeOnBackdrop: {
        type: Boolean,
        default: true
    }
})

const emit = defineEmits(['confirm', 'cancel', 'close'])

const LoaderIcon = Loader2

const icon = computed(() => {
    const icons = {
        default: Info,
        danger: AlertTriangle,
        warning: AlertTriangle,
        success: CheckCircle
    }
    return icons[props.variant]
})

const iconBgClass = computed(() => {
    const classes = {
        default: 'bg-velaris-teal/15',
        danger: 'bg-red-500/15',
        warning: 'bg-velaris-amber/15',
        success: 'bg-velaris-green/15'
    }
    return classes[props.variant]
})

const iconColorClass = computed(() => {
    const classes = {
        default: 'text-velaris-teal',
        danger: 'text-red-500',
        warning: 'text-velaris-amber',
        success: 'text-velaris-green'
    }
    return classes[props.variant]
})

function handleBackdropClick() {
    if (props.closeOnBackdrop) {
        close()
    }
}

function close() {
    emit('close')
    emit('cancel')
}

function confirm() {
    emit('confirm')
}
</script>