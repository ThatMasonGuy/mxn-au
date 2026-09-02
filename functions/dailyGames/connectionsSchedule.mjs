export function connectionsPuzzleBufferDateIds(now = new Date(), days = 7) {
  const count = Number.isInteger(days) ? Math.min(Math.max(days, 1), 14) : 7;
  return Array.from({ length: count }, (_, index) => {
    const target = new Date(Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() + index + 1,
    ));
    return target.toISOString().slice(0, 10);
  });
}

export function nextConnectionsPuzzleDateId(now = new Date()) {
  return connectionsPuzzleBufferDateIds(now, 1)[0];
}
