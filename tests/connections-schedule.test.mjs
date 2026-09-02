import test from 'node:test';
import assert from 'node:assert/strict';

import { nextConnectionsPuzzleDateId } from '../functions/dailyGames/connectionsSchedule.mjs';

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
