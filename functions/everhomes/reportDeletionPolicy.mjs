const DELETABLE_REPORT_STATUSES = new Set(['draft', 'failed'])

export function canDeleteEverhomesReport(status) {
  return DELETABLE_REPORT_STATUSES.has(status)
}
