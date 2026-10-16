import { renderIdSightingEmail } from './idSightingEmail.mjs'

export const ID_TYPES = Object.freeze([
  'Australian driver licence', 'Passport', 'Proof of age card',
  'Birth certificate', 'Medicare card', 'Other',
])

export class IdSightingError extends Error {
  constructor(status, message) { super(message); this.status = status }
}

export function normaliseIdSighting(input = {}, today) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new IdSightingError(400, 'Enter the ID sighting details.')
  const text = (key, label, max = 160) => {
    const value = input[key]
    if (typeof value !== 'string' || !value.trim() || value.trim().length > max || /[\u0000-\u001f\u007f]/.test(value)) {
      throw new IdSightingError(400, `${label} is required and must be no more than ${max} characters.`)
    }
    return value.trim()
  }
  const staffName = text('staffName', 'Everhomes staff member')
  const staffEmail = text('staffEmail', 'Everhomes staff member email', 254).toLowerCase()
  if (!/^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@everhomes\.com\.au$/.test(staffEmail)) {
    throw new IdSightingError(400, 'Use an @everhomes.com.au staff email address.')
  }
  const applicantName = text('applicantName', 'Name of the person whose ID is sighted')
  const sightedDate = text('sightedDate', 'Date sighted', 10)
  const parsed = new Date(`${sightedDate}T00:00:00Z`)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(sightedDate) || !Number.isFinite(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== sightedDate || sightedDate < '1900-01-01' || (today && sightedDate > today)) {
    throw new IdSightingError(400, 'Enter a valid sighting date that is not in the future.')
  }
  if (!Array.isArray(input.documents) || input.documents.length < 1 || input.documents.length > 2) {
    throw new IdSightingError(400, 'Record one or two forms of ID.')
  }
  const documents = input.documents.map((item) => {
    if (!item || !ID_TYPES.includes(item.type)) throw new IdSightingError(400, 'Choose a form of ID.')
    if (item.sighted !== true) throw new IdSightingError(400, 'Confirm that each listed form of ID has been sighted.')
    const description = item.type === 'Other' && typeof item.description === 'string' ? item.description.trim() : ''
    if (item.type === 'Other' && (typeof description !== 'string' || !description || description.length > 100 || /[\u0000-\u001f\u007f]/.test(description))) {
      throw new IdSightingError(400, 'Describe the other form of ID in 100 characters or fewer.')
    }
    return { type: item.type, description, sighted: true }
  })
  return { staffName, staffEmail, applicantName, sightedDate, documents }
}

export function validateIdSightingCredentials(input = {}) {
  if (!/^[a-f0-9]{32}$/.test(input.recordId ?? '') || !/^[a-f0-9]{64}$/.test(input.accessKey ?? '')) {
    throw new IdSightingError(400, 'Invalid record reference. Start a new ID sighting record.')
  }
  return { recordId: input.recordId, accessKey: input.accessKey }
}

export function requireIdSightingAccess(record, accessHash, isAdmin = false) {
  if (!record || (!isAdmin && (!accessHash || record.accessHash !== accessHash))) {
    throw new IdSightingError(404, 'Record not found.')
  }
}

export function brisbaneToday(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-AU', { timeZone: 'Australia/Brisbane', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(now)
  const part = (type) => parts.find((item) => item.type === type).value
  return `${part('year')}-${part('month')}-${part('day')}`
}

export function idSightingFilename(record) {
  return `Everhomes_ID_Sighting_${record.sightedDate}_${record.id}.pdf`
}

export function buildIdSightingEmail(record, pdf) {
  const { html, text, dateLabel } = renderIdSightingEmail(record)
  return {
    from: 'Everhomes Tools <inspections@mxn.au>',
    to: record.staffEmail,
    replyTo: 'admin@everhomes.com.au',
    subject: `Everhomes ID sighting record - ${dateLabel}`,
    html,
    text,
    attachments: [{ filename: idSightingFilename(record), content: pdf }],
  }
}

// The repository owns atomic claims; the workflow is independent of Firebase and Resend.
export async function completeIdSighting({ claim, generatePdf, storePdf, update, sendEmail, release }, request) {
  const record = await claim(request)
  try {
    let pdf
    if (!record.pdfStoragePath) {
      pdf = await generatePdf(record)
      record.pdfStoragePath = await storePdf(record, pdf)
      await update(record.id, { pdfStoragePath: record.pdfStoragePath, status: 'complete' })
    }
    if (record.emailStatus !== 'sent') {
      try {
        const result = await sendEmail(record, pdf)
        if (result?.error || !result?.data?.id) throw new Error('Email provider did not accept the message.')
        await update(record.id, { emailStatus: 'sent', emailProviderId: result.data.id })
        record.emailStatus = 'sent'
      } catch {
        await update(record.id, { emailStatus: 'failed' })
        record.emailStatus = 'failed'
      }
    }
    return { recordId: record.id, emailStatus: record.emailStatus, staffEmail: record.staffEmail }
  } finally {
    await release(record.id)
  }
}
