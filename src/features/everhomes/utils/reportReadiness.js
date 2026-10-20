import { isRequiredAnswerComplete } from './reportStatus.js'

export function collectMissingReportAnswers(sections, data, getInputItems, isVisible) {
  const missing = []
  for (const section of sections) {
    for (const item of getInputItems(section.key)) {
      if (!isVisible(item, section.id)) continue
      if (!isRequiredAnswerComplete(item, data[section.id]?.inputs?.[item.id])) {
        missing.push({
          sectionId: section.id,
          sectionLabel: section.label,
          itemId: item.id,
          itemLabel: item.label,
        })
      }
    }
  }
  return missing
}

export function getReportReadiness({ missingAnswers, sections, data, marketingPhotos, isOnline, hasAnyUploading }) {
  const issues = missingAnswers.map((answer) => ({
    ...answer,
    kind: 'answer',
    label: `${answer.sectionLabel}: ${answer.itemLabel}`,
  }))
  for (const section of sections) {
    const failed = (data[section.id]?.photos ?? []).filter((photo) => photo.uploadStatus === 'failed').length
    if (failed) issues.push({ kind: 'photos', sectionId: section.id, label: `${section.label}: retry or remove ${failed} failed photo${failed === 1 ? '' : 's'}` })
  }
  const failedMarketing = Object.values(marketingPhotos).flat().filter((photo) => photo.uploadStatus === 'failed').length
  if (failedMarketing) issues.push({ kind: 'marketing', label: `Marketing Photos: retry or remove ${failedMarketing} failed photo${failedMarketing === 1 ? '' : 's'}` })
  return {
    blocked: issues.length > 0 || !isOnline || hasAnyUploading,
    issues,
    missingAnswerCount: missingAnswers.length,
    waitingForUploads: hasAnyUploading,
    offline: !isOnline,
  }
}

// Stable across accordion mounting and safe for arbitrary section/item IDs.
export function reportItemElementId(sectionId, itemId) {
  return `report-item-${encodeURIComponent(sectionId)}:${encodeURIComponent(itemId)}`
}
