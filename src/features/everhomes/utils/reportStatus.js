export const CHECKED_REPORT_STATUSES = new Set(['ok', 'attention', 'issue', 'na'])

export function isRequiredAnswerComplete(item, value) {
  if (item.type !== 'yesno' && item.required !== true) return true
  if (item.type === 'yesno') return value === 'yes' || value === 'no'
  return value !== undefined && value !== null && String(value).trim() !== ''
}

export function deriveSectionStatus(statuses, manualStatus = null) {
  const checked = statuses.filter((status) => CHECKED_REPORT_STATUSES.has(status))
  if (!checked.length) return { status: 'unchecked', manualStatus: null }

  if (checked.every((status) => status === 'na')) {
    return {
      status: CHECKED_REPORT_STATUSES.has(manualStatus) ? manualStatus : 'unchecked',
      manualStatus: CHECKED_REPORT_STATUSES.has(manualStatus) ? manualStatus : null,
    }
  }

  if (statuses.includes('issue')) return { status: 'issue', manualStatus: null }
  if (statuses.includes('attention')) return { status: 'attention', manualStatus: null }
  return { status: 'ok', manualStatus: null }
}

export function isStatusSectionComplete(statuses, manualStatus = null) {
  if (!statuses.length || !statuses.every((status) => CHECKED_REPORT_STATUSES.has(status))) {
    return false
  }

  return !statuses.every((status) => status === 'na')
    || CHECKED_REPORT_STATUSES.has(manualStatus)
}
