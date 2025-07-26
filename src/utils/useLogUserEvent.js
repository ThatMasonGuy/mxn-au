// @/composables/useLogUserEvent.js
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { firestore } from '@/firebase'
import { useMainStore } from '@/stores/useMainStore'

// Deduplication cache to prevent rapid duplicate events
const eventCache = new Map()
const CACHE_DURATION = 1000 // 1 second

const getCacheKey = (uid, eventType, data) => {
    return `${uid}-${eventType}-${JSON.stringify(data)}`
}

export const logUserEvent = async (eventType, data = {}) => {
    try {
        const mainStore = useMainStore()
        const user = mainStore.user

        if (!user?.uid) {
            // Silently skip if no user
            return
        }

        // Check for duplicate events
        const cacheKey = getCacheKey(user.uid, eventType, data)
        const cachedTime = eventCache.get(cacheKey)

        if (cachedTime && Date.now() - cachedTime < CACHE_DURATION) {
            console.log(`[logUserEvent] Skipping duplicate event: ${eventType}`)
            return
        }

        // Mark this event as processed
        eventCache.set(cacheKey, Date.now())

        // Clean up old cache entries
        setTimeout(() => {
            eventCache.delete(cacheKey)
        }, CACHE_DURATION)

        const eventData = {
            type: eventType,
            timestamp: serverTimestamp(),
            data: {
                ...data,
                userAgent: navigator.userAgent,
                url: window.location.href,
                viewport: {
                    width: window.innerWidth,
                    height: window.innerHeight
                }
            }
        }

        await addDoc(collection(firestore, `users/${user.uid}/userEvents`), eventData)

    } catch (err) {
        // More detailed error logging
        console.error('[logUserEvent] Failed to log:', {
            error: err,
            eventType,
            data,
            errorCode: err.code,
            errorMessage: err.message
        })
        // Don't throw - logging is non-critical
    }
}

// Convenience methods with deduplication
export const logPageView = (page) => {
    // For page views, only log if the page is different
    return logUserEvent('page_view', { page })
}

export const logAction = (action, details = {}) => {
    return logUserEvent('action', { action, ...details })
}

export const logError = (error, context = {}) => {
    return logUserEvent('error', {
        error: error.message,
        stack: error.stack,
        ...context
    })
}
