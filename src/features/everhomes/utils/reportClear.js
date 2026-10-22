// Clearing a completed form only discards the device copy. Published reports
// remain under admin control, including when submission finished in another tab.
export async function clearReportSession(session, { getDraft, deleteDraft }) {
  if (!session.draftId || !session.draftAccessKey) return

  async function status() {
    try {
      return (await getDraft({ ...session, includeDraft: false })).status
    } catch (error) {
      if (error.status === 404 && error.message === 'Draft not found') return 'missing'
      throw error
    }
  }

  const current = await status()
  if (current === 'complete' || current === 'missing') return
  if (!['draft', 'failed', 'pending', 'deleting'].includes(current)) {
    throw new Error('This report is still being processed. Wait for it to finish before clearing this form.')
  }
  try {
    await deleteDraft(session, { timeoutMs: 60_000 })
  } catch (error) {
    // Submission or deletion can finish between the status check and deletion.
    if (error.status === 404 && error.message === 'Draft not found') return
    if (error.status === 409 && await status() === 'complete') return
    throw error
  }
}
