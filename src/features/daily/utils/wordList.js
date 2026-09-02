export function parseAllowedFiveLetterWords(payload) {
  const raw = payload?.default ?? payload?.words ?? payload?.list ?? payload;
  const entries = Array.isArray(raw)
    ? raw
    : raw && typeof raw === 'object'
      ? Object.keys(raw)
      : [];

  return new Set(
    entries
      .filter((word) => typeof word === 'string' && /^[a-z]{5}$/i.test(word))
      .map((word) => word.toLowerCase()),
  );
}

export function isAllowedFiveLetterGuess(word, allowedWords) {
  return typeof word === 'string'
    && /^[a-z]{5}$/i.test(word)
    && allowedWords instanceof Set
    && allowedWords.has(word.toLowerCase());
}
