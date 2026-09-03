import { randomUUID } from 'node:crypto';
import { onSchedule } from 'firebase-functions/v2/scheduler';
import { onRequest } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params';
import { FieldValue } from 'firebase-admin/firestore';
import OpenAI from 'openai';
import { db } from '../config/firebase.mjs';
import { connectionsGenerationDateIds } from './connectionsSchedule.mjs';
import {
  CONNECTIONS_MODEL, CONNECTIONS_REVIEW_MODEL, generateConnectionsPuzzle, shouldGenerateConnectionsPuzzle,
  saveConnectionsPuzzle, withConnectionsGenerationLease,
  claimConnectionsGenerationBudget,
} from './connectionsGeneration.mjs';

const OPENAI_API_KEY = defineSecret('OPENAI_API_KEY');
const ADMIN_API_KEY = defineSecret('ADMIN_API_KEY');
const solutions = () => db.collection('dailyChallenges').doc('connections').collection('solutions');
const leaseRef = () => db.doc('dailyChallenges/connections/maintenance/generationLease');
const dateIdUTC = (date = new Date()) => date.toISOString().slice(0, 10);
let client;
function openai() {
  client ||= new OpenAI({ apiKey: OPENAI_API_KEY.value(), timeout: 180000, maxRetries: 0 });
  return client;
}

async function fetchBannedWords(dateId) {
  const start = new Date(`${dateId}T00:00:00Z`);
  const end = new Date(start);
  start.setUTCDate(start.getUTCDate() - 30);
  end.setUTCDate(end.getUTCDate() + 365);
  const snapshot = await solutions().where('__name__', '>=', dateIdUTC(start))
    .where('__name__', '<=', dateIdUTC(end)).get();
  const ban = new Set();
  snapshot.forEach(doc => {
    if (doc.id === dateId) return;
    for (const words of Object.values(doc.data().answer || {})) {
      if (Array.isArray(words)) words.forEach(word => ban.add(String(word).trim().toUpperCase()));
    }
  });
  return ban;
}

async function runGenerationFor(dateId, { overwrite = false } = {}) {
  const ref = solutions().doc(dateId);
  const existing = await ref.get();
  if (!shouldGenerateConnectionsPuzzle(existing.exists ? existing.data() : null, dateId, dateIdUTC(), { overwrite })) {
    return { filledCount: 0, date: dateId, skipped: true, failed: false };
  }
  if (!await claimConnectionsGenerationBudget({
    db, ref: db.doc('dailyChallenges/connections/maintenance/generationBudget'), day: dateIdUTC(),
  })) {
    return { filledCount: 0, date: dateId, skipped: false, failed: true, reasons: ['daily_generation_budget_exhausted'] };
  }
  const result = await generateConnectionsPuzzle({
    client: openai(), bannedWords: await fetchBannedWords(dateId),
    signal: AbortSignal.timeout(450000),
    onAttempt: entry => console.info('[connectionsGenerate] attempt', { date: dateId, ...entry }),
  });
  if (!result.puzzle) {
    return { filledCount: 0, date: dateId, skipped: false, failed: true, attempts: result.attempts, reasons: result.reasons };
  }
  const saved = await saveConnectionsPuzzle({
    db, ref, dateId, overwrite,
    data: {
      ...result.puzzle, source: 'ai', model: CONNECTIONS_MODEL,
      qualityReviewed: true, reviewModel: CONNECTIONS_REVIEW_MODEL, generationVersion: 2,
      createdAt: FieldValue.serverTimestamp(), generationAttempts: result.attempts,
    },
  });
  console.info('[connectionsGenerate] result', { date: dateId, saved, attempts: result.attempts });
  return { filledCount: saved ? 1 : 0, date: dateId, skipped: !saved, failed: false };
}

function withLease(run) {
  return withConnectionsGenerationLease({ db, ref: leaseRef(), owner: randomUUID(), run });
}

export const connectionsGenerateCron = onSchedule({
  schedule: '5 * * * *', timeZone: 'Etc/UTC', region: 'australia-southeast1',
  secrets: [OPENAI_API_KEY], retryCount: 2, timeoutSeconds: 540, maxInstances: 1,
}, async () => {
  const summary = await withLease(async () => {
    const targetDateIds = connectionsGenerationDateIds();
    const results = [];
    let attemptedDates = 0;
    for (const date of targetDateIds) {
      const snapshot = await solutions().doc(date).get();
      if (!shouldGenerateConnectionsPuzzle(snapshot.exists ? snapshot.data() : null, date, dateIdUTC())) continue;
      // Leave time for reasoning and revision; later hourly runs pick up other dates.
      if (attemptedDates >= 1) break;
      attemptedDates++;
      try { results.push(await runGenerationFor(date)); }
      catch (error) {
        console.error('[connectionsGenerate] date failed', { date, message: error.message });
        results.push({ date, failed: true, filledCount: 0 });
      }
    }
    const snapshots = await db.getAll(...targetDateIds.map(date => solutions().doc(date)));
    const pendingDates = snapshots.filter((snap, index) => shouldGenerateConnectionsPuzzle(
      snap.exists ? snap.data() : null, targetDateIds[index], dateIdUTC(),
    )).map(snap => snap.id);
    return { results, pendingDates, filledCount: results.reduce((sum, item) => sum + item.filledCount, 0) };
  });
  if (summary.busy) {
    console.info('[connectionsGenerateCron] another generator holds the lease');
    return;
  }
  console.info('[connectionsGenerateCron] done', summary);
  if (summary.results.some(result => result.failed)) {
    throw new Error(`Connections generation failed; pending dates: ${summary.pendingDates.join(', ')}`);
  }
});

export const connectionsGenerateNow = onRequest({
  region: 'australia-southeast2', secrets: [OPENAI_API_KEY, ADMIN_API_KEY],
  cors: true, maxInstances: 1, timeoutSeconds: 540,
}, async (req, res) => {
  const key = req.header('x-admin-key') || req.query.key;
  if (!key || String(key) !== ADMIN_API_KEY.value()) return res.status(401).json({ error: 'unauthorized' });
  const date = req.query.date ? String(req.query.date) : dateIdUTC();
  if (!connectionsGenerationDateIds(new Date(), 14).includes(date)) {
    return res.status(400).json({ error: 'date_must_be_today_or_within_next_14_days' });
  }
  try {
    const result = await withLease(() => runGenerationFor(date, { overwrite: req.query.overwrite === 'true' }));
    if (result.busy) return res.status(409).json({ ok: false, error: 'generation_in_progress' });
    return res.status(result.failed ? 503 : 200).json({ ok: !result.failed, ...result });
  } catch (error) {
    console.error('[connectionsGenerateNow] error', { date, message: error.message });
    return res.status(500).json({ ok: false, error: 'generation_failed' });
  }
});
