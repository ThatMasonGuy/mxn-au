import assert from 'node:assert/strict'
import test from 'node:test'

import handoverSchema from '../src/features/everhomes/schemas/handover.js'
import { REPORT_STORE_CONFIG } from '../src/features/everhomes/stores/useEverhomesReportStore.js'
import {
  applyFailedPhotoRecoveryState,
  prepareRestoredPhoto,
} from '../src/features/everhomes/utils/photoRecovery.js'
import {
  getActiveReportBadges,
  isReportItemVisible,
} from '../src/features/everhomes/utils/reportVisibility.js'
import {
  deriveSectionStatus,
  isRequiredAnswerComplete as browserRequiredAnswerComplete,
  isStatusSectionComplete,
} from '../src/features/everhomes/utils/reportStatus.js'
import { REPORT_SCHEMAS } from '../functions/everhomes/checklistSchemas/index.mjs'
import { normaliseEmailDeliveries } from '../functions/everhomes/emailDelivery.mjs'
import { buildReportArtifactPaths, safeArchiveKey } from '../functions/everhomes/reportArtifacts.mjs'
import {
  emailActivityRecord,
  normaliseProviderStatus,
  sanitiseActivityActor,
  sortActivityNewestFirst,
} from '../functions/everhomes/reportActivity.mjs'
import { canDeleteEverhomesReport } from '../functions/everhomes/reportDeletionPolicy.mjs'
import {
  addStorageObject,
  createStorageUsageSummary,
  estimateLegacyFirebaseStorageUsd,
} from '../functions/everhomes/storageUsageCore.mjs'
import {
  collectMissingRequiredAnswers,
  computeItemStats,
  isRequiredAnswerComplete as functionRequiredAnswerComplete,
  itemIsVisible,
} from '../functions/everhomes/reportLogic.mjs'

test('report activity records preserve observable email outcomes and safe actor details', () => {
  const actor = sanitiseActivityActor({
    kind: 'admin',
    uid: ' admin-123 ',
    name: ' Report Admin ',
    email: 'admin@example.com',
  })
  assert.deepEqual(actor, {
    kind: 'admin',
    uid: 'admin-123',
    name: 'Report Admin',
    email: 'admin@example.com',
  })

  assert.deepEqual(emailActivityRecord({
    email: ' Correct.Person@Example.com ',
    sent: true,
    providerId: 'email_123',
    providerStatus: 'delivered',
    error: null,
  }, { action: 'targeted_resend', actor, generationId: 'generation_1' }), {
    kind: 'email',
    type: 'email.attempted',
    action: 'targeted_resend',
    recipient: 'correct.person@example.com',
    accepted: true,
    providerId: 'email_123',
    providerStatus: 'delivered',
    error: null,
    generationId: 'generation_1',
    actor,
  })

  const failure = emailActivityRecord({
    email: 'wrong@example.com',
    sent: false,
    error: 'Rejected by provider',
  }, { action: 'generation' })
  assert.equal(failure.accepted, false)
  assert.equal(failure.providerStatus, 'failed')
  assert.equal(failure.error, 'Rejected by provider')
})

test('report activity status and ordering helpers handle provider and legacy data', () => {
  assert.equal(normaliseProviderStatus('bounced'), 'bounced')
  assert.equal(normaliseProviderStatus('unexpected', 'sent'), 'sent')
  assert.deepEqual(
    sortActivityNewestFirst([
      { id: 'old', occurredAt: '2026-08-24T01:00:00.000Z' },
      { id: 'unknown', occurredAt: null },
      { id: 'new', occurredAt: '2026-08-25T01:00:00.000Z' },
    ]).map((event) => event.id),
    ['new', 'old', 'unknown'],
  )
})

test('Inspection and Handover use different fixed store IDs and persistence keys', () => {
  assert.notEqual(REPORT_STORE_CONFIG.inspection.storeId, REPORT_STORE_CONFIG.handover.storeId)
  assert.notEqual(REPORT_STORE_CONFIG.inspection.storageKey, REPORT_STORE_CONFIG.handover.storageKey)
  assert.equal(REPORT_STORE_CONFIG.inspection.storageKey, 'everhomes_report_inspection')
  assert.equal(REPORT_STORE_CONFIG.handover.storageKey, 'everhomes_report_handover')
})

