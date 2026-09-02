import test from 'node:test';
import assert from 'node:assert/strict';

import { completeDailySignOut } from '../src/features/daily/utils/dailyAuth.js';

test('Daily sign-out ends the Firebase session before clearing local auth', async () => {
  const events = [];
  await completeDailySignOut(
    async () => events.push('firebase'),
    () => events.push('local'),
  );
  assert.deepEqual(events, ['firebase', 'local']);
});

test('Daily sign-out keeps local auth when Firebase sign-out fails', async () => {
  let cleared = false;
  await assert.rejects(
    completeDailySignOut(
      async () => { throw new Error('offline'); },
      () => { cleared = true; },
    ),
    /offline/,
  );
  assert.equal(cleared, false);
});
