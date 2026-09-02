export const ACTIVE_DAILY_GAME_IDS = Object.freeze(["wordle", "connections", "flag"]);

export function dailyStatusFromDayData(data) {
  if (data?.outcome === "win") return "won";
  if (data?.outcome === "loss") return "lost";
  if (data?.outcome === "in_progress") return "in-progress";
  return "not-started";
}
