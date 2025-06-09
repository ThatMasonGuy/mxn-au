// utils/prepPlayerEventData
import { serverTimestamp } from 'firebase/firestore';
import { clean } from './cleanNumber';

export const preparePlayerEventData = (player, currentEvent) => {
  const scores = [player.scoreD1, player.scoreD2, player.scoreD3, player.scoreD4, player.scoreD5, player.scoreD6];
  const overallScore = scores.map(s => clean(s)).reduce((acc, val) => acc + val, 0);

  return {
    eventId: currentEvent.id,
    player: player.name,
    playerId: player.id,
    power: clean(player.power),
    castle: player.castle || '',
    role: player.role || '',
    overallRank: player.rank || '',
    score: clean(player.score),
    scoreD1: clean(player.scoreD1), scoreD2: clean(player.scoreD2), scoreD3: clean(player.scoreD3),
    scoreD4: clean(player.scoreD4), scoreD5: clean(player.scoreD5), scoreD6: clean(player.scoreD6),
    overallScore,
    notes: player.notes || '',
    enteredBy: currentEvent.enteredBy || 'system',
    enteredDate: serverTimestamp(),
    type: currentEvent.type,
    guild: currentEvent.guildShort
  };
};