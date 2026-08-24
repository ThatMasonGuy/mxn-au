function hasValue(value) {
  return value !== undefined && value !== null && String(value).trim() !== ''
}

export function getActiveReportBadges(schema, reportSubtype) {
  if (!schema?.sdaFilter || !reportSubtype) return null
  const option = schema.pickerOptions?.find((candidate) => candidate.key === reportSubtype)
  return option?.includes ? new Set(option.includes) : null
}

export function isReportItemVisible(item, {
  inputs = {},
  statuses = {},
  sdaFilter = false,
  activeBadges = null,
} = {}) {
  if (item.showIf) {
    const currentValue = inputs[item.showIf.id] ?? statuses[item.showIf.id] ?? ''

    if (item.showIf.hasValue === true && !hasValue(currentValue)) return false
    if (item.showIf.hasValue === false && hasValue(currentValue)) return false
    if (item.showIf.hasValue === undefined && currentValue !== item.showIf.value) return false
  }

  if (sdaFilter && activeBadges && item.badges?.length) {
    if (!item.badges.some((badge) => activeBadges.has(badge))) return false
  }

  return true
}
