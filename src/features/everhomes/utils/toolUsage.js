const FUNCTIONS_URL = import.meta.env?.VITE_FUNCTIONS_URL ?? ''

export const EVERHOMES_TOOL_CATALOGUE = Object.freeze([
    { id: 'water-bills', name: 'Water Bills' },
    { id: 'placement-fees', name: 'Placement Fees' },
    { id: 'participant-sda-funding', name: 'Participant SDA Funding' },
    { id: 'qr-code', name: 'QR Code Generator' },
    { id: 'inspection-report', name: 'Inspection Report' },
    { id: 'handover-report', name: 'Handover Report' },
])

const PRODUCTION_HOSTS = new Set([
    'mxn.au',
    'www.mxn.au',
    'mxn-au.web.app',
    'mxn-au.firebaseapp.com',
])

const firedEvents = new Set()
let fallbackSessionId = ''

function randomId() {
    if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID()
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, character => {
        const random = Math.floor(Math.random() * 16)
        const value = character === 'x' ? random : (random & 0x3) | 0x8
        return value.toString(16)
    })
}

function getSessionId() {
    if (typeof window === 'undefined') return randomId()
    const key = 'everhomes_tool_usage_session_v1'
    try {
        const current = window.sessionStorage.getItem(key)
        if (current) return current
        const created = randomId()
        window.sessionStorage.setItem(key, created)
        return created
    } catch {
        fallbackSessionId ||= randomId()
        return fallbackSessionId
    }
}

export function isEverhomesUsageHost(hostname) {
    return PRODUCTION_HOSTS.has(String(hostname ?? '').toLowerCase())
}

export function resolveEverhomesTool(route = {}) {
    const path = String(route.path ?? '').replace(/\/+$/, '') || '/'
    if (path === '/everhomes/water-bill' || path === '/everhomes/water-bills') return EVERHOMES_TOOL_CATALOGUE[0]
    if (['/everhomes/placement-fee', '/everhomes/placement-fees', '/everhomes/placement'].includes(path)) return EVERHOMES_TOOL_CATALOGUE[1]
    if (path === '/everhomes/sda-returns' || path === '/everhomes/sda-return') return EVERHOMES_TOOL_CATALOGUE[2]
    if (path === '/everhomes/qr-code' || path === '/everhomes/qr') return EVERHOMES_TOOL_CATALOGUE[3]
    const reportType = String(route.params?.reportType ?? '')
    if (reportType === 'handover' || path.includes('/handover')) return EVERHOMES_TOOL_CATALOGUE[5]
    if (reportType === 'inspection' || path.includes('/inspection')) return EVERHOMES_TOOL_CATALOGUE[4]
    return null
}

function deviceClass() {
    if (typeof window === 'undefined') return 'unknown'
    if (window.innerWidth < 640) return 'mobile'
    if (window.innerWidth < 1024) return 'tablet'
    return 'desktop'
}

export function buildEverhomesUsageEvent({ toolId, action = 'opened', variant = null } = {}) {
    return {
        eventId: randomId(),
        sessionId: getSessionId(),
        toolId,
        action,
        variant: variant || null,
        device: deviceClass(),
    }
}

export async function trackEverhomesToolUsage({
    toolId,
    action = 'opened',
    variant = null,
    once = true,
} = {}) {
    if (typeof window === 'undefined' || !FUNCTIONS_URL || !isEverhomesUsageHost(window.location.hostname)) return false

    const eventKey = `${toolId}:${action}:${variant ?? ''}`
    if (once && firedEvents.has(eventKey)) return false
    if (once) firedEvents.add(eventKey)

    try {
        const response = await fetch(`${FUNCTIONS_URL}/recordEverhomesToolUsage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(buildEverhomesUsageEvent({ toolId, action, variant })),
            keepalive: true,
        })
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        return true
    } catch (error) {
        if (once) firedEvents.delete(eventKey)
        console.warn('[Everhomes usage] Event was not recorded:', error)
        return false
    }
}

export function trackEverhomesRouteUsage(route) {
    const tool = resolveEverhomesTool(route)
    if (!tool) return false
    void trackEverhomesToolUsage({ toolId: tool.id, action: 'opened', once: false })
    return true
}
