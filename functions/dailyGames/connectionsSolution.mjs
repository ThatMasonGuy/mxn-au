import { CURATED_CONNECTIONS_FALLBACK, validateConnectionsPuzzle } from './connectionsQuality.mjs';

export async function readOrSeedConnectionsSolution({ db, ref, now = () => new Date() }) {
  return db.runTransaction(async tx => {
    const snapshot = await tx.get(ref);
    const raw = snapshot.exists ? snapshot.data() : null;
    const validation = validateConnectionsPuzzle(raw?.answer, raw?.categories);
    if (validation.valid) return { answer: validation.answer, categories: validation.categories };
    const timestamp = now().toISOString();
    tx.set(ref, {
      ...CURATED_CONNECTIONS_FALLBACK,
      source: 'curated-fallback', wasFallbackSeed: true,
      seedReason: snapshot.exists ? validation.reason : 'missing_puzzle',
      ...(snapshot.exists ? { qualityRepairAt: timestamp } : { seededAt: timestamp }),
    }, { merge: true });
    return CURATED_CONNECTIONS_FALLBACK;
  });
}
