// timezones.js
// Real timezone utilities w/ full list + country mapping.
// Requires: date-fns, date-fns-tz (v3+), @vvo/tzdb

import { format, parseISO, getUnixTime, fromUnixTime } from 'date-fns'
import { formatInTimeZone, fromZonedTime, toZonedTime } from 'date-fns-tz'
import { getTimeZones } from '@vvo/tzdb' // full tz dataset with country mapping & population

// ------------------------------
// Core detection & lists
// ------------------------------

/** Detect the user's IANA timezone (falls back to UTC) */
export function getUserTimezone() {
    try {
        return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
    } catch {
        return 'UTC'
    }
}

const HARD_FALLBACK = [
    'UTC',
    'Australia/Brisbane', 'Australia/Sydney', 'Australia/Melbourne', 'Australia/Perth', 'Australia/Adelaide',
    'Pacific/Auckland',
    'Asia/Tokyo', 'Asia/Seoul', 'Asia/Shanghai', 'Asia/Hong_Kong', 'Asia/Singapore', 'Asia/Kolkata', 'Asia/Bangkok',
    'Europe/London', 'Europe/Paris', 'Europe/Berlin', 'Europe/Madrid', 'Europe/Rome', 'Europe/Amsterdam',
    'Europe/Zurich', 'Europe/Stockholm', 'Europe/Athens', 'Europe/Moscow',
    'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles', 'America/Toronto',
    'America/Mexico_City', 'America/Bogota', 'America/Lima', 'America/Sao_Paulo', 'America/Argentina/Buenos_Aires',
    'Africa/Cairo', 'Africa/Johannesburg', 'Africa/Nairobi', 'Asia/Dubai', 'Asia/Jerusalem', 'Asia/Riyadh'
]

/**
 * Full list of IANA time zone names.
 * Priority:
 *   1) @vvo/tzdb (works everywhere, includes country mapping)
 *   2) Intl.supportedValuesOf('timeZone') (browser-only)
 *   3) hard fallback list (small, just to not break UI)
 */
export function getAllTimezones() {
    try {
        const tzdb = getTimeZones() // array of objects
        if (Array.isArray(tzdb) && tzdb.length) {
            // tzdb items have .name (IANA, e.g. "Australia/Brisbane")
            const timezones = tzdb
                .map(z => z?.name)
                .filter(name => name && typeof name === 'string')

            // Deduplicate timezone names
            return [...new Set(timezones)]
        }
    } catch (error) {
        console.warn('Error getting timezones from tzdb:', error)
        // ignore and try engine list
    }

    try {
        if (typeof Intl !== 'undefined' && typeof Intl.supportedValuesOf === 'function') {
            const list = Intl.supportedValuesOf('timeZone')
            if (Array.isArray(list) && list.length) return [...new Set(list)]
        }
    } catch (error) {
        console.warn('Error getting timezones from Intl:', error)
        // ignore
    }

    return HARD_FALLBACK
}

/** Validate a timezone string against the formatter (fast) or the dataset */
export function isValidTimezone(tz) {
    if (!tz || typeof tz !== 'string') return false
    try {
        formatInTimeZone(new Date(), tz, 'yyyy-MM-dd')
        return true
    } catch {
        return getAllTimezones().includes(tz)
    }
}

// ------------------------------
// Country ↔ Timezone helpers (tzdb-backed)
// ------------------------------

/**
 * Get all time zones used by a country (ISO 3166-1 alpha-2, e.g. 'AU', 'US', 'MX').
 * Sorted by population (descending) so the first is the "most common".
 */
export function getTimezonesByCountry(countryCode) {
    if (!countryCode) return []
    let zones = []
    try {
        const tzdb = getTimeZones()
        const cc = countryCode.toUpperCase()
        // tzdb entries include .countries (array of ISO codes) and .population
        zones = tzdb
            .filter(z => {
                if (!z || !z.name) return false
                return Array.isArray(z.countries)
                    ? z.countries.includes(cc)
                    : (z.countryCode?.toUpperCase?.() === cc)
            })
            .sort((a, b) => (b.population ?? 0) - (a.population ?? 0))
            .map(z => ({
                id: z.name,                                   // "Australia/Brisbane"
                alt: z.alternativeName || z.abbreviation,     // "Australian Eastern Standard Time" / "AEST"
                offsetMinutes: z.currentTimeOffsetInMinutes ?? z.rawOffsetInMinutes ?? 0,
                population: z.population ?? 0,
                mainCities: z.mainCities || [],
            }))
            .filter(z => z.id) // Ensure we have valid IDs
    } catch (error) {
        console.warn('Error getting timezones for country:', countryCode, error)
        // If tzdb failed (shouldn't if installed), just return empty and let caller decide on a default.
        zones = []
    }
    return zones
}

