import assert from 'node:assert/strict'
import test from 'node:test'

import {
  buildEverhomesUsageEvent,
  resolveEverhomesTool,
} from '../src/features/everhomes/utils/toolUsage.js'
import {
  ToolUsageRequestError,
  brisbaneDateKey,
  normaliseEverhomesUsageEvent,
} from '../functions/everhomes/toolUsageCore.mjs'

const EVENT_ID = '11111111-1111-4111-8111-111111111111'
const SESSION_ID = '22222222-2222-4222-8222-222222222222'

test('every public Everhomes tool route resolves to a stable analytics ID', () => {
  const cases = [
    ['/everhomes/water-bills', {}, 'water-bills'],
    ['/everhomes/placement-fees', {}, 'placement-fees'],
    ['/everhomes/sda-returns', {}, 'participant-sda-funding'],
    ['/everhomes/qr-code', {}, 'qr-code'],
    ['/everhomes/report/inspection', { reportType: 'inspection' }, 'inspection-report'],
    ['/everhomes/report/handover', { reportType: 'handover' }, 'handover-report'],
    ['/everhomes/import/review', {}, 'spreadsheet-import'],
  ]

  for (const [path, params, expected] of cases) {
    assert.equal(resolveEverhomesTool({ path, params })?.id, expected)
  }
  assert.equal(resolveEverhomesTool({ path: '/everhomes/admin' }), null)
  assert.equal(resolveEverhomesTool({ path: '/everhomes' }), null)
})

test('browser usage payload contains operational metadata only', () => {
  const event = buildEverhomesUsageEvent({
    toolId: 'participant-sda-funding',
    action: 'calculation_completed',
    variant: 'appendix_h',
  })
  assert.deepEqual(Object.keys(event).sort(), [
    'action',
    'device',
    'eventId',
    'sessionId',
    'toolId',
    'variant',
  ])
  assert.match(event.eventId, /^[0-9a-f-]{36}$/i)
  assert.match(event.sessionId, /^[0-9a-f-]{36}$/i)
})

test('server accepts declared tool actions and derives trusted tool names', () => {
  const result = normaliseEverhomesUsageEvent({
    eventId: EVENT_ID,
    sessionId: SESSION_ID,
    toolId: 'participant-sda-funding',
    action: 'calculation_completed',
    variant: 'appendix_h',
    device: 'mobile',
    toolName: 'Spoofed name',
    participantName: 'must be ignored',
    amount: 123456,
  })

  assert.equal(result.toolName, 'Participant SDA Funding')
  assert.equal(result.meaningfulUse, true)
  assert.equal(result.device, 'mobile')
  assert.equal(Object.hasOwn(result, 'participantName'), false)
  assert.equal(Object.hasOwn(result, 'amount'), false)
})

test('server rejects undeclared tools, actions and variants', () => {
  const base = {
    eventId: EVENT_ID,
    sessionId: SESSION_ID,
    toolId: 'water-bills',
    action: 'calculation_completed',
    variant: 'easy',
  }

  for (const invalid of [
    { ...base, toolId: 'made-up-tool' },
    { ...base, action: 'saved_sensitive_inputs' },
    { ...base, variant: 'participant-name' },
    { ...base, eventId: 'not-a-uuid' },
  ]) {
    assert.throws(() => normaliseEverhomesUsageEvent(invalid), ToolUsageRequestError)
  }
})

test('Brisbane day keys do not use a caller supplied timezone', () => {
  assert.equal(brisbaneDateKey(new Date('2026-08-03T14:30:00.000Z')), '2026-08-04')
})
