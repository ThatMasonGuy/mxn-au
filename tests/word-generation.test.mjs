import test from 'node:test';
import assert from 'node:assert/strict';
import { requestWordCandidates } from '../functions/dailyGames/wordGeneration.mjs';

test('Wordle generation uses Luna Responses structured output and preserves exclusions', async () => {
  const input = [{ role: 'user', content: 'Return words excluding APPLE' }];
  let request;
  const client = { responses: { create: async value => {
    request = value;
    return { status: 'completed', output_text: '{"words":["CRANE","SLATE"]}' };
  } } };
  assert.deepEqual(await requestWordCandidates(client, input), ['CRANE', 'SLATE']);
  assert.equal(request.model, 'gpt-5.6-luna');
  assert.deepEqual(request.input, input);
  assert.equal(request.text.format.type, 'json_schema');
  assert.equal(request.text.format.strict, true);
  assert.equal(request.store, false);
  assert.equal(request.temperature, undefined);
  assert.ok(request.max_output_tokens > 0);
});

test('Wordle refuses incomplete, malformed and non-word Responses output', async () => {
  for (const response of [
    { status: 'incomplete', output_text: '{"words":["CRANE"]}' },
    { status: 'completed', output_text: 'not json' },
    { status: 'completed', output_text: '{"words":"CRANE"}' },
    { status: 'completed', output_text: '{"words":[null]}' },
    { status: 'completed', output_text: '{}' },
  ]) {
    assert.deepEqual(await requestWordCandidates({ responses: { create: async () => response } }, []), []);
  }
});
