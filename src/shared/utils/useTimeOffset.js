// src/composables/useTimeOffset.js
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { DateTime } from 'luxon'

/**
 * useTimeOffset composable - returns the local time and countdown for a fixed event time
 *
 * @param {Object} options
 * @param {string} options.fixedTime - e.g. '02:00' for 2am
 * @param {string} options.fixedTimezone - e.g. 'UTC'
 * @param {string} options.userTimezone - e.g. 'Australia/Brisbane' or undefined for auto-detect
 */
export function useTimeOffset({
    fixedTime = '02:00',
    fixedTimezone = 'UTC',
    userTimezone = undefined
}) {
    const tick = ref(new Date())

    // Re-tick every minute
    let interval = null
    onMounted(() => {
        interval = setInterval(() => {
            tick.value = new Date()
        }, 60000)
    })
    onUnmounted(() => {
        clearInterval(interval)
    })

    const result = computed(() => {
        const userNow = DateTime.fromJSDate(tick.value)
        const tz = userTimezone || Intl.DateTimeFormat().resolvedOptions().timeZone

        if (!tz || typeof tz !== 'string') {
            throw new Error('Invalid or undefined user timezone')
        }

        const [hour, minute] = fixedTime.split(':').map(Number)

        // Create fixed event time today in fixed timezone
        let fixedTimeToday = DateTime.fromObject({ hour, minute, second: 0 }, { zone: fixedTimezone })

        // Convert to user zone
        const fixedInUserZone = fixedTimeToday.setZone(tz)
        const userNowInZone = userNow.setZone(tz)

        // If it already passed today, shift to tomorrow
        const nextOccurrence = fixedInUserZone < userNowInZone
            ? fixedInUserZone.plus({ days: 1 })
            : fixedInUserZone

        const diff = nextOccurrence.diff(userNowInZone, ['hours', 'minutes']).toObject()

        const timeForYou = nextOccurrence.toFormat('h:mm a')
        const timeUntil = `${Math.floor(diff.hours || 0)}h ${Math.round(diff.minutes || 0)}m`

        return { timeForYou, timeUntil }
    })

    return {
        timeForYou: computed(() => result.value.timeForYou),
        timeUntil: computed(() => result.value.timeUntil)
    }
}
