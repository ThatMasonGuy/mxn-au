export const OPTIONAL_ANALYTICS_STORAGE_KEY = 'mxn_optional_analytics_v1'
export const ANALYTICS_POLICY_VERSION = 1

export const OPTIONAL_ANALYTICS_PREFERENCE = Object.freeze({
  ENABLED: 'enabled',
  DISABLED: 'disabled',
})

export const ANALYTICS_PRODUCTION_HOSTS = Object.freeze([
  'mxn.au',
  'www.mxn.au',
  'mxn-au.web.app',
  'mxn-au.firebaseapp.com',
])

const ANALYTICS_HOSTS = new Set(ANALYTICS_PRODUCTION_HOSTS)

const EVENT_PARAM_ALLOWLIST = Object.freeze({
  page_view: Object.freeze(['page_title', 'page_location', 'page_path']),
  login: Object.freeze(['method']),
  sign_up: Object.freeze(['method']),
})

const OPERATIONAL_EVENT_ALLOWLIST = Object.freeze({
  page_view: Object.freeze(['page']),
  signup: Object.freeze(['device', 'locale', 'timezone']),
  account_created: Object.freeze(['provider', 'areas', 'device', 'locale', 'timezone']),
  action: Object.freeze(['action']),
  error: Object.freeze(['name', 'area']),
})

function resolveStorage(storage) {
  if (storage) return storage
  if (typeof window === 'undefined') return null

  try {
    return window.localStorage
  } catch {
    return null
  }
}

export function readOptionalAnalyticsPreference(storage) {
  try {
    const rawValue = resolveStorage(storage)?.getItem(OPTIONAL_ANALYTICS_STORAGE_KEY)
    if (Object.values(OPTIONAL_ANALYTICS_PREFERENCE).includes(rawValue)) return rawValue
    if (!rawValue) return null

    const record = JSON.parse(rawValue)
    return record?.policyVersion === ANALYTICS_POLICY_VERSION
      && Object.values(OPTIONAL_ANALYTICS_PREFERENCE).includes(record?.status)
      ? record.status
      : null
  } catch {
    return null
  }
}

export function readOptionalAnalyticsPreferenceRecord(storage) {
  try {
    const rawValue = resolveStorage(storage)?.getItem(OPTIONAL_ANALYTICS_STORAGE_KEY)
    if (!rawValue) return null

    if (Object.values(OPTIONAL_ANALYTICS_PREFERENCE).includes(rawValue)) {
      return {
        status: rawValue,
        policyVersion: ANALYTICS_POLICY_VERSION,
        decidedAt: null,
      }
    }

    const record = JSON.parse(rawValue)
    if (record?.policyVersion !== ANALYTICS_POLICY_VERSION
      || !Object.values(OPTIONAL_ANALYTICS_PREFERENCE).includes(record?.status)) {
      return null
    }

    return {
      status: record.status,
      policyVersion: record.policyVersion,
      decidedAt: typeof record.decidedAt === 'string' ? record.decidedAt : null,
    }
  } catch {
    return null
  }
}

export function hasOptionalAnalyticsPreference(storage) {
  return readOptionalAnalyticsPreference(storage) !== null
}

export function isOptionalAnalyticsEnabled(storage) {
  return readOptionalAnalyticsPreference(storage) === OPTIONAL_ANALYTICS_PREFERENCE.ENABLED
}

export function writeOptionalAnalyticsPreference(enabled, storage) {
  const value = enabled
    ? OPTIONAL_ANALYTICS_PREFERENCE.ENABLED
    : OPTIONAL_ANALYTICS_PREFERENCE.DISABLED

  try {
    resolveStorage(storage)?.setItem(OPTIONAL_ANALYTICS_STORAGE_KEY, JSON.stringify({
      status: value,
      policyVersion: ANALYTICS_POLICY_VERSION,
      decidedAt: new Date().toISOString(),
    }))
  } catch {
    // The in-memory runtime state still applies for the current page.
  }

  return value
}

export function isAnalyticsProductionHost(hostname) {
  return ANALYTICS_HOSTS.has(String(hostname ?? '').trim().toLowerCase())
}

export function sanitizePathname(value = '/') {
  try {
    const url = new URL(String(value || '/'), 'https://mxn.invalid')
    const pathname = url.pathname.replace(/\/{2,}/g, '/').slice(0, 300)
    return pathname.startsWith('/') ? pathname : `/${pathname}`
  } catch {
    return '/'
  }
}

export function sanitizeReferrer(value) {
  if (!value) return 'direct'

  try {
    const url = new URL(value)
    if (!['http:', 'https:'].includes(url.protocol)) return 'direct'
    return `${url.origin}${sanitizePathname(url.pathname)}`
  } catch {
    return 'direct'
  }
}

export function stableRoutePath(route = {}) {
  const matched = Array.isArray(route.matched) ? route.matched : []
  if (matched.some(record => String(record?.path || '').includes('*'))) return '/404'

  const routePattern = [...matched]
    .reverse()
    .map(record => record?.path)
    .find(path => typeof path === 'string' && path.startsWith('/') && !path.includes('*'))

  return sanitizePathname(routePattern || route.path || '/')
}

export function buildSafePageLocation(path, origin) {
  const pathname = sanitizePathname(path)

  try {
    const url = new URL(origin)
    if (!['http:', 'https:'].includes(url.protocol)) return pathname
    return `${url.origin}${pathname}`
  } catch {
    return pathname
  }
}

function sanitizeScalar(value, maxLength = 100) {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'boolean') return value
  if (typeof value !== 'string') return undefined
  return value.trim().slice(0, maxLength)
}

export function sanitizeAnalyticsEventParams(eventName, params = {}) {
  const allowedKeys = EVENT_PARAM_ALLOWLIST[eventName]
  if (!allowedKeys) return null

  const sanitized = {}
  for (const key of allowedKeys) {
    if (!Object.hasOwn(params, key)) continue

    if (key === 'page_path') {
      sanitized[key] = sanitizePathname(params[key])
      continue
    }

    if (key === 'page_location') {
      sanitized[key] = buildSafePageLocation(params.page_path || params[key], params[key])
      continue
    }

    const value = sanitizeScalar(params[key])
    if (value !== undefined) sanitized[key] = value
  }

  return sanitized
}

export function sanitizeOperationalEventData(eventType, data = {}) {
  const allowedKeys = OPERATIONAL_EVENT_ALLOWLIST[eventType] || []
  const sanitized = {}

  for (const key of allowedKeys) {
    if (!Object.hasOwn(data, key)) continue

    if (key === 'page') {
      sanitized.page = sanitizePathname(data.page)
      continue
    }

    if (key === 'areas' && Array.isArray(data.areas)) {
      sanitized.areas = data.areas
        .map(value => sanitizeScalar(value, 40))
        .filter(Boolean)
        .slice(0, 20)
      continue
    }

    const value = sanitizeScalar(data[key])
    if (value !== undefined) sanitized[key] = value
  }

  return sanitized
}
