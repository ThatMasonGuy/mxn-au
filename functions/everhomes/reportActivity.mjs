const PROVIDER_STATUSES = new Set([
  'bounced',
  'canceled',
  'clicked',
  'complained',
  'delivered',
  'delivery_delayed',
  'failed',
  'opened',
  'queued',
  'scheduled',
  'sent',
  'suppressed',
])

export function sanitiseActivityActor(actor = {}, fallbackKind = 'system') {
  const string = (value, max) => typeof value === 'string' ? value.trim().slice(0, max) : ''
  return {
    kind: string(actor.kind, 32) || fallbackKind,
    uid: string(actor.uid, 128) || null,
    name: string(actor.name, 200) || null,
    email: string(actor.email, 320) || null,
  }
}

export function normaliseProviderStatus(value, fallback = 'unknown') {
  return PROVIDER_STATUSES.has(value) ? value : fallback
}

export function emailActivityRecord(delivery, {
  action,
  actor,
  generationId = null,
} = {}) {
  if (!delivery || typeof delivery.email !== 'string') {
    throw new TypeError('An email delivery with a recipient is required')
  }

  return {
    kind: 'email',
    type: 'email.attempted',
    action: typeof action === 'string' ? action.slice(0, 64) : 'unknown',
    recipient: delivery.email.trim().toLowerCase(),
    accepted: delivery.sent === true,
    providerId: delivery.providerId ?? null,
    providerStatus: normaliseProviderStatus(
      delivery.providerStatus,
      delivery.sent ? 'sent' : 'failed',
    ),
    error: delivery.error ?? null,
    generationId,
    actor: sanitiseActivityActor(actor),
  }
}

export function timestampToIso(value) {
  if (!value) return null
  if (typeof value === 'string') {
    const parsed = Date.parse(value)
    return Number.isFinite(parsed) ? new Date(parsed).toISOString() : null
  }
  const date = value.toDate?.() ?? value
  return date instanceof Date && Number.isFinite(date.getTime()) ? date.toISOString() : null
}

export function sortActivityNewestFirst(events) {
  return [...events].sort((left, right) => (
    (Date.parse(right.occurredAt ?? '') || 0) - (Date.parse(left.occurredAt ?? '') || 0)
  ))
}
