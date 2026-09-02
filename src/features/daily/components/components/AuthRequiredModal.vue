<template>
    <Teleport to="body">
        <Transition name="modal">
            <div v-if="show" class="auth-modal" @keydown="onDialogKeydown">
                <div class="auth-modal__backdrop" @click="$emit('close')"></div>

                <Transition name="modal-card">
                    <div v-if="showCard" ref="dialogRef" class="auth-modal__dialog" role="dialog" aria-modal="true"
                        aria-labelledby="auth-modal-title" aria-describedby="auth-modal-message" tabindex="-1">
                        <div class="auth-modal__content">
                            <div class="auth-modal__heading">
                                <span class="auth-modal__icon"><component :is="icon" aria-hidden="true" /></span>
                                <div>
                                    <p class="auth-modal__eyebrow">Wordle Unlimited</p>
                                    <h2 id="auth-modal-title">{{ title }}</h2>
                                </div>
                            </div>

                            <p id="auth-modal-message" class="auth-modal__message">{{ message }}</p>

                            <p v-if="extraInfo" class="auth-modal__extra">{{ extraInfo }}</p>

                            <div class="auth-modal__actions">
                                <button v-if="showPrimaryAction" ref="primaryButtonRef" type="button" class="auth-modal__primary"
                                    @click="onPrimaryAction">
                                    {{ primaryActionText }}
                                </button>

                                <button v-if="showSecondaryAction" type="button" class="auth-modal__secondary" @click="onSecondaryAction">
                                    {{ secondaryActionText }}
                                </button>

                                <button v-if="showClose" ref="primaryButtonRef" type="button" class="auth-modal__secondary"
                                    @click="$emit('close')">
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
import { Lock, Trophy, UserX, AlertCircle } from '@lucide/vue'

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
const dialogRef = ref(null)
const primaryButtonRef = ref(null)
let previousActiveElement = null

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
            return 'Sign in to play'
        case 'daily-required':
            return 'Finish today\'s Wordle first'
        case 'error':
            return 'Couldn\'t open this game'
        default:
            return 'This game is unavailable'
    }
})

const message = computed(() => {
    if (props.customMessage) return props.customMessage
    switch (props.type) {
        case 'auth-required':
            return 'Use your TempestID to unlock Wordle Unlimited.'
        case 'daily-required':
            return 'Play today\'s Wordle, then come back for as many extra puzzles as you like.'
        case 'error':
            return 'The game did not load. Close this message and try again.'
        default:
            return 'This feature is currently unavailable.'
    }
})

const extraInfo = computed(() => {
    if (props.customExtraInfo) return props.customExtraInfo
    switch (props.type) {
        case 'auth-required':
            return 'Your account keeps your unlimited progress together across visits.'
        case 'daily-required':
            return 'The daily puzzle still counts as your one Wordle for today.'
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
            return 'Sign in with TempestID'
        case 'daily-required':
            return 'Play today\'s Wordle'
        default:
            return 'Continue'
    }
})

const showSecondaryAction = computed(() => {
    return props.type === 'auth-required'
})

const secondaryActionText = computed(() => {
    return 'Not now'
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

function onDialogKeydown(event) {
    if (event.key === 'Escape') {
        event.preventDefault()
        emit('close')
        return
    }

    if (event.key !== 'Tab' || !dialogRef.value) return

    const focusable = [...dialogRef.value.querySelectorAll('button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])')]
    if (!focusable.length) {
        event.preventDefault()
        dialogRef.value.focus()
        return
    }

    const first = focusable[0]
    const last = focusable[focusable.length - 1]

    if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
    }
}

// Animation control
watch(
    () => props.show,
    async (newVal) => {
        if (newVal) {
            previousActiveElement = document.activeElement
            await nextTick()
            showCard.value = true
            await nextTick()
            primaryButtonRef.value?.focus()
        } else {
            showCard.value = false
            await nextTick()
            previousActiveElement?.focus?.()
            previousActiveElement = null
        }
    }
)
</script>

<style scoped>
.auth-modal {
    position: fixed;
    inset: 0;
    z-index: 200;
    display: grid;
    place-items: center;
    padding: 1rem;
    font-family: var(--font-body);
}

.auth-modal__backdrop {
    position: absolute;
    inset: 0;
    background: rgb(4 3 6 / 82%);
    backdrop-filter: blur(8px);
}

.auth-modal__dialog {
    position: relative;
    width: min(100%, 25rem);
    overflow: hidden;
    border: 1px solid #39333f;
    border-radius: 0.85rem;
    color: #f7f2f6;
    background: #121018;
    box-shadow: 0 24px 80px rgb(0 0 0 / 55%);
}

.auth-modal__dialog:focus {
    outline: none;
}

.auth-modal__content {
    padding: 1.35rem;
}

.auth-modal__heading {
    display: flex;
    align-items: center;
    gap: 0.8rem;
}

.auth-modal__icon {
    display: grid;
    width: 2.7rem;
    height: 2.7rem;
    flex: 0 0 auto;
    place-items: center;
    border: 1px solid #753469;
    border-radius: 0.65rem;
    color: #f0a5df;
    background: #281225;
}

.auth-modal__icon svg {
    width: 1.2rem;
}

.auth-modal__eyebrow {
    margin: 0 0 0.2rem;
    color: #f0a5df;
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.09em;
    text-transform: uppercase;
}

.auth-modal h2 {
    margin: 0;
    font-family: var(--font-heading);
    font-size: 1.45rem;
    line-height: 1.1;
}

.auth-modal__message {
    margin: 1rem 0 0;
    color: #c4bbc8;
    font-size: 0.82rem;
    line-height: 1.55;
}

.auth-modal__extra {
    margin: 0.8rem 0 0;
    padding-left: 0.75rem;
    border-left: 2px solid #753469;
    color: #928996;
    font-size: 0.7rem;
    line-height: 1.45;
}

.auth-modal__actions {
    display: flex;
    gap: 0.55rem;
    margin-top: 1.25rem;
}

.auth-modal__actions button {
    min-height: 2.65rem;
    flex: 1;
    padding: 0.55rem 0.8rem;
    border-radius: 0.55rem;
    font: inherit;
    font-size: 0.72rem;
    font-weight: 700;
    cursor: pointer;
}

.auth-modal__actions button:focus-visible {
    outline: 2px solid #f0a5df;
    outline-offset: 2px;
}

.auth-modal__primary {
    border: 1px solid #91427f;
    color: white;
    background: #7b2169;
}

.auth-modal__primary:hover {
    background: #92277e;
}

.auth-modal__secondary {
    border: 1px solid #3a3445;
    color: #d9d0dd;
    background: #1a1720;
}

.auth-modal__secondary:hover {
    background: #211d28;
}

.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.18s ease;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}

.modal-card-enter-active {
    transition: opacity 0.18s ease, transform 0.18s ease;
}

.modal-card-leave-active {
    transition: opacity 0.14s ease, transform 0.14s ease;
}

.modal-card-enter-from {
    opacity: 0;
    transform: translateY(0.75rem);
}

.modal-card-leave-to {
    opacity: 0;
    transform: translateY(0.35rem);
}

@media (max-width: 420px) {
    .auth-modal__actions {
        flex-direction: column;
    }
}

@media (prefers-reduced-motion: reduce) {
    .modal-enter-active,
    .modal-leave-active,
    .modal-card-enter-active,
    .modal-card-leave-active {
        transition: none;
    }
}
</style>
