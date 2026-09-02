import test from 'node:test';
import assert from 'node:assert/strict';

import {
  connectionsPuzzleBufferDateIds,
  nextConnectionsPuzzleDateId,
} from '../functions/dailyGames/connectionsSchedule.mjs';

test('Connections generation prepares the next UTC puzzle before players request it', () => {
  assert.equal(
    nextConnectionsPuzzleDateId(new Date('2026-09-02T00:05:00.000Z')),
    '2026-09-03',
  );
  assert.equal(
    nextConnectionsPuzzleDateId(new Date('2026-12-31T23:59:59.000Z')),
    '2027-01-01',
  );
});

test('Connections generation maintains a bounded seven-day UTC buffer', () => {
  assert.deepEqual(
    connectionsPuzzleBufferDateIds(new Date('2026-12-28T23:59:59.000Z')),
    [
      '2026-12-29',
      '2026-12-30',
      '2026-12-31',
      '2027-01-01',
      '2027-01-02',
      '2027-01-03',
      '2027-01-04',
    ],
  );
  assert.equal(connectionsPuzzleBufferDateIds(new Date(), 100).length, 14);
});
