import assert from 'node:assert/strict'
import test from 'node:test'

import {
  buildSafePageLocation,
  ANALYTICS_POLICY_VERSION,
  hasOptionalAnalyticsPreference,
  isAnalyticsProductionHost,
  isOptionalAnalyticsEnabled,
  readOptionalAnalyticsPreference,
  readOptionalAnalyticsPreferenceRecord,
  sanitizeAnalyticsEventParams,
  sanitizeOperationalEventData,
  sanitizePathname,
  sanitizeReferrer,
  stableRoutePath,
  writeOptionalAnalyticsPreference,
} from '../src/shared/analytics/analyticsPolicy.js'

function memoryStorage() {
  const values = new Map()
  return {
    getItem: key => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    values,
  }
}

test('optional analytics stays off until a versioned explicit choice is made', () => {
  const storage = memoryStorage()

  assert.equal(hasOptionalAnalyticsPreference(storage), false)
  assert.equal(isOptionalAnalyticsEnabled(storage), false)

  writeOptionalAnalyticsPreference(false, storage)
  assert.equal(readOptionalAnalyticsPreference(storage), 'disabled')
  assert.equal(isOptionalAnalyticsEnabled(storage), false)
  assert.deepEqual(readOptionalAnalyticsPreferenceRecord(storage), {
    status: 'disabled',
    policyVersion: ANALYTICS_POLICY_VERSION,
    decidedAt: JSON.parse(storage.values.get('mxn_optional_analytics_v1')).decidedAt,
  })

  writeOptionalAnalyticsPreference(true, storage)
  assert.equal(readOptionalAnalyticsPreference(storage), 'enabled')
  assert.equal(isOptionalAnalyticsEnabled(storage), true)
})

test('legacy choices are honored and invalid or stale records require a new choice', () => {
  const legacyStorage = memoryStorage()
  legacyStorage.setItem('mxn_optional_analytics_v1', 'disabled')
  assert.equal(readOptionalAnalyticsPreference(legacyStorage), 'disabled')

  const staleStorage = memoryStorage()
  staleStorage.setItem('mxn_optional_analytics_v1', JSON.stringify({
    status: 'enabled',
    policyVersion: ANALYTICS_POLICY_VERSION + 1,
    decidedAt: new Date().toISOString(),
  }))
  assert.equal(readOptionalAnalyticsPreference(staleStorage), null)
  assert.equal(isOptionalAnalyticsEnabled(staleStorage), false)
})

test('Google Analytics runs only on exact production hosts', () => {
  for (const host of ['mxn.au', 'www.mxn.au', 'mxn-au.web.app', 'mxn-au.firebaseapp.com']) {
    assert.equal(isAnalyticsProductionHost(host), true)
  }

  for (const host of ['localhost', 'mxn.au.example.com', 'preview--mxn-au.web.app', '']) {
    assert.equal(isAnalyticsProductionHost(host), false)
  }
})

test('page locations contain no query string, fragment or dynamic route value', () => {
  assert.equal(
    sanitizePathname('/translate/bot/login?code=secret#error_description'),
    '/translate/bot/login',
  )
  assert.equal(
    sanitizeReferrer('https://example.com/path?token=secret#fragment'),
    'https://example.com/path',
  )

  const routePath = stableRoutePath({
    path: '/topheroes/datasets/private-dataset-id?tab=results',
    matched: [{ path: '/topheroes/datasets/:datasetId' }],
  })
  assert.equal(routePath, '/topheroes/datasets/:datasetId')
  assert.equal(buildSafePageLocation(routePath, 'https://mxn.au?ignored=1'), 'https://mxn.au/topheroes/datasets/:datasetId')

  assert.equal(stableRoutePath({
    path: '/secret-looking-not-found-value',
    matched: [{ path: '/:pathMatch(.*)*' }],
  }), '/404')
})

test('Google events use a strict event and parameter allowlist', () => {
  assert.equal(sanitizeAnalyticsEventParams('made_up_event', { value: 1 }), null)

  assert.deepEqual(sanitizeAnalyticsEventParams('page_view', {
    page_title: 'Dashboard',
    page_path: '/dashboard?accessKey=secret#resume',
    page_location: 'https://mxn.au/dashboard?accessKey=secret#resume',
    email: 'person@example.com',
    reportId: 'private-id',
  }), {
    page_title: 'Dashboard',
    page_location: 'https://mxn.au/dashboard',
    page_path: '/dashboard',
  })
})

test('required operational events keep useful fields without full URLs or free text', () => {
  assert.deepEqual(sanitizeOperationalEventData('page_view', {
    page: '/everhomes/report/inspection?code=secret#everhomes-draft=secret',
    url: 'https://mxn.au/private?code=secret',
    accessKey: 'secret',
  }), {
    page: '/everhomes/report/inspection',
  })

  assert.deepEqual(sanitizeOperationalEventData('action', {
    action: 'opened_settings',
    notes: 'free text must not be logged',
  }), {
    action: 'opened_settings',
  })
})
