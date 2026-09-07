export const WORD_GENERATION_MODEL = 'gpt-5.6-luna';

export async function requestWordCandidates(client, input) {
  const response = await client.responses.create({
    model: WORD_GENERATION_MODEL,
    input,
    store: false,
    reasoning: { effort: 'medium' },
    max_output_tokens: 6000,
    text: { format: {
      type: 'json_schema', name: 'word_candidates', strict: true,
      schema: {
        type: 'object', additionalProperties: false, required: ['words'],
        properties: { words: { type: 'array', items: { type: 'string' } } },
      },
    } },
  });
  if (response.status !== 'completed') return [];
  try {
    const parsed = JSON.parse(response.output_text);
    return Array.isArray(parsed.words) && parsed.words.every(word => typeof word === 'string')
      ? parsed.words : [];
  } catch { return []; }
}
