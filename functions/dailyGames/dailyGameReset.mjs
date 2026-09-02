import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { db } from '../config/firebase.mjs';

const REGION = 'australia-southeast2';
const RESETTABLE_GAMES = new Set(['wordle', 'connections', 'flag']);
const dateStrUTC = (date) => date.toISOString().slice(0, 10);

export function validateDailyGameReset({ game, date } = {}, now = new Date()) {
  if (!RESETTABLE_GAMES.has(game)) {
    return { valid: false, reason: 'invalid_game' };
  }

  if (date !== dateStrUTC(now)) {
    return { valid: false, reason: 'invalid_or_stale_date' };
  }

  return {
    valid: true,
    game,
    date,
    path: `dailyChallenges/${game}/days/${date}`,
  };
}

export const resetDailyGameProgress = onCall(
  { region: REGION, maxInstances: 2 },
  async (request) => {
    const uid = request.auth?.uid;
    if (!uid) {
      throw new HttpsError('unauthenticated', 'Authentication required');
    }

    const validation = validateDailyGameReset(request.data);
    if (!validation.valid) {
      throw new HttpsError('invalid-argument', validation.reason);
    }

    await db.doc(`users/${uid}/${validation.path}`).delete();

    return {
      success: true,
      game: validation.game,
      date: validation.date,
    };
  },
);
