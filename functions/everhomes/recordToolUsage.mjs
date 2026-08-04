import { onRequest } from 'firebase-functions/v2/https'
import { firebaseAdmin, db } from '../config/firebase.mjs'
import {
  ToolUsageRequestError,
  brisbaneDateKey,
  normaliseEverhomesUsageEvent,
} from './toolUsageCore.mjs'

const REGION = 'australia-southeast1'
const MAX_EVENTS_PER_SESSION_PER_DAY = 100
const ALLOWED_ORIGINS = new Set([
  'https://mxn.au',
  'https://www.mxn.au',
  'https://mxn-au.web.app',
  'https://mxn-au.firebaseapp.com',
])

function requireAllowedOrigin(req) {
  const origin = req.get('origin') ?? ''
  if (!ALLOWED_ORIGINS.has(origin)) throw new ToolUsageRequestError(403, 'Unsupported request origin')
  return new URL(origin).hostname
}

export const recordEverhomesToolUsage = onRequest(
  { region: REGION, cors: [...ALLOWED_ORIGINS] },
  async (req, res) => {
    try {
      if (req.method !== 'POST') {
        res.status(405).json({ error: 'POST only' })
        return
      }

      const host = requireAllowedOrigin(req)
      const event = normaliseEverhomesUsageEvent(req.body)
      const date = brisbaneDateKey()
      const eventRef = db.collection('everhomesToolUsage').doc(event.eventId)
      const aggregateRef = db.collection('everhomesToolUsageDaily').doc(`${date}_${event.toolId}`)
      const rateRef = db.collection('everhomesToolUsageSessions').doc(`${date}_${event.sessionId}`)
      const timestamp = firebaseAdmin.firestore.FieldValue.serverTimestamp()
      const increment = firebaseAdmin.firestore.FieldValue.increment

      const outcome = await db.runTransaction(async transaction => {
        const [existingEvent, rateSnapshot] = await Promise.all([
          transaction.get(eventRef),
          transaction.get(rateRef),
        ])
        if (existingEvent.exists) return 'duplicate'

        const eventCount = Number(rateSnapshot.data()?.eventCount) || 0
        if (eventCount >= MAX_EVENTS_PER_SESSION_PER_DAY) {
          throw new ToolUsageRequestError(429, 'Daily usage event limit reached')
        }

        transaction.set(eventRef, {
          sessionId: event.sessionId,
          toolId: event.toolId,
          toolName: event.toolName,
          action: event.action,
          variant: event.variant,
          device: event.device,
          host,
          date,
          createdAt: timestamp,
        })

        const aggregate = {
          date,
          toolId: event.toolId,
          toolName: event.toolName,
          totalEvents: increment(1),
          opened: increment(event.action === 'opened' ? 1 : 0),
          meaningfulUses: increment(event.meaningfulUse ? 1 : 0),
          actions: { [event.action]: increment(1) },
          updatedAt: timestamp,
        }
        if (event.variant) {
          aggregate.variants = { [event.variant]: increment(1) }
          aggregate.actionVariants = { [event.action]: { [event.variant]: increment(1) } }
        }
        transaction.set(aggregateRef, aggregate, { merge: true })
        transaction.set(rateRef, {
          date,
          sessionId: event.sessionId,
          eventCount: increment(1),
          updatedAt: timestamp,
        }, { merge: true })
        return 'recorded'
      })

      res.status(outcome === 'duplicate' ? 200 : 201).json({ ok: true, outcome })
    } catch (error) {
      const status = error instanceof ToolUsageRequestError ? error.status : 500
      console.error(JSON.stringify({
        scope: 'everhomes-tool-usage',
        outcome: 'failure',
        status,
        error: error.message,
      }))
      res.status(status).json({ error: status === 500 ? 'Could not record tool usage' : error.message })
    }
  },
)
