export function nextConnectionsPuzzleDateId(now = new Date()) {
  const tomorrow = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() + 1,
  ));
  return tomorrow.toISOString().slice(0, 10);
}
