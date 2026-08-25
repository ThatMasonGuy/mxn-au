import assert from 'node:assert/strict'
import test from 'node:test'

import { hasSiteAdminRole } from '../functions/siteAdmin/adminRoles.mjs'
import {
  createActivitySummary,
  createCollectionSummary,
  createStorageSummary,
  createUserSummary,
} from '../functions/siteAdmin/overviewCore.mjs'

test('site administration requires the dedicated siteAdmin role', () => {
  assert.equal(hasSiteAdminRole(['siteAdmin']), true)
  assert.equal(hasSiteAdminRole(['admin']), false)
  assert.equal(hasSiteAdminRole(['everhomesAdmin']), false)
  assert.equal(hasSiteAdminRole(null), false)
})

test('user summaries expose audit fields without returning the full profile', () => {
  const summary = createUserSummary({
    uid: 'user-123',
    email: 'mason@example.com',
    disabled: false,
    displayName: 'Fallback name',
    providerData: [{ providerId: 'password' }],
    metadata: {
      creationTime: '2026-01-10T01:00:00.000Z',
      lastSignInTime: '2026-08-25T02:30:00.000Z',
    },
  }, {
    firstName: 'Mason',
    lastName: 'Bartholomai',
    roles: ['siteAdmin', 'user'],
    phoneNumber: 'not-returned',
    areas: { personal: true, translate: false, topheroes: true },
    flags: { profileComplete: true },
  })

  assert.deepEqual(summary, {
    uid: 'user-123',
    name: 'Mason Bartholomai',
    email: 'mason@example.com',
    roles: ['siteAdmin', 'user'],
    status: 'active',
    provider: ['password'],
    createdAt: '2026-01-10T01:00:00.000Z',
    lastSignInAt: '2026-08-25T02:30:00.000Z',
    profileComplete: true,
    areas: ['personal', 'topheroes'],
  })
  assert.equal('phoneNumber' in summary, false)
})

test('activity summaries retain observable action and path details', () => {
  const event = createActivitySummary({
    id: 'event-1',
    ref: { path: 'users/user-123/userEvents/event-1' },
    data: () => ({
      type: 'page_view',
      timestamp: '2026-08-25T02:31:00.000Z',
      data: {
        page: '/daily',
        path: '/daily',
        viewport: { width: 1440, height: 900 },
        userAgent: 'not-returned',
      },
    }),
  }, new Map([['user-123', { name: 'Mason', email: 'mason@example.com' }]]))

  assert.deepEqual(event, {
    id: 'event-1',
    uid: 'user-123',
    user: { name: 'Mason', email: 'mason@example.com' },
    type: 'page_view',
    summary: '/daily',
    path: '/daily',
    at: '2026-08-25T02:31:00.000Z',
    viewport: '1440 × 900',
  })
})

test('Firestore inventory labels sampled payload estimates as incomplete', () => {
  const summary = createCollectionSummary('users', 10, [
    { data: () => ({ name: 'One' }) },
    { data: () => ({ name: 'Two', active: true }) },
  ])

  assert.equal(summary.name, 'users')
  assert.equal(summary.documents, 10)
  assert.equal(summary.sampleSize, 2)
  assert.ok(summary.averageDocumentBytes > 0)
  assert.equal(summary.estimatedDocumentBytes, summary.averageDocumentBytes * 10)
  assert.match(summary.estimateBasis, /excludes index and metadata storage/i)
})

test('storage summaries group every object and byte by its first path segment', () => {
  assert.deepEqual(createStorageSummary([
    { name: 'reports/one.pdf', metadata: { size: '120' } },
    { name: 'reports/two.pdf', metadata: { size: '80' } },
    { name: 'avatars/mason.png', metadata: { size: '50' } },
  ]), {
    bytes: 250,
    objects: 3,
    groups: [
      { name: 'reports', bytes: 200, objects: 2 },
      { name: 'avatars', bytes: 50, objects: 1 },
    ],
  })
})
