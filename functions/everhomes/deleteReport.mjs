import { onRequest } from 'firebase-functions/v2/https'
import { firebaseAdmin, db } from '../config/firebase.mjs'
import { requireEverhomesAdmin } from './requireEverhomesAdmin.mjs'
import { canDeleteEverhomesReport } from './reportDeletionPolicy.mjs'

const REPORT_COLLECTIONS = new Set(['inspections', 'handovers'])
const REPORT_ID_PATTERN = /^[A-Za-z0-9_-]{1,128}$/

export const deleteEverhomesReport = onRequest(
  {
    region: 'australia-southeast1',
    timeoutSeconds: 120,
    memory: '256MiB',
    cors: true,
  },
  async (req, res) => {
    res.set('Access-Control-Allow-Methods', 'POST, OPTIONS')
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    if (req.method === 'OPTIONS') return res.status(204).send('')
    if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' })

    let administrator
    try {
      administrator = await requireEverhomesAdmin(req)
    } catch (error) {
      return res.status(error.status ?? 500).json({
        error: error.message ?? 'Could not verify administrator access',
      })
    }

    const { collection, docId } = req.body ?? {}
    if (!REPORT_COLLECTIONS.has(collection) || !REPORT_ID_PATTERN.test(docId ?? '')) {
      return res.status(400).json({ error: 'Invalid report collection or ID' })
    }

    const docRef = db.collection(collection).doc(docId)
    let originalStatus
    try {
      await db.runTransaction(async (transaction) => {
        const snapshot = await transaction.get(docRef)
        if (!snapshot.exists) {
          const error = new Error('Report not found')
          error.status = 404
          throw error
        }

        originalStatus = snapshot.data()?.status
        if (!canDeleteEverhomesReport(originalStatus)) {
          const error = new Error('Only draft or failed reports can be deleted. Completed and active reports are protected.')
          error.status = 409
          throw error
        }

        transaction.update(docRef, {
          status: 'deleting',
          updatedAt: firebaseAdmin.firestore.FieldValue.serverTimestamp(),
          deletionRequestedAt: firebaseAdmin.firestore.FieldValue.serverTimestamp(),
          deletionRequestedBy: administrator.uid,
        })
      })
    } catch (error) {
      return res.status(error.status ?? 500).json({ error: error.message ?? 'Could not start report deletion' })
    }

    try {
      await firebaseAdmin.storage().bucket().deleteFiles({ prefix: `${collection}/${docId}/` })
      await db.recursiveDelete(docRef)
      console.info(JSON.stringify({
        event: 'everhomes_admin_report_deleted',
        collection,
        docId,
        previousStatus: originalStatus,
        administratorUid: administrator.uid,
      }))
      return res.status(200).json({ success: true })
    } catch (error) {
      // Keep the record in the deleting state. The scheduled maintenance function
      // can safely retry both storage cleanup and recursive Firestore deletion.
      console.error(`Could not delete ${collection}/${docId}:`, error)
      return res.status(500).json({
        error: 'Deletion did not finish. It will be retried automatically.',
      })
    }
  },
)
