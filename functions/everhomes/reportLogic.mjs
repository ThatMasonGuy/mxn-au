export function itemIsVisible(item, itemStatuses, itemInputs, schema, reportSubtype) {
  if (item.showIf) {
    const parentValue = (itemInputs ?? {})[item.showIf.id]
      ?? (itemStatuses ?? {})[item.showIf.id]

    if (
      item.showIf.hasValue === true
      && (parentValue === undefined || parentValue === null || String(parentValue).trim() === '')
    ) {
      return false
    }
    if (
      item.showIf.hasValue === false
      && !(parentValue === undefined || parentValue === null || String(parentValue).trim() === '')
    ) {
      return false
    }
    if (item.showIf.hasValue === undefined && parentValue !== item.showIf.value) {
      return false
    }
  }

  if (schema.sdaFilter && item.badges?.length) {
    const option = schema.pickerOptions?.find((candidate) => candidate.key === reportSubtype)
    const activeBadges = option?.includes ?? []
    if (!item.badges.some((badge) => activeBadges.includes(badge))) return false
  }

  return true
}

export function getRoomType(room = {}) {
  const type = room.type ?? room.itemsKey ?? room.key
  return type === 'ooa' ? 'bedroom' : type
}

export function getRoomGroups(schema, room) {
  return schema.items[getRoomType(room)] ?? schema.fallback
}

export function isRequiredInputItem(item) {
  return item.type === 'yesno' || item.required === true
}

export function isRequiredAnswerComplete(item, value) {
  if (!isRequiredInputItem(item)) return true
  if (item.type === 'yesno') return value === 'yes' || value === 'no'
  return value !== undefined && value !== null && String(value).trim() !== ''
}

export function collectMissingRequiredAnswers(rooms, schema, reportSubtype) {
  const missing = []
  for (const room of rooms) {
    const itemStatuses = room.items ?? {}
    const itemInputs = room.inputs ?? {}
    for (const group of getRoomGroups(schema, room)) {
      for (const item of group.items) {
        if (!isRequiredInputItem(item)) continue
        if (!itemIsVisible(item, itemStatuses, itemInputs, schema, reportSubtype)) continue
        if (!isRequiredAnswerComplete(item, itemInputs[item.id])) {
          missing.push({
            roomId: room.id ?? null,
            roomLabel: room.label ?? room.id ?? 'Unknown section',
            itemId: item.id,
            itemLabel: item.label,
          })
        }
      }
    }
  }
  return missing
}

export function getActiveStatusItems(groups, itemStatuses, itemInputs, schema, reportSubtype) {
  return groups
    .flatMap((group) => group.items)
    .filter((item) =>
      !item.type && itemIsVisible(item, itemStatuses, itemInputs, schema, reportSubtype),
    )
}

export function computeItemStats(rooms, schema, reportSubtype) {
  const stats = { total: 0, ok: 0, attention: 0, issues: 0, na: 0, unchecked: 0 }

  for (const room of rooms) {
    const itemStatuses = room.items ?? {}
    const itemInputs = room.inputs ?? {}
    const groups = getRoomGroups(schema, room)
    const activeItems = getActiveStatusItems(
      groups,
      itemStatuses,
      itemInputs,
      schema,
      reportSubtype,
    )

    for (const item of activeItems) {
      stats.total += 1
      const status = itemStatuses[item.id] ?? 'unchecked'
      if (status === 'ok') stats.ok += 1
      else if (status === 'attention') stats.attention += 1
      else if (status === 'issue') stats.issues += 1
      else if (status === 'na') stats.na += 1
      else stats.unchecked += 1
    }
  }

  return stats
}
