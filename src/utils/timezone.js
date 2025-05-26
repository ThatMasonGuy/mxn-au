export function getUserTimezone() {
    try {
        return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
    } catch (e) {
        console.warn('⚠️ Failed to detect timezone. Defaulting to UTC.')
        return 'UTC'
    }
}

export function getLocalTimeString(timeZone = getUserTimezone(), date = new Date()) {
    try {
        return date.toLocaleString('en-AU', {
            timeZone,
            dateStyle: 'full',
            timeStyle: 'short'
        })
    } catch (e) {
        console.warn('⚠️ Failed to format local time string:', e)
        return date.toISOString()
    }
}

export function getLocalISO(timeZone = getUserTimezone(), date = new Date()) {
    try {
        const tzDate = new Intl.DateTimeFormat('en-CA', {
            timeZone,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        }).formatToParts(date)

        const pad = (v) => String(v).padStart(2, '0')

        const obj = Object.fromEntries(tzDate.map(({ type, value }) => [type, value]))
        return `${obj.year}-${pad(obj.month)}-${pad(obj.day)}T${pad(obj.hour)}:${pad(obj.minute)}:${pad(obj.second)}`
    } catch (e) {
        return date.toISOString()
    }
}
