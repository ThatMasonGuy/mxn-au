// functions/everhomes/resendReport.mjs
// Lightweight endpoint that resends an existing completed report's email
// without regenerating the PDF. Called from the admin page.

import { onRequest } from 'firebase-functions/v2/https'
import { defineSecret } from 'firebase-functions/params'
import { db } from '../config/firebase.mjs'

const RESEND_API_KEY = defineSecret('RESEND_API_KEY')
const ADMIN_EMAIL = 'admin@everhomes.com.au'
const FROM_ADDRESS = 'Everhomes <reports@everhomes.com.au>'

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
    res.set('Access-Control-Allow-Headers', 'Content-Type')
    if (req.method === 'OPTIONS') return res.status(204).send('')
    if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' })

    const { collection, docId, extraEmails = [] } = req.body
    if (!collection || !docId) {
      return res.status(400).json({ error: 'Missing collection or docId' })
    }

    if (!['inspections', 'handovers'].includes(collection)) {
      return res.status(400).json({ error: 'Invalid collection' })
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
      ...(data.emailsSent ?? []),
      ...extraEmails,
    ].filter(Boolean)))

    const typeLabel = collection === 'handovers' ? 'Handover Checklist' : 'Inspection Report'
    const dateLabel = data.inspectionDate ?? 'Unknown Date'
    const address   = data.propertyAddress ?? 'Unknown Property'

    const html = `
      <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;padding:24px;background:#ffffff;color:#1e293b;">
        <div style="margin-bottom:20px;">
          <img src="https://everhomes.com.au/logo.png" alt="Everhomes" height="28" style="display:block;" onerror="this.style.display='none'" />
        </div>
        <h2 style="font-size:18px;font-weight:700;margin:0 0 4px 0;">${typeLabel} — Resent</h2>
        <p style="font-size:14px;color:#64748b;margin:0 0 20px 0;">
          ${address} &middot; ${dateLabel}${data.inspectorName ? ` &middot; ${data.inspectorName}` : ''}
        </p>
        <p style="font-size:14px;color:#334155;line-height:1.6;margin:0 0 20px 0;">
          This report has been re-sent by an Everhomes administrator. The PDF is attached below.
        </p>
        <a href="${data.pdfUrl}" style="display:inline-block;padding:10px 20px;background:#0d9488;color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;border-radius:8px;margin-bottom:16px;">
          View Report PDF
        </a>
        ${data.photosDownloadUrl ? `
        <br />
        <a href="${data.photosDownloadUrl}" style="display:inline-block;margin-top:8px;padding:10px 20px;background:#1e293b;color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;border-radius:8px;">
          Download Photos ZIP
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
          subject: `[Resent] ${typeLabel} — ${address} — ${dateLabel}`,
          html,
        })
      )
    )

    const failures = results.filter(r => r.status === 'rejected').length
    if (failures === recipients.length) {
      return res.status(500).json({ error: 'All emails failed to send' })
    }

    // Log resend in Firestore
    await docRef.update({
      lastResentAt: new Date().toISOString(),
      lastResentTo: recipients,
    }).catch(() => {})

    return res.status(200).json({
      success: true,
      sent: recipients.length - failures,
      failed: failures,
      recipients,
    })
  }
)
