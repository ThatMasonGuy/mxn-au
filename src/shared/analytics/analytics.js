import { firebaseApp } from '@/firebase'
import {
  buildSafePageLocation,
  hasOptionalAnalyticsPreference,
  isAnalyticsProductionHost,
  isOptionalAnalyticsEnabled,
  sanitizeAnalyticsEventParams,
  stableRoutePath,
  writeOptionalAnalyticsPreference,
} from './analyticsPolicy'

export const ANALYTICS_PREFERENCE_EVENT = 'mxn:optional-analytics-change'

const MEASUREMENT_ID = import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
const IS_PRODUCTION_BUILD = import.meta.env.PROD === true

let analyticsInstance = null
let analyticsModule = null
let initializationPromise = null
let runtimePreference = null
let lastPageViewKey = null

function browserPreferenceEnabled() {
  if (runtimePreference !== null) return runtimePreference
  return isOptionalAnalyticsEnabled()
}

function setGoogleDisableFlag(disabled) {
  if (typeof window === 'undefined' || !MEASUREMENT_ID) return
  window[`ga-disable-${MEASUREMENT_ID}`] = disabled
}

function canUseGoogleAnalytics() {
  return typeof window !== 'undefined'
    && IS_PRODUCTION_BUILD
    && Boolean(MEASUREMENT_ID)
    && isAnalyticsProductionHost(window.location.hostname)
}

function consentState(analyticsEnabled) {
  return {
    analytics_storage: analyticsEnabled ? 'granted' : 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  }
}

async function createAnalyticsInstance() {
  if (!canUseGoogleAnalytics() || !browserPreferenceEnabled()) {
    setGoogleDisableFlag(true)
    return null
  }

  analyticsModule = await import('firebase/analytics')
  if (!await analyticsModule.isSupported()) return null
  if (!browserPreferenceEnabled()) {
    setGoogleDisableFlag(true)
    return null
  }

  analyticsModule.setConsent(consentState(true))
  analyticsInstance = analyticsModule.initializeAnalytics(firebaseApp, {
    config: {
      send_page_view: false,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
    },
  })
  analyticsModule.setAnalyticsCollectionEnabled(analyticsInstance, true)
  setGoogleDisableFlag(false)

  return analyticsInstance
}

export function initializeOptionalAnalytics() {
  if (!initializationPromise) {
    initializationPromise = createAnalyticsInstance().catch(error => {
      console.warn('[Analytics] Google Analytics could not start:', error)
      return null
    })
  }

  return initializationPromise
}

export function getOptionalAnalyticsPreference() {
  return {
    choiceMade: hasOptionalAnalyticsPreference(),
    enabled: browserPreferenceEnabled(),
  }
}

export async function setOptionalAnalyticsEnabled(enabled) {
  runtimePreference = Boolean(enabled)
  writeOptionalAnalyticsPreference(runtimePreference)

  if (!runtimePreference) {
    setGoogleDisableFlag(true)
    if (analyticsModule && analyticsInstance) {
      analyticsModule.setConsent(consentState(false))
      analyticsModule.setAnalyticsCollectionEnabled(analyticsInstance, false)
    }
  } else if (analyticsInstance && analyticsModule) {
    analyticsModule.setConsent(consentState(true))
    analyticsModule.setAnalyticsCollectionEnabled(analyticsInstance, true)
    setGoogleDisableFlag(false)
  } else {
    initializationPromise = null
    await initializeOptionalAnalytics()
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(ANALYTICS_PREFERENCE_EVENT, {
      detail: { enabled: runtimePreference },
    }))
  }

  return runtimePreference
}

export async function trackAnalyticsEvent(eventName, params = {}) {
  if (!browserPreferenceEnabled()) return false

  const safeParams = sanitizeAnalyticsEventParams(eventName, params)
  if (!safeParams) {
    console.warn(`[Analytics] Blocked undeclared event: ${eventName}`)
    return false
  }

  const instance = analyticsInstance || await initializeOptionalAnalytics()
  if (!instance || !analyticsModule || !browserPreferenceEnabled()) return false

  analyticsModule.logEvent(instance, eventName, safeParams)
  return true
}

export async function trackPageView(route = {}) {
  if (typeof window === 'undefined' || !browserPreferenceEnabled()) return false

  const pagePath = stableRoutePath(route)
  const pageTitle = document.title.slice(0, 100)
  const pageViewKey = `${pagePath}:${pageTitle}`
  if (pageViewKey === lastPageViewKey) return false

  const tracked = await trackAnalyticsEvent('page_view', {
    page_path: pagePath,
    page_location: buildSafePageLocation(pagePath, window.location.origin),
    page_title: pageTitle,
  })

  if (tracked) lastPageViewKey = pageViewKey
  return tracked
}