test('all-N/A sections require an explicit valid overall status', () => {
  assert.deepEqual(
    deriveSectionStatus(['na', 'na'], null),
    { status: 'unchecked', manualStatus: null },
  )
  assert.equal(isStatusSectionComplete(['na', 'na'], null), false)
  assert.deepEqual(
    deriveSectionStatus(['na', 'na'], 'na'),
    { status: 'na', manualStatus: 'na' },
  )
  assert.equal(isStatusSectionComplete(['na', 'na'], 'na'), true)
  assert.deepEqual(
    deriveSectionStatus(['na', 'issue'], 'ok'),
    { status: 'issue', manualStatus: null },
  )
})

test('required yes/no answers accept only explicit yes or no in browser and function logic', () => {
  const item = { id: 'allRemotesWorking', type: 'yesno' }
  for (const value of [undefined, null, '', 'maybe', true, 1]) {
    assert.equal(browserRequiredAnswerComplete(item, value), false)
    assert.equal(functionRequiredAnswerComplete(item, value), false)
  }
  for (const value of ['yes', 'no']) {
    assert.equal(browserRequiredAnswerComplete(item, value), true)
    assert.equal(functionRequiredAnswerComplete(item, value), true)
  }

  for (const [reportType, category] of [['inspection', 'routine'], ['handover', 'HPS']]) {
    const schema = REPORT_SCHEMAS[reportType]
    const inputs = Object.fromEntries(
      schema.items.general
        .flatMap((group) => group.items)
        .filter((candidate) => candidate.type === 'yesno')
        .map((candidate) => [candidate.id, 'yes']),
    )
    inputs.allRemotesWorking = 'maybe'
    const room = [{ id: 'general', type: 'general', label: 'General Property', inputs, items: {} }]
    const missing = collectMissingRequiredAnswers(room, schema, category)
    assert.ok(
      missing.some((entry) => entry.itemId === 'allRemotesWorking'),
      `${reportType} must reject an invalid remotes answer`,
    )

    inputs.allRemotesWorking = 'no'
    assert.equal(collectMissingRequiredAnswers(room, schema, category).length, 0)
  }
})

test('Cloud Function visibility matches the frontend helper for every Handover category', () => {
  const functionSchema = REPORT_SCHEMAS.handover
  for (const category of handoverSchema.pickerOptions.map((option) => option.key)) {
    const activeBadges = getActiveReportBadges(handoverSchema, category)
    let hidden = 0

    for (const groups of Object.values(functionSchema.items)) {
      for (const group of groups) {
        for (const item of group.items) {
          const browserVisible = isReportItemVisible(item, {
            sdaFilter: handoverSchema.sdaFilter,
            activeBadges,
          })
          const functionVisible = itemIsVisible(item, {}, {}, functionSchema, category)
          assert.equal(functionVisible, browserVisible, `${category}: ${item.id}`)
          if (!functionVisible) hidden += 1
        }
      }
    }

    assert.ok(hidden > 0, `${category} should exclude at least one category-specific item`)
  }
})

test('Cloud Function statistics exclude category-inapplicable status items', () => {
  const schema = REPORT_SCHEMAS.handover
  const rooms = Object.entries(schema.items).map(([key, groups]) => ({
    id: key,
    key,
    type: key,
    label: key,
    items: Object.fromEntries(
      groups.flatMap((group) => group.items)
        .filter((item) => !item.type)
        .map((item) => [item.id, 'ok']),
    ),
    inputs: {},
  }))

  const hps = computeItemStats(rooms, schema, 'HPS')
  const improvedLiveability = computeItemStats(rooms, schema, 'IL')
  assert.ok(hps.total > improvedLiveability.total)
  assert.equal(hps.total, hps.ok)
  assert.equal(improvedLiveability.total, improvedLiveability.ok)
})

