function previousUTCDate(date) {
  const [year, month, day] = String(date).split("-").map(Number);
  if (![year, month, day].every(Number.isFinite)) return null;
  return new Date(Date.UTC(year, month - 1, day - 1))
    .toISOString()
    .slice(0, 10);
}

function finiteNumber(value) {
  return Number.isFinite(value) ? value : 0;
}

export function recordLocalDailyResult(
  profile,
  { date, outcome, attempts = null, score = null, mistakes = null },
) {
  const current = profile || {};
  if (!date || !["win", "loss"].includes(outcome)) return current;
  if (current.lastPlayedUTC === date) return current;

  const totalPlays = finiteNumber(current.totalPlays) + 1;
  const wins = finiteNumber(current.wins) + (outcome === "win" ? 1 : 0);
  const losses = finiteNumber(current.losses) + (outcome === "loss" ? 1 : 0);
  const continued = current.lastPlayedUTC === previousUTCDate(date);
  const currentStreak = outcome === "win"
    ? (continued ? finiteNumber(current.currentStreak) + 1 : 1)
    : 0;

  const next = {
    ...current,
    currentStreak,
    maxStreak: Math.max(finiteNumber(current.maxStreak), currentStreak),
    wins,
    losses,
    totalPlays,
    gamesPlayed: totalPlays,
    winPercentage: Math.round((wins / totalPlays) * 100),
    lastPlayedUTC: date,
  };

  if (Number.isInteger(attempts) && attempts >= 1 && attempts <= 6) {
    const histogram = Array.isArray(current.histogram)
      ? [...current.histogram]
      : [0, 0, 0, 0, 0, 0];
    if (outcome === "win") histogram[attempts - 1] = finiteNumber(histogram[attempts - 1]) + 1;
    next.histogram = histogram;
  }

  if (Number.isFinite(score)) {
    next.totalScore = finiteNumber(current.totalScore) + score;
    next.averageScore = Math.round(next.totalScore / totalPlays);
  }

  if (Number.isFinite(mistakes)) {
    const previousTotalMistakes = finiteNumber(current.averageMistakes)
      * finiteNumber(current.totalPlays);
    next.averageMistakes = (previousTotalMistakes + mistakes) / totalPlays;
    next.perfectGames = finiteNumber(current.perfectGames)
      + (outcome === "win" && mistakes === 0 ? 1 : 0);
  }

  return next;
}
