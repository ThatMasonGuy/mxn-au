import { onSchedule } from 'firebase-functions/v2/scheduler'
import { firebaseAdmin, db } from '../config/firebase.mjs'

const ACTIVE_STATUSES = ['processing', 'regenerating', 'pending', 'deleting']
const STALE_AFTER_MS = 10 * 60 * 1000
const ACTIVE_REGENERATION_PHASES = ['preparing', 'restoring', 'generating']
const STALE_REGENERATION_PHASE_AFTER_MS = 20 * 60 * 1000

export const sweepStaleEverhomesReports = onSchedule(
  {
    region: 'australia-southeast1',
    schedule: 'every 5 minutes',
    timeoutSeconds: 120,
    memory: '256MiB',
  },
  async () => {
    const now = Date.now()
    let recovered = 0

    for (const collectionName of ['inspections', 'handovers']) {
      const snapshot = await db.collection(collectionName)
        .where('status', 'in', ACTIVE_STATUSES)
        .get()

      for (const document of snapshot.docs) {
        const data = document.data()
        const generationStartedAt = data.startedAt?.toMillis?.()
        const regenerationStartedAt = Date.parse(data.regenStartedAt ?? '')
        const pendingStartedAt = data.createdAt?.toMillis?.()
        const deletionStartedAt = data.updatedAt?.toMillis?.()
        const startedAt = {
          processing: generationStartedAt,
          regenerating: regenerationStartedAt,
          pending: pendingStartedAt,
          deleting: deletionStartedAt,
        }[data.status]
        if (!Number.isFinite(startedAt) || now - startedAt < STALE_AFTER_MS) continue

        if (data.status === 'deleting') {
          try {
            await firebaseAdmin.storage().bucket()
              .deleteFiles({ prefix: `${collectionName}/${document.id}/` })
            await db.recursiveDelete(document.ref)
            recovered += 1
          } catch (error) {
            console.error(`Could not finish deleting stale ${collectionName}/${document.id}:`, error.message)
          }
          continue
        }

        const timestamp = firebaseAdmin.firestore.FieldValue.serverTimestamp()
        if (data.status === 'regenerating' && data.pdfUrl) {
          await document.ref.update({
            status: 'complete',
            regenerationError: 'Regeneration stopped before completion. The previous report remains available.',
            staleRecoveredAt: timestamp,
            regenerationAccessKey: firebaseAdmin.firestore.FieldValue.delete(),
            generationDeadlineWarning: firebaseAdmin.firestore.FieldValue.delete(),
            generationDeadlineReachedAt: firebaseAdmin.firestore.FieldValue.delete(),
          })
        } else {
          await document.ref.update({
            status: 'failed',
            error: 'Report generation stopped before completion. The saved report can be retried.',
            failedAt: timestamp,
            staleRecoveredAt: timestamp,
            regenerationAccessKey: firebaseAdmin.firestore.FieldValue.delete(),
            generationDeadlineWarning: firebaseAdmin.firestore.FieldValue.delete(),
            generationDeadlineReachedAt: firebaseAdmin.firestore.FieldValue.delete(),
          })
        }
        recovered += 1
      }

      const regenerationSnapshot = await db.collection(collectionName)
        .where('regenerationPhase', 'in', ACTIVE_REGENERATION_PHASES)
        .get()
      for (const document of regenerationSnapshot.docs) {
        const data = document.data()
        if (ACTIVE_STATUSES.includes(data.status)) continue
        const phaseStartedAt = data.regenerationPhaseStartedAt?.toMillis?.()
        if (
          !Number.isFinite(phaseStartedAt)
          || now - phaseStartedAt < STALE_REGENERATION_PHASE_AFTER_MS
        ) continue

        const timestamp = firebaseAdmin.firestore.FieldValue.serverTimestamp()
        const batch = db.batch()
        batch.update(document.ref, {
          regenerationPhase: 'failed',
          regenerationError: 'Regeneration stopped before the report generator started. The previous report remains available.',
          regenerationFinishedAt: timestamp,
          regenerationProgress: firebaseAdmin.firestore.FieldValue.delete(),
          regenerationRunId: firebaseAdmin.firestore.FieldValue.delete(),
        })
        batch.set(document.ref.collection('activity').doc(), {
          kind: 'lifecycle',
          type: 'report.regeneration_failed',
          label: 'Regeneration failed',
          actor: data.regenerationRequestedBy ?? { kind: 'system' },
          error: 'Regeneration stopped before the report generator started.',
          createdAt: timestamp,
        })
        await batch.commit()
        recovered += 1
      }
    }

    console.log(JSON.stringify({
      scope: 'everhomes-report-maintenance',
      staleReportsRecovered: recovered,
    }))
  },
)