test('restored failed photos expose either retry or removal recovery', () => {
  const completed = { id: 'done', uploadStatus: 'done', url: 'https://example.com/photo.jpg' }
  assert.equal(prepareRestoredPhoto(completed), completed)

  const recoverable = prepareRestoredPhoto({
    id: 'recoverable',
    uploadStatus: 'uploading',
    intendedStoragePath: 'reports/photo.jpg',
  })
  applyFailedPhotoRecoveryState(recoverable)
  assert.equal(recoverable.uploadStatus, 'failed')
  assert.equal(recoverable.retryable, true)
  assert.match(recoverable.retryNote, /Retry/)

  const localBackup = prepareRestoredPhoto({ id: 'local', uploadStatus: 'uploading' })
  applyFailedPhotoRecoveryState(localBackup, { localFileAvailable: true })
  assert.equal(localBackup.retryable, true)
  assert.equal(localBackup.localBackupAvailable, true)

  const unavailable = prepareRestoredPhoto({ id: 'missing', uploadStatus: 'uploading' })
  applyFailedPhotoRecoveryState(unavailable)
  assert.equal(unavailable.retryable, false)
  assert.match(unavailable.retryNote, /Remove this entry/)
})

test('fulfilled Resend error payloads are failures, not successful deliveries', () => {
  const deliveries = normaliseEmailDeliveries([
    { status: 'fulfilled', value: { data: { id: 'email-ok' } } },
    { status: 'fulfilled', value: { error: { message: 'recipient rejected' } } },
    { status: 'rejected', reason: new Error('network timeout') },
  ], [
    { email: 'one@example.com' },
    { email: 'two@example.com' },
    { email: 'three@example.com' },
  ])

  assert.deepEqual(deliveries.map(({ email, sent, providerId, error }) => ({
    email,
    sent,
    providerId,
    error,
  })), [
    { email: 'one@example.com', sent: true, providerId: 'email-ok', error: null },
    { email: 'two@example.com', sent: false, providerId: null, error: 'recipient rejected' },
    { email: 'three@example.com', sent: false, providerId: null, error: 'network timeout' },
  ])
})

test('report generations use immutable paths and safe archive keys', () => {
  const first = buildReportArtifactPaths('inspectionReports', 'report-1', 'generation-a')
  const second = buildReportArtifactPaths('inspectionReports', 'report-1', 'generation-b')

  assert.equal(first.pdfStoragePath, 'inspectionReports/report-1/generations/generation-a/report.pdf')
  assert.equal(first.zipStoragePath, 'inspectionReports/report-1/generations/generation-a/photos.zip')
  assert.notEqual(first.artifactRoot, second.artifactRoot)
  assert.throws(() => buildReportArtifactPaths('inspectionReports', 'report-1', ''), TypeError)

  const unsafeRoomId = '../../shared/photo'
  const archiveKey = safeArchiveKey(unsafeRoomId, 'room')
  assert.doesNotMatch(archiveKey, /[/.]/)
  assert.equal(archiveKey, safeArchiveKey(unsafeRoomId, 'room'))
  assert.notEqual(archiveKey, safeArchiveKey('../../other/photo', 'room'))
})

test('admin report deletion is limited to draft and failed reports', () => {
  assert.equal(canDeleteEverhomesReport('draft'), true)
  assert.equal(canDeleteEverhomesReport('failed'), true)

  for (const status of ['complete', 'pending', 'processing', 'regenerating', 'deleting', null, undefined]) {
    assert.equal(canDeleteEverhomesReport(status), false, `${status} must remain protected`)
  }
})

test('storage usage separates Everhomes files from unrelated bucket objects', () => {
  const summary = createStorageUsageSummary()
  addStorageObject(summary, { name: 'inspections/report-1/photos/one.jpg', size: '1500000000' })
  addStorageObject(summary, { name: 'handovers/report-2/generations/a/report.pdf', size: 500000000 })
  addStorageObject(summary, { name: 'users/legacy/logo.png', size: 250000000 })
  addStorageObject(summary, { name: 'inspections/report-1/empty.jpg', size: 'invalid' })

  assert.deepEqual(summary, {
    total: { bytes: 2250000000, objects: 4 },
    inspections: { bytes: 1500000000, objects: 2 },
    handovers: { bytes: 500000000, objects: 1 },
    other: { bytes: 250000000, objects: 1 },
  })
})

test('legacy Firebase storage estimate applies its five GB free allowance', () => {
  assert.deepEqual(estimateLegacyFirebaseStorageUsd(4_000_000_000), {
    storedGb: 4,
    billableGb: 0,
    monthlyStorageUsd: 0,
  })
  assert.deepEqual(estimateLegacyFirebaseStorageUsd(7_000_000_000), {
    storedGb: 7,
    billableGb: 2,
    monthlyStorageUsd: 0.052,
  })
})
