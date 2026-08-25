// functions/everhomes/resendReport.mjs
// Lightweight endpoint that resends an existing completed report's email
// without regenerating the PDF. Called from the admin page.

import { onRequest } from 'firebase-functions/v2/https'
import { defineSecret } from 'firebase-functions/params'
import { firebaseAdmin, db } from '../config/firebase.mjs'
import { requireEverhomesAdmin } from './requireEverhomesAdmin.mjs'
import { normaliseEmailDeliveries } from './emailDelivery.mjs'

const RESEND_API_KEY = defineSecret('RESEND_API_KEY')
const ADMIN_EMAIL = 'admin@everhomes.com.au'
const FROM_ADDRESS = 'Everhomes <reports@everhomes.com.au>'
const MAX_ATTACHMENT_BYTES = 25 * 1024 * 1024

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function isEmailAddress(value) {
  return typeof value === 'string'
    && value.length <= 320
    && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export const resendReport = onRequest(
  {
    region: 'australia-southeast1',
    timeoutSeconds: 30,
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

    const { collection, docId, extraEmails = [] } = req.body ?? {}
    if (!collection || !docId) {
      return res.status(400).json({ error: 'Missing collection or docId' })
    }

    if (!['inspections', 'handovers'].includes(collection)) {
      return res.status(400).json({ error: 'Invalid collection' })
    }
    if (
      !Array.isArray(extraEmails)
      || extraEmails.length > 20
      || extraEmails.some((email) => !isEmailAddress(email))
    ) {
      return res.status(400).json({ error: 'Extra recipients must be a list of no more than 20 valid email addresses' })
    }

    const docRef = db.collection(collection).doc(docId)
    const snap = await docRef.get()
    if (!snap.exists) return res.status(404).json({ error: 'Report not found' })

    const data = snap.data()
    if (!data.pdfUrl) {
      return res.status(400).json({ error: 'No PDF available — report may not have completed' })
    }

    const { Resend } = await import('resend')
    const resend = new Resend(RESEND_API_KEY.value())

    // Compile recipients: original list + any extras specified by admin
    const recipients = Array.from(new Set([
      ADMIN_EMAIL,
      ...(isEmailAddress(data.inspectorEmail) ? [data.inspectorEmail] : []),
      ...(Array.isArray(data.emailsSent) ? data.emailsSent : []).filter(isEmailAddress),
      ...extraEmails.map((email) => email.trim()),
    ])).slice(0, 25)

    const typeLabel = collection === 'handovers' ? 'Handover / Annual Review' : 'Inspection Report'
    const dateLabel = data.inspectionDate ?? 'Unknown Date'
    const address   = data.propertyAddress ?? 'Unknown Property'
    const subjectAddress = String(address).replace(/[\r\n]+/g, ' ').slice(0, 500)
    const storagePrefix = `${collection}/${docId}/`
    const bucket = firebaseAdmin.storage().bucket()

    async function freshUrl(storagePath, fallbackUrl) {
      if (!storagePath?.startsWith(storagePrefix)) return fallbackUrl ?? null
      const [exists] = await bucket.file(storagePath).exists()
      if (!exists) return fallbackUrl ?? null
      const [url] = await bucket.file(storagePath).getSignedUrl({
        action: 'read',
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
      })
      return url
    }

    const pdfUrl = await freshUrl(data.pdfStoragePath, data.pdfUrl)
    const photosDownloadUrl = await freshUrl(data.photosStoragePath, data.photosDownloadUrl)
    let attachments = []
    if (data.pdfStoragePath?.startsWith(storagePrefix)) {
      const pdfFile = bucket.file(data.pdfStoragePath)
      const [metadata] = await pdfFile.getMetadata().catch(() => [null])
      if (metadata && Number(metadata.size) <= MAX_ATTACHMENT_BYTES) {
        const [pdfBuffer] = await pdfFile.download().catch(() => [null])
        if (pdfBuffer) {
          attachments = [{
            filename: `${typeLabel.replaceAll(' ', '_')}_${docId}.pdf`,
            content: pdfBuffer,
          }]
        }
      }
    }

    const html = `
      <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;padding:24px;background:#ffffff;color:#1e293b;">
        <div style="margin-bottom:20px;">
          <img src="https://everhomes.com.au/logo.png" alt="Everhomes" height="28" style="display:block;" onerror="this.style.display='none'" />
        </div>
        <h2 style="font-size:18px;font-weight:700;margin:0 0 4px 0;">${typeLabel} — Resent</h2>
        <p style="font-size:14px;color:#64748b;margin:0 0 20px 0;">
          ${escapeHtml(address)} &middot; ${escapeHtml(dateLabel)}${data.inspectorName ? ` &middot; ${escapeHtml(data.inspectorName)}` : ''}
        </p>
        <p style="font-size:14px;color:#334155;line-height:1.6;margin:0 0 20px 0;">
          This report has been re-sent by an Everhomes administrator.${attachments.length ? ' The PDF is attached and available from the link below.' : ' The PDF is available from the link below.'}
        </p>
        <a href="${escapeHtml(pdfUrl)}" style="display:inline-block;padding:10px 20px;background:#0d9488;color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;border-radius:8px;margin-bottom:16px;">
          View Report PDF
        </a>
        ${photosDownloadUrl ? `
        <br />
        <a href="${escapeHtml(photosDownloadUrl)}" style="display:inline-block;margin-top:8px;padding:10px 20px;background:#1e293b;color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;border-radius:8px;">
          Download Report Package ZIP
        </a>` : ''}
        <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;" />
        <p style="font-size:12px;color:#94a3b8;margin:0;">
          Everhomes Pty Ltd &middot; <a href="mailto:admin@everhomes.com.au" style="color:#0d9488;">admin@everhomes.com.au</a>
        </p>
      </div>
    `

    const results = await Promise.allSettled(
      recipients.map(email =>
        resend.emails.send({
          from: FROM_ADDRESS,
          to: email,
          subject: `[Resent] ${typeLabel} — ${subjectAddress} — ${dateLabel}`,
          html,
          attachments,
        })
      )
    )

    const deliveries = normaliseEmailDeliveries(
      results,
      recipients.map((email) => ({ email })),
    )
    const sent = deliveries.filter((delivery) => delivery.sent)
    const failed = deliveries.filter((delivery) => !delivery.sent)
    if (!sent.length) {
      return res.status(500).json({ error: 'All emails failed to send' })
    }

    // Log resend in Firestore
    await docRef.update({
      lastResentAt: firebaseAdmin.firestore.FieldValue.serverTimestamp(),
      lastResentTo: sent.map((delivery) => delivery.email),
      lastResendFailures: failed.map((delivery) => ({ email: delivery.email, error: delivery.error })),
      lastResendProviderIds: sent
        .filter((delivery) => delivery.providerId)
        .map((delivery) => ({ email: delivery.email, id: delivery.providerId })),
    }).catch(() => {})

    return res.status(200).json({
      success: true,
      sent: sent.length,
      failed: failed.length,
      recipients,
      failures: failed.map((delivery) => ({ email: delivery.email, error: delivery.error })),
    })
  }
)
