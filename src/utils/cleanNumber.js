// utils/cleanNumber.js
export const clean = (v) => {
    if (typeof v === 'string') v = v.replace(/,/g, '');
    const num = Number(v);
    return isNaN(num) ? 0 : num;
  };
  
  export const isScoreEmpty = (score) => score === null || score === undefined || score === '';
  
  export const shouldSavePlayer = (player) => {
    const scores = [player.scoreD1, player.scoreD2, player.scoreD3, player.scoreD4, player.scoreD5, player.scoreD6];
    return scores.some(score => !isScoreEmpty(score));
  };