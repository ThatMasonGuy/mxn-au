import test from 'node:test';
import assert from 'node:assert/strict';
import {
  generateConnectionsPuzzle, shouldGenerateConnectionsPuzzle,
  saveConnectionsPuzzle, withConnectionsGenerationLease,
  claimConnectionsGenerationBudget,
} from '../functions/dailyGames/connectionsGeneration.mjs';
import { readOrSeedConnectionsSolution } from '../functions/dailyGames/connectionsSolution.mjs';
import { CURATED_CONNECTIONS_FALLBACK as fixture } from '../functions/dailyGames/connectionsQuality.mjs';

function clientWith(responses) {
  const requests = [];
  return {
    requests,
    client: { responses: { async create(request) {
      requests.push(request);
      assert.ok(responses.length, 'generation must remain bounded');
      const response = responses.shift();
      return response.raw || { status: 'completed', output_text: JSON.stringify(response) };
    } } },
  };
}
function database(initial) {
  const docs = new Map(initial);
  return { docs, async runTransaction(run) {
    return run({
      async get(ref) { return { exists: docs.has(ref), data: () => docs.get(ref) }; },
      set(ref, value, options) { docs.set(ref, options?.merge ? { ...docs.get(ref), ...value } : value); },
      delete(ref) { docs.delete(ref); },
    });
  } };
}
const clock = () => new Date('2026-09-03T02:00:00Z');

test('reused words receive specific revision feedback before independent review', async () => {
  const revised = { ...fixture, answer: { ...fixture.answer, medium: ['DASH', 'POINT', 'SURF', 'KEY'] } };
  const { client, requests } = clientWith([fixture, revised, { pass: true, reasons: [] }]);
  const result = await generateConnectionsPuzzle({ client, bannedWords: ['SCORE'] });
  assert.deepEqual(result.puzzle, revised);
  assert.equal(result.attempts, 2);
  assert.equal(requests.length, 3);
  assert.ok(requests.every(request => request.model === 'gpt-5.6-terra'));
  assert.ok(requests[1].input.at(-1).content.includes('reused_word'));
  assert.ok(requests[1].input.at(-1).content.includes('SCORE'));
  assert.deepEqual(JSON.parse(requests[1].input.at(-2).content), fixture);
});

test('editor feedback revises a draft and cannot be mistaken for approval', async () => {
  const reason = 'The fourth connection is not defensible.';
  const { client, requests } = clientWith([fixture, { pass: false, reasons: [reason] }, fixture, { pass: true, reasons: [] }]);
  const result = await generateConnectionsPuzzle({ client });
  assert.equal(result.attempts, 2);
  assert.ok(requests[2].input.at(-1).content.includes(reason));
  assert.equal(requests[3].input.length, 2);
  assert.ok(!requests[3].input.some(message => message.content.includes(reason)));
});

test('the model sees exclusions beyond the former 500-word cutoff', async () => {
  const bannedWords = Array.from({ length: 501 }, (_, index) => `BAN${index}`);
  bannedWords.push('ZEPHYR');
  const { client, requests } = clientWith([fixture, { pass: true, reasons: [] }]);
  await generateConnectionsPuzzle({ client, bannedWords });
  assert.ok(requests[0].input[1].content.includes('ZEPHYR'));
});

test('incomplete output and failed reviews exhaust the bounded attempts without a puzzle', async () => {
  const { client, requests } = clientWith([
    { raw: { status: 'incomplete', output_text: JSON.stringify(fixture) } },
    fixture, { pass: true, reasons: ['Still has a defect.'] },
  ]);
  const result = await generateConnectionsPuzzle({ client, maxAttempts: 2 });
  assert.equal(result.puzzle, null);
  assert.equal(result.attempts, 2);
  assert.equal(requests.length, 3);
});

test('catch-up fills missing dates and repairs future fallback boards while preserving active games', () => {
  const fallback = { ...fixture, wasFallbackSeed: true };
  assert.equal(shouldGenerateConnectionsPuzzle(null, '2026-09-03', '2026-09-03'), true);
  assert.equal(shouldGenerateConnectionsPuzzle(fallback, '2026-09-04', '2026-09-03'), true);
  assert.equal(shouldGenerateConnectionsPuzzle(fixture, '2026-09-04', '2026-09-03'), false);
  assert.equal(shouldGenerateConnectionsPuzzle({}, '2026-09-04', '2026-09-03'), true);
  assert.equal(shouldGenerateConnectionsPuzzle(fallback, '2026-09-03', '2026-09-03', { overwrite: true }), false);
  assert.equal(shouldGenerateConnectionsPuzzle(null, '2026-09-02', '2026-09-03'), false);
});

test('a player opening the board during generation wins the publication race', async () => {
  const db = database();
  const board = await readOrSeedConnectionsSolution({ db, ref: 'today', now: clock });
  const saved = await saveConnectionsPuzzle({ db, ref: 'today', dateId: '2026-09-03', data: { ...fixture, source: 'ai' }, now: clock });
  assert.equal(saved, false);
  assert.deepEqual(board, fixture);
  assert.equal(db.docs.get('today').wasFallbackSeed, true);
});

test('a generated board published first is the board returned to players', async () => {
  const db = database();
  const generated = { ...fixture, categories: { ...fixture.categories, easy: 'AFTER NIGHT' }, source: 'ai' };
  assert.equal(await saveConnectionsPuzzle({ db, ref: 'today', dateId: '2026-09-03', data: generated, now: clock }), true);
  const board = await readOrSeedConnectionsSolution({ db, ref: 'today', now: clock });
  assert.deepEqual(board.categories, generated.categories);
  assert.equal(db.docs.get('today').source, 'ai');
});

test('replacing a future fallback clears its fallback metadata', async () => {
  const db = database([['tomorrow', { ...fixture, wasFallbackSeed: true, seedReason: 'missing_puzzle' }]]);
  assert.equal(await saveConnectionsPuzzle({ db, ref: 'tomorrow', dateId: '2026-09-04', data: { ...fixture, source: 'ai' }, now: clock }), true);
  assert.equal(db.docs.get('tomorrow').wasFallbackSeed, undefined);
  assert.equal(db.docs.get('tomorrow').seedReason, undefined);
});

test('manual and scheduled generation cannot hold the shared lease together, and failures release it', async () => {
  const db = database();
  const options = { db, ref: 'lease', now: () => 1000 };
  await assert.rejects(withConnectionsGenerationLease({ ...options, owner: 'cron', run: async () => {
    assert.deepEqual(await withConnectionsGenerationLease({ ...options, owner: 'manual', run: () => assert.fail('busy lease ran') }), { busy: true });
    throw new Error('generation failed');
  } }), /generation failed/);
  assert.equal(db.docs.has('lease'), false);
  db.docs.set('lease', { owner: 'crashed', expiresAt: 999 });
  assert.equal(await withConnectionsGenerationLease({ ...options, owner: 'retry', run: () => 'recovered' }), 'recovered');
});

test('hourly recovery and scheduler retries share a bounded daily generation budget', async () => {
  const db = database();
  const options = { db, ref: 'budget', day: '2026-09-03', limit: 2 };
  assert.equal(await claimConnectionsGenerationBudget(options), true);
  assert.equal(await claimConnectionsGenerationBudget(options), true);
  assert.equal(await claimConnectionsGenerationBudget(options), false);
  assert.equal(await claimConnectionsGenerationBudget({ ...options, day: '2026-09-04' }), true);
});
