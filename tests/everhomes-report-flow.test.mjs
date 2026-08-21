import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

import inspectionSchema from '../src/features/everhomes/schemas/inspection.js'
import handoverSchema from '../src/features/everhomes/schemas/handover.js'
import { REPORT_STORE_CONFIG } from '../src/features/everhomes/stores/useEverhomesReportStore.js'
import {
  deriveSectionStatus,
  isRequiredAnswerComplete as browserRequiredAnswerComplete,
  isStatusSectionComplete,
} from '../src/features/everhomes/utils/reportStatus.js'
import { REPORT_SCHEMAS } from '../functions/everhomes/checklistSchemas/index.mjs'
import {
  collectMissingRequiredAnswers,
  computeItemStats,
  isRequiredAnswerComplete as functionRequiredAnswerComplete,
  itemIsVisible,
} from '../functions/everhomes/reportLogic.mjs'
import { normaliseEmailDeliveries } from '../functions/everhomes/emailDelivery.mjs'

function browserItemIsVisible(item, inputs, statuses, schema, category) {
  if (item.showIf) {
    const value = inputs[item.showIf.id] ?? statuses[item.showIf.id] ?? ''
    if (item.showIf.hasValue === true && String(value).trim() === '') return false
    if (item.showIf.hasValue === false && String(value).trim() !== '') return false
    if (item.showIf.hasValue === undefined && value !== item.showIf.value) return false
  }

  if (schema.sdaFilter && item.badges?.length) {
    const active = schema.pickerOptions.find((option) => option.key === category)?.includes ?? []
    if (!item.badges.some((badge) => active.includes(badge))) return false
  }
  return true
}

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
    const missing = collectMissingRequiredAnswers([{
      id: 'general',
      type: 'general',
      label: 'General Property',
      inputs,
      items: {},
    }], schema, category)
    assert.ok(
      missing.some((entry) => entry.itemId === 'allRemotesWorking'),
      `${reportType} must reject an invalid remotes answer`,
    )

    inputs.allRemotesWorking = 'no'
    assert.equal(collectMissingRequiredAnswers([{
      id: 'general',
      type: 'general',
      label: 'General Property',
      inputs,
      items: {},
    }], schema, category).length, 0)
  }
})

test('Cloud Function visibility matches the browser for every Handover category', () => {
  const functionSchema = REPORT_SCHEMAS.handover
  for (const category of handoverSchema.pickerOptions.map((option) => option.key)) {
    let hidden = 0
    for (const groups of Object.values(functionSchema.items)) {
      for (const group of groups) {
        for (const item of group.items) {
          const browserVisible = browserItemIsVisible(item, {}, {}, handoverSchema, category)
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

test('ordinary report schema labels contain no unsupported comparison glyphs', async () => {
  const files = [
    'src/features/everhomes/data/inspectionItems.js',
    'src/features/everhomes/data/handoverItems.js',
    'functions/everhomes/checklistSchemas/inspectionItems.mjs',
    'functions/everhomes/checklistSchemas/handoverItems.mjs',
  ]
  for (const file of files) {
    const source = await readFile(new URL(`../${file}`, import.meta.url), 'utf8')
    assert.doesNotMatch(source, /[≤≥]/u, file)
  }
})

test('report workflows do not enforce an arbitrary photo-count cap', async () => {
  const files = [
    'src/features/everhomes/composables/useReportState.js',
    'functions/everhomes/generateInspectionReport.mjs',
    'functions/everhomes/regenerateReport.mjs',
  ]
  for (const file of files) {
    const source = await readFile(new URL(`../${file}`, import.meta.url), 'utf8')
    assert.doesNotMatch(source, /MAX_REPORT_PHOTOS|storage\/report-photo-limit/, file)
  }
})

test('frontend and backend workflow configuration stays aligned', () => {
  for (const browserSchema of [inspectionSchema, handoverSchema]) {
    const functionSchema = REPORT_SCHEMAS[browserSchema.reportType]
    assert.equal(functionSchema.collection, browserSchema.collection)
    assert.equal(functionSchema.docTitle, browserSchema.docTitle)
    assert.equal(functionSchema.emailSubjectPrefix, browserSchema.emailSubjectPrefix)
    assert.equal(functionSchema.fromName, browserSchema.fromName)
    assert.equal(functionSchema.sdaFilter, browserSchema.sdaFilter)
    assert.deepEqual(
      functionSchema.requiredSections,
      browserSchema.sections.forced.map((section) => section.itemsKey ?? section.key),
    )
  }
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

test('generation publishes immutable artifacts and recovery exports stay wired', async () => {
  const generator = await readFile(
    new URL('../functions/everhomes/generateInspectionReport.mjs', import.meta.url),
    'utf8',
  )
  const index = await readFile(new URL('../functions/index.mjs', import.meta.url), 'utf8')
  const drafts = await readFile(
    new URL('../functions/everhomes/inspectionDrafts.mjs', import.meta.url),
    'utf8',
  )
  const regeneration = await readFile(
    new URL('../functions/everhomes/regenerateReport.mjs', import.meta.url),
    'utf8',
  )
  const maintenance = await readFile(
    new URL('../functions/everhomes/reportMaintenance.mjs', import.meta.url),
    'utf8',
  )
  const firestoreRules = await readFile(new URL('../firestore.rules', import.meta.url), 'utf8')
  const rules = await readFile(new URL('../storage.rules', import.meta.url), 'utf8')

  assert.match(generator, /generations\/\$\{generationId\}/)
  assert.match(generator, /const pdfStoragePath = `\$\{artifactRoot\}\/report\.pdf`/)
  assert.match(generator, /const zipStoragePath = `\$\{artifactRoot\}\/photos\.zip`/)
  assert.match(generator, /db\.runTransaction/)
  assert.match(generator, /collection\("artifactGenerations"\)\.doc\(generationId\)/)
  assert.match(generator, /publishBatch\.commit\(\)/)
  assert.match(generator, /safeArchiveKey\(room\.id, "room"\)/)
  assert.doesNotMatch(generator, /res\.status\(504\)/)
  assert.match(regeneration, /MAX_ARCHIVE_FILE_BYTES = 320 \* 1024 \* 1024/)
  assert.match(regeneration, /MAX_EXPANDED_PHOTO_BYTES = 300 \* 1024 \* 1024/)
  assert.match(regeneration, /archiveGroup: 'marketing'/)
  assert.match(drafts, /db\.recursiveDelete\(ref\)/)
  assert.match(maintenance, /'processing', 'regenerating', 'pending', 'deleting'/)
  assert.match(index, /deleteEverhomesDraft/)
  assert.match(index, /sweepStaleEverhomesReports/)
  assert.match(firestoreRules, /match \/artifactGenerations\/\{generationId\}/)
  assert.match(rules, /isMutableDraft/)
  assert.match(rules, /status == 'draft' \|\| status == 'pending' \|\| status == 'failed'/)
})
