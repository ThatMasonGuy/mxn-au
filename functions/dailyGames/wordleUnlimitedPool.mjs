export function normaliseUnlimitedWordRequest(data = {}) {
  const requested = Number.isInteger(data.requestCount) ? data.requestCount : 50;
  const requestCount = Math.min(Math.max(requested, 1), 100);
  const excludeWords = Array.isArray(data.excludeWords)
    ? Array.from(new Set(data.excludeWords
      .map((word) => String(word).trim().toUpperCase())
      .filter((word) => /^[A-Z]{5}$/.test(word))))
    : [];
  return { requestCount, excludeWords };
}

export function selectUnplayedWordIds(candidateIds, playedIds, excludeWords, count) {
  const unavailable = new Set([...playedIds, ...excludeWords]);
  return Array.from(new Set(candidateIds))
    .filter((word) => /^[A-Z]{5}$/.test(word) && !unavailable.has(word))
    .slice(0, count);
}
