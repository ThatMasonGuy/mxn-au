<!-- ConfirmationModal.vue - Reusable confirmation dialog -->
<template>
    <Dialog :open="isOpen" @update:open="handleOpenChange">
        <DialogContent class="max-w-md">
            <DialogHeader>
                <div class="flex items-center gap-3">
                    <div class="h-10 w-10 rounded-full flex items-center justify-center" :class="iconBgClass">
                        <component :is="icon" class="h-5 w-5" :class="iconColorClass" />
                    </div>
                    <DialogTitle>{{ title }}</DialogTitle>
                </div>
                <DialogDescription v-if="message">
                    {{ message }}
                </DialogDescription>
            </DialogHeader>

            <!-- Content -->
            <div v-if="details" class="mt-3 p-3 bg-foreground/5 rounded-lg text-sm text-foreground/70">
                {{ details }}
            </div>

            <DialogFooter class="gap-3">
                <Button variant="outline" @click="cancel" :disabled="loading">
                    {{ cancelText }}
                </Button>
                <Button @click="confirm" :disabled="loading" :variant="buttonVariant">
                    <component v-if="loading" :is="LoaderIcon" class="h-4 w-4 animate-spin mr-2" />
                    <component v-else-if="confirmIcon" :is="confirmIcon" class="h-4 w-4 mr-2" />
                    {{ confirmText }}
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>

<script setup>
import { computed } from 'vue'
import { AlertTriangle, Info, CheckCircle, Loader2 } from 'lucide-vue-next'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

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
        default: ''
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

const emit = defineEmits(['update:isOpen', 'confirm', 'cancel', 'close'])

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

const buttonVariant = computed(() => {
    const variants = {
        default: 'default',
        danger: 'destructive',
        warning: 'default',
        success: 'default'
    }
    return variants[props.variant]
})

const handleOpenChange = (open) => {
    emit('update:isOpen', open)
    if (!open) {
        emit('close')
    }
}

function cancel() {
    emit('update:isOpen', false)
    emit('cancel')
    emit('close')
}

function confirm() {
    emit('confirm')
}
</script>