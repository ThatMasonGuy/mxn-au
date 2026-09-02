function normaliseStatus(state = {}) {
  const value = state.status || state.outcome || "idle";
  if (value === "win") return "won";
  if (value === "loss") return "lost";
  if (value === "in_progress") return "in-progress";
  return value;
}

function attemptCount(attempts) {
  if (Array.isArray(attempts)) return attempts.length;
  if (attempts && typeof attempts === "object") return Object.keys(attempts).length;
  return 0;
}

function compareTuple(left, right) {
  for (let index = 0; index < Math.max(left.length, right.length); index++) {
    const difference = (left[index] || 0) - (right[index] || 0);
    if (difference !== 0) return Math.sign(difference);
  }
  return 0;
}

function terminalWeight(state) {
  return ["won", "lost"].includes(normaliseStatus(state)) ? 1 : 0;
}

export function compareWordleProgress(local, cloud) {
  const localRows = local?.rows || local?.guesses;
  const cloudRows = cloud?.rows || cloud?.guesses;
  return compareTuple(
    [terminalWeight(local), attemptCount(localRows)],
    [terminalWeight(cloud), attemptCount(cloudRows)],
  );
}

export function compareConnectionsProgress(local, cloud) {
  return compareTuple(
    [
      terminalWeight(local),
      attemptCount(local?.attempts),
      attemptCount(local?.foundGroups),
      Number(local?.mistakes) || 0,
    ],
    [
      terminalWeight(cloud),
      attemptCount(cloud?.attempts),
      attemptCount(cloud?.foundGroups),
      Number(cloud?.mistakes) || 0,
    ],
  );
}

export function compareFlagleProgress(local, cloud) {
  return compareTuple(
    [
      terminalWeight(local),
      attemptCount(local?.allAttempts),
      Number(local?.currentFlagIndex) || 0,
    ],
    [
      terminalWeight(cloud),
      attemptCount(cloud?.allAttempts),
      Number(cloud?.currentFlagIndex) || 0,
    ],
  );
}
