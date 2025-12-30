// @/composables/useToast.js
import { ref } from 'vue'

const toasts = ref([])
let nextId = 1

export const useToast = () => {
    const show = (message, type = 'info', duration = 2000) => {
        const id = nextId++
        const toast = {
            id,
            message,
            type, // 'success', 'error', 'info', 'warning'
            duration
        }

        toasts.value.push(toast)

        setTimeout(() => {
            const index = toasts.value.findIndex(t => t.id === id)
            if (index > -1) {
                toasts.value.splice(index, 1)
            }
        }, duration)
    }

    const success = (message, duration) => show(message, 'success', duration)
    const error = (message, duration) => show(message, 'error', duration)
    const info = (message, duration) => show(message, 'info', duration)
    const warning = (message, duration) => show(message, 'warning', duration)

    return {
        toasts,
        show,
        success,
        error,
        info,
        warning
    }
}