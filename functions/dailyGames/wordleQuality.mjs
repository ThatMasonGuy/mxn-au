export function normaliseWordleAnswer(value) {
  const answer = String(value || '').trim().toUpperCase();
  return /^[A-Z]{5}$/.test(answer) ? answer : null;
}

export function storedWordleAnswer(data) {
  return normaliseWordleAnswer(data?.answer);
}
