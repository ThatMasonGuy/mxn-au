export function deriveUnlimitedOutcome(mask, rowCount) {
  if (Array.isArray(mask) && mask.join('') === 'GGGGG') return 'win';
  if (rowCount >= 6) return 'loss';
  return null;
}

export function resolveUnlimitedGameNumber(currentGame, totalPlayed) {
  const savedNumber = Number(currentGame?.number);
  if (Number.isInteger(savedNumber) && savedNumber > 0) return savedNumber;
  const completed = Number.isFinite(totalPlayed) ? Math.max(0, totalPlayed) : 0;
  return completed + 1;
}