/** Get the "primary" (most populous) timezone for a given country */
export function getPrimaryTimezoneForCountry(countryCode, fallback = 'UTC') {
    try {
        const zones = getTimezonesByCountry(countryCode)
        return zones[0]?.id || fallback
    } catch (error) {
        console.warn('Error getting primary timezone for country:', countryCode, error)
        return fallback
    }
}

// ------------------------------
// Display / formatting helpers
// ------------------------------

/** Human-ish display like "Australian Eastern Standard Time (UTC+10)" */
export function getTimezoneDisplayName(timezone) {
    if (!isValidTimezone(timezone)) return timezone || 'Unknown'
    try {
        const parts = new Intl.DateTimeFormat('en', {
            timeZone: timezone,
            hour: '2-digit',
            minute: '2-digit',
            timeZoneName: 'longGeneric'
        }).formatToParts(new Date())
        const name = parts.find(p => p.type === 'timeZoneName')?.value
        const offset = getTimezoneOffsetString(timezone)
        return name ? `${name} (${offset})` : `${timezone} (${offset})`
    } catch (error) {
        console.warn('Error getting timezone display name for:', timezone, error)
        return `${timezone} (${getTimezoneOffsetString(timezone)})`
    }
}

/** Current offset for a timezone as "UTC+10" / "UTC-05:30" */
export function getTimezoneOffsetString(timezone) {
    try {
        const off = formatInTimeZone(new Date(), timezone, 'XXX') // +10, +10:30, -05, etc.
        return `UTC${off}`
    } catch (error) {
        console.warn('Error getting timezone offset for:', timezone, error)
        return 'UTC'
    }
}

/** Current localized time string for any zone (full date + short time) */
export function getLocalTimeString(timeZone = getUserTimezone(), date = new Date()) {
    try {
        return new Intl.DateTimeFormat('en-AU', {
            timeZone,
            dateStyle: 'full',
            timeStyle: 'short'
        }).format(date)
    } catch (error) {
        console.warn('Error getting local time string:', error)
        return date.toISOString()
    }
}

/** ISO string rendered in a target timezone (optionally including the offset) */
export function getLocalISO(timeZone = getUserTimezone(), date = new Date(), includeOffset = false) {
    try {
        const pattern = includeOffset ? "yyyy-MM-dd'T'HH:mm:ssXXX" : "yyyy-MM-dd'T'HH:mm:ss"
        return formatInTimeZone(date, timeZone, pattern)
    } catch (error) {
        console.warn('Error getting local ISO:', error)
        return date.toISOString()
    }
}

/**
 * Convert a <input type="datetime-local"> value to epoch seconds,
 * interpreting it as wall time in `timezone`.
 */
export function datetimeLocalToUnixTimestamp(datetimeLocal, timezone = 'local') {
    try {
        const targetTz = timezone === 'local' ? getUserTimezone() : timezone
        const naive = parseISO(datetimeLocal) // no offset
        const utcDate = fromZonedTime(naive, targetTz)   // v3+
        return getUnixTime(utcDate)
    } catch (error) {
        console.warn('Error converting datetime to unix timestamp:', error)
        return Math.floor(new Date(datetimeLocal).getTime() / 1000)
    }
}

/** Convenience: current time (h:mm a) in a zone */
export function getCurrentTimeInTimezone(timezone) {
    try {
        return formatInTimeZone(new Date(), timezone, 'h:mm a')
    } catch (error) {
        console.warn('Error getting current time in timezone:', timezone, error)
        return 'Unknown'
    }
}

// ------------------------------
// Discord timestamp helpers
// ------------------------------

