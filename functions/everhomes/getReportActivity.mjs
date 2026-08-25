import { onRequest } from 'firebase-functions/v2/https'
import { defineSecret } from 'firebase-functions/params'
import { firebaseAdmin, db } from '../config/firebase.mjs'
import { requireEverhomesAdmin } from './requireEverhomesAdmin.mjs'
import {
  normaliseProviderStatus,
  sanitiseActivityActor,
  sortActivityNewestFirst,
  timestampToIso,
} from './reportActivity.mjs'

const RESEND_API_KEY = defineSecret('RESEND_API_KEY')
const MAX_ACTIVITY_EVENTS = 250
const MAX_PROVIDER_REFRESHES = 100

function isEmailAddress(value) {
  return typeof value === 'string'
    && value.length <= 320
    && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function legacyEmailEvents(data, existingProviderIds, existingRecipientActions) {
  const reporter = sanitiseActivityActor({
    kind: 'reporter',
    name: data.inspectorName,
    email: data.inspectorEmail,
  }, 'reporter')
  const system = sanitiseActivityActor({ kind: 'system' })
  const events = []

  const appendGroup = ({ providerIds, failures, recipients, action, occurredAt, actor }) => {
    const providerRecipients = new Set()
    for (const entry of Array.isArray(providerIds) ? providerIds : []) {
      if (!entry?.id || !isEmailAddress(entry.email) || existingProviderIds.has(entry.id)) continue
      providerRecipients.add(entry.email.toLowerCase())
      existingProviderIds.add(entry.id)
      events.push({
        id: `legacy-provider-${entry.id}`,
        kind: 'email',
        type: 'email.attempted',
        action,
        recipient: entry.email.toLowerCase(),
        accepted: true,
        providerId: entry.id,
        providerStatus: 'sent',
        error: null,
        actor,
        occurredAt,
        legacy: true,
      })
    }

    for (const failure of Array.isArray(failures) ? failures : []) {
      const email = typeof failure === 'string' ? failure : failure?.email
      if (!isEmailAddress(email)) continue
      const key = `${action}:${email.toLowerCase()}`
      if (existingRecipientActions.has(key)) continue
      existingRecipientActions.add(key)
      events.push({
        id: `legacy-failure-${action}-${email.toLowerCase()}`,
        kind: 'email',
        type: 'email.attempted',
        action,
        recipient: email.toLowerCase(),
        accepted: false,
        providerId: null,
        providerStatus: 'failed',
        error: typeof failure === 'object' ? failure.error ?? 'Send failed' : 'Send failed',
        actor,
        occurredAt,
        legacy: true,
      })
    }

    for (const email of Array.isArray(recipients) ? recipients : []) {
      if (!isEmailAddress(email) || providerRecipients.has(email.toLowerCase())) continue
      const key = `${action}:${email.toLowerCase()}`
      if (existingRecipientActions.has(key)) continue
      existingRecipientActions.add(key)
      events.push({
        id: `legacy-recipient-${action}-${email.toLowerCase()}`,
        kind: 'email',
        type: 'email.attempted',
        action,
        recipient: email.toLowerCase(),
        accepted: true,
        providerId: null,
        providerStatus: 'unknown',
        error: null,
        actor,
        occurredAt,
        legacy: true,
      })
    }
  }

  appendGroup({
    providerIds: data.emailProviderIds,
    failures: data.emailFailures,
    recipients: data.emailsSent,
    action: 'generation',
    occurredAt: timestampToIso(data.completedAt ?? data.submittedAt ?? data.createdAt),
    actor: reporter,
  })
  appendGroup({
    providerIds: data.lastResendProviderIds,
    failures: data.lastResendFailures,
    recipients: data.lastResentTo,
    action: 'resend',
    occurredAt: timestampToIso(data.lastResentAt),
    actor: system,
  })

  return events
}

function syntheticLifecycleEvents(data, storedTypes) {
  const actor = sanitiseActivityActor({
    kind: 'reporter',
    name: data.inspectorName,
    email: data.inspectorEmail,
  }, 'reporter')
  const events = []
  const add = (type, value, label, eventActor = actor) => {
    const occurredAt = timestampToIso(value)
    if (!occurredAt || storedTypes.has(type)) return
    events.push({
      id: `legacy-${type}`,
      kind: 'lifecycle',
      type,
      label,
      actor: eventActor,
      occurredAt,
      legacy: true,
    })
  }

  add('report.started', data.createdAt, 'Report started')
  add('report.submitted', data.submittedAt ?? data.startedAt, 'Report submitted')
  if (![...storedTypes].some((type) => ['report.generated', 'report.regenerated', 'report.completed'].includes(type))) {
    add('report.completed', data.completedAt, 'Report generated')
  }
  add(
    'report.regeneration_started',
    data.regenStartedAt,
    'Regeneration started',
    sanitiseActivityActor(data.regenerationRequestedBy ?? { kind: 'admin' }, 'admin'),
  )
  return events
}

async function runConcurrent(items, worker, limit = 6) {
  let index = 0
  async function next() {
    while (index < items.length) {
      const item = items[index++]
      await worker(item)
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, next))
}

export const getReportActivity = onRequest(
  {
    region: 'australia-southeast1',
    timeoutSeconds: 60,
    memory: '256MiB',
    cors: true,
    secrets: [RESEND_API_KEY],
  },
  async (req, res) => {
    res.set('Access-Control-Allow-Methods', 'POST, OPTIONS')
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    if (req.method === 'OPTIONS') return res.status(204).send('')
    if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' })

    try {
      await requireEverhomesAdmin(req)
    } catch (error) {
      return res.status(error.status ?? 500).json({ error: error.message ?? 'Could not verify administrator access' })
    }

    const { collection, docId, refreshProviderStatuses = true } = req.body ?? {}
    if (!['inspections', 'handovers'].includes(collection) || typeof docId !== 'string') {
      return res.status(400).json({ error: 'Invalid report reference' })
    }

    const docRef = db.collection(collection).doc(docId)
    const [snapshot, activitySnapshot] = await Promise.all([
      docRef.get(),
      docRef.collection('activity').orderBy('createdAt', 'desc').limit(MAX_ACTIVITY_EVENTS).get(),
    ])
    if (!snapshot.exists) return res.status(404).json({ error: 'Report not found' })

    const data = snapshot.data()
    const storedEvents = activitySnapshot.docs.map((document) => {
      const event = document.data()
      return {
        id: document.id,
        ...event,
        actor: sanitiseActivityActor(event.actor),
        occurredAt: timestampToIso(event.createdAt ?? event.occurredAt),
        providerCheckedAt: timestampToIso(event.providerCheckedAt),
        _ref: document.ref,
      }
    })
    const storedTypes = new Set(storedEvents.map((event) => event.type))
    const existingProviderIds = new Set(
      storedEvents.map((event) => event.providerId).filter(Boolean),
    )
    const existingRecipientActions = new Set(
      storedEvents
        .filter((event) => event.kind === 'email' && event.recipient)
        .map((event) => `${event.action}:${event.recipient.toLowerCase()}`),
    )
    const events = [
      ...storedEvents,
      ...syntheticLifecycleEvents(data, storedTypes),
      ...legacyEmailEvents(data, existingProviderIds, existingRecipientActions),
    ]

    if (refreshProviderStatuses !== false) {
      const refreshable = events
        .filter((event) => event.kind === 'email' && event.providerId)
        .slice(0, MAX_PROVIDER_REFRESHES)
      if (refreshable.length) {
        const { Resend } = await import('resend')
        const resend = new Resend(RESEND_API_KEY.value())
        const batch = db.batch()
        let batchWrites = 0
        await runConcurrent(refreshable, async (event) => {
          const result = await resend.emails.get(event.providerId).catch((error) => ({ error }))
          if (!result?.data?.last_event) return
          event.providerStatus = normaliseProviderStatus(result.data.last_event, event.providerStatus)
          event.providerCheckedAt = new Date().toISOString()
          if (event._ref) {
            batch.update(event._ref, {
              providerStatus: event.providerStatus,
              providerCheckedAt: firebaseAdmin.firestore.FieldValue.serverTimestamp(),
            })
            batchWrites += 1
          }
        })
        if (batchWrites) await batch.commit()
      }
    }

    const cleanEvents = sortActivityNewestFirst(events).map(({ _ref, ...event }) => event)
    return res.status(200).json({
      report: {
        id: docId,
        collection,
        status: data.status ?? 'unknown',
        regenerationPhase: data.regenerationPhase ?? null,
        regenerationProgress: data.regenerationProgress ?? null,
        propertyAddress: data.propertyAddress ?? '',
        inspectionDate: data.inspectionDate ?? null,
        inspectorName: data.inspectorName ?? null,
        inspectorEmail: data.inspectorEmail ?? null,
        pdfUrl: data.pdfUrl ?? null,
        photosDownloadUrl: data.photosDownloadUrl ?? null,
        canRegenerate: Boolean(data.submissionPayload),
      },
      events: cleanEvents,
    })
  },
)
