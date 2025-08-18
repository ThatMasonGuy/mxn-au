<template>
    <Teleport to="body">
        <Transition name="modal">
            <div v-if="show" class="fixed inset-0 z-[200] flex items-center justify-center p-4"
                @click.self="$emit('close')">
                <!-- Backdrop -->
                <div class="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>

                <!-- Modal Card -->
                <Transition name="modal-card">
                    <div v-if="showCard"
                        class="relative w-full max-w-md rounded-2xl border border-zinc-700/80 bg-gradient-to-br from-zinc-800/95 to-zinc-900/95 backdrop-blur-sm shadow-2xl">
                        <!-- Gradient overlay -->
                        <div
                            class="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-600/10 via-transparent to-fuchsia-600/10">
                        </div>

                        <!-- Content -->
                        <div class="relative p-6">
                            <!-- Icon -->
                            <div class="mb-4 flex justify-center">
                                <div
                                    class="h-16 w-16 rounded-2xl bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 ring-1 ring-violet-500/30 flex items-center justify-center">
                                    <component :is="icon" class="h-8 w-8 text-violet-300" />
                                </div>
                            </div>

                            <!-- Title -->
                            <h2 class="mb-2 text-center text-2xl font-bold text-white">
                                {{ title }}
                            </h2>

                            <!-- Message -->
                            <p class="mb-6 text-center text-sm text-zinc-300">
                                {{ message }}
                            </p>

                            <!-- Extra info (optional) -->
                            <div v-if="extraInfo"
                                class="mb-6 rounded-xl bg-violet-600/10 border border-violet-500/20 p-4 text-center">
                                <p class="text-xs text-violet-200">{{ extraInfo }}</p>
                            </div>

                            <!-- Actions -->
                            <div class="flex flex-col gap-3">
                                <button v-if="showPrimaryAction" @click="onPrimaryAction"
                                    class="w-full rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition-all hover:from-violet-500 hover:to-fuchsia-500">
                                    {{ primaryActionText }}
                                </button>

                                <button v-if="showSecondaryAction" @click="onSecondaryAction"
                                    class="w-full rounded-xl bg-white/10 px-4 py-3 text-sm font-semibold text-white backdrop-blur transition-all hover:bg-white/20">
                                    {{ secondaryActionText }}
                                </button>

                                <button v-if="showClose" @click="$emit('close')"
                                    class="w-full rounded-xl border border-zinc-700/50 bg-zinc-900/50 px-4 py-3 text-sm font-semibold text-zinc-300 transition-all hover:bg-zinc-800/70">
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </Transition>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
import { ref, watch, nextTick, computed } from 'vue'
import { Lock, Trophy, UserX, AlertCircle } from 'lucide-vue-next'

const props = defineProps({
    show: Boolean,
    type: {
        type: String,
        default: 'auth-required', // 'auth-required', 'daily-required', 'error'
        validator: (value) => ['auth-required', 'daily-required', 'error'].includes(value)
    },
    customTitle: String,
    customMessage: String,
    customExtraInfo: String,
    customIcon: Object
})

const emit = defineEmits(['close', 'sign-in', 'play-daily', 'primary-action'])

const showCard = ref(false)

// Computed properties for dynamic content
const icon = computed(() => {
    if (props.customIcon) return props.customIcon
    switch (props.type) {
        case 'auth-required':
            return UserX
        case 'daily-required':
            return Trophy
        case 'error':
            return AlertCircle
        default:
            return Lock
    }
})

const title = computed(() => {
    if (props.customTitle) return props.customTitle
    switch (props.type) {
        case 'auth-required':
            return 'Sign In Required'
        case 'daily-required':
            return 'Complete Daily First'
        case 'error':
            return 'Oops!'
        default:
            return 'Access Restricted'
    }
})

const message = computed(() => {
    if (props.customMessage) return props.customMessage
    switch (props.type) {
        case 'auth-required':
            return 'You need to be signed in with your TempestID to play Wordle Unlimited.'
        case 'daily-required':
            return 'Complete today\'s daily Wordle puzzle first to unlock unlimited play!'
        case 'error':
            return 'Something went wrong. Please try again.'
        default:
            return 'This feature is currently unavailable.'
    }
})

const extraInfo = computed(() => {
    if (props.customExtraInfo) return props.customExtraInfo
    switch (props.type) {
        case 'auth-required':
            return 'Sign in is required to prevent API abuse and track your unlimited progress.'
        case 'daily-required':
            return 'This helps us maintain fair play and ensures everyone tries the daily challenge.'
        default:
            return null
    }
})

const showPrimaryAction = computed(() => {
    return props.type === 'auth-required' || props.type === 'daily-required'
})

const primaryActionText = computed(() => {
    switch (props.type) {
        case 'auth-required':
            return 'Sign In / Create Account'
        case 'daily-required':
            return 'Play Daily Wordle'
        default:
            return 'Continue'
    }
})

const showSecondaryAction = computed(() => {
    return props.type === 'auth-required'
})

const secondaryActionText = computed(() => {
    return 'Back to Games'
})

const showClose = computed(() => {
    return props.type === 'error' || (!showPrimaryAction.value && !showSecondaryAction.value)
})

// Action handlers
function onPrimaryAction() {
    switch (props.type) {
        case 'auth-required':
            emit('sign-in')
            break
        case 'daily-required':
            emit('play-daily')
            break
        default:
            emit('primary-action')
    }
}

function onSecondaryAction() {
    emit('close')
}

// Animation control
watch(
    () => props.show,
    async (newVal) => {
        if (newVal) {
            await nextTick()
            setTimeout(() => {
                showCard.value = true
            }, 50)
        } else {
            showCard.value = false
        }
    }
)
</script>

<style scoped>
/* Modal backdrop transition */
.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}

/* Card transition */
.modal-card-enter-active {
    transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.modal-card-leave-active {
    transition: all 0.2s ease;
}

.modal-card-enter-from {
    opacity: 0;
    transform: scale(0.8) translateY(20px);
}

.modal-card-leave-to {
    opacity: 0;
    transform: scale(0.95);
}
</style>