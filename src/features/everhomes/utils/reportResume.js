function reportPdfUrl(value) {
  try {
    const url = new URL(value)
    return url.protocol === 'https:' && !url.username && !url.password ? url.href : null
  } catch {
    return null
  }
}

export function resolveReportResume(result = {}) {
  if (['complete', 'processing', 'regenerating'].includes(result.status)) {
    return {
      kind: 'submitted',
      status: result.status,
      pdfUrl: result.status === 'processing' ? null : reportPdfUrl(result.pdfUrl),
    }
  }
  if (!result.draft?.setup || !Array.isArray(result.draft.checklistSections) || !result.draft.checklistData) {
    throw new Error('The saved draft did not contain recoverable report data.')
  }
  return { kind: 'draft', draft: result.draft }
}

export function hasOtherLocalReport(store, submittedReportId) {
  if (store.setup.reportId === submittedReportId) return false
  return Boolean(store.hasChecklistStarted || store.setup.propertyAddress?.trim()
    || store.setup.inspectorName?.trim() || store.setup.inspectorEmail?.trim())
}