export function getDiscordTimestampFormats(unixTimestamp) {
    try {
        const date = fromUnixTime(unixTimestamp)
        return [
            {
                type: 'relative',
                name: 'Relative Time',
                code: `<t:${unixTimestamp}:R>`,
                preview: getRelativeTimePreview(date),
                description: 'Shows time relative to now (e.g., "in 2 hours", "3 days ago")'
            },
            {
                type: 'short-time',
                name: 'Short Time',
                code: `<t:${unixTimestamp}:t>`,
                preview: format(date, 'h:mm a'),
                description: 'Time in 12-hour format'
            },
            {
                type: 'long-time',
                name: 'Long Time',
                code: `<t:${unixTimestamp}:T>`,
                preview: format(date, 'h:mm:ss a'),
                description: 'Time in 12-hour format with seconds'
            },
            {
                type: 'short-date',
                name: 'Short Date',
                code: `<t:${unixTimestamp}:d>`,
                preview: format(date, 'MM/dd/yyyy'),
                description: 'Date in MM/DD/YYYY format'
            },
            {
                type: 'long-date',
                name: 'Long Date',
                code: `<t:${unixTimestamp}:D>`,
                preview: format(date, 'MMMM d, yyyy'),
                description: 'Full date format'
            },
            {
                type: 'short-datetime',
                name: 'Short Date/Time',
                code: `<t:${unixTimestamp}:f>`,
                preview: format(date, "MMMM d, yyyy 'at' h:mm a"),
                description: 'Date and time combined'
            },
            {
                type: 'long-datetime',
                name: 'Long Date/Time',
                code: `<t:${unixTimestamp}:F>`,
                preview: format(date, "EEEE, MMMM d, yyyy 'at' h:mm a"),
                description: 'Full date and time with day of week'
            }
        ]
    } catch (error) {
        console.error('Error generating Discord timestamp formats:', error)
        return []
    }
}

function getRelativeTimePreview(date) {
    try {
        const now = new Date()
        const diffMs = date.getTime() - now.getTime()
        const abs = (ms) => Math.abs(ms)
        const mins = Math.round(diffMs / 60000)
        const hours = Math.round(diffMs / 3600000)
        const days = Math.round(diffMs / 86400000)

        const isPast = diffMs < 0
        const prefix = isPast ? '' : 'in '
        const suffix = isPast ? ' ago' : ''

        if (abs(mins) < 1) return 'now'
        if (abs(mins) < 60) return `${prefix}${Math.abs(mins)} minute${abs(mins) !== 1 ? 's' : ''}${suffix}`
        if (abs(hours) < 24) return `${prefix}${Math.abs(hours)} hour${abs(hours) !== 1 ? 's' : ''}${suffix}`
        if (abs(days) < 30) return `${prefix}${Math.abs(days)} day${abs(days) !== 1 ? 's' : ''}${suffix}`

        const months = Math.round(abs(days) / 30)
        return `${prefix}${months} month${months !== 1 ? 's' : ''}${suffix}`
    } catch (error) {
        console.warn('Error generating relative time preview:', error)
        return 'Unknown'
    }
}

// ------------------------------
// Search & quick-picks
// ------------------------------

/** Simple substring search across IANA names; returns [{ id, display, offset }] */
export function searchTimezones(query) {
    try {
        const q = (query || '').trim().toLowerCase()
        const zones = getAllTimezones()
        const now = new Date()
        return zones
            .filter(z => z && z.toLowerCase().includes(q))
            .map(z => {
                try {
                    return {
                        id: z,
                        display: getTimezoneDisplayName(z),
                        offset: formatInTimeZone(now, z, 'XXX')
                    }
                } catch (error) {
                    console.warn(`Error processing timezone in search: ${z}`, error)
                    return null
                }
            })
            .filter(Boolean) // Remove null entries
            .sort((a, b) => a.display.localeCompare(b.display))
    } catch (error) {
        console.error('Error searching timezones:', error)
        return []
    }
}

/** "Sensible defaults" for a picker, deduped w/ the user's zone */
export function commonTimezones(primary = getUserTimezone()) {
    try {
        const base = [
            'UTC',
            'Australia/Brisbane', 'Australia/Sydney', 'Australia/Melbourne',
            'America/Los_Angeles', 'America/Denver', 'America/Chicago', 'America/New_York',
            'Europe/London', 'Europe/Berlin', 'Europe/Paris',
            'Asia/Tokyo', 'Asia/Shanghai', 'Asia/Singapore'
        ]
        const set = new Set([primary, ...base])
        return [...set].filter(isValidTimezone)
    } catch (error) {
        console.error('Error getting common timezones:', error)
        return ['UTC']
    }
}